// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    if (!ticker.trim()) {
      setError('Please enter a stock ticker, e.g. AMD');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: ticker.trim().toUpperCase() }),
      });

      const data = await res.json().catch(() => ({}));
      console.log('[frontend] /api/pay response:', data);

      if (!res.ok || !data.ok || !data.checkoutUrl) {
        setError(data.error || 'Payment failed. Please try again.');
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f5f3] text-neutral-900 flex flex-col">
      {/* 顶部导航：极简 Notion 风 */}
      <header className="w-full border-b border-neutral-200 bg-[#f6f5f3]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-md bg-black" />
            <span className="text-sm font-medium tracking-tight">
              BriefingDeck
            </span>
          </div>
        </div>
      </header>

      {/* 主内容区：居中白卡 */}
      <div className="flex-1">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-14 md:py-16">
          <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm px-5 py-7 sm:px-8 sm:py-9 md:px-10 md:py-10">
            {/* 标题区 */}
            <div className="space-y-4 mb-8 md:mb-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                Briefing Deck Agent
              </p>
              <h1 className="text-[28px] leading-tight md:text-[32px] md:leading-snug font-semibold text-neutral-900">
                Turn a ticker into a briefing deck
              </h1>
              <p className="text-sm md:text-[15px] leading-relaxed text-neutral-600 max-w-2xl">
                Enter any stock ticker to generate a concise, banker-style
                briefing deck based on the latest publicly filed earnings and
                investor materials.
              </p>
            </div>

            {/* 表单区域 */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label
                  htmlFor="ticker"
                  className="mb-1 block text-xs font-medium uppercase tracking-[0.16em] text-neutral-500"
                >
                  Ticker
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    id="ticker"
                    type="text"
                    placeholder="e.g. AMD"
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    {loading ? 'Processing…' : 'Generate for $4.99'}
                  </button>
                </div>
              </div>

              {/* 错误 / 状态 */}
              {(error || status) && (
                <div className="mt-1 space-y-1">
                  {error && (
                    <p className="text-xs text-red-500">
                      {error}
                    </p>
                  )}
                  {status && (
                    <p className="text-xs text-emerald-600">
                      {status}
                    </p>
                  )}
                </div>
              )}
            </form>

            {/* 卖点文案：Notion 式 bullet */}
            <div className="mt-7 space-y-1.5 text-xs md:text-sm text-neutral-500">
              <p>• Uses latest publicly filed earnings and investor materials.</p>
              <p>• Clean, professional layout for investor meetings and IC memos.</p>
              <p>• Typically ready in about 60 seconds.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer：给支付方看的合规链接 */}
      <footer className="border-t border-neutral-200 bg-[#f6f5f3]">
        <div className="mx-auto flex max-w-4xl flex-col sm:flex-row items-center justify-between gap-2 px-6 py-4 text-xs text-neutral-500">
          <span>© {new Date().getFullYear()} BriefingDeck.com</span>
          <div>
            <a href="/privacy" className="mr-4 hover:text-neutral-800">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-neutral-800">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}