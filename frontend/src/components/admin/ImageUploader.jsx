import { useState } from 'react'
import * as api from '../../data/api'

// Upload widget used by the admin forms. Picks a file, uploads it to the
// backend, and reports the saved URL back via onChange. The stored value is a
// plain URL string (a server path like "/api/uploads/<name>.png", or any
// external URL), so it drops straight into the existing image fields.
export default function ImageUploader({ value, onChange, previewWidth = 96, previewHeight = 60 }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // let the user re-pick the same file later
    if (!file) return
    setErr(null)
    setBusy(true)
    try {
      const { url } = await api.upload(file)
      onChange(url)
    } catch (ex) {
      setErr(ex.message || 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ width: previewWidth, height: previewHeight, borderRadius: '8px', background: '#f1f3f5', border: '1px solid #e5e7eb', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: '11px' }}>
        {value
          ? <img src={value} alt="preview" onError={(e) => { e.currentTarget.style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : 'No image'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-start' }}>
        <label style={{ ...uploadBtn, opacity: busy ? 0.6 : 1, pointerEvents: busy ? 'none' : 'auto' }}>
          {busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
          <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleFile} disabled={busy} style={{ display: 'none' }} />
        </label>
        {value && !busy && (
          <button type="button" onClick={() => onChange('')} style={removeBtn}>Remove</button>
        )}
        {err && <span style={{ color: '#dc2626', fontSize: '11px' }}>{err}</span>}
      </div>
    </div>
  )
}

const uploadBtn = {
  display: 'inline-block', cursor: 'pointer',
  background: '#0072CE', color: 'white', fontWeight: 600, fontSize: '13px',
  padding: '8px 16px', borderRadius: '8px', fontFamily: 'Inter, sans-serif',
}
const removeBtn = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#E8192C', fontSize: '12px', fontWeight: 600, padding: 0,
}
