import React, { useState, useEffect } from 'react'

export default function OfficerMode({ apiBase }) {
  const [file, setFile] = useState(null)
  const [department, setDepartment] = useState('general')
  const [lang, setLang] = useState('en')
  const [departments, setDepartments] = useState({})
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)

  // Load departments from backend on mount
  useEffect(() => {
    fetch(`${apiBase}/api/officer/departments`)
      .then(r => r.json())
      .then(j => setDepartments(j.departments))
      .catch(() => {})
  }, [apiBase])

  async function scan() {
    if (!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('image', file)              // ← was 'file', backend expects 'image'
    fd.append('department', department)   // ← new field
    fd.append('language', lang)
    try {
      const r = await fetch(`${apiBase}/api/officer/scan-petition`, {  // ← fixed route
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
      <h3>👮 Government Officer Portal</h3>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0])} />
      <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={department} onChange={e => setDepartment(e.target.value)}>
          {Object.entries(departments).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
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
        <button className="button" onClick={scan} disabled={!file || loading}>
          {loading ? 'Generating...' : 'Generate Formal Document'}
        </button>
      </div>
      {res && (
        <div style={{ marginTop: 12 }}>
          {res.error ? (
            <div style={{ color: 'red' }}>{res.error}</div>
          ) : (
            <>
              <h4>Transcription (what was handwritten)</h4>
              <div style={{ background: '#f4f5f7', padding: 8, whiteSpace: 'pre-wrap' }}>
                {res.transcription}
              </div>
              <h4 style={{ marginTop: 12 }}>Formal Document ({res.language})</h4>
              <textarea
                className="textarea"
                rows={12}
                value={res.formal_document}   // ← was res.formal_translation
                readOnly
              />
              <div style={{ marginTop: 4, color: '#666', fontSize: 12 }}>
                Department: {res.department} · Model: {res.model}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}