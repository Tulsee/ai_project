import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'

const companyLinks = ['About Us', 'Our Team', 'Careers', 'Blog', 'Press']
const solutionLinks = [
  { label: 'ERP Integration', path: '/solutions' },
  { label: 'CRM Solutions', path: '/solutions' },
  { label: 'Custom Development', path: '/solutions' },
  { label: 'Cloud Consulting', path: '/solutions' },
  { label: 'VPS Solutions', path: '/solutions' },
]
const industryLinks = [
  { label: 'Banking & Finance', path: '/industries' },
  { label: 'Healthcare', path: '/industries' },
  { label: 'Retail', path: '/industries' },
  { label: 'Manufacturing', path: '/industries' },
  { label: 'Education', path: '/industries' },
]

export default function Footer() {
  const [settings, setSettings] = useState(store.getSettings)
  useEffect(() => store.subscribe(() => setSettings(store.getSettings())), [])

  return (
    <footer style={{ background: '#0A1F3D', color: 'rgba(255,255,255,0.75)', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', paddingBottom: '48px' }}>
          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '36px', height: '36px', background: settings.primaryColor,
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', color: 'white', fontWeight: '800',
                fontSize: '18px', fontFamily: 'Montserrat, sans-serif',
              }}>{settings.logoLetter}</div>
              <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: 'white' }}>
                {settings.siteName}<span style={{ color: settings.primaryColor }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '24px', maxWidth: '280px' }}>
              {settings.tagline} Trusted by 500+ companies across all 7 provinces of Nepal.
            </p>
            <div style={{ fontSize: '13px' }}>
              <div style={{ marginBottom: '8px' }}>📍 Durbar Marg, Kathmandu 44600, Nepal</div>
              <div style={{ marginBottom: '8px' }}>📞 +977 1 4123456</div>
              <div>✉️ contact@ai-solution.com.np</div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>
              Company
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {companyLinks.map(l => (
                <li key={l} style={{ marginBottom: '12px' }}>
                  <Link to="/" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                  >{l}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>
              Solutions
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {solutionLinks.map(l => (
                <li key={l.label} style={{ marginBottom: '12px' }}>
                  <Link to={l.path} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>
              Industries
            </h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {industryLinks.map(l => (
                <li key={l.label} style={{ marginBottom: '12px' }}>
                  <Link to={l.path} style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                  >{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
        }}>
          <span>© 2024 AI-Solution. All rights reserved.</span>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >Admin Portal</Link>
        </div>
      </div>
    </footer>
  )
}
