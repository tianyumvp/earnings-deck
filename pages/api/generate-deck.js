// pages/api/generate-deck.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { ticker, email } = req.body || {};
  let { orderId } = req.body || {};
  const normalizedTicker = (ticker || '').trim().toUpperCase();

  if (!orderId) {
    orderId = `${normalizedTicker || 'DECK'}_${Date.now()}`;
  }

  const n8nUrl = process.env.N8N_WEBHOOK_URL;
  if (!n8nUrl) {
    return res.status(500).json({ ok: false, error: 'N8N_WEBHOOK_URL not configured' });
  }

  console.log('[API POST] 同步触发 n8n:', { ticker: normalizedTicker, email, orderId });

  try {
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'BriefingDeck/1.0',
      },
      body: JSON.stringify({ 
        ticker: normalizedTicker, 
        email: (email || '').trim() || null, 
        orderId,
        timestamp: Date.now(),
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(500).json({
        ok: false,
        status: 'failed',
        error: `n8n error (${response.status})`,
        rawText: text,
        orderId,
      });
    }

    let data = await response.json().catch(() => ({}));
    if (Array.isArray(data)) data = data[0] || {};

    const deckUrl =
      data.deckUrl ||
      data.url ||
      data.exportUrl ||
      data.gammaUrl ||
      null;

    if (!deckUrl) {
      return res.status(500).json({
        ok: false,
        status: 'failed',
        error: 'deckUrl missing from n8n response',
        data,
        orderId,
      });
    }

    return res.status(200).json({
      ok: true,
      status: data.status || 'completed',
      ticker: data.ticker || normalizedTicker,
      deckUrl,
      exportUrl: data.exportUrl || null,
      gammaUrl: data.gammaUrl || null,
      orderId,
    });
  } catch (err) {
    console.error('[API] n8n fetch failed:', err);
    return res.status(500).json({
      ok: false,
      status: 'failed',
      error: 'n8n request failed',
      orderId,
    });
  }
}
