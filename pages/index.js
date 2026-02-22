import Head from 'next/head';
import { useEffect, useState, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
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
  Shield,
  Lock,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  History,
  Settings,
  X,
  Mail,
} from 'lucide-react';

// ===== User Menu Component =====
function UserMenu({ session, onSignOut }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-sand-200 hover:border-terracotta-300 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {session.user?.image ? (
          <img 
            src={session.user.image} 
            alt={session.user.name || 'User'}
            className="w-7 h-7 rounded-full border border-sand-200"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
            <User className="w-4 h-4 text-sage-700" />
          </div>
        )}
        <span className="text-sm font-medium text-charcoal-700 hidden sm:block max-w-[120px] truncate">
          {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
        </span>
        <ChevronDown className={`w-4 h-4 text-charcoal-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-sand-200 shadow-xl shadow-charcoal-800/10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-sand-100">
            <p className="text-sm font-semibold text-charcoal-800 truncate">{session.user?.name}</p>
            <p className="text-xs text-charcoal-500 truncate">{session.user?.email}</p>
          </div>
          
          <a 
            href="/dashboard" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-sage-500" />
            My Reports
          </a>
          
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-charcoal-700 hover:bg-sand-50 transition-colors"
          >
            <Settings className="w-4 h-4 text-charcoal-400" />
            Settings
          </a>
          
          <div className="border-t border-sand-100 mt-2 pt-2">
            <button 
              onClick={() => { setIsOpen(false); onSignOut(); }}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Login Prompt Modal Component =====
function LoginPromptModal({ isOpen, onClose, onSignIn }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-800/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-sand-100 transition-colors"
        >
          <X className="w-5 h-5 text-charcoal-400" />
        </button>
        
        <div className="text-center">
          <h3 className="text-xl font-bold text-charcoal-900 mb-2">
            Save your reports
          </h3>
          
          <p className="text-charcoal-500 text-sm mb-6">
            Sign in to access your report history anytime
          </p>
          
          {/* Sign Up 按钮 */}
          <button
            onClick={() => { onClose(); onSignIn(); }}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-charcoal-900 text-white font-semibold hover:bg-charcoal-800 transition-all duration-200 shadow-soft"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>
          
          {/* 分割线 */}
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-sand-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-charcoal-400">Already have an account?</span>
            </div>
          </div>
          
          {/* Sign In 按钮 */}
          <button
            onClick={() => { onClose(); onSignIn(); }}
            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border-2 border-sand-200 text-charcoal-700 font-semibold hover:border-charcoal-400 hover:bg-charcoal-50/30 transition-all duration-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in
          </button>
          
          <p className="mt-4 text-xs text-charcoal-400">
            2 free reports · No credit card required
          </p>
        </div>
      </div>
    </div>
  );
}

// SEO and Meta Configuration
const SITE_CONFIG = {
  title: 'BriefingDeck - AI-Powered Stock Briefing Decks',
  description: 'Transform any stock ticker into a polished, investment-ready briefing deck in seconds. Get latest financials, key metrics, and professional analysis powered by AI — 2 free reports, then pay per use.',
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
  // ========= NextAuth Session =========
  const { data: session, status: authStatus } = useSession();
  
  // ========= 状态管理 =========
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [deckUrl, setDeckUrl] = useState(null);
  const [generatingDots, setGeneratingDots] = useState('');
  const [orderId, setOrderId] = useState(null);
  
  // 邮箱发送状态
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(null);
  
  // 登录引导弹窗
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  
  // 用户使用次数追踪（免费2次）
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const FREE_LIMIT = 2;
  const PRICE_PER_REPORT = 4.99;
  
  // 加载用户使用次数
  useEffect(() => {
    if (authStatus === 'authenticated' && session?.user?.email) {
      const savedCount = localStorage.getItem(`briefingdeck_usage_${session.user.email}`);
      if (savedCount) {
        setUsageCount(parseInt(savedCount, 10));
      }
    }
  }, [authStatus, session]);
  
  // 保存使用次数
  const incrementUsage = () => {
    if (authStatus === 'authenticated' && session?.user?.email) {
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(`briefingdeck_usage_${session.user.email}`, newCount.toString());
      return newCount;
    }
    return usageCount;
  };

  // ========= 登录后自动滚动到生成器 =========
  useEffect(() => {
    if (authStatus === 'authenticated') {
      // 延迟一点时间让页面渲染完成
      const timer = setTimeout(() => {
        const generator = document.getElementById('generator');
        if (generator) {
          generator.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authStatus]);

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
      
      setSuccessMessage(`✅ Payment confirmed for ${upper}. Your deck is being generated...`);
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
        
        // 增加使用次数
        incrementUsage();
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

  // 进度条状态
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  
  // Deck 预览轮播
  const [previewIndex, setPreviewIndex] = useState(0);
  const previewSlides = [
    { 
      title: 'Cover Page', 
      desc: 'Professional title slide with company branding',
      image: '/samples/previews/slide-1.png'
    },
    { 
      title: 'Financial Overview', 
      desc: 'Key metrics and YoY performance',
      image: '/samples/previews/slide-2.png'
    },
    { 
      title: 'Business Highlights', 
      desc: 'Recent developments and strategic initiatives',
      image: '/samples/previews/slide-3.png'
    },
  ];
  
  // 自动轮播
  useEffect(() => {
    if (!generating) return;
    const timer = setInterval(() => {
      setGeneratingDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(timer);
  }, [generating]);

  // ========= 生成按钮点击 =========
  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(null);
    setStatus(null);
    setSuccessMessage(null);
    setDeckUrl(null);

    if (!ticker.trim()) {
      setError('Please enter a stock ticker, e.g. AMD');
      return;
    }

    const upper = ticker.trim().toUpperCase();
    
    // 测试模式：跳过支付直接生成
    if (isTestMode) {
      console.log('[TEST MODE] Skipping payment, generating deck directly...');
      autoGenerateAfterPayment(upper, `test_${upper}_${Date.now()}`);
      return;
    }

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
        
        {/* Fonts - Inter (Claude's font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="min-h-screen bg-cream-50 text-charcoal-800 antialiased font-sans">
        {/* Canva-inspired gradient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Top right gradient blob */}
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-terracotta-200/30 via-terracotta-100/20 to-transparent rounded-full blur-3xl" />
          {/* Bottom left gradient blob */}
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-sage-200/25 via-cream-200/20 to-transparent rounded-full blur-3xl" />
          {/* Center subtle glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-terracotta-100/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Debug Panel - 开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 z-50 bg-white/90 backdrop-blur border border-sand-200 rounded-lg shadow-lg p-3 text-xs font-mono max-w-xs">
            <div className="font-semibold text-charcoal-700 mb-1">Auth Debug:</div>
            <div>Status: <span className={authStatus === 'authenticated' ? 'text-green-600' : 'text-amber-600'}>{authStatus}</span></div>
            <div>User: {session?.user?.email || 'none'}</div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-2 py-1 bg-sand-100 hover:bg-sand-200 rounded text-xs"
            >
              Refresh
            </button>
          </div>
        )}

        {/* Header - Clean minimal style */}
        <header className="relative w-full border-b border-sand-200/60 bg-cream-50/70 backdrop-blur-xl z-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="flex items-center group">
              <img src="/Logo.png" alt="BriefingDeck" className="h-10 w-auto" />
            </a>
            <div className="flex items-center gap-3">
              <nav className="hidden sm:flex items-center gap-1">
                {['Features', 'Pricing', 'Support'].map((item) => (
                  <a 
                    key={item}
                    href={item === 'Features' ? '#features' : item === 'Pricing' ? '#pricing' : 'mailto:tianyu.jiang@icloud.com'}
                    className="px-3 py-2 text-sm font-medium text-charcoal-600 hover:text-charcoal-900 rounded-lg hover:bg-sand-100/50 transition-all duration-200"
                  >
                    {item}
                  </a>
                ))}
              </nav>
              
              {/* Auth Button / User Menu */}
              <div className="ml-2 pl-2 border-l border-sand-200 flex items-center gap-2">
                {authStatus === 'authenticated' ? (
                  <UserMenu session={session} onSignOut={() => signOut()} />
                ) : authStatus === 'loading' ? (
                  <div className="w-8 h-8 rounded-full border-2 border-sand-200 border-t-charcoal-400 animate-spin" />
                ) : (
                  <>
                    {/* Log in 按钮 */}
                    <button
                      onClick={async () => {
                        try {
                          const result = await signIn('google', { 
                            callbackUrl: '/',
                            redirect: true 
                          });
                          console.log('Sign in result:', result);
                        } catch (error) {
                          console.error('Sign in error:', error);
                          alert('Login failed: ' + error.message);
                        }
                      }}
                      className="px-4 py-2 text-sm font-medium text-charcoal-700 hover:text-charcoal-900 rounded-lg hover:bg-sand-100/50 transition-all duration-200"
                    >
                      Log in
                    </button>
                    {/* Sign up 按钮 */}
                    <button
                      onClick={async () => {
                        try {
                          const result = await signIn('google', { 
                            callbackUrl: '/',
                            redirect: true 
                          });
                          console.log('Sign up result:', result);
                        } catch (error) {
                          console.error('Sign up error:', error);
                          alert('Sign up failed: ' + error.message);
                        }
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-charcoal-900 text-white text-sm font-semibold hover:bg-charcoal-800 transition-all duration-200 shadow-soft hover:shadow-card hover:-translate-y-0.5"
                    >
                      Sign up
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative flex-1">
          <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24 md:pb-16">
            {/* Hero Section - Canva-inspired bold layout */}
            <div className="text-center max-w-3xl mx-auto">
              {/* Eyebrow text */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-semibold uppercase tracking-wider mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-terracotta-600"></span>
                </span>
                Now in Beta
              </div>
              
              {/* Main headline - Bold, confident */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-charcoal-900 leading-[1.05]">
                Wall Street decks,
                <br />
                <span className="bg-gradient-to-r from-terracotta-500 via-terracotta-400 to-terracotta-500 bg-clip-text text-transparent">
                  zero effort
                </span>
              </h1>

              {/* Subheadline - Clear value prop */}
              <p className="text-lg md:text-xl text-charcoal-600 max-w-2xl mx-auto leading-relaxed mb-8">
                Transform any ticker into a professional briefing deck. 
                Powered by AI, sourced from SEC filings.
              </p>
              
              {/* CTA Area */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <button
                  onClick={() => authStatus === 'authenticated' ? document.getElementById('generator')?.scrollIntoView({behavior: 'smooth'}) : signIn('google')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white text-base font-semibold hover:from-terracotta-600 hover:to-terracotta-700 transition-all duration-300 shadow-elevated hover:shadow-lg hover:-translate-y-0.5"
                >
                  <Sparkles className="w-5 h-5" />
                  {authStatus === 'authenticated' ? 'Generate your deck' : 'Start for free'}
                </button>
                <a 
                  href="#features"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-xl text-charcoal-600 font-medium hover:text-charcoal-900 hover:bg-sand-100/50 transition-all duration-200"
                >
                  See how it works
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              {/* Trust indicator */}
              <p className="text-sm text-charcoal-400">
                2 free reports • No credit card required
              </p>
            </div>

            {/* Sample Preview - Carousel showcase */}
            <div className="mt-16 relative">
              <div className="text-center mb-6">
                <span className="text-sm font-medium text-terracotta-600 uppercase tracking-wider">Preview</span>
                <h2 className="text-xl font-semibold text-charcoal-900 mt-2">See what you&apos;ll get</h2>
              </div>
              
              {/* Carousel Container */}
              <div className="relative max-w-4xl mx-auto">
                {/* Main Preview Window */}
                <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-sand-200 bg-charcoal-900">
                  {/* Carousel Track */}
                  <div 
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${previewIndex * 100}%)` }}
                  >
                    {[
                      { src: '/samples/previews/slide-1.png', title: 'Cover Page', desc: 'Professional title slide with company branding' },
                      { src: '/samples/previews/slide-2.png', title: 'Financial Overview', desc: 'Key metrics and YoY performance' },
                      { src: '/samples/previews/slide-3.png', title: 'Business Highlights', desc: 'Recent developments and strategic initiatives' },
                    ].map((slide, i) => (
                      <div key={i} className="w-full flex-shrink-0">
                        <div className="aspect-[16/10] bg-charcoal-800 relative">
                          <img 
                            src={slide.src}
                            alt={slide.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setPreviewIndex((prev) => prev === 0 ? 2 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-charcoal-700" />
                  </button>
                  <button
                    onClick={() => setPreviewIndex((prev) => (prev + 1) % 3)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-all"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-charcoal-700" />
                  </button>
                  
                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <button
                        key={i}
                        onClick={() => setPreviewIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === previewIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Slide Info */}
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-charcoal-900">
                    {['Cover Page', 'Financial Overview', 'Business Highlights'][previewIndex]}
                  </h3>
                  <p className="text-sm text-charcoal-500 mt-1">
                    {['Professional title slide with company branding', 'Key metrics and YoY performance', 'Recent developments and strategic initiatives'][previewIndex]}
                  </p>
                </div>
                
                {/* View Full PDF Button */}
                <div className="mt-6 text-center">
                  <a
                    href="/samples/Tesla-Q3-2025-Earnings-Report.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-charcoal-900 text-white font-semibold hover:bg-charcoal-800 transition-all shadow-soft"
                  >
                    <FileText className="w-5 h-5" />
                    View full sample PDF
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Main Card - Generator Section */}
            <div id="generator" className="relative mt-16">
              <div className="rounded-2xl border border-sand-200 bg-white shadow-card overflow-hidden">
                {/* Card Header */}
                <div className="px-8 py-6 border-b border-sand-100 bg-gradient-to-r from-sand-50/50 to-cream-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-charcoal-900">Generate your deck</h2>
                      <p className="text-sm text-charcoal-500 mt-1">Enter a stock ticker to get started</p>
                    </div>
                    {authStatus === 'authenticated' && usageCount < FREE_LIMIT && (
                      <div className="px-4 py-2 rounded-full bg-sage-100/80 text-sage-800 text-sm font-medium">
                        {FREE_LIMIT - usageCount} free reports left
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="px-8 py-10">
                  {/* 登录墙 - Canva风格 */}
                  {authStatus !== 'authenticated' ? (
                    <div className="max-w-sm mx-auto">
                      {/* 标题区域 */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-charcoal-900 mb-3">
                          Log in or sign up in seconds
                        </h3>
                        <p className="text-charcoal-500 text-sm leading-relaxed">
                          Get 2 free reports when you sign in.
                          <br />
                          No credit card required.
                        </p>
                      </div>

                      {/* Sign Up / Sign In 按钮组 */}
                      <div className="space-y-3">
                        {/* Sign up with Google - 主要按钮 */}
                        <button
                          onClick={() => signIn('google')}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl bg-charcoal-900 text-white font-semibold hover:bg-charcoal-800 transition-all duration-200 shadow-soft"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Sign up with Google</span>
                        </button>
                        
                        {/* 分割线 */}
                        <div className="relative py-2">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-sand-200"></div>
                          </div>
                          <div className="relative flex justify-center">
                            <span className="px-3 bg-white text-xs text-charcoal-400">Already have an account?</span>
                          </div>
                        </div>
                        
                        {/* Sign in - 次要按钮 */}
                        <button
                          onClick={() => signIn('google')}
                          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white border-2 border-sand-200 text-charcoal-700 font-semibold hover:border-charcoal-400 hover:bg-charcoal-50/30 transition-all duration-200"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                          <span>Sign in</span>
                        </button>
                      </div>
                      
                      {/* 条款提示 */}
                      <p className="text-center text-xs text-charcoal-400 mt-4">
                        By continuing, you agree to our{' '}
                        <a href="/terms" className="text-terracotta-600 hover:underline">Terms</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-terracotta-600 hover:underline">Privacy Policy</a>
                      </p>
                    </div>
                ) : usageCount >= FREE_LIMIT ? (
                  /* 付费墙 - 超过免费次数 */
                  <div className="text-center py-10">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-terracotta-100 to-terracotta-50 flex items-center justify-center shadow-soft">
                      <Sparkles className="w-7 h-7 text-terracotta-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-charcoal-900 mb-2">
                      You&apos;ve used your 2 free reports
                    </h3>
                    <p className="text-charcoal-500 mb-6 text-sm max-w-sm mx-auto">
                      Pay per report to continue generating professional decks
                    </p>
                    
                    <div className="bg-sand-50 rounded-xl p-5 mb-5 max-w-xs mx-auto border border-sand-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-charcoal-600 text-sm">1 Report</span>
                        <span className="text-xl font-bold text-charcoal-900">${PRICE_PER_REPORT}</span>
                      </div>
                      <ul className="text-xs text-charcoal-500 space-y-1.5 text-left">
                        {['Professional PDF deck', 'AI-generated analysis', 'Delivered in ~2 min'].map((item) => (
                          <li key={item} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sage-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => alert('Payment integration coming soon!')}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 text-white font-semibold hover:from-terracotta-600 hover:to-terracotta-700 transition-all duration-200 shadow-soft hover:shadow-card"
                    >
                      <Zap className="w-4 h-4" />
                      Pay ${PRICE_PER_REPORT} & Generate
                    </button>
                  </div>
                ) : (
                  /* 正常生成器 - 已登录且未超次数 */
                  <>
                    {/* 免费次数提示条 */}
                    <div className="mb-5 p-4 bg-sage-50/70 rounded-xl border border-sage-100">
                      <p className="text-sm text-charcoal-600">
                        Free reports remaining: <span className="font-semibold text-sage-700">{FREE_LIMIT - usageCount} of {FREE_LIMIT}</span>
                      </p>
                    </div>

                    {/* 支付成功提示 */}
                    {successMessage && (
                      <div className="mb-5 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-sage-600 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-charcoal-800">{successMessage}</p>
                            <p className="text-xs text-charcoal-500 mt-0.5">Generation takes ~2 minutes</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 输入区 - 简洁设计 */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                          <input
                            id="ticker"
                            type="text"
                            placeholder="Enter ticker (e.g. AAPL)"
                            className="w-full rounded-xl border border-sand-200 bg-white px-5 py-4 text-base text-charcoal-900 placeholder-charcoal-400 focus:outline-none focus:border-charcoal-400 focus:ring-2 focus:ring-charcoal-100 transition-all duration-200"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleGenerate(e);
                              }
                            }}
                            disabled={successMessage || generating}
                            aria-label="Enter stock ticker symbol"
                          />
                        </div>
                        
                        <button
                          onClick={handleGenerate}
                          disabled={loading || generating || successMessage}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-charcoal-900 px-8 py-4 text-base font-semibold text-white hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-soft whitespace-nowrap"
                        >
                          {loading || generating ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              <span>Generate Free</span>
                            </>
                          )}
                        </button>
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
                  </>
                )}

                {/* Features - Canva-style clean cards */}
                <div id="features" className="mt-16">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-charcoal-900 mb-2">Everything you need</h2>
                    <p className="text-charcoal-500">Professional research, simplified</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { 
                        icon: FileText, 
                        title: 'SEC Filings', 
                        desc: 'Real-time data from official sources' 
                      },
                      { 
                        icon: Presentation, 
                        title: 'Pro Decks', 
                        desc: 'Investor-ready presentations' 
                      },
                      { 
                        icon: Timer, 
                        title: '~2 Minutes', 
                        desc: 'From ticker to PDF instantly' 
                      },
                    ].map((feature, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white border border-sand-200 p-6 hover:border-terracotta-200 hover:shadow-card transition-all duration-300 group"
                      >
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-terracotta-50 to-sand-50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                          <feature.icon className="w-5 h-5 text-terracotta-600" />
                        </div>
                        <h3 className="font-semibold text-charcoal-900 mb-1">{feature.title}</h3>
                        <p className="text-sm text-charcoal-500">{feature.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sample Deck Preview */}
                <div id="how-it-works" className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-sand-50 to-cream-50 border border-sand-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-charcoal-900 mb-1">See an example</h3>
                      <p className="text-sm text-charcoal-500">Tesla Q3 2025 earnings deck</p>
                    </div>
                    <a
                      href="/samples/Tesla-Q3-2025-Earnings-Report.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-sand-200 text-sm font-medium text-charcoal-700 hover:border-terracotta-300 hover:text-terracotta-600 transition-all shadow-soft"
                    >
                      View sample
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-10 pt-6 border-t border-sand-200">
                  <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-charcoal-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-4 h-4" />
                      ~2 min delivery
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      SEC sourced
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Pay per use
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* 登录引导弹窗 */}
        <LoginPromptModal 
          isOpen={showLoginPrompt} 
          onClose={() => setShowLoginPrompt(false)}
          onSignIn={() => signIn('google')}
        />

        {/* Footer - Clean minimal design */}
        <footer className="relative border-t border-sand-200 bg-cream-50 mt-16">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Logo & Copyright */}
              <div className="flex items-center gap-2.5">
                <img src="/Logo.png" alt="BriefingDeck" className="h-8 w-auto" />
                <span className="text-sm text-charcoal-400">© {new Date().getFullYear()}</span>
              </div>

              {/* Navigation */}
              <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <a
                  href="mailto:tianyu.jiang@icloud.com"
                  className="text-charcoal-500 hover:text-charcoal-900 transition-colors"
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
