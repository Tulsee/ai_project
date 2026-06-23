import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react'

// App-wide replacement for window.alert / window.confirm with a styled popup.
//
// Usage:
//   const { confirm, alert } = useDialog()
//   if (await confirm({ title, message, confirmLabel, danger })) { ... }
//   await alert({ title, message })          // or alert('Something went wrong')
const DialogContext = createContext(null)

export function useDialog() {
  const ctx = useContext(DialogContext)
  if (!ctx) throw new Error('useDialog must be used inside <DialogProvider>')
  return ctx
}

// Accept either a plain string or an options object.
const normalize = (opts) => (typeof opts === 'string' ? { message: opts } : (opts || {}))

export function DialogProvider({ children }) {
  const [state, setState] = useState(null) // { mode, title, message, confirmLabel, cancelLabel, danger }
  const resolveRef = useRef(null)

  const settle = useCallback((result) => {
    const resolve = resolveRef.current
    resolveRef.current = null
    setState(null)
    if (resolve) resolve(result)
  }, [])

  const ask = useCallback((mode, opts) => new Promise((resolve) => {
    resolveRef.current = resolve
    setState({ mode, ...normalize(opts) })
  }), [])

  const confirm = useCallback((opts) => ask('confirm', opts), [ask])
  const alert = useCallback((opts) => ask('alert', opts), [ask])

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      {state && (
        <DialogModal
          {...state}
          onConfirm={() => settle(true)}
          onCancel={() => settle(false)}
        />
      )}
    </DialogContext.Provider>
  )
}

function DialogModal({ mode, title, message, confirmLabel, cancelLabel, danger, icon, onConfirm, onCancel }) {
  const isConfirm = mode === 'confirm'
  const isDanger = danger ?? isConfirm
  const accent = isDanger ? '#E8192C' : '#0072CE'

  // Keyboard: Esc cancels, Enter confirms.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
      else if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onConfirm, onCancel])

  return (
    <div style={overlay} onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div style={dialog} role="alertdialog" aria-modal="true">
        <div style={{ ...iconCircle, background: isDanger ? '#fee2e2' : '#dbeafe' }}>
          {icon || (isDanger ? '⚠️' : 'ℹ️')}
        </div>
        {title && <h3 style={titleStyle}>{title}</h3>}
        {message && <p style={messageStyle}>{message}</p>}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
          {isConfirm && (
            <button onClick={onCancel} style={cancelBtn}>{cancelLabel || 'Cancel'}</button>
          )}
          <button onClick={onConfirm} autoFocus style={{ ...confirmBtn, background: accent }}>
            {confirmLabel || (isConfirm ? 'Confirm' : 'OK')}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed', inset: 0, zIndex: 3000,
  background: 'rgba(10,31,61,0.55)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '24px',
}
const dialog = {
  background: 'white', borderRadius: '16px', padding: '32px',
  width: '100%', maxWidth: '420px', textAlign: 'center',
  boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
  fontFamily: 'Inter, sans-serif',
  animation: 'fadeInUp 0.18s ease',
}
const iconCircle = {
  width: '60px', height: '60px', borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '28px', margin: '0 auto 18px',
}
const titleStyle = {
  fontSize: '19px', fontWeight: 800, fontFamily: 'Montserrat, sans-serif',
  color: '#0A1F3D', marginBottom: '8px',
}
const messageStyle = {
  fontSize: '14px', color: '#666', lineHeight: 1.7, whiteSpace: 'pre-wrap',
}
const cancelBtn = {
  background: '#f3f4f6', color: '#374151', border: 'none',
  padding: '11px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
}
const confirmBtn = {
  color: 'white', border: 'none',
  padding: '11px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
}
