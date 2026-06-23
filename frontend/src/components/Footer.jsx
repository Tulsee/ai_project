import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'
import LogoMark from './LogoMark'
import { useIsMobile } from '../hooks/useMediaQuery'

const companyLinks = ['About Us', 'Our Team', 'Careers', 'Blog', 'Press']
const solutionLinks = [
  { label: 'ERP Integration', path: '/services' },
  { label: 'CRM Services', path: '/services' },
  { label: 'Custom Development', path: '/services' },
  { label: 'Cloud Consulting', path: '/services' },
  { label: 'VPS Services', path: '/services' },
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
  const isMobile = useIsMobile()
  useEffect(() => store.subscribe(() => setSettings(store.getSettings())), [])

  return (
    <footer style={{ background: '#0A1F3D', color: 'rgba(255,255,255,0.75)', paddingTop: '64px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        {/* Company background + mission — appears on every page */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '40px', marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.08)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px' }}>WHO WE ARE</div>
          <h3 style={{ color: 'white', fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', marginBottom: '14px', maxWidth: '780px', lineHeight: 1.3 }}>
            {settings.siteName} — enterprise software, powered by AI
          </h3>
          <p style={{ fontSize: '14.5px', lineHeight: 1.9, maxWidth: '820px' }}>
            Founded in Kathmandu, {settings.siteName} is an enterprise software company serving 500+ organisations across all 7 provinces of Nepal. From ERP and CRM to cloud, hosting and custom development — every service is powered by our AI virtual assistant.{' '}
            <strong style={{ color: 'rgba(255,255,255,0.92)' }}>Our mission:</strong> {settings.tagline}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '2fr 1fr 1fr 1fr',
          gap: isMobile ? '32px' : '48px',
          paddingBottom: '48px',
        }}>
          {/* Brand column */}
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <LogoMark settings={settings} boxColor={settings.primaryColor} />
              <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: 'white' }}>
                {settings.siteName}<span style={{ color: settings.primaryColor }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.8', marginBottom: '24px', maxWidth: '280px' }}>
              {settings.tagline}
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

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', fontWeight: '700', marginBottom: '20px', fontFamily: 'Montserrat, sans-serif' }}>
              Services
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
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? '12px' : '0',
          justifyContent: 'space-between',
          alignItems: 'center',
          textAlign: 'center',
          fontSize: '13px',
        }}>
          <span>© 2024 {settings.siteName}. All rights reserved.</span>
          <Link to="/admin" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >Admin Portal</Link>
        </div>
      </div>
    </footer>
  )
}
