// pages/terms.js

export default function TermsOfService() {
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
        <h1 className="text-2xl font-semibold mb-4">Terms of Service</h1>
        <p className="text-sm text-neutral-600 mb-2">
          BriefingDeck.com provides automatically generated briefing decks based
          on publicly available company filings and related information.
        </p>
        <p className="text-sm text-neutral-600 mb-2">
          The service is intended for informational and internal discussion
          purposes only. It does not constitute investment advice, an offer, or
          a recommendation to buy or sell any security.
        </p>
        <p className="text-sm text-neutral-600 mb-2">
          Outputs may contain errors, omissions, or outdated information. You
          are solely responsible for verifying any data before relying on it for
          financial decisions.
        </p>
        <p className="text-sm text-neutral-600 mb-2">
          By using this service you agree that BriefingDeck.com and its
          developer are not liable for any losses or decisions made based on the
          generated content.
        </p>
        <p className="text-sm text-neutral-600 mt-4">
          This project may change or be discontinued at any time without notice.
        </p>
      </section>
    </main>
  );
}