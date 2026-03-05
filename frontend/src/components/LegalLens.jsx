import React, { useState } from 'react'

export default function LegalLens({ apiBase }) {
  const [file, setFile] = useState(null)
  const [lang, setLang] = useState('hi')
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)

  async function upload() {
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('image', file)        // ← was 'file', backend expects 'image'
    fd.append('language', lang)
    try {
      const r = await fetch(`${apiBase}/api/legal-lens/analyze`, {  // ← fixed route
        method: 'POST',
        body: fd
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
      <h3>🔍 Legal Lens: Document Simplifier</h3>
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setFile(e.target.files?.[0])} />
      <div style={{ marginTop: 8 }}>
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
        <button className="button" onClick={upload} style={{ marginLeft: 8 }} disabled={!file || loading}>
          {loading ? 'Processing...' : 'Simplify'}
        </button>
      </div>
      {res && (
        <div style={{ marginTop: 12 }}>
          {res.error ? (
            <div style={{ color: 'red' }}>{res.error}</div>
          ) : (
            <>
              <h4>Analysis ({res.language})</h4>
              <div style={{ whiteSpace: 'pre-wrap' }}>{res.analysis}</div>  {/* ← was res.simplified_text */}
            </>
          )}
        </div>
      )}
    </div>
  )
}