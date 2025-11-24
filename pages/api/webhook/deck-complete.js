// pages/api/webhook/deck-complete.js
import { setOrderState } from '../../../lib/stateStore';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const payload = req.body || {};
  const orderId = payload.orderId || payload.id || null;
  const deckUrl =
    payload.deckUrl ||
    payload.url ||
    payload.exportUrl ||
    payload.gammaUrl ||
    null;
  const ticker = payload.ticker || null;
  const status = payload.status || 'completed';

  if (!orderId) {
    return res.status(400).json({ ok: false, error: 'orderId required' });
  }

  setOrderState(orderId, {
    ok: !!deckUrl,
    status: deckUrl ? status : 'failed',
    deckUrl: deckUrl || null,
    ticker,
    source: payload.source || 'webhook',
    raw: payload,
    completedAt: Date.now(),
  });

  return res.status(200).json({ ok: true });
}
