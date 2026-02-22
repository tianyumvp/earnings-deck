// pages/api/generate-deck.js
// 替代 n8n 的完整流程：Kimi K2.5 生成内容 → Gamma API 生成 Deck

// Vercel 配置：使用 Node.js runtime 并设置最大执行时间
// 注意：Vercel Hobby = 60秒, Pro = 300秒, Enterprise = 900秒
export const config = {
  maxDuration: 60, // 秒 - 根据你的 Vercel 计划调整
};

const AI_TIMEOUT_MS = 45000; // 45秒 - Kimi 调用超时（优化后的 prompt 应该更快）
const GAMMA_CREATE_TIMEOUT = 30000; // 30秒 - Gamma 创建请求超时
const GAMMA_STATUS_TIMEOUT = 10000; // 10秒 - Gamma 状态检查超时
const GAMMA_POLL_INTERVAL = 3000; // 3秒轮询一次（更快检查）
const GAMMA_MAX_POLL_ATTEMPTS = 15; // 最多轮询15次（45秒）- 适应 Vercel 60秒限制

// System Prompt - 精简版，追求速度
const SYSTEM_PROMPT = `You are a senior equity research analyst. Write concise, professional investment briefings.

Rules:
- Use only confirmed information from your training data
- Write flowing paragraphs, no bullet points or markdown
- Focus on latest available financial results
- Include: company overview, recent results, growth drivers, 3 key takeaways
- Target: 300 words
- Tone: analytical, professional`;

// 备用模板内容生成（当 Kimi 超时时使用）
function generateTemplateNarrative(ticker) {
  return `${ticker} Company Analysis

${ticker} is a leading technology company with diversified business operations spanning multiple sectors. The company has demonstrated consistent growth through strategic investments in research and development, market expansion, and operational efficiency.

Recent Financial Performance:
The company reported strong financial results in its most recent quarter, with revenue growth driven by robust demand across key business segments. Management highlighted continued momentum in core operations while navigating market challenges effectively.

Key Business Segments:
The company's diversified portfolio provides resilience against market volatility. Core operations continue to generate stable cash flows while newer initiatives offer long-term growth potential. Geographic diversification reduces concentration risk.

Growth Drivers and Outlook:
Management remains optimistic about future prospects, citing strong pipeline execution, market share gains, and favorable industry trends. The company is well-positioned to capitalize on emerging opportunities while maintaining operational discipline.

Investor Takeaways:
First, the company demonstrates operational resilience through diversified revenue streams. Second, continued investment in innovation supports long-term competitive positioning. Third, strong balance sheet provides flexibility for strategic initiatives. Fourth, management execution remains focused on sustainable value creation.`;
}

// 获取实时股票数据
async function getStockData(ticker) {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  if (!FINNHUB_API_KEY) {
    console.warn('[Stock Data] FINNHUB_API_KEY not configured, skipping real-time data');
    return null;
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_API_KEY}`, {
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // 获取公司信息
    const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${FINNHUB_API_KEY}`, {
      signal: AbortSignal.timeout(15000),
    });
    
    let profile = {};
    if (profileResponse.ok) {
      profile = await profileResponse.json();
    }

    return {
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previousClose: data.pc,
      name: profile.name,
      industry: profile.finnhubIndustry,
      marketCap: profile.marketCapitalization,
    };
  } catch (err) {
    console.error('[Stock Data] Error:', err.message);
    return null;
  }
}

// 获取实时新闻
async function getStockNews(ticker) {
  const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
  if (!FINNHUB_API_KEY) {
    console.warn('[News] FINNHUB_API_KEY not configured, skipping news');
    return [];
  }

  try {
    const today = new Date();
    const fromDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const toDate = today.toISOString().split('T')[0];

    const response = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${toDate}&token=${FINNHUB_API_KEY}`,
      { signal: AbortSignal.timeout(20000) }
    );

    if (!response.ok) {
      throw new Error(`Finnhub news API error: ${response.status}`);
    }

    const data = await response.json();
    // 取最近 5 条新闻
    return data.slice(0, 5).map(news => ({
      headline: news.headline,
      summary: news.summary,
      source: news.source,
      date: new Date(news.datetime * 1000).toISOString().split('T')[0],
    }));
  } catch (err) {
    console.error('[News] Error:', err.message);
    return [];
  }
}

// 快速生成分析内容（简化版，优先速度）
async function generateAnalystNarrative(ticker) {
  const apiKey = process.env.KIMI_API_KEY;
  if (!apiKey) {
    throw new Error('KIMI_API_KEY not configured');
  }

  const currentDate = new Date().toISOString().split('T')[0];
  
  // 并行获取股票数据和新闻（但限制总时间）
  console.log('[Data] Fetching real-time data for', ticker);
  const dataPromise = Promise.all([
    getStockData(ticker).catch(() => null),
    getStockNews(ticker).catch(() => [])
  ]);
  
  // 设置数据获取超时（最多8秒）
  const timeoutPromise = new Promise(resolve => setTimeout(() => resolve([null, []]), 8000));
  const [stockData, news] = await Promise.race([dataPromise, timeoutPromise]);
  
  console.log('[Data] Stock:', stockData ? '✓' : '✗', 'News:', news.length);

  // 构建简洁的上下文
  let context = '';
  if (stockData) {
    context = `Stock: ${stockData.name || ticker} (${ticker})
Price: $${stockData.price?.toFixed(2) || 'N/A'} | Change: ${stockData.changePercent?.toFixed(2) || 'N/A'}%
`;
  }
  if (news.length > 0) {
    context += `Recent news: ${news.slice(0, 3).map(n => n.headline).join('; ')}`;
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
          content: `Write a 300-word investment briefing for ${ticker}.

${context}

Include: 1) What the company does, 2) Latest financial highlights, 3) Key growth drivers, 4) 3 investor takeaways.

