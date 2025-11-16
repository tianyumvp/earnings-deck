export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center px-6 py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
        Turn a Ticker into a Deck in 60 Seconds.
      </h1>

      <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mb-10">
        Type any NYSE / NASDAQ ticker and get a fresh, investor-ready update deck
        built from the latest public filings—delivered straight to your inbox.
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-12">
        <input
          placeholder="e.g. AMD"
          className="border border-gray-300 rounded-md px-4 py-3 w-72 text-gray-800"
        />
        <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700">
          Generate for $0.99
        </button>
      </div>

      <ul className="text-gray-700 text-lg space-y-2">
        <li>• Latest publicly filed figures included.</li>
        <li>• Professional, banker-grade update deck.</li>
        <li>• PDF delivered in under 60 seconds.</li>
      </ul>
    </main>
  );
}
