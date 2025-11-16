// pages/index.js
export default function Home() {
  return (
    <div style={{
      maxWidth: 560,
      margin: '120px auto 60px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#111'
    }}>
      <h1 style={{ fontSize: 40, marginBottom: 8 }}>
        Get the Update Deck in 1 Min
      </h1>
      <p style={{ fontSize: 20, color: '#555', marginBottom: 32 }}>
        Type any NYSE / NASDAQ ticker & receive a fresh investor-ready slide deck—straight to your inbox.
      </p>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          id="ticker"
          placeholder="e.g. AMD"
          style={{
            flex: 1,
            padding: '14px 16px',
            fontSize: 18,
            border: '1px solid #ccc',
            borderRadius: 4
          }}
        />
        <button style={{
          padding: '14px 24px',
          fontSize: 18,
          background: '#0d7cff',
          color: '#fff',
          border: 0,
          borderRadius: 4,
          cursor: 'pointer'
        }}>
          Generate for $0.99
        </button>
      </div>

      <ul style={{ marginTop: 28, paddingLeft: 20, fontSize: 15, color: '#666' }}>
        <li>Q2 2025 numbers included</li>
        <li>High-res charts ready to present</li>
        <li>PDF delivered in under 60 s</li>
      </ul>
    </div>
  );
}