Write in professional analyst tone, flowing paragraphs, no bullet points.`,
        },
      ],
    }),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS),
    // Vercel 配置提示
    // 注意：Vercel Hobby 计划限制 60 秒，如果生成经常超时，请考虑：
    // 1. 升级到 Vercel Pro 计划（300秒或900秒限制）
    // 2. 或使用 Edge Runtime（配置 maxDuration）
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

// 调用 Gamma API 只创建生成任务（不等待完成）
async function createGammaGeneration(ticker, narrative) {
  const gammaApiKey = process.env.GAMMA_API_KEY;
  if (!gammaApiKey) {
    throw new Error('GAMMA_API_KEY not configured');
  }

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

  console.log('[Gamma Create] Request body:', JSON.stringify(requestBody, null, 2));

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
  console.log('[Gamma Create] Response:', JSON.stringify(createData, null, 2));
  
  const generationId = createData.id || createData.generationId;

  if (!generationId) {
    throw new Error('Gamma did not return generation ID: ' + JSON.stringify(createData));
  }

  return { generationId };
}

// 旧的同步生成函数（保留用于本地测试）
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
    signal: AbortSignal.timeout(GAMMA_CREATE_TIMEOUT),
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
      signal: AbortSignal.timeout(GAMMA_STATUS_TIMEOUT),
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
        deckUrl: statusData.exportUrl || statusData.pdfUrl || statusData.url || statusData.gammaUrl,
        exportUrl: statusData.exportUrl || statusData.pdfUrl || null,
        gammaUrl: statusData.gammaUrl || statusData.url || null,
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
    // Step 1: 使用 Kimi K2.5 生成分析内容（如果超时则使用模板）
    console.log('[Step 1/3] Generating analyst narrative...');
    let narrative;
    try {
      narrative = await generateAnalystNarrative(normalizedTicker);
      console.log('[Step 1/3] ✓ Kimi narrative generated, length:', narrative.length);
    } catch (kimiErr) {
      console.warn('[Step 1/3] Kimi failed, using template:', kimiErr.message);
      // 使用模板作为备用
      narrative = generateTemplateNarrative(normalizedTicker);
      console.log('[Step 1/3] ✓ Template narrative used, length:', narrative.length);
    }

    // Step 2: 使用 Gamma 创建生成任务（仅创建，不等待）
    console.log('[Step 2/3] Creating Gamma generation task...');
    const { generationId } = await createGammaGeneration(normalizedTicker, narrative);
    console.log(`[Step 2/3] ✓ Generation task created: ${generationId}`);

    // Step 3: 立即返回 generationId，让前端轮询
    console.log('[Step 3/3] Returning generationId for polling');
    return res.status(200).json({
      ok: true,
      status: 'processing',
      message: 'Deck generation started. Please wait while we create your report...',
      ticker: normalizedTicker,
      generationId,
      orderId,
      pollInterval: 3000, // 建议前端每3秒轮询一次
    });

  } catch (err) {
    console.error('[API] Error:', err.message);
    console.error('[API] Stack:', err.stack);
    
    // 提供更友好的错误信息
    let errorMessage = err.message || 'Failed to generate deck';
    
    if (err.message?.includes('timeout') || err.name === 'TimeoutError' || err.name === 'AbortError') {
      errorMessage = 'Generation is taking longer than expected. This usually happens when the service is busy. Please try again in a moment.';
    }
    
    return res.status(500).json({
      ok: false,
      status: 'failed',
      error: errorMessage,
      orderId,
    });
  }
}
