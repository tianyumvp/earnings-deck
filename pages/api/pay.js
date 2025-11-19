// pages/api/pay.js

// 用 env 来切换支付渠道：bagel / creem
const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'bagel';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { ticker } = req.body || {};
  if (!ticker || typeof ticker !== 'string') {
    return res
      .status(400)
      .json({ ok: false, error: 'Ticker is required (e.g. AMD)' });
  }

  const normalizedTicker = ticker.trim().toUpperCase();
  const origin =
    req.headers.origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'http://localhost:3000';

  try {
    // —— 1. Creem 路径（保留将来用）——
    if (PAYMENT_PROVIDER === 'creem') {
      const result = await createCreemCheckout(normalizedTicker, origin);
      if (!result.ok) {
        return res
          .status(result.statusCode || 500)
          .json({ ok: false, error: result.error || 'Creem payment failed' });
      }
      return res.status(200).json({
        ok: true,
        provider: 'creem',
        checkoutUrl: result.checkoutUrl,
      });
    }

    // —— 2. 默认：BagelPay Hosted Checkout（不调 API，只跳链接）——
    const result = await createBagelHostedCheckout(normalizedTicker);
    if (!result.ok) {
      return res
        .status(result.statusCode || 500)
        .json({ ok: false, error: result.error || 'BagelPay payment failed' });
    }

    return res.status(200).json({
      ok: true,
      provider: 'bagelpay',
      checkoutUrl: result.checkoutUrl,
    });
  } catch (err) {
    console.error('[API /pay] Unexpected error:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}

/**
 * BagelPay - Hosted Checkout 模式
 * 使用你在 Bagel 后台已经生成好的支付链接（BAGELPAY_CHECKOUT_URL）
 * ✅ 不再调用任何 Bagel API，不会再出现 405 / JSON 解析错误。
 */
async function createBagelHostedCheckout(ticker) {
  const baseUrl = process.env.BAGELPAY_CHECKOUT_URL;

  if (!baseUrl) {
    console.error('[BagelPay] Missing BAGELPAY_CHECKOUT_URL');
    return {
      ok: false,
      statusCode: 500,
      error: 'Payment configuration is missing (BagelPay)',
    };
  }

  // 可选：把 ticker 当作 query 传过去，方便你在 Bagel 或回调里看到
  const checkoutUrl = baseUrl.includes('?')
    ? `${baseUrl}&ticker=${encodeURIComponent(ticker)}`
    : `${baseUrl}?ticker=${encodeURIComponent(ticker)}`;

  console.log('[BagelPay] Hosted checkout URL:', checkoutUrl);

  // ❗注意：这里不再有 fetch，直接返回 URL
  return {
    ok: true,
    checkoutUrl,
  };
}

/**
 * Creem 支付（保留代码，将来 KYC 通过可以把 PAYMENT_PROVIDER 切回 creem）
 */
async function createCreemCheckout(ticker, origin) {
  const apiKey = process.env.CREEM_API_KEY;
  const productId = process.env.CREEM_PRODUCT_ID;
  const apiBase =
    process.env.CREEM_API_BASE || 'https://api.creem.io';

  if (!apiKey || !productId) {
    console.error('[Creem] Missing CREEM_API_KEY or CREEM_PRODUCT_ID');
    return {
      ok: false,
      statusCode: 500,
      error: 'Payment configuration is missing (Creem)',
    };
  }

  const configuredSuccess = process.env.CREEM_SUCCESS_URL || null;

  const derivedSuccess =
    !configuredSuccess && origin.startsWith('https://')
      ? `${origin}/?paid=1&ticker=${encodeURIComponent(ticker)}`
      : null;

  const successUrl = configuredSuccess
    ? configuredSuccess.replace('{{ticker}}', encodeURIComponent(ticker))
    : derivedSuccess;

  const sendMetadata =
    (process.env.CREEM_SEND_METADATA || 'true').toLowerCase() !== 'false';
  const sendRequestId =
    (process.env.CREEM_SEND_REQUEST_ID || 'true').toLowerCase() !== 'false';

  const body = {
    product_id: productId,
  };

  if (sendRequestId) {
    body.request_id = `briefingdeck_${ticker}_${Date.now()}`;
  }
  if (sendMetadata) {
    body.metadata = { ticker };
  }
  if (successUrl) {
    body.success_url = successUrl;
  }

  console.log('[Creem] Creating checkout with body:', body);

  let response;
  try {
    response = await fetch(`${apiBase}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('[Creem] Network error:', err);
    return { ok: false, statusCode: 500, error: 'Creem network error' };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    console.error('[Creem] Failed to parse JSON:', err);
    return {
      ok: false,
      statusCode: response.status,
      error: 'Creem invalid response',
    };
  }

  const checkoutUrl = data.checkout_url || data.url || null;
  console.log('[Creem] Response:', data);

  if (!response.ok || !checkoutUrl) {
    console.error('[Creem] Live API Error:', data);
    return {
      ok: false,
      statusCode: response.status,
      error:
        data.error ||
        data.message ||
        `Creem error (status ${response.status})`,
    };
  }

  return {
    ok: true,
    checkoutUrl,
  };
}
