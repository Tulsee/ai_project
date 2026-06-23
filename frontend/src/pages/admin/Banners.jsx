import { useState, useEffect } from 'react'
import * as store from '../../data/store'
import ImageUploader from '../../components/admin/ImageUploader'
import { card, input, label, btn, pageTitle } from '../../components/admin/ui'

const SECTIONS = [
  { key: 'home', label: 'Home', bannerKey: 'bannerHome' },
  { key: 'services', label: 'Services', bannerKey: 'bannerSolutions' },
  { key: 'industries', label: 'Industries', bannerKey: 'bannerIndustries' },
  { key: 'testimonials', label: 'Testimonials', bannerKey: 'bannerTestimonials' },
  { key: 'articles', label: 'Articles', bannerKey: 'bannerArticles' },
  { key: 'gallery', label: 'Gallery', bannerKey: 'bannerGallery' },
]

export default function Banners() {
  const [site, setSite] = useState(store.getSettings())
  const [active, setActive] = useState('home')
  const [msg, setMsg] = useState(null)

  useEffect(() => store.subscribe(() => setSite(store.getSettings())), [])

  const section = SECTIONS.find((s) => s.key === active)
  const hero = (site.heroes && site.heroes[active]) || {}
  const banner = site[section.bannerKey] || ''
  const color = hero.textColor || '#ffffff'

  const setBanner = (url) => setSite((s) => ({ ...s, [section.bannerKey]: url }))
  const setHero = (key) => (e) => {
    const value = e && e.target ? e.target.value : e
    setSite((s) => ({ ...s, heroes: { ...s.heroes, [active]: { ...((s.heroes && s.heroes[active]) || {}), [key]: value } } }))
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      await store.saveSettings(site)
      setMsg({ type: 'ok', text: `${section.label} banner saved. Changes are live on the website.` })
      setTimeout(() => setMsg(null), 3000)
    } catch (err) {
      setMsg({ type: 'err', text: err.message || 'Could not save.' })
    }
  }

  return (
    <div>
      <h2 style={pageTitle}>Page Banners</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>
        Manage the top banner (hero) of each page — image, badge label, heading, sub-text and text colour.
      </p>

      {/* Section tabs */}
      <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', background: '#eef0f3', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
        {SECTIONS.map((s) => {
          const on = s.key === active
          return (
            <button key={s.key} onClick={() => { setActive(s.key); setMsg(null) }}
              style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif', background: on ? 'white' : 'transparent', color: on ? '#0A1F3D' : '#888', boxShadow: on ? '0 1px 4px rgba(0,0,0,0.1)' : 'none' }}>
              {s.label}
            </button>
          )
        })}
      </div>

      {msg && (
        <div style={{ background: msg.type === 'ok' ? '#dcfce7' : '#fee2e2', border: `1px solid ${msg.type === 'ok' ? '#86efac' : '#fca5a5'}`, color: msg.type === 'ok' ? '#15803d' : '#dc2626', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
          {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Editor */}
        <form onSubmit={save} style={{ ...card, padding: '28px' }}>
          <h3 style={h3}>{section.label} Banner</h3>

          <Field label="Banner image">
            <ImageUploader value={banner} onChange={setBanner} previewWidth={180} previewHeight={90} />
          </Field>
          <Field label="Badge label">
            <input value={hero.badge || ''} onChange={setHero('badge')} placeholder="e.g. OUR SOLUTIONS" style={input} />
          </Field>
          <Field label="Heading">
            <input value={hero.title || ''} onChange={setHero('title')} style={input} />
          </Field>
          <Field label="Sub-text">
            <textarea value={hero.subtitle || ''} onChange={setHero('subtitle')} rows={3} style={{ ...input, resize: 'vertical' }} />
          </Field>
          <Field label="Text colour">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input type="color" value={color} onChange={setHero('textColor')} style={{ width: '44px', height: '40px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', padding: '2px', background: 'white' }} />
              <input value={color} onChange={setHero('textColor')} style={{ ...input, flex: 1 }} />
            </div>
          </Field>

          <button type="submit" style={{ ...btn(), marginTop: '8px' }}>Save {section.label} Banner</button>
        </form>

        {/* Live preview */}
        <div style={{ ...card, padding: 0, overflow: 'hidden', position: 'sticky', top: '24px' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontSize: '13px', fontWeight: 600, color: '#888' }}>Live preview</div>
          <div style={{ background: store.bannerBg(banner), padding: '56px 24px', textAlign: 'center' }}>
            {hero.badge && (
              <div style={{ display: 'inline-block', background: site.primaryColor, color: '#fff', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>{hero.badge}</div>
            )}
            <div style={{ fontSize: '28px', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color, marginBottom: '10px', textShadow: '0 2px 14px rgba(0,0,0,0.4)' }}>{hero.title}</div>
            {hero.subtitle && (
              <div style={{ fontSize: '14px', color, opacity: 0.92, maxWidth: '440px', margin: '0 auto', lineHeight: 1.6, textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}>{hero.subtitle}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label: l, children }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={label}>{l}</label>
      {children}
    </div>
  )
}

const h3 = { fontSize: '16px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '20px' }
