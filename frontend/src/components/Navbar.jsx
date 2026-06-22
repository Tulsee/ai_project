import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as store from '../data/store'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/solutions', label: 'Solutions' },
  { path: '/industries', label: 'Industries' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/articles', label: 'Articles' },
  { path: '/gallery', label: 'Gallery' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState(store.getSettings)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => store.subscribe(() => setSettings(store.getSettings())), [])

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'white',
      boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.14)' : '0 2px 12px rgba(0,0,0,0.07)',
      transition: 'box-shadow 0.3s',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: settings.darkColor,
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: '800', fontSize: '18px',
            fontFamily: 'Montserrat, sans-serif',
          }}>{settings.logoLetter}</div>
          <span style={{
            fontSize: '20px', fontWeight: '800',
            fontFamily: 'Montserrat, sans-serif', color: settings.darkColor,
          }}>
            {settings.siteName}<span style={{ color: settings.primaryColor }}>.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {NAV_LINKS.map(({ path, label }) => (
            <Link key={path} to={path} style={{
              fontSize: '14px', fontWeight: '500',
              color: isActive(path) ? settings.primaryColor : '#444',
              borderBottom: isActive(path) ? `2px solid ${settings.primaryColor}` : '2px solid transparent',
              paddingBottom: '2px',
              transition: 'color 0.2s, border-color 0.2s',
            }}>
              {label}
            </Link>
          ))}
          <Link to="/contact" style={{
            background: settings.primaryColor,
            color: 'white',
            padding: '10px 24px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  )
}
