// pages/privacy.js
export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      <header className="w-full border-b border-neutral-200 bg-neutral-100/80">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-black" />
            <span className="text-sm font-medium tracking-tight">
              BriefingDeck
            </span>
          </div>
          <span className="text-xs text-neutral-500">Privacy Policy</span>
        </div>
      </header>

      <section className="flex-1 mx-auto max-w-3xl px-6 py-10 md:py-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-neutral-600 mb-4">
          This Privacy Policy explains how BriefingDeck.com (&quot;we&quot;,
          &quot;us&quot;, or &quot;our&quot;) collects, uses and stores
          information when you use our website and services.
        </p>

        <div className="space-y-4 text-sm text-neutral-700">
          <div>
            <h2 className="font-medium mb-1">1. Information we collect</h2>
            <p>
              We may collect limited personal information such as your email
              address if you choose to contact us, and usage data such as
              pages visited, tickers entered and basic analytics to improve the
              product.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">2. How we use this information</h2>
            <p>
              We use this information only to operate, maintain and improve
              BriefingDeck, understand how the service is used and communicate
              with you when necessary (for example, product updates or support
              replies).
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">3. Third-party services</h2>
            <p>
              We may use third-party providers for payments, analytics and
              infrastructure. These providers only receive the minimum data
              required to perform their functions and are not permitted to use
              it for other purposes.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">4. Data retention</h2>
            <p>
              We retain data only for as long as it is reasonably necessary for
              the purposes described above or as required by law.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">5. Your rights</h2>
            <p>
              If you would like to access, update or delete information related
              to you, please contact us at{' '}
              <a
                href="mailto:support@briefingdeck.com"
                className="underline"
              >
                support@briefingdeck.com
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">6. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The latest
              version will always be available on this page with the
              &quot;Last updated&quot; date.
            </p>
          </div>
        </div>

        <p className="mt-6 text-xs text-neutral-500">
          Last updated: November 2025
        </p>
      </section>
    </main>
  );
}