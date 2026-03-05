import React, { useState } from 'react'

export default function RightsBot({ apiBase }) {
  const [q, setQ] = useState('')
  const [lang, setLang] = useState('en')
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)

  async function ask() {
    if (!q) return
    setLoading(true)
    try {
      const r = await fetch(`${apiBase}/api/rights/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,    // ← correct field name (was already right)
          language: lang
        })
      })
      const j = await r.json()
      setRes(j)
    } catch (e) {
      setRes({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="service-card">
      <h3>🤖 Legal Rights Assistant</h3>
      <input
        className="input"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Ask about your rights..."
        onKeyDown={e => e.key === 'Enter' && ask()}
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="gu">Gujarati</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="pa">Punjabi</option>
          <option value="or">Odia</option>
          <option value="as">Assamese</option>
          <option value="ur">Urdu</option>
        </select>
        <button className="button" onClick={ask} disabled={!q || loading}>
          {loading ? 'Thinking...' : 'Get Legal Advice'}
        </button>
      </div>
      {res && (
        <div style={{ marginTop: 12 }}>
          {res.error ? (
            <div style={{ color: 'red' }}>{res.error}</div>
          ) : (
            <>
              <h4>Answer</h4>
              <div style={{ whiteSpace: 'pre-wrap' }}>{res.answer}</div>
              {res.citations?.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <strong>Sources</strong>
                  {res.citations.map((c, i) => (
                    <div key={i} style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                      {c.source}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}