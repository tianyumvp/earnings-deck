// pages/index.js

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased">
      {/* Simple header / logo */}
      <header className="w-full px-6 md:px-10 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            AI
          </div>
          <span className="text-sm font-medium text-slate-800 tracking-tight">
            Earnings Decks
          </span>
        </div>
      </header>

      {/* Hero section */}
      <main className="flex items-center">
        <section className="w-full max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-16">
          <div className="max-w-2xl">
            {/* Headline */}
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
              Turn a Ticker into a Deck in{" "}
              <span className="text-indigo-500">60 Seconds.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
              Type any NYSE / NASDAQ ticker and get a fresh, investor-ready
              update deck built from the latest public filings—delivered
              straight to your inbox.
            </p>

            {/* Input + button */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
              <div className="flex-1">
                <label htmlFor="ticker" className="sr-only">
                  Ticker
                </label>
                <div className="relative">
                  <input
                    id="ticker"
                    type="text"
                    placeholder="e.g. AMD"
                    className="w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-base text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent placeholder:text-slate-400 transition"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 hidden md:flex items-center text-xs text-slate-400">
                    NYSE / NASDAQ
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-indigo-500 px-6 py-3 text-sm md:text-base font-medium text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-600 active:bg-indigo-700 transition-colors"
              >
                Generate for $0.99
              </button>
            </div>

            {/* Key features */}
            <div className="mt-6 text-sm text-slate-600">
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Latest publicly filed figures included.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Professional, banker-grade update deck.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>PDF delivered in under 60 seconds.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
