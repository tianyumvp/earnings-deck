// pages/dashboard.js
// 用户中心 - 报告历史和账户管理

import Head from 'next/head';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  FileText, 
  Clock, 
  ArrowRight,
  LogOut,
  User,
  Download,
  Mail,
  ChevronLeft,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // 加载用户报告历史（从 localStorage 模拟，实际应该从数据库加载）
  useEffect(() => {
    if (status === 'authenticated') {
      // 这里应该从后端 API 加载用户报告
      // 暂时使用 localStorage 模拟
      const savedReports = JSON.parse(localStorage.getItem('briefingdeck_reports') || '[]');
      setReports(savedReports);
      setLoading(false);
    }
  }, [status]);

  // 未登录状态
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 flex items-center justify-center">
            <User className="w-8 h-8 text-terracotta-600" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-800 mb-3">
            Sign in to view your reports
          </h1>
          <p className="text-charcoal-500 mb-6">
            Access all your generated reports, track favorite stocks, and get notified about new earnings.
          </p>
          <button
            onClick={() => signIn('google')}
            className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-charcoal-800 text-white font-semibold hover:bg-charcoal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
          <a 
            href="/" 
            className="mt-4 inline-flex items-center gap-2 text-charcoal-500 hover:text-terracotta-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to home
          </a>
        </div>
      </div>
    );
  }

  // 加载中
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sand-200 border-t-terracotta-500 rounded-full animate-spin" />
          <p className="text-charcoal-500">Loading your reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Reports | BriefingDeck</title>
        <meta name="description" content="View all your generated stock reports" />
      </Head>

      <div className="min-h-screen bg-cream-100">
        {/* Header */}
        <header className="bg-white border-b border-sand-200">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-charcoal-800 to-charcoal-700 text-cream-50 flex items-center justify-center font-semibold shadow-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-charcoal-800">BriefingDeck</span>
            </a>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-charcoal-500 hidden sm:block">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="p-2 rounded-lg hover:bg-sand-100 text-charcoal-500 hover:text-red-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-charcoal-800 mb-2">
              Welcome back, {session.user?.name?.split(' ')[0] || 'there'}!
            </h1>
            <p className="text-charcoal-500">
              You have generated {reports.length} report{reports.length !== 1 ? 's' : ''} so far.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <a 
              href="/"
              className="group p-6 bg-white rounded-2xl border border-sand-200 hover:border-terracotta-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta-100 to-terracotta-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-terracotta-600" />
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-1">Generate New Report</h3>
              <p className="text-sm text-charcoal-500">Create a new earnings deck</p>
            </a>

            <div className="p-6 bg-white rounded-2xl border border-sand-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-1">Email Reports</h3>
              <p className="text-sm text-charcoal-500">Reports sent to your inbox</p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-sand-200">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-charcoal-800 mb-1">Saved Time</h3>
              <p className="text-sm text-charcoal-500">~{reports.length * 30} minutes saved</p>
            </div>
          </div>

          {/* Reports List */}
          <div className="bg-white rounded-3xl border border-sand-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-sand-200 bg-sand-50/50">
              <h2 className="font-semibold text-charcoal-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-charcoal-600" />
                Your Reports
              </h2>
            </div>

            {reports.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-sand-100 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-sand-400" />
                </div>
                <h3 className="text-lg font-medium text-charcoal-800 mb-2">No reports yet</h3>
                <p className="text-charcoal-500 mb-4">Generate your first earnings report to see it here.</p>
                <a 
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-charcoal-800 text-white font-medium hover:bg-charcoal-700 transition-colors"
                >
                  Generate Report
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <div className="divide-y divide-sand-100">
                {reports.map((report, index) => (
                  <div 
                    key={index}
                    className="px-6 py-4 flex items-center justify-between hover:bg-sand-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-sage-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-charcoal-800">{report.ticker} Report</h4>
                        <p className="text-sm text-charcoal-500">
                          {new Date(report.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={report.deckUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-sand-200 text-charcoal-500 hover:text-charcoal-800 transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
