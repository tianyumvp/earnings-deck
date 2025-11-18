// pages/terms.js

export default function TermsPage() {
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

      <section className="mx-auto max-w-3xl px-6 py-10 md:py-12 flex-1">
        <h1 className="text-2xl font-semibold mb-4">Terms of Service</h1>
        <p className="text-sm text-neutral-700 mb-4">
          By using BriefingDeck.com, you agree to the following terms:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-neutral-700">
          <li>
            BriefingDeck is provided &quot;as is&quot; without warranty of any kind.
          </li>
          <li>
            Decks are generated automatically using third-party AI and content APIs
            (including DeepSeek &amp; Gamma). They may contain inaccuracies or be incomplete.
          </li>
          <li>
            Nothing on this site constitutes investment, legal, or financial advice.
            You are solely responsible for any decisions made using the generated output.
          </li>
          <li>
            Payments and subscriptions are handled by Creem.io, and may be subject to
            their own terms and policies.
          </li>
        </ul>
        <p className="text-sm text-neutral-700 mt-4">
          If you do not agree with these terms, please do not use the service.
        </p>
      </section>
    </main>
  );
}