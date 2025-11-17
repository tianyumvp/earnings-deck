// pages/api/generate-deck.js

export default async function handler(req, res) {
  // 1. Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Read ticker (and optional email) from request body
  const { ticker, email } = req.body || {};

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' });
  }

  try {
    // 3. n8n Webhook URL (use Production URL by default)
    const webhookUrl =
      process.env.N8N_WEBHOOK_URL ||
      'https://tianyumvp.app.n8n.cloud/webhook/earnings-deck'; // ✅ 生产 URL

    console.log('[API] incoming request:', { ticker, email });
    console.log('[API] calling n8n webhook:', webhookUrl);

    // 4. Forward ticker (and optional email) to n8n
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ticker,
        email,
      }),
    });

    console.log('[API] n8n status:', n8nResponse.status);

    // 5. Parse n8n JSON response (from "Respond to Webhook" node)
    let data = null;
    let rawText = null;
    try {
      rawText = await n8nResponse.text();
      console.log('[API] n8n raw response text:', rawText);
      data = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      console.error('[API] Failed to parse n8n JSON response:', e);
    }

    if (!n8nResponse.ok) {
      // n8n returned an HTTP error
      return res.status(500).json({
        ok: false,
        error: 'n8n workflow error',
        status: n8nResponse.status,
        data,
        rawText,
      });
    }

    // 6. Validate data from n8n (according to your Respond to Webhook JSON)
    // e.g. { ok: true, ticker: "...", status: "completed", exportUrl: "...", gammaUrl: "..." }
    if (!data || data.ok === false) {
      return res.status(500).json({
        ok: false,
        error: data?.error || 'Invalid response from workflow',
        data,
      });
    }

    // 7. Return clean data to the frontend
    const payload = {
      ok: true,
      ticker: data.ticker || ticker,
      status: data.status,
      exportUrl: data.exportUrl || null,
      gammaUrl: data.gammaUrl || null,
      // raw: data, // 如果想调试完整返回，可以临时打开
    };

    console.log('[API] returning to frontend:', payload);

    return res.status(200).json(payload);
  } catch (err) {
    console.error('Error calling n8n webhook:', err);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}