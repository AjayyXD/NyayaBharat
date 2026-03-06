import React, { useState } from 'react'

export default function VoiceFiling({ apiBase }) {
  const [file, setFile] = useState(null)
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)
  const [view, setView] = useState('native')

  async function process() {
    if (!file) return
    setLoading(true)
    setRes(null)
    setView('native')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const r = await fetch(`${apiBase}/api/complaint/voice`, {
        method: 'POST',
        body: fd
      })
      const j = await r.json()
      if (j.job_name) {
        setRes({ status: 'processing', message: 'Transcription started...' })
        pollResult(j.job_name)    // ← pass unique job_name
      } else {
        setRes({ error: j.detail || 'Unknown error' })
      }
    } catch (e) {
      setRes({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  function pollResult(jobName) {
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        // ← use job-specific route
        const r = await fetch(`${apiBase}/api/complaint/result/${jobName}`)
        const j = await r.json()
        if (j.status === 'COMPLETED') {
          setRes(j)
          clearInterval(interval)
          setPolling(false)
        } else if (j.status === 'FAILED') {
          setRes({ error: 'Transcription failed.' })
          clearInterval(interval)
          setPolling(false)
        } else {
          setRes({ status: 'processing', message: `Status: ${j.status}...` })
        }
      } catch (e) {
        setRes({ error: e.message })
        clearInterval(interval)
        setPolling(false)
      }
    }, 3000)
  }

  const tabStyle = (active) => ({
    padding: '6px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontWeight: active ? 700 : 400,
    background: active ? '#1a1a2e' : '#e2e8f0',
    color: active ? '#fff' : '#333',
    fontSize: 13,
  })

  return (
    <div className="service-card">
      <h3>🎤 Voice Complaint Filing</h3>
      <input
        type="file"
        accept="audio/mp3,audio/wav,audio/ogg,audio/*"
        onChange={e => setFile(e.target.files?.[0])}
      />
      <div style={{ marginTop: 8 }}>
        <button
          className="button"
          onClick={process}
          disabled={!file || loading || polling}
        >
          {loading ? 'Uploading...' : polling ? 'Transcribing...' : 'File Complaint'}
        </button>
      </div>

      {res && (
        <div style={{ marginTop: 12 }}>
          {res.error ? (
            <div style={{ color: 'red' }}>{res.error}</div>
          ) : res.status === 'processing' ? (
            <div style={{ color: '#888' }}>⏳ {res.message}</div>
          ) : (
            <>
              <div style={{ color: 'green', marginBottom: 12 }}>✅ Transcription Complete</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button style={tabStyle(view === 'native')} onClick={() => setView('native')}>
                  🌐 Original Language
                </button>
                <button style={tabStyle(view === 'english')} onClick={() => setView('english')}>
                  🇬🇧 English Translation
                </button>
              </div>
              {view === 'native' && (
                <div style={{ background: '#f4f5f7', padding: 12, whiteSpace: 'pre-wrap', borderRadius: 8, lineHeight: 1.7 }}>
                  {res.native_transcript || 'No native transcript available.'}
                </div>
              )}
              {view === 'english' && (
                <div style={{ background: '#f4f5f7', padding: 12, whiteSpace: 'pre-wrap', borderRadius: 8, lineHeight: 1.7 }}>
                  {res.english_transcript || 'No English translation available.'}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}