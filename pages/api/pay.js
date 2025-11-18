// pages/api/pay.js

// 这些变量来自环境变量（.env.local 或 Vercel Project Settings）
const CREEM_API_KEY = process.env.CREEM_API_KEY;
const CREEM_PRODUCT_ID = process.env.CREEM_PRODUCT_ID;

// ⚠️ 现在默认用 TEST 环境的域名
// 以后你要切到正式收费，只需要：
// 1）把 CREEM_API_BASE 改成 https://api.creem.io
// 2）换成 Live API Key & Live Product ID
const CREEM_API_BASE =
  process.env.CREEM_API_BASE || 'https://test-api.creem.io';

// 站点自己的地址，用于 success_url（随便写一个也行）
const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'https://briefingdeck.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res
      .status(405)
      .json({ ok: false, error: 'Method not allowed' });
  }

  const { ticker } = req.body || {};

  if (!ticker || typeof ticker !== 'string') {
    return res
      .status(400)
      .json({ ok: false, error: 'Ticker is required' });
  }

  if (!CREEM_API_KEY || !CREEM_PRODUCT_ID) {
    console.error('[API /pay] env check:', {
      hasApiKey: !!CREEM_API_KEY,
      hasProductId: !!CREEM_PRODUCT_ID,
    });
    return res.status(500).json({
      ok: false,
      error: 'Payment configuration is missing',
    });
  }

  const upperTicker = ticker.trim().toUpperCase();

  const requestId = `briefingdeck_${upperTicker}_${Date.now()}`;

  const successUrl = `${APP_BASE_URL}/?status=success&ticker=${encodeURIComponent(
    upperTicker,
  )}`;

  const payload = {
    request_id: requestId,
    product_id: CREEM_PRODUCT_ID,
    units: 1,
    success_url: successUrl,
    metadata: {
      ticker: upperTicker,
    },
  };

  console.log('[API /pay] env check:', {
    hasApiKey: !!CREEM_API_KEY,
    hasProductId: !!CREEM_PRODUCT_ID,
  });
  console.log('[API /pay] Creating Creem checkout for', payload);

  try {
    const resp = await fetch(`${CREEM_API_BASE}/v1/checkouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const text = await resp.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.warn('[API /pay] Non-JSON response from Creem:', text);
    }

    if (!resp.ok) {
      console.error(
        `[API /pay] Creem API error ${resp.status}`,
        text,
      );
      return res.status(500).json({
        ok: false,
        error:
          data?.error ||
          data?.message ||
          `Creem API error ${resp.status}`,
      });
    }

    const checkoutUrl = data?.checkout_url;

    if (!checkoutUrl) {
      console.error(
        '[API /pay] No checkout_url in Creem response:',
        data,
      );
      return res.status(500).json({
        ok: false,
        error: 'No checkout URL returned by payment provider',
      });
    }

    return res.status(200).json({
      ok: true,
      checkoutUrl,
    });
  } catch (err) {
    console.error('[API /pay] Unexpected error:', err);
    return res.status(500).json({
      ok: false,
      error: 'Unexpected server error',
    });
  }
}