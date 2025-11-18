export default function Privacy() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>

        <p className="text-neutral-700 text-sm leading-relaxed">
          BriefingDeck.com (“we”, “our”, or “the service”) collects only the
          minimal information required to operate our product. This primarily
          includes the stock ticker you submit and basic technical logs needed
          to maintain service reliability.
        </p>

        <p className="text-neutral-700 text-sm leading-relaxed">
          We do not sell personal data. We do not track users across other
          websites. Any payment information is processed securely by our payment
          provider and never touches our servers.
        </p>

        <p className="text-neutral-700 text-sm leading-relaxed">
          Deck generation uses third-party AI services. Your input (e.g.,
          ticker symbols and summary context) may be processed by these model
          providers for the purpose of generating your deck.
        </p>

        <p className="text-neutral-500 text-xs pt-4">
          This service uses AI APIs, including DeepSeek and Gamma API, to
          generate briefing materials.
        </p>

        <p className="text-xs text-neutral-400 pt-8">
          © {new Date().getFullYear()} BriefingDeck.com
        </p>
      </div>
    </main>
  );
}