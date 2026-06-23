import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'
import PageHero from '../components/PageHero'
import { openAssistant } from '../components/Chatbot'

function SolutionCard({ sol }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: '14px', padding: '36px',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.12)' : '0 2px 16px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.28s', borderTop: `4px solid ${sol.color}`,
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ fontSize: '36px' }}>{sol.icon}</div>
        <div style={{ background: `${sol.color}18`, color: sol.color, padding: '4px 12px', borderRadius: '14px', fontSize: '11px', fontWeight: '700' }}>{sol.badge}</div>
      </div>
      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0A1F3D', marginBottom: '12px', fontFamily: 'Montserrat, sans-serif' }}>{sol.title}</h3>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.7, marginBottom: '24px' }}>{sol.desc}</p>
      <ul style={{ padding: 0, marginBottom: '28px' }}>
        {sol.features.map(f => (
          <li key={f} style={{ fontSize: '13px', color: '#555', padding: '5px 0', display: 'flex', alignItems: 'flex-start', gap: '8px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ color: sol.color, fontWeight: '800', marginTop: '1px', flexShrink: 0 }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <Link to="/contact" style={{
        display: 'block', textAlign: 'center',
        background: sol.color, color: 'white',
        padding: '13px 24px', borderRadius: '30px', fontSize: '14px', fontWeight: '600',
        transition: 'opacity 0.2s',
      }}>Get a Quote →</Link>
    </div>
  )
}

export default function Services() {
  const [services, setSolutions] = useState(() => store.getAll('services'))
  const [settings, setSettings] = useState(() => store.getSettings())
  useEffect(() => store.subscribe(() => {
    setSolutions(store.getAll('services'))
    setSettings(store.getSettings())
  }), [])

  return (
    <div>
      <PageHero page="services" settings={settings} />

      <section style={{ background: '#F5F6F8', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Flagship: AI virtual assistant — our key unique selling point */}
          <div style={{
            background: `linear-gradient(135deg, ${settings.darkColor} 0%, ${settings.primaryColor} 135%)`,
            borderRadius: '18px', padding: 'clamp(28px, 4vw, 44px)', marginBottom: '40px',
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px',
            alignItems: 'center', boxShadow: '0 16px 48px rgba(0,0,0,0.18)',
          }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.18)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>⭐ OUR FLAGSHIP</div>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '12px', lineHeight: 1.2 }}>
                AI-Powered Virtual Assistant
              </h2>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.8, marginBottom: '24px' }}>
                The unique selling point behind everything we deliver — an intelligent assistant that answers questions instantly, recommends the right service, and books consultations 24/7, right here on the site.
              </p>
              <button onClick={openAssistant} style={{
                background: 'white', color: settings.darkColor, border: 'none',
                padding: '14px 32px', borderRadius: '30px', fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
              }}>
                💬 Try it now
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 'clamp(80px, 13vw, 128px)', lineHeight: 1 }}>🤖</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            {services.map((sol) => <SolutionCard key={sol.id} sol={sol} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A1F3D', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '14px' }}>
          Not sure which service fits?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '32px' }}>
          Our experts will help you design the right technology roadmap for your business.
        </p>
        <Link to="/contact" style={{ background: '#E8192C', color: 'white', padding: '14px 40px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>
          Talk to an Expert
        </Link>
      </section>
    </div>
  )
}
