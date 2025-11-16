<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI Earnings Deck</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
        "SF Pro Display", "Inter", "Segoe UI", sans-serif;
    }
  </style>
</head>
<body class="min-h-screen bg-[#fafafa] text-slate-900 antialiased">
  <div class="min-h-screen flex flex-col">
    <!-- Top nav / logo placeholder -->
    <header class="w-full px-6 md:px-10 pt-6 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
          AI
        </div>
        <span class="text-sm font-medium text-slate-800 tracking-tight">
          Earnings Decks
        </span>
      </div>
      <!-- optional nav -->
      <!-- <nav class="hidden md:flex text-sm gap-6 text-slate-500">
        <a href="#" class="hover:text-slate-900 transition-colors">How it works</a>
        <a href="#" class="hover:text-slate-900 transition-colors">Pricing</a>
      </nav> -->
    </header>

    <!-- Hero -->
    <main class="flex-1 flex items-center">
      <section class="w-full max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <div class="max-w-2xl">
          <!-- Slogan -->
          <h1 class="text-3xl md:text-5xl font-semibold tracking-tight text-slate-900 leading-tight">
            Turn a Ticker into a Deck in
            <span class="text-indigo-500">60 Seconds.</span>
          </h1>

          <!-- Subheading -->
          <p class="mt-4 text-base md:text-lg text-slate-600 leading-relaxed">
            Type any NYSE / NASDAQ ticker and get a fresh, investor-ready update deck
            built from the latest public filings—delivered straight to your inbox.
          </p>

          <!-- Input + button -->
          <div class="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
            <div class="flex-1">
              <label for="ticker" class="sr-only">Ticker</label>
              <div class="relative">
                <input
                  id="ticker"
                  type="text"
                  placeholder="e.g. AMD"
                  class="w-full rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-base text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/70 focus:border-transparent placeholder:text-slate-400 transition"
                />
                <span class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 hidden md:inline">
                  NYSE / NASDAQ
                </span>
              </div>
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-indigo-500 px-6 py-3 text-sm md:text-base font-medium text-white shadow-md shadow-indigo-500/30 hover:bg-indigo-600 active:bg-indigo-700 transition-colors"
            >
              Generate for $0.99
            </button>
          </div>

          <!-- Key features -->
          <div class="mt-6 text-sm text-slate-600">
            <ul class="space-y-1.5">
              <li class="flex items-start gap-2">
                <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Latest publicly filed figures included.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Professional, banker-grade update deck.</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="mt-[3px] h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>PDF delivered in under 60 seconds.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</body>
</html>
