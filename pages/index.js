// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [paidMessage, setPaidMessage] = useState(null);

  // 处理 Creem 成功回调 ?paid=1&ticker=AMD
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const paid = url.searchParams.get('paid');
    const t = url.searchParams.get('ticker');
    if (paid === '1' && t) {
      setPaidMessage(
        `Payment received for ${t}. Your briefing deck is being generated.`
      );
    }
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setPaidMessage(null);

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

      // 跳转到 Creem 付款页
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      {/* 顶部栏 */}
      <header className="w-full border-b border-neutral-200 bg-neutral-100/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-black" />
            <span className="text-sm font-medium tracking-tight">
              BriefingDeck
            </span>
          </div>
        </div>
      </header>

      {/* 主内容 */}
      <div className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm px-6 py-8 md:px-8 md:py-10">
            {/* 顶部提示：Creem 回调成功提示 */}
            {paidMessage && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                {paidMessage}
              </div>
            )}

            {/* 标题区 */}
            <div className="space-y-4 mb-8">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                Briefing Deck Agent
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
                Turn a ticker into an briefing deck
              </h1>
              <p className="text-sm md:text-base leading-relaxed text-neutral-600">
                Enter any stock ticker to generate a concise, banker-style
                briefing deck based on the latest publicly filed results.
              </p>
            </div>

            {/* 表单 */}
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label
                  htmlFor="ticker"
                  className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500"
                >
                  Ticker
                </label>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <input
                    id="ticker"
                    type="text"
                    placeholder="e.g. AMD"
                    className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900"
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
                <div className="mt-2 space-y-1">
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

            {/* 卖点文案 */}
            <div className="mt-8 space-y-1 text-xs md:text-sm text-neutral-500">
              <p>• Uses latest publicly filed earnings and investor materials.</p>
              <p>• Clean, professional layout for investor meetings and IC memos.</p>
              <p>• Typically ready in about 60 seconds.</p>
            </div>

            {/* Powered by 声明 */}
            <div className="mt-6 border-t border-neutral-200 pt-3">
              <p className="text-[11px] text-neutral-400">
                Powered by DeepSeek &amp; Gamma API. BriefingDeck does not
                provide investment advice; all content is for information only.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-100">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4 text-xs text-neutral-500">
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