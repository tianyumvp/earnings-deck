// pages/api/pay.js

// ==================== 环境变量检查（启动时打印） ====================
console.log('=== /api/pay.js 环境变量 ===');
console.log('PAYMENT_PROVIDER:', process.env.PAYMENT_PROVIDER);
console.log('CREEM_IS_TEST:', process.env.CREEM_IS_TEST);
console.log('CREEM_API_KEY:', process.env.CREEM_API_KEY ? '已设置' : '未设置');
console.log('CREEM_PRODUCT_ID:', process.env.CREEM_PRODUCT_ID ? '已设置' : '未设置');
console.log('CREEM_API_BASE:', process.env.CREEM_API_BASE || '默认(sandbox.creem.io)');
console.log('BAGELPAY_CHECKOUT_URL:', process.env.BAGELPAY_CHECKOUT_URL ? '已设置' : '未设置');
console.log('=============================');

const PAYMENT_PROVIDER = process.env.PAYMENT_PROVIDER || 'bagel';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { ticker, email } = req.body || {};
  
  if (!ticker || typeof ticker !== 'string' || ticker.trim().length === 0) {
    return res.status(400).json({ ok: false, error: 'Ticker is required (e.g. AMD)' });
  }

  const normalizedTicker = ticker.trim().toUpperCase();
  const origin =
    req.headers.origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://briefingdeck.com';

  // ✅ 生成唯一订单号
  const orderId = `deck_${normalizedTicker}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`[API /pay] 订单: ${orderId}, Ticker: ${normalizedTicker}, Email: ${email || 'N/A'}`);

  try {
    if (PAYMENT_PROVIDER === 'creem') {
      console.log('[API /pay] 使用 Creem');
      const result = await createCreemCheckout(normalizedTicker, origin, orderId);
      
      if (!result.ok) {
        return res.status(result.statusCode || 500).json({
          ok: false,
          error: result.error || 'Creem payment failed'
        });
      }
      
      return res.status(200).json({
        ok: true,
        provider: 'creem',
        checkoutUrl: result.checkoutUrl,
        orderId,
      });
    }

    console.log('[API /pay] 使用 BagelPay');
    const result = await createBagelHostedCheckout(normalizedTicker, orderId);
    
    if (!result.ok) {
      return res.status(result.statusCode || 500).json({
        ok: false,
        error: result.error || 'BagelPay payment failed'
      });
    }

    return res.status(200).json({
      ok: true,
      provider: 'bagelpay',
      checkoutUrl: result.checkoutUrl,
      orderId,
    });

  } catch (err) {
    console.error('[API /pay] 异常:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}

/**
 * BagelPay - Hosted Checkout
 */
async function createBagelHostedCheckout(ticker, orderId) {
  const baseUrl = process.env.BAGELPAY_CHECKOUT_URL;

  if (!baseUrl) {
    console.error('[BagelPay] 错误: BAGELPAY_CHECKOUT_URL 未配置');
    return {
      ok: false,
      statusCode: 500,
      error: 'Payment configuration is missing (BagelPay)',
    };
  }

  const params = new URLSearchParams({ ticker, orderId });
  const checkoutUrl = baseUrl.includes('?') 
    ? `${baseUrl}&${params.toString()}`
    : `${baseUrl}?${params.toString()}`;

  console.log(`[BagelPay] URL: ${checkoutUrl}`);
  return { ok: true, checkoutUrl };
}

/**
 * Creem - 支持测试模式
 */
async function createCreemCheckout(ticker, origin, orderId) {
  // ==================== 测试模式检查 ====================
  const isTestMode = String(process.env.CREEM_IS_TEST).trim().toLowerCase() === 'true';
  
  if (isTestMode) {
    console.log('[Creem] 🧪 测试模式激活');
    const mockUrl = `${origin}/?paid=1&ticker=${encodeURIComponent(ticker)}&orderId=${encodeURIComponent(orderId)}`;
    console.log('[Creem] 返回 mock URL:', mockUrl);
    return { ok: true, checkoutUrl: mockUrl };
  }

  // ==================== 生产模式 ====================
  console.log('[Creem] 🚀 生产模式');
  
  const apiKey = process.env.CREEM_API_KEY;
  const productId = process.env.CREEM_PRODUCT_ID;
  const apiBase = process.env.CREEM_API_BASE || 'https://api.creem.io';

  if (!apiKey || !productId) {
    console.error('[Creem] 错误: 缺少 API Key 或 Product ID');
    return {
      ok: false,
      statusCode: 500,
      error: 'Payment configuration is missing (Creem)',
    };
  }

  const configuredSuccess = process.env.CREEM_SUCCESS_URL || null;
  const derivedSuccess = !configuredSuccess && origin.startsWith('https://')
    ? `${origin}/?paid=1&ticker=${encodeURIComponent(ticker)}&orderId=${encodeURIComponent(orderId)}`
    : null;

  const successUrl = configuredSuccess
    ? configuredSuccess
        .replace('{{ticker}}', encodeURIComponent(ticker))
        .replace('{{orderId}}', encodeURIComponent(orderId))
    : derivedSuccess;

  const body = {
    product_id: productId,
  };

  if ((process.env.CREEM_SEND_METADATA || 'true') === 'true') {
    body.metadata = { ticker, orderId };
  }

  if ((process.env.CREEM_SEND_REQUEST_ID || 'true') === 'true') {
    body.request_id = `briefingdeck_${ticker}_${Date.now()}`;
  }

  if (successUrl) {
    body.success_url = successUrl;
  }

  console.log('[Creem] 请求体:', JSON.stringify(body, null, 2));

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
    console.error('[Creem] 网络错误:', err);
    return { ok: false, statusCode: 500, error: 'Creem network error' };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    console.error('[Creem] JSON 解析失败:', err);
    return {
      ok: false,
      statusCode: response.status,
      error: 'Creem invalid response',
    };
  }

  const checkoutUrl = data.checkout_url || data.url || null;
  console.log('[Creem] 响应:', data);

  if (!response.ok || !checkoutUrl) {
    console.error('[Creem] 错误:', data);
    return {
      ok: false,
      statusCode: response.status,
      error: data.error || data.message || `Creem error (status ${response.status})`,
    };
  }

  return {
    ok: true,
    checkoutUrl,
  };
}
