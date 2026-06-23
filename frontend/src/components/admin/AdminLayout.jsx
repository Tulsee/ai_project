import { useState, useEffect } from 'react'
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import * as store from '../../data/store'
import LogoMark from '../LogoMark'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '📬' },
  { to: '/admin/services', label: 'Services', icon: '⚙️' },
  { to: '/admin/events', label: 'Events', icon: '📅' },
  { to: '/admin/articles', label: 'Articles', icon: '📝' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { to: '/admin/banners', label: 'Banners', icon: '🏷️' },
  { to: '/admin/settings', label: 'Settings', icon: '🔧' },
]

export default function AdminLayout() {
  const [loggedIn, setLoggedIn] = useState(() => store.isAuthed())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = useMediaQuery('(max-width: 860px)')
  const settings = store.getSettings()

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setDrawerOpen(false), [location.pathname])

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />

  const logout = () => {
    store.logout()
    setLoggedIn(false)
    navigate('/admin')
  }

  const sidebar = (
    <aside style={{
      width: '248px',
      background: '#0A1F3D',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      ...(isMobile
        ? {
            position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 1300,
            transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.28s ease',
            boxShadow: drawerOpen ? '4px 0 32px rgba(0,0,0,0.35)' : 'none',
          }
        : { position: 'sticky', top: 0, height: '100vh' }),
    }}>
      <div style={{ padding: '24px 24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <LogoMark settings={settings} boxColor="#E8192C" size={38} />
        <div>
          <div style={{ fontWeight: 800, fontFamily: 'Montserrat, sans-serif', fontSize: '15px', lineHeight: 1.1 }}>{settings.siteName}</div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Admin Panel</div>
        </div>
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            style={{
              marginLeft: 'auto', flexShrink: 0,
              width: '34px', height: '34px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              color: 'white', fontSize: '20px', lineHeight: 1,
            }}
          >
            ✕
          </button>
        )}
      </div>

      <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '10px', marginBottom: '4px',
              fontSize: '14px', fontWeight: 500,
              color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
              background: isActive ? '#E8192C' : 'transparent',
              transition: 'background 0.15s, color 0.15s',
            })}
          >
            <span style={{ fontSize: '18px' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.65)' }}>
          <span style={{ fontSize: '16px' }}>🌐</span> View Website
        </Link>
        <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.65)', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', textAlign: 'left' }}>
          <span style={{ fontSize: '16px' }}>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F6F8' }}>
      {sidebar}

      {/* Drawer backdrop (mobile only) */}
      {isMobile && drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.5)', zIndex: 1200 }}
        />
      )}

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, maxWidth: '100%', overflowX: 'hidden' }}>
        {/* Mobile top bar */}
        {isMobile && (
          <div style={{
            position: 'sticky', top: 0, zIndex: 1100,
            display: 'flex', alignItems: 'center', gap: '14px',
            background: 'white', borderBottom: '1px solid #eee',
            padding: '12px 16px',
          }}>
            <button
              onClick={() => setDrawerOpen(o => !o)}
              aria-label="Open menu"
              style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px',
                width: '40px', height: '40px', padding: '9px',
                background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{ display: 'block', height: '2.5px', borderRadius: '2px', background: '#0A1F3D' }} />
              ))}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <LogoMark settings={settings} boxColor="#E8192C" size={32} />
              <span style={{ fontWeight: 800, fontFamily: 'Montserrat, sans-serif', fontSize: '15px', color: '#0A1F3D' }}>
                {settings.siteName}
              </span>
            </div>
          </div>
        )}

        <div style={{ padding: isMobile ? '20px 16px' : '32px 40px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
