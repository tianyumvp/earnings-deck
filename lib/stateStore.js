// Simple in-memory state store for order tracking.
// Note: In serverless environments this does not persist across cold starts.
// Consider replacing with Redis/DB for production durability.

const store = new Map();

export function generateOrderId(ticker = 'deck') {
  const clean = (ticker || 'deck').trim().toUpperCase() || 'DECK';
  return `${clean}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

export function setOrderState(orderId, state) {
  if (!orderId) return;
  store.set(orderId, { ...state, orderId });
}

export function getOrderState(orderId) {
  if (!orderId) return null;
  return store.get(orderId) || null;
}

export function hasOrder(orderId) {
  return store.has(orderId);
}

export function resetStore() {
  store.clear();
}
