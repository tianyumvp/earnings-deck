// pages/terms.js

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">
          Terms of Service
        </h1>

        <p className="text-sm text-neutral-700 mb-4">
          BriefingDeck.com is provided “as is”, without any guarantee of
          accuracy or fitness for a particular purpose. Generated decks are
          for informational use only and do not constitute financial advice.
        </p>

        <p className="text-sm text-neutral-700 mb-4">
          You are responsible for reviewing and verifying any AI-generated
          content before sharing it with clients, investors, or other third
          parties.
        </p>

        <p className="text-sm text-neutral-700 mb-4">
          AI features are powered by third-party APIs, including DeepSeek and
          Gamma API. By using this site you agree that your inputs may be sent
          to those providers for processing.
        </p>

        <p className="text-sm text-neutral-700">
          These terms may be updated from time to time. Continued use of the
          service means you accept the latest version.
        </p>

        <p className="text-[11px] text-neutral-500 mt-8">
          AI generation powered by DeepSeek &amp; Gamma API.
        </p>
      </div>
    </main>
  );
}