import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Presentation,
  Timer,
} from 'lucide-react';

// SEO and Meta Configuration
const SITE_CONFIG = {
  title: 'BriefingDeck - AI-Powered Stock Briefing Decks',
  description: 'Transform any stock ticker into a polished, investment-ready briefing deck in minutes. Get latest financials, key metrics, and professional analysis powered by AI.',
  keywords: 'stock analysis, investment research, AI reports, financial analysis, stock briefing, investment deck, equity research, stock reports',
  url: 'https://briefingdeck.com',
  image: 'https://briefingdeck.com/og-image.png',
  twitterHandle: '@briefingdeck',
};

// JSON-LD Structured Data
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'BriefingDeck',
  applicationCategory: 'FinanceApplication',
  description: SITE_CONFIG.description,
  url: SITE_CONFIG.url,
  offers: {
    '@type': 'Offer',
    price: '4.99',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
  },
  creator: {
    '@type': 'Organization',
    name: 'BriefingDeck',
    url: SITE_CONFIG.url,
  },
};

export default function Home() {
  // ========= 状态管理 =========
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [paidMessage, setPaidMessage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [deckUrl, setDeckUrl] = useState(null);
  const [generatingDots, setGeneratingDots] = useState('');
  const [orderId, setOrderId] = useState(null);

  // ========= 动态生成提示动画 =========
  useEffect(() => {
    if (!generating) {
      setGeneratingDots('');
      return;
    }

    const frames = ['.', '..', '...'];
    let idx = 0;
    setGeneratingDots(frames[idx]);
    
    const timer = setInterval(() => {
      setGeneratingDots(frames[idx]);
      idx = (idx + 1) % frames.length;
    }, 500);

    return () => clearInterval(timer);
  }, [generating]);

  // ========= 支付成功后自动轮询 =========
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    const paid = url.searchParams.get('paid');
    const t = url.searchParams.get('ticker');
    const orderId = url.searchParams.get('orderId');

    if (paid === '1' && t) {
      const upper = t.trim().toUpperCase();
      setTicker(upper);
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setPaidMessage(`✅ Payment confirmed for ${upper}. Your deck is being generated...`);
      autoGenerateAfterPayment(upper, orderId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ========= 生成函数（支付后调用） =========
  const autoGenerateAfterPayment = async (paidTicker, incomingOrderId) => {
    setError(null);
    setStatus(null);
    setDeckUrl(null);
    setGenerating(true);
    const currentOrderId =
      incomingOrderId || orderId || `deck_${paidTicker}_${Date.now()}`;
    setOrderId(currentOrderId);

    try {
      const res = await fetch('/api/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ticker: paidTicker, 
          orderId: currentOrderId,
        }),
      });

      const data = await res.json().catch(() => ({}));
      console.log('[frontend] /api/generate-deck response:', data);

      if (res.ok && data.ok && data.deckUrl) {
        setStatus(`Your briefing deck for ${paidTicker} is ready.`);
        setDeckUrl(data.deckUrl);
      } else {
        setError(data.error || 'Deck generation failed. Please contact support@briefingdeck.com');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError('Network error while generating the deck. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // ========= 支付按钮点击 =========
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setPaidMessage(null);
    setDeckUrl(null);

    if (!ticker.trim()) {
      setError('Please enter a stock ticker, e.g. AMD');
      return;
    }

    const upper = ticker.trim().toUpperCase();
    setLoading(true);

    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: upper }),
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
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{SITE_CONFIG.title}</title>
        <meta name="title" content={SITE_CONFIG.title} />
        <meta name="description" content={SITE_CONFIG.description} />
        <meta name="keywords" content={SITE_CONFIG.keywords} />
        <meta name="author" content="BriefingDeck" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={SITE_CONFIG.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_CONFIG.url} />
        <meta property="og:title" content={SITE_CONFIG.title} />
        <meta property="og:description" content={SITE_CONFIG.description} />
        <meta property="og:image" content={SITE_CONFIG.image} />
        <meta property="og:site_name" content="BriefingDeck" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={SITE_CONFIG.url} />
        <meta property="twitter:title" content={SITE_CONFIG.title} />
        <meta property="twitter:description" content={SITE_CONFIG.description} />
        <meta property="twitter:image" content={SITE_CONFIG.image} />
        <meta name="twitter:creator" content={SITE_CONFIG.twitterHandle} />
        
        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <main className="min-h-screen bg-cream-100 text-charcoal-700 antialiased">
        {/* Decorative gradient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-terracotta-400/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-20 w-80 h-80 bg-sage-300/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-sand-300/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative w-full border-b border-sand-200 bg-cream-50/80 backdrop-blur-md z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-charcoal-800 text-cream-50 flex items-center justify-center font-semibold shadow-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-lg font-semibold text-charcoal-800 tracking-tight">
                BriefingDeck
              </span>
            </div>
            <nav className="flex items-center gap-6 text-sm font-medium">
              <a 
                href="#features" 
                className="text-charcoal-500 hover:text-terracotta-600 transition-colors"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="text-charcoal-500 hover:text-terracotta-600 transition-colors"
              >
                How it works
              </a>
              <a 
                href="mailto:tianyu.jiang@icloud.com"
                className="text-charcoal-500 hover:text-terracotta-600 transition-colors"
              >
                Support
              </a>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative flex-1">
          <section className="mx-auto max-w-5xl px-6 py-16 md:py-24">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 text-charcoal-800 leading-[1.1]">
                Turn stock tickers into
                <br />
                <span className="text-charcoal-600">professional decks</span>
              </h1>

              <p className="text-lg md:text-xl text-charcoal-500 max-w-2xl mx-auto leading-relaxed font-normal">
                Polished company profile decks with current financials and developments 
                sourced from the latest SEC filings. Research made simple.
              </p>

              {/* Beta Badge */}
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-terracotta-200 bg-terracotta-400/10 text-terracotta-700 text-xs font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta-500"></span>
                </span>
                <span className="uppercase tracking-wide">Beta</span>
                <span className="text-charcoal-400">— Currently in testing</span>
              </div>
            </div>

            {/* Main Card */}
            <div className="relative">
              <div className="rounded-3xl border border-sand-200 bg-white/70 backdrop-blur-sm shadow-[0_2px_20px_rgba(0,0,0,0.04)] px-8 py-10 md:px-12 md:py-12">
                {/* 支付成功提示 */}
                {paidMessage && (
                  <div className="mb-6 rounded-2xl border border-sage-200 bg-sage-100 px-5 py-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-charcoal-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-charcoal-700 font-medium">
                          {paidMessage}
                        </p>
                        <div className="mt-2 text-xs text-charcoal-500 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          Generation typically takes ~1 minute
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 输入区 */}
                <div className="space-y-6">
                  <div>
                    <label 
                      htmlFor="ticker" 
                      className="mb-3 block text-sm font-semibold text-charcoal-700"
                    >
                      Stock Ticker
                    </label>
                    <div className="flex flex-col gap-4 md:flex-row">
                      <div className="flex-1 relative group">
                        <input
                          id="ticker"
                          type="text"
                          placeholder="e.g. AAPL, TSLA, NVDA"
                          className="w-full rounded-2xl border-2 border-sand-200 bg-white px-5 py-4 text-base text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:border-terracotta-400 focus:ring-4 focus:ring-terracotta-400/10 transition-all duration-200 group-hover:border-sand-300"
                          value={ticker}
                          onChange={(e) => setTicker(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleGenerate(e);
                            }
                          }}
                          disabled={paidMessage || generating}
                          aria-label="Enter stock ticker symbol"
                        />
                      </div>
                      
                      <button
                        onClick={handleGenerate}
                        disabled={loading || generating || paidMessage}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-charcoal-800 px-8 py-4 text-base font-semibold text-cream-50 hover:bg-charcoal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
                      >
                        {loading || generating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-cream-50/30 border-t-cream-50 rounded-full animate-spin"></div>
                            {loading ? 'Processing' : 'Generating'}
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

                  {/* 错误 / 状态 / deck 链接 */}
                  {(error || status || deckUrl) && (
                    <div className="space-y-3">
                      {error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                          {error}
                        </div>
                      )}
                      
                      {status && (
                        <div className="rounded-xl bg-sage-100 border border-sage-200 px-4 py-3">
                          <p className="text-sm text-charcoal-700 font-medium flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {status}
                          </p>
                          {generating && (
                            <p className="text-xs text-charcoal-500 mt-1" aria-live="polite">
                              We&apos;ll drop your PDF link here shortly{generatingDots}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {deckUrl && (
                        <div className="rounded-xl bg-charcoal-800 px-5 py-4">
                          <p className="text-sm text-cream-50 font-medium mb-3">
                            🎉 Your deck is ready!
                          </p>
                          <a
                            href={deckUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-cream-50 px-4 py-2.5 text-sm font-semibold text-charcoal-800 hover:bg-white transition shadow-sm"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Open PDF Deck
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div id="features" className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { 
                      icon: FileText, 
                      title: 'Latest Filings', 
                      desc: 'Data from the most recent SEC filings and financial reports' 
                    },
                    { 
                      icon: Presentation, 
                      title: 'Pro Design', 
                      desc: 'Clean, investor-ready layouts that impress stakeholders' 
                    },
                    { 
                      icon: Timer, 
                      title: '~1 Minute', 
                      desc: 'Lightning-fast generation powered by advanced AI' 
                    },
                  ].map((feature, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-cream-50 border border-sand-200/60 p-5 hover:border-terracotta-200 hover:shadow-sm transition-all duration-200 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-sand-100 flex items-center justify-center mb-3 group-hover:bg-terracotta-400/10 transition-colors">
                        <feature.icon className="w-5 h-5 text-charcoal-600 group-hover:text-terracotta-600 transition-colors" />
                      </div>
                      <h3 className="font-semibold text-charcoal-800 mb-1">{feature.title}</h3>
                      <p className="text-sm text-charcoal-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Sample Deck */}
                <div id="how-it-works" className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-sand-100/50 border border-sand-200">
                  <div>
                    <p className="text-sm font-medium text-charcoal-700">
                      Want to see what the output looks like?
                    </p>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Check out a sample Tesla Q3 2025 briefing deck
                    </p>
                  </div>
                  <a
                    href="/samples/Tesla-Q3-2025-Earnings-Report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-sand-300 bg-white px-5 py-2.5 text-sm font-medium text-charcoal-700 hover:border-terracotta-300 hover:text-terracotta-700 transition whitespace-nowrap"
                  >
                    View sample deck
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 pt-8 border-t border-sand-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 text-sm text-charcoal-600">
                      <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-sage-400" />
                      </div>
                      <span className="font-medium">Secure payment</span>
                    </div>
                    <div className="flex items-center justify-center gap-2.5 text-sm text-charcoal-600">
                      <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-4 h-4 text-sage-400" />
                      </div>
                      <span className="font-medium">Instant delivery</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-2.5 text-sm text-charcoal-600">
                      <div className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-sage-400" />
                      </div>
                      <span className="font-medium">Official SEC data</span>
                    </div>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-8 pt-6 border-t border-sand-200">
                  <p className="text-xs text-charcoal-400 leading-relaxed text-center max-w-3xl mx-auto">
                    BriefingDeck does not provide investment advice; all content is for informational 
                    purposes only. Always conduct your own research before making investment decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="relative border-t border-sand-200 bg-cream-50/80 backdrop-blur-xl mt-20">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Logo & Copyright */}
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-charcoal-800 text-cream-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-charcoal-800">BriefingDeck</span>
                  <span className="text-charcoal-400 mx-2">·</span>
                  <span className="text-charcoal-500">© {new Date().getFullYear()}</span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex flex-wrap items-center justify-center gap-8 text-sm">
                <a
                  href="mailto:tianyu.jiang@icloud.com"
                  className="text-charcoal-500 hover:text-terracotta-600 transition-colors"
                >
                  Support
                </a>
                <a href="/privacy" className="text-charcoal-500 hover:text-terracotta-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-charcoal-500 hover:text-terracotta-600 transition-colors">
                  Terms of Service
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
