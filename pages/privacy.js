// pages/privacy.js

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      <header className="w-full border-b border-neutral-200 bg-neutral-100/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-black" />
            <a href="/" className="text-sm font-medium tracking-tight">
              BriefingDeck
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Privacy Policy</h1>
        <p className="text-sm text-neutral-600 mb-4">
          BriefingDeck.com is a personal side project that helps users generate
          briefing decks based on public company filings.
        </p>
        <p className="text-sm text-neutral-600 mb-2">
          We only collect the minimum information necessary to provide the
          service, such as your email address (for sending deck links or
          receipts) and the ticker symbols you request.
        </p>
        <p className="text-sm text-neutral-600 mb-2">
          Data may be processed by third-party providers such as Creem
          (payments), DeepSeek and Gamma (content generation). These providers
          handle your data under their own privacy policies.
        </p>
        <p className="text-sm text-neutral-600 mb-2">
          No personalized investment profiling is performed. We do not sell your
          data to third parties.
        </p>
        <p className="text-sm text-neutral-600 mt-4">
          If you have any questions, please contact us via the email address
          listed on the Creem onboarding form.
        </p>
      </section>
    </main>
  );
}