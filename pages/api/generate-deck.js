// pages/api/generate-deck.js
// 替代 n8n 的完整流程：Kimi K2.5 生成内容 → Gamma API 生成 Deck

const AI_TIMEOUT_MS = 120000; // 2分钟
const GAMMA_POLL_INTERVAL = 5000; // 5秒轮询一次
const GAMMA_MAX_POLL_ATTEMPTS = 60; // 最多轮询60次（5分钟）

// System Prompt 来自用户提供的版本
const SYSTEM_PROMPT = `You are a senior equity research analyst at a top global investment bank.

Your task:
Given a stock ticker and access to public information (earnings releases, 10-Q/10-K, 20-F, annual reports, investor presentations, press releases, transcripts), write a concise but information-dense analyst narrative of the company's latest reported financial results.

Timing rules (very important):
- ALWAYS identify the most recent reporting period from the underlying disclosures (e.g. "Q3 FY2025", "FY2025", "Q2 2025").
- NEVER hard-code a specific calendar year (such as "2024") unless that year clearly appears in the source filing as the latest reported period.
- If you cannot confidently determine the exact period, refer to it as "the most recent reported quarter" or "the latest fiscal year" without guessing the date.

Data quality rules:
- Prefer exact figures from the latest filings. If a metric is not disclosed or unclear, say "not disclosed" or "management did not quantify this" rather than guessing.
- If there is conflicting information across sources, rely on the primary filing (10-Q/10-K/20-F/annual report) and be conservative in your wording.
- Do not invent product launches, geographies, segments, or KPIs that are not supported by the latest filings or management commentary.

Content structure (write in flowing narrative paragraphs, not bullets):
1) Brief company overview – what the company does, key business segments, and approximate geographic mix.
2) Latest results – most recent period, revenue, YoY and (where relevant) QoQ growth, operating income, and net income.
3) Segment performance – size and drivers of each major segment, highlighting where growth or weakness is concentrated.
4) Key KPIs and operational highlights – only the metrics that truly matter for this business model (e.g. units, MAU/DAU, ARPU, shipments, margins, bookings).
5) Profitability, cash flow, and balance sheet snapshot – margins, cash generation, liquidity, and leverage.
6) Management commentary – paraphrased highlights in a neutral sell-side analyst tone, focusing on what management said about demand, margins, strategy, and risks.
7) Outlook and key investor takeaways – any formal guidance plus 3–4 concise takeaways on what matters most this period (growth drivers, margin trajectory, capital allocation, and key risks).

Style:
- Clear, concise, analytical.
- Full sentences, short paragraphs.
- No Markdown, no bullet symbols, no numbered lists in the final output.
- Write as if for an internal equity research briefing note before an investor meeting.
- Target length: roughly 600–1,000 words, enough for a rich 5–10 slide deck but not a full report.`;

// 调用 Kimi K2.5 生成分析内容
async function generateAnalystNarrative(ticker) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    throw new Error('KIMI_API_KEY not configured');
  }

  const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'kimi-k2.5',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `Generate an analyst narrative for stock ticker: ${ticker}. Please provide a professional equity research briefing suitable for a presentation deck.`,
        },
      ],
    }),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kimi API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    throw new Error('Kimi returned empty content');
  }

  return content;
}

