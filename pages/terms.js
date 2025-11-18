// pages/terms.js
export default function TermsPage() {
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
          <span className="text-xs text-neutral-500">Terms of Service</span>
        </div>
      </header>

      <section className="flex-1 mx-auto max-w-3xl px-6 py-10 md:py-12">
        <h1 className="text-2xl font-semibold tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-sm text-neutral-600 mb-4">
          These Terms of Service (&quot;Terms&quot;) govern your use of
          BriefingDeck.com (&quot;the Service&quot;). By accessing or using the
          Service, you agree to be bound by these Terms.
        </p>

        <div className="space-y-4 text-sm text-neutral-700">
          <div>
            <h2 className="font-medium mb-1">1. Use of the service</h2>
            <p>
              You may use BriefingDeck to generate briefing decks for your own
              personal or business use. You are responsible for ensuring that
              any use complies with applicable laws and regulations.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">2. No investment advice</h2>
            <p>
              BriefingDeck provides automatically generated slides based on
              public information. The content is for informational purposes only
              and does not constitute investment, legal or tax advice.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">3. Accounts and payments</h2>
            <p>
              Payments are processed by third-party providers such as Creem.
              By completing a purchase you also agree to their terms and
              policies. All fees are non-refundable unless required by law.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">4. Intellectual property</h2>
            <p>
              The BriefingDeck brand, website design and underlying software
              are owned by us. You retain rights to your own uploaded content
              and may use generated decks for your internal and client
              communication.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">5. Disclaimer of warranties</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and
              &quot;as available&quot; basis, without warranties of any kind.
              We do not guarantee the accuracy or completeness of any generated
              content.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">6. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable
              for any indirect, incidental or consequential damages arising out
              of or connected with your use of the Service.
            </p>
          </div>

          <div>
            <h2 className="font-medium mb-1">7. Changes to the service</h2>
            <p>
              We may modify or discontinue parts of the Service at any time.
              When we update these Terms, we will post the new version on this
              page.
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