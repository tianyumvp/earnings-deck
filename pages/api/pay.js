// pages/api/pay.js

const CREEM_API_KEY = process.env.CREEM_API_KEY;
const CREEM_PRODUCT_ID = process.env.CREEM_PRODUCT_ID;
// 可选：本地/线上都走同一个，不用再写 TEST BASE 了
const CREEM_API_BASE = process.env.CREEM_API_BASE || 'https://api.creem.io';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { ticker } = req.body || {};
  const cleanTicker = (ticker || '').trim().toUpperCase();

  if (!cleanTicker) {
    return res.status(400).json({ ok: false, error: 'Ticker is required' });
  }

  if (!CREEM_API_KEY || !CREEM_PRODUCT_ID) {
    console.error('[API /pay] Missing CREEM env vars');
    return res
      .status(500)
      .json({ ok: false, error: 'Payment configuration is missing' });
  }

  const origin =
    req.headers.origin ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');

  const requestId = `briefingdeck_${cleanTicker}_${Date.now()}`;

  const body = {
    product_id: CREEM_PRODUCT_ID,
    request_id: requestId,
    metadata: { ticker: cleanTicker },
    success_url: `${origin}/?paid=1&ticker=${encodeURIComponent(cleanTicker)}`,
  };

  console.log('[API /pay] Using live Creem:', {
    apiKey: !!CREEM_API_KEY,
    productId: CREEM_PRODUCT_ID,
  });
  console.log('[API /pay] Creating Creem checkout with body:', body);

  try {
    const resp = await fetch(`${CREEM_API_BASE}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // ✅ 关键：Creem 用 x-api-key，而不是 Authorization
        'x-api-key': CREEM_API_KEY,
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = { raw: text };
    }

    console.log('[API /pay] Creem response:', json);

    if (!resp.ok) {
      console.error('Creem Live API Error:', json);
      return res
        .status(500)
        .json({ ok: false, error: json.error || 'Payment failed' });
    }

    const checkoutUrl = json.checkout_url || json.url;

    if (!checkoutUrl) {
      console.error('Creem response missing checkout_url:', json);
      return res
        .status(500)
        .json({ ok: false, error: 'Missing checkout URL from Creem' });
    }

    return res.status(200).json({
      ok: true,
      checkoutUrl,
    });
  } catch (err) {
    console.error('Creem Live API Unexpected Error:', err);
    return res
      .status(500)
      .json({ ok: false, error: 'Unexpected payment error' });
  }
}