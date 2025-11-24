// pages/api/webhook/deck-completed.js

const processedOrders = new Map(); // 与 generate-deck.js 共享

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { orderId, deckUrl } = req.body || {};

  if (!orderId || !deckUrl) {
    console.error('[Webhook] Invalid data:', { orderId, deckUrl });
    return res.status(400).json({ ok: false, error: 'orderId and deckUrl required' });
  }

  console.log('[Webhook] 收到完成通知:', orderId, deckUrl);

  // 更新订单状态
  processedOrders.set(orderId, {
    ok: true,
    deckUrl,
    source: 'n8n',
    status: 'completed',
    completedAt: Date.now(),
  });

  console.log('[Webhook] 状态已更新，前端轮询可获取结果');

  return res.status(200).json({ ok: true, message: 'Status updated' });
}