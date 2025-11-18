// pages/index.js
import { useState } from 'react';

// 小工具函数：保证 URL 是绝对地址（带 https://）
function ensureAbsoluteUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url.replace(/^\/+/, '')}`;
}

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [deckUrl, setDeckUrl] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setDeckUrl(null);

    if (!ticker.trim()) {
      setError('Please enter a stock ticker, e.g. AMD');
      return;
    }

    setLoading(true);

    try {
      // 1) 调用 /api/pay（触发 Creem 支付）
      const payment = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: ticker.trim().toUpperCase() }),
      });

      const paymentData = await payment.json();
      console.log('[frontend] /api/pay result:', paymentData);

      if (!payment.ok || !paymentData?.checkout_url) {
        throw new Error(paymentData.error || 'Payment failed');
      }

      // 2) 跳转到 Creem checkout
      window.location.href = paymentData.checkout_url;

    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav */}
      <header className="w-full pt-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
            <span className="font-medium text-slate-50">AI Earnings Decks</span>
            <span>•</span>
            <span>Built for investors</span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-24">
        {/* Hero */}
        <div className="max-w-3xl space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
            Turn a Ticker into a Deck{' '}
            <span className="whitespace-nowrap text-sky-400">
              in 60 Seconds.
            </span>
          </h1>

          <p className="text-base leading-relaxed text-slate-300 md:text-lg">
            Enter any NYSE / NASDAQ ticker and instantly generate a clean,
            investor-ready briefing deck from the latest public filings.
          </p>
        </div>

        {/* Input + button */}
        <div className="mt-12">
          <label
            htmlFor="ticker"
            className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Ticker
          </label>

          <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
            <input
              id="ticker"
              type="text"
              placeholder="e.g. AMD"
              className="w-full rounded-xl bg-slate-900/60 border border-slate-700 px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70 focus:border-sky-500/70"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-sm hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Processing...' : 'Generate for $4.99'}
            </button>
          </div>
        </div>

        {/* Status / error / link */}
        {(status || error || deckUrl) && (
          <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            {status && (
              <p className="text-sm text-sky-300">
                {status}
              </p>
            )}

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            {deckUrl && (
              <div className="pt-2 space-y-2">
                <a
                  href={deckUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
                >
                  Open PDF Deck
                </a>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 space-y-1 text-sm text-slate-400">
          <p>Latest public filings included.</p>
          <p>Professional, banker-grade slide design.</p>
          <p>PDF delivered in under 60 seconds.</p>
        </div>
      </section>
    </main>
  );
}