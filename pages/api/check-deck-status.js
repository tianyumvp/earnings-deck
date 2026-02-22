// pages/api/check-deck-status.js
// 检查 Gamma deck 生成状态

export const config = {
  maxDuration: 10,
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { generationId } = req.query;
  
  if (!generationId) {
    return res.status(400).json({ ok: false, error: 'Missing generationId' });
  }

  const gammaApiKey = process.env.GAMMA_API_KEY;
  if (!gammaApiKey) {
    return res.status(500).json({ ok: false, error: 'GAMMA_API_KEY not configured' });
  }

  try {
    console.log(`[Check Status] Checking generation: ${generationId}`);
    
    const statusResponse = await fetch(`https://public-api.gamma.app/v1.0/generations/${generationId}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': gammaApiKey,
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.error(`[Check Status] Gamma error: ${statusResponse.status} - ${errorText}`);
      return res.status(500).json({ 
        ok: false, 
        error: `Gamma API error: ${statusResponse.status}` 
      });
    }

    const statusData = await statusResponse.json();
    console.log('[Check Status] Response:', JSON.stringify(statusData, null, 2));

    const status = statusData.status || statusData.state;
    
    if (status === 'completed' || status === 'done') {
      return res.status(200).json({
        ok: true,
        status: 'completed',
        deckUrl: statusData.exportUrl || statusData.pdfUrl || statusData.url || statusData.gammaUrl,
        exportUrl: statusData.exportUrl || statusData.pdfUrl || null,
        gammaUrl: statusData.gammaUrl || statusData.url || null,
      });
    }

    if (status === 'failed' || status === 'error') {
      return res.status(200).json({
        ok: false,
        status: 'failed',
        error: statusData.error || statusData.message || 'Generation failed',
      });
    }

    // 仍在处理中
    return res.status(200).json({
      ok: true,
      status: 'processing',
      message: 'Generation in progress...',
    });

  } catch (err) {
    console.error('[Check Status] Error:', err);
    return res.status(500).json({
      ok: false,
      error: err.message || 'Failed to check status',
    });
  }
}
