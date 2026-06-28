import { useState, useEffect } from 'react'
import * as store from '../../data/store'
import ImageUploader from '../../components/admin/ImageUploader'
import LogoMark from '../../components/LogoMark'
import { card, input, label, btn, pageTitle } from '../../components/admin/ui'

// At least 8 chars with one lowercase, one uppercase, one digit, one special char.
const PASSWORD_POLICY = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/

function Notice({ type, children }) {
  if (!children) return null
  const ok = type === 'ok'
  return (
    <div style={{ background: ok ? '#dcfce7' : '#fee2e2', border: `1px solid ${ok ? '#86efac' : '#fca5a5'}`, color: ok ? '#15803d' : '#dc2626', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
      {children}
    </div>
  )
}

export default function Settings() {
  // ── Password / account ──
  const [account, setAccount] = useState({ username: store.getUsername(), current: '', next: '', confirm: '' })
  const [accountMsg, setAccountMsg] = useState(null)

  const saveAccount = async (e) => {
    e.preventDefault()
    if (!account.current) return setAccountMsg({ type: 'err', text: 'Enter your current password to save changes.' })
    if (account.next && !PASSWORD_POLICY.test(account.next)) {
      return setAccountMsg({
        type: 'err',
        text: 'New password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character.',
      })
    }
    if (account.next !== account.confirm) return setAccountMsg({ type: 'err', text: 'New password and confirmation do not match.' })
    try {
      await store.saveCredentials({
        current_password: account.current,
        new_username: account.username.trim() || undefined,
        new_password: account.next || undefined,
      })
      setAccount((a) => ({ ...a, current: '', next: '', confirm: '' }))
      setAccountMsg({ type: 'ok', text: 'Account updated successfully.' })
    } catch (err) {
      setAccountMsg({ type: 'err', text: err.message || 'Could not update account.' })
    }
  }

  // ── Site controls ──
  const [site, setSite] = useState(store.getSettings())
  const [siteMsg, setSiteMsg] = useState(null)
  const setSiteField = (k) => (e) => setSite((s) => ({ ...s, [k]: e.target.value }))

  // Sync the form once site settings finish hydrating from the backend.
  useEffect(() => store.subscribe(() => setSite(store.getSettings())), [])

  const saveSite = async (e) => {
    e.preventDefault()
    try {
      await store.saveSettings(site)
      setSiteMsg('Site settings saved. Changes are live across the website.')
      setTimeout(() => setSiteMsg(null), 3000)
    } catch (err) {
      setSiteMsg(err.message || 'Could not save settings.')
    }
  }

  return (
    <div>
      <h2 style={pageTitle}>Settings</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>Manage your admin account and global site controls.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Account / password */}
        <div style={{ ...card, padding: '28px' }}>
          <h3 style={h3}>🔐 Account & Password</h3>
          <Notice type={accountMsg?.type === 'ok' ? 'ok' : 'err'}>{accountMsg?.text}</Notice>
          <form onSubmit={saveAccount}>
            <Row label="Username">
              <input value={account.username} onChange={(e) => setAccount((a) => ({ ...a, username: e.target.value }))} style={input} />
            </Row>
            <Row label="Current Password">
              <input type="password" value={account.current} onChange={(e) => setAccount((a) => ({ ...a, current: e.target.value }))} placeholder="Required to save changes" style={input} />
            </Row>
            <Row label="New Password">
              <input type="password" value={account.next} onChange={(e) => setAccount((a) => ({ ...a, next: e.target.value }))} placeholder="Leave blank to keep current" style={input} />
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', lineHeight: 1.4 }}>
                Use at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character.
              </div>
            </Row>
            <Row label="Confirm New Password">
              <input type="password" value={account.confirm} onChange={(e) => setAccount((a) => ({ ...a, confirm: e.target.value }))} style={input} />
            </Row>
            <button type="submit" style={{ ...btn(), marginTop: '8px' }}>Update Account</button>
          </form>
        </div>

        {/* Site controls */}
        <div style={{ ...card, padding: '28px' }}>
          <h3 style={h3}>🎨 Site Controls</h3>
          <Notice type="ok">{siteMsg}</Notice>
          <form onSubmit={saveSite}>
            <Row label="Site Name">
              <input value={site.siteName} onChange={setSiteField('siteName')} style={input} />
            </Row>
            <Row label="Logo">
              <div style={{ display: 'inline-flex', background: '#eef0f3', borderRadius: '8px', padding: '3px', marginBottom: '12px' }}>
                {[{ id: 'text', label: 'Text letter' }, { id: 'image', label: 'Upload image' }].map((m) => {
                  const active = (site.logoType || 'text') === m.id
                  return (
                    <button key={m.id} type="button" onClick={() => setSite((s) => ({ ...s, logoType: m.id }))}
                      style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: active ? 'white' : 'transparent', color: active ? '#0A1F3D' : '#888', boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
                      {m.label}
                    </button>
                  )
                })}
              </div>
              {(site.logoType || 'text') === 'image' ? (
                <ImageUploader value={site.logoImage || ''} onChange={(url) => setSite((s) => ({ ...s, logoImage: url }))} previewWidth={64} previewHeight={64} />
              ) : (
                <input value={site.logoLetter} maxLength={2} onChange={setSiteField('logoLetter')} placeholder="A" style={{ ...input, width: '80px' }} />
              )}
            </Row>
            <Row label="Tagline">
              <textarea value={site.tagline} onChange={setSiteField('tagline')} rows={2} style={{ ...input, resize: 'vertical' }} />
            </Row>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '12px', marginBottom: '8px' }}>
              <ColorField label="Primary" value={site.primaryColor} onChange={setSiteField('primaryColor')} />
              <ColorField label="Dark" value={site.darkColor} onChange={setSiteField('darkColor')} />
              <ColorField label="Accent" value={site.accentColor} onChange={setSiteField('accentColor')} />
            </div>

            {/* Live logo preview */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#F5F6F8', borderRadius: '10px', padding: '14px 16px', margin: '16px 0' }}>
              <LogoMark settings={site} boxColor={site.darkColor} />
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: site.darkColor }}>
                {site.siteName}<span style={{ color: site.primaryColor }}>.</span>
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#aaa' }}>Live preview</span>
            </div>

            <button type="submit" style={btn()}>Save Site Settings</button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Row({ label: l, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={label}>{l}</label>
      {children}
    </div>
  )
}

function ColorField({ label: l, value, onChange }) {
  return (
    <div>
      <label style={{ ...label, fontSize: '12px' }}>{l}</label>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input type="color" value={value} onChange={onChange} style={{ width: '36px', height: '38px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', padding: '2px', background: 'white' }} />
        <input value={value} onChange={onChange} style={{ ...input, padding: '8px', fontSize: '12px' }} />
      </div>
    </div>
  )
}

const h3 = { fontSize: '16px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '20px' }
