// pages/index.js
import { useEffect, useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [paidMessage, setPaidMessage] = useState(null);

  // 当 Creem 支付成功跳回 ?paid=1&ticker=XXX 时，给用户一个“支付成功，正在生成”的提示
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

      // 没拿到 checkoutUrl，就视为支付创建失败
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 text-slate-900">
      {/* 背景动态色块 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="relative w-full border-b border-slate-200/60 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BriefingDeck
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-600 hidden sm:inline">
              AI-Powered Analysis
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex-1">
        <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-slate-700">
                Powered by AI
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 bg-clip-text text-transparent">
                Turn tickers into
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                investor decks
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              AI-powered briefing decks from the latest public filings.
              Professional, fast, and ready for IC meetings.
            </p>
          </div>

          {/* Main Card */}
          <div className="relative">
            {/* Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl -z-10"></div>

            <div className="rounded-3xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl shadow-slate-200/50 px-8 py-10 md:px-12 md:py-12">
              {/* Paid message after returning from Creem */}
              {paidMessage && (
                <div className="mb-6 rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-emerald-800 font-medium">
                    {paidMessage}
                  </span>
                </div>
              )}

              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="ticker"
                    className="mb-3 block text-sm font-semibold text-slate-700"
                  >
                    Stock Ticker
                  </label>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1 relative group">
                      <input
                        id="ticker"
                        type="text"
                        placeholder="e.g. AAPL, TSLA, NVDA"
                        className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 group-hover:border-slate-300"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleGenerate(e);
                          }
                        }}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-base font-semibold text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Processing
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Generate for $4.99
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Error / Status Messages */}
                {(error || status) && (
                  <div className="space-y-2">
                    {error && (
                      <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                        {error}
                      </div>
                    )}
                    {status && (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 font-medium">
                        {status}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Features Grid */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    icon: '📊',
                    title: 'Latest Filings',
                    desc: 'Real earnings & investor data',
                  },
                  {
                    icon: '✨',
                    title: 'Pro Design',
                    desc: 'Clean, meeting-ready layouts',
                  },
                  {
                    icon: '⚡',
                    title: '~60 Seconds',
                    desc: 'Lightning-fast generation',
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/60 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="text-3xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* ✅ Sample Deck Link */}
              <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Want to see what the output looks like?
                </p>
                <a
                  href="/samples/AMD-Q1-2024-Investor-Briefing.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  View sample deck
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Powered by DeepSeek & Gamma API. BriefingDeck does not provide
                  investment advice; all content is for informational purposes
                  only. Always conduct your own research.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-slate-200/60 bg-white/60 backdrop-blur-xl mt-20">
        <div className="mx-auto flex max-w-6xl flex-col md:flex-row items-center justify-between px-6 py-6 text-sm text-slate-600 gap-4">
          <span>
            © {new Date().getFullYear()} BriefingDeck.com — All rights
            reserved
          </span>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  );
}