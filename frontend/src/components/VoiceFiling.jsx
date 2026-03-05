import React, { useState } from 'react'

export default function VoiceFiling({ apiBase }) {
  const [file, setFile] = useState(null)
  const [lang, setLang] = useState('hi')
  const [location, setLocation] = useState('')
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)

  async function process() {
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('audio', file)          // ← was sending a URL via JSON, backend expects a file
    fd.append('language', lang)
    fd.append('location', location)
    try {
      const r = await fetch(`${apiBase}/api/voice/complaint`, {  // ← fixed route
        method: 'POST',
        body: fd                       // ← multipart, not JSON
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
      <h3>🎤 Voice Complaint Filing</h3>
      <input
        type="file"
        accept="audio/mp3,audio/wav,audio/ogg,audio/*"
        onChange={e => setFile(e.target.files?.[0])}
      />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          className="input"
          placeholder="City or district (optional)"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
        <select value={lang} onChange={e => setLang(e.target.value)}>
          <option value="hi">Hindi</option>
          <option value="en">English</option>
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
        <button className="button" onClick={process} disabled={!file || loading}>
          {loading ? 'Processing...' : 'File Complaint'}
        </button>
      </div>
      {res && (
        <div style={{ marginTop: 12 }}>
          {res.error ? (
            <div style={{ color: 'red' }}>{res.error}</div>
          ) : (
            <>
              <div style={{ color: 'green', marginBottom: 8 }}>✅ Complaint Filed</div>
              <h4>Transcript</h4>
              <div style={{ background: '#f4f5f7', padding: 8 }}>{res.transcript}</div>
              <h4 style={{ marginTop: 8 }}>Drafted Complaint</h4>
              <div style={{ background: '#f4f5f7', padding: 8, whiteSpace: 'pre-wrap' }}>
                {res.complaint_drafted}
              </div>
              {res.authorities_notified?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  Notified: {res.authorities_notified.join(', ')}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}