import React, { useState } from 'react'

export default function VoiceFiling({ apiBase }) {
  const [file, setFile] = useState(null)
  const [res, setRes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [polling, setPolling] = useState(false)

  async function process() {
    if (!file) return
    setLoading(true)
    setRes(null)
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
        pollResult()
      } else {
        setRes({ error: j.detail || 'Unknown error' })
      }
    } catch (e) {
      setRes({ error: e.message })
    } finally {
      setLoading(false)
    }
  }

  function pollResult() {
    setPolling(true)
    const interval = setInterval(async () => {
      try {
        const r = await fetch(`${apiBase}/api/complaint/result`)
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

  return (
    <div className="service-card">
      <h3>🎤 Voice Complaint Filing</h3>
      <input
        type="file"
        accept="audio/mp3,audio/wav,audio/ogg,audio/*"
        onChange={e => setFile(e.target.files?.[0])}
      />
      <div style={{ marginTop: 8 }}>
        <button className="button" onClick={process} disabled={!file || loading || polling}>
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
              <div style={{ color: 'green', marginBottom: 8 }}>✅ Transcription Complete</div>
              {res.native_transcript && (
                <>
                  <h4>Original ({res.native_transcript !== res.english_transcript ? 'Native Language' : 'English'})</h4>
                  <div style={{ background: '#f4f5f7', padding: 8, whiteSpace: 'pre-wrap', borderRadius: 6 }}>
                    {res.native_transcript}
                  </div>
                </>
              )}
              {res.english_transcript && res.english_transcript !== res.native_transcript && (
                <>
                  <h4 style={{ marginTop: 8 }}>English Translation</h4>
                  <div style={{ background: '#f4f5f7', padding: 8, whiteSpace: 'pre-wrap', borderRadius: 6 }}>
                    {res.english_transcript}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}