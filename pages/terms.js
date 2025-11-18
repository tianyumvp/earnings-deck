export default function Terms() {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900 px-6 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>

        <p className="text-neutral-700 text-sm leading-relaxed">
          By using BriefingDeck.com (“the service”), you agree that the
          generated content is provided for informational purposes only and
          does not constitute financial advice. You are responsible for all
          interpretations and decisions based on the generated materials.
        </p>

        <p className="text-neutral-700 text-sm leading-relaxed">
          All content is generated automatically using AI model providers.
          Outputs may contain inaccuracies, and no warranty is provided for
          the completeness or accuracy of generated content.
        </p>

        <p className="text-neutral-700 text-sm leading-relaxed">
          You may not redistribute or resell the service without prior written
          permission. Payments are processed by our payment provider; refunds
          are handled on a case-by-case basis.
        </p>

        <p className="text-neutral-500 text-xs pt-4">
          AI features are powered by DeepSeek and Gamma API.
        </p>

        <p className="text-xs text-neutral-400 pt-8">
          © {new Date().getFullYear()} BriefingDeck.com
        </p>
      </div>
    </main>
  );
}