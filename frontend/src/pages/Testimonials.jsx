import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'
import PageHero from '../components/PageHero'
import { useIsMobile } from '../hooks/useMediaQuery'

const CATEGORY_COLORS = {
  ERP: '#E8192C', CRM: '#0072CE', Healthcare: '#059669',
  Manufacturing: '#7c3aed', Retail: '#d97706', Education: '#E8192C',
}
const catColor = (c) => CATEGORY_COLORS[c] || '#0072CE'

export default function Testimonials() {
  const [settings, setSettings] = useState(() => store.getSettings())
  const [testimonials, setTestimonials] = useState(() => store.getAll('testimonials'))
  const isMobile = useIsMobile()
  useEffect(() => store.subscribe(() => {
    setSettings(store.getSettings())
    setTestimonials(store.getAll('testimonials'))
  }), [])

  const total = testimonials.length
  const avg = total ? (testimonials.reduce((s, t) => s + (Number(t.rating) || 0), 0) / total) : 0
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const n = testimonials.filter((t) => (Number(t.rating) || 0) === stars).length
    return { stars, pct: total ? Math.round((n / total) * 100) : 0 }
  })

  return (
    <div>
      <PageHero page="testimonials" settings={settings} />

      {/* Rating Summary */}
      <section style={{ background: '#F5F6F8', padding: '64px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: 'clamp(28px, 5vw, 40px)', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '200px 1fr', gap: isMobile ? '28px' : '48px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', lineHeight: 1 }}>{avg ? avg.toFixed(1) : '—'}</div>
              <div style={{ color: '#E8192C', fontSize: '24px', letterSpacing: '3px', margin: '8px 0' }}>{'★'.repeat(Math.round(avg)) || '—'}</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Based on {total} review{total === 1 ? '' : 's'}</div>
            </div>
            <div>
              {breakdown.map(({ stars, pct }) => (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#555', width: '32px', textAlign: 'right', flexShrink: 0 }}>{stars}★</span>
                  <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: stars === 5 ? '#E8192C' : '#0072CE', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#888', width: '36px', flexShrink: 0 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {testimonials.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#aaa', fontSize: '15px', padding: '40px 0' }}>No testimonials yet.</p>
          ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((t) => (
              <div key={t.id} style={{ background: '#F5F6F8', borderRadius: '14px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ color: '#E8192C', fontSize: '18px', letterSpacing: '2px' }}>{'★'.repeat(t.rating || 5)}</div>
                  {t.category && <span style={{ background: `${catColor(t.category)}18`, color: catColor(t.category), padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>{t.category}</span>}
                </div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '24px', flex: 1 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ position: 'relative', width: '44px', height: '44px', background: '#0A1F3D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0, overflow: 'hidden' }}>
                    {(t.name || '?').charAt(0)}
                    {t.image && <img src={t.image} alt={t.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0A1F3D', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{[t.company, t.country].filter(Boolean).join(' · ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A1F3D', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '14px' }}>
          Join Our Growing List of Success Stories
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '32px' }}>
          Ready to become our next case study?
        </p>
        <Link to="/contact" style={{ background: '#E8192C', color: 'white', padding: '14px 40px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>
          Start Your Journey
        </Link>
      </section>
    </div>
  )
}