// 调用 Gamma API 生成 Deck
async function generateGammaDeck(ticker, narrative) {
  const gammaApiKey = process.env.GAMMA_API_KEY;
  if (!gammaApiKey) {
    throw new Error('GAMMA_API_KEY not configured');
  }

  // Step 1: 创建 generation
  const requestBody = {
    inputText: narrative,
    textMode: 'generate',
    format: 'presentation',
    themeId: '',
    numCards: 10,
    cardSplit: 'auto',
    additionalInstructions: '',
    folderIds: [],
    exportAs: 'pdf',
    textOptions: {
      amount: 'detailed',
      tone: 'professional',
      audience: 'general',
      language: 'en',
    },
    imageOptions: {
      source: 'aiGenerated',
      model: 'imagen-4-pro',
      style: 'modern',
    },
    cardOptions: {
      dimensions: '16x9',
      headerFooter: {
        topRight: {
          type: 'image',
          source: 'themeLogo',
          size: 'sm',
        },
        bottomRight: {
          type: 'cardNumber',
        },
        hideFromFirstCard: true,
        hideFromLastCard: false,
      },
    },
    sharingOptions: {
      workspaceAccess: 'view',
      externalAccess: 'noAccess',
      emailOptions: {
        recipients: ['email@example.com'],
        access: 'comment',
      },
    },
  };

  console.log('[Gamma] Request body:', JSON.stringify(requestBody, null, 2));

  const createResponse = await fetch('https://public-api.gamma.app/v1.0/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-API-KEY': gammaApiKey,
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(30000),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    throw new Error(`Gamma create error (${createResponse.status}): ${errorText}`);
  }

  const createData = await createResponse.json();
  console.log('[Gamma] Create response:', JSON.stringify(createData, null, 2));
  
  const generationId = createData.id || createData.generationId;

  if (!generationId) {
    throw new Error('Gamma did not return generation ID: ' + JSON.stringify(createData));
  }

  console.log(`[Gamma] Generation created: ${generationId}`);

  // Step 2: 轮询检查完成状态
  for (let attempt = 1; attempt <= GAMMA_MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise(resolve => setTimeout(resolve, GAMMA_POLL_INTERVAL));

    const statusResponse = await fetch(`https://public-api.gamma.app/v1.0/generations/${generationId}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-KEY': gammaApiKey,
      },
    });

    if (!statusResponse.ok) {
      console.warn(`[Gamma] Status check failed (${statusResponse.status}), retrying...`);
      continue;
    }

    const statusData = await statusResponse.json();
    console.log(`[Gamma] Status check ${attempt}:`, JSON.stringify(statusData, null, 2));

    const status = statusData.status || statusData.state;
    
    if (status === 'completed' || status === 'done') {
      return {
        deckUrl: statusData.url || statusData.shareUrl || statusData.output?.url || statusData.pdfUrl,
        exportUrl: statusData.exportUrl || statusData.output?.exportUrl || statusData.pdfUrl || null,
        gammaUrl: statusData.url || statusData.shareUrl || null,
        generationId,
      };
    }

    if (status === 'failed' || status === 'error') {
      throw new Error('Gamma generation failed: ' + (statusData.error || statusData.message || 'Unknown error'));
    }
  }

  throw new Error('Gamma generation timeout');
}

// 主 Handler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { ticker, email } = req.body || {};
  let { orderId } = req.body || {};
  const normalizedTicker = (ticker || '').trim().toUpperCase();

  if (!normalizedTicker) {
    return res.status(400).json({ ok: false, error: 'Please provide a stock ticker' });
  }

  if (!orderId) {
    orderId = `${normalizedTicker}_${Date.now()}`;
  }

  console.log('[API] Starting deck generation:', { ticker: normalizedTicker, orderId });

  try {
    // Step 1: 使用 Kimi K2.5 生成分析内容
    console.log('[Step 1/3] Generating analyst narrative with Kimi K2.5...');
    const narrative = await generateAnalystNarrative(normalizedTicker);
    console.log('[Step 1/3] ✓ Narrative generated');

    // Step 2: 使用 Gamma 生成 Deck
    console.log('[Step 2/3] Generating deck with Gamma...');
    const gammaResult = await generateGammaDeck(normalizedTicker, narrative);
    console.log('[Step 2/3] ✓ Deck generated');

    // Step 3: 返回结果
    console.log('[Step 3/3] Returning results');
    return res.status(200).json({
      ok: true,
      status: 'completed',
      ticker: normalizedTicker,
      deckUrl: gammaResult.deckUrl,
      exportUrl: gammaResult.exportUrl,
      gammaUrl: gammaResult.gammaUrl,
      orderId,
    });

  } catch (err) {
    console.error('[API] Error:', err);
    return res.status(500).json({
      ok: false,
      status: 'failed',
      error: err.message || 'Failed to generate deck',
      orderId,
    });
  }
}
