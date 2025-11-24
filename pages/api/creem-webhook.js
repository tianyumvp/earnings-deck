// pages/api/creem-webhook.js

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || null;

// 可选：如果你之后想做验签，可以在这里读取 CREEM_WEBHOOK_SECRET
// const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET || null;

export const config = {
  api: {
    // Creem 默认发送 application/json，这里保留 bodyParser 为 true 即可。
    // 如果以后要做原始体验签，再改成 false。
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const payload = req.body || {};
  console.log('[Creem Webhook] payload:', JSON.stringify(payload, null, 2));

  try {
    // 不同版本的 Creem 事件字段可能叫 event / type / event_type
    const eventType =
      payload.event ||
      payload.eventType ||
      payload.type ||
      payload.event_type ||
      'unknown';

    // Creem 新版 payload 把对象放在 object 字段
    const data =
      payload.data ||
      payload.object ||
      payload.charge ||
      payload.payment ||
      payload;

    const status =
      data?.status ||
      data?.payment_status ||
      data?.checkout_status ||
      payload.status;

    const metadata =
      data?.metadata || payload.metadata || payload.meta || {};

    const ticker =
      metadata.ticker ||
      metadata.TICKER ||
      metadata.symbol ||
      null;

    const orderId =
      metadata.orderId ||
      metadata.order_id ||
      null;

    // 简单判断一下是不是「支付成功」类事件
    const isPaid =
      status === 'paid' ||
      status === 'succeeded' ||
      status === 'completed' ||
      status === 'success';

    if (!isPaid) {
      console.log(
        `[Creem Webhook] Event "${eventType}" with status "${status}" not treated as paid. Ignored.`
      );
      return res.status(200).json({ ok: true, ignored: true });
    }

    if (!ticker) {
      console.warn(
        '[Creem Webhook] Paid event but no ticker found in metadata. Skipping n8n call.'
      );
      return res
        .status(200)
        .json({ ok: true, missingTicker: true, ignored: true });
    }

    console.log(`[Creem Webhook] Payment confirmed for ticker "${ticker}" (orderId: ${orderId})`);
    console.log('[Creem Webhook] Skipping n8n trigger to avoid double runs (frontend handles generation).');

    return res.status(200).json({
      ok: true,
      message: 'Webhook received (generation handled by frontend)',
    });
  } catch (err) {
    console.error('[Creem Webhook] Unexpected error:', err);
    // 即便出错，也尽量返回 200，避免 Creem 不断重试
    return res.status(200).json({ ok: false, error: 'Internal error logged' });
  }
}
