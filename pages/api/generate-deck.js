// pages/api/generate-deck.js

const processedOrders = new Map();
const ACTIVE_FETCHES = new Set(); // 保持 Promise 引用，防止被 GC

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // ==================== GET: 查询状态 ====================
  if (req.method === 'GET') {
    const { orderId } = req.query;
    if (!orderId) return res.status(400).json({ ok: false, error: 'orderId required' });

    const result = processedOrders.get(orderId);
    if (!result) {
      return res.status(202).json({
        ok: false,
        status: 'processing',
        message: 'Still initializing...',
      });
    }
    return res.status(200).json(result);
  }

  // ==================== POST: 触发生成 ====================
  if (req.method === 'POST') {
    const { ticker, email, orderId } = req.body || {};
    const normalizedTicker = (ticker || '').trim().toUpperCase();

    console.log('[API POST] 收到请求:', { ticker: normalizedTicker, email, orderId });

    if (orderId && processedOrders.has(orderId)) {
      return res.status(200).json(processedOrders.get(orderId));
    }

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      return res.status(500).json({ ok: false, error: 'N8N_WEBHOOK_URL not configured' });
    }
    const safeEmail = (email || '').trim() || null;

    // ✅ 标记处理中
    processedOrders.set(orderId, {
      ok: false,
      status: 'processing',
      message: 'Your deck is being generated (2-4 minutes)',
      startedAt: Date.now(),
    });

    // ==================== 关键修复 ====================
    // 使用 setImmediate 确保响应发送后执行
    setImmediate(async () => {
      console.log('[API] 🚀 [setImmediate] 开始触发 n8n:', new Date().toISOString());
      console.log('[API] n8n URL:', n8nUrl);
      console.log('[API] Payload:', { ticker: normalizedTicker, email, orderId });

      try {
        const fetchPromise = fetch(n8nUrl, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'BriefingDeck/1.0',
          },
          body: JSON.stringify({ 
            ticker: normalizedTicker, 
            email: safeEmail, 
            orderId,
            timestamp: Date.now(),
          }),
          // 不设 timeout，让 n8n 充分运行
        });

        // 保持引用
        ACTIVE_FETCHES.add(fetchPromise);

        const response = await fetchPromise;
        ACTIVE_FETCHES.delete(fetchPromise);

        console.log('[API] ✅ n8n 回调完成，状态:', response.status);

        if (response.ok) {
          const data = await response.json().catch(() => ({}));
          const deckUrl = data.deckUrl || data.url || null;
          
          if (deckUrl && orderId) {
            processedOrders.set(orderId, {
              ok: true,
              deckUrl,
              source: 'n8n',
              status: 'completed',
              completedAt: Date.now(),
            });
            console.log('[API] 🎉 结果已缓存:', orderId, deckUrl);
          }
        } else {
          const errorBody = await response.text();
          console.error('[API] ❌ n8n 错误:', response.status, errorBody);
          if (orderId) {
            processedOrders.set(orderId, {
              ok: false,
              status: 'failed',
              message: `n8n error (${response.status}). Check n8n logs.`,
              errorBody,
              completedAt: Date.now(),
            });
          }
        }
      } catch (err) {
        console.error('[API] 🔥 n8n 异常:', err.message);
        if (orderId) {
          processedOrders.set(orderId, {
            ok: false,
            status: 'failed',
            message: 'n8n request failed',
            error: err.message,
            completedAt: Date.now(),
          });
        }
      }
    });

    // ✅ 立即响应
    console.log('[API POST] 返回 202，响应已发送');
    res.status(202).json({
      ok: false,
      status: 'processing',
      message: 'Your deck is being generated (2-4 minutes)',
      orderId,
    });

    // 关键：不要等待 setImmediate，让 Node.js 保持事件循环
    return;
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
