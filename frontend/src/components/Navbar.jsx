import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import * as store from '../data/store'
import LogoMark from './LogoMark'
import { useMediaQuery } from '../hooks/useMediaQuery'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/industries', label: 'Industries' },
  { path: '/testimonials', label: 'Testimonials' },
  { path: '/articles', label: 'Articles' },
  { path: '/gallery', label: 'Gallery' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState(store.getSettings)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 860px)')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => store.subscribe(() => setSettings(store.getSettings())), [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => setMenuOpen(false), [location.pathname])

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
          <LogoMark settings={settings} boxColor={settings.darkColor} />
          <span style={{
            fontSize: '20px', fontWeight: '800',
            fontFamily: 'Montserrat, sans-serif', color: settings.darkColor,
          }}>
            {settings.siteName}<span style={{ color: settings.primaryColor }}>.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {!isMobile && (
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
        )}

        {/* Mobile hamburger toggle */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px',
              width: '44px', height: '44px', padding: '10px', flexShrink: 0,
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', height: '2.5px', borderRadius: '2px',
                background: settings.darkColor, transition: 'transform 0.25s, opacity 0.25s',
                transform: menuOpen
                  ? (i === 0 ? 'translateY(7.5px) rotate(45deg)' : i === 2 ? 'translateY(-7.5px) rotate(-45deg)' : 'none')
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        )}
      </div>

      {/* Mobile dropdown panel */}
      {isMobile && menuOpen && (
        <div style={{
          borderTop: '1px solid #eee',
          background: 'white',
          padding: '12px 24px 20px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          boxShadow: '0 12px 24px rgba(0,0,0,0.10)',
          animation: 'fadeInUp 0.2s ease',
        }}>
          {NAV_LINKS.map(({ path, label }) => (
            <Link key={path} to={path} style={{
              fontSize: '15px', fontWeight: '500',
              color: isActive(path) ? settings.primaryColor : '#333',
              padding: '12px 4px',
              borderBottom: '1px solid #f3f3f3',
            }}>
              {label}
            </Link>
          ))}
          <Link to="/contact" style={{
            background: settings.primaryColor,
            color: 'white',
            padding: '13px 24px',
            borderRadius: '25px',
            fontSize: '15px',
            fontWeight: '600',
            textAlign: 'center',
            marginTop: '12px',
          }}>
            Contact Us
          </Link>
        </div>
      )}
    </nav>
  )
}
