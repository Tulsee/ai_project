import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import AdminLogin from './AdminLogin'
import * as store from '../../data/store'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/inquiries', label: 'Inquiries', icon: '📬' },
  { to: '/admin/services', label: 'Services', icon: '⚙️' },
  { to: '/admin/events', label: 'Events', icon: '📅' },
  { to: '/admin/content', label: 'Photos & Blogs', icon: '🖼️' },
  { to: '/admin/settings', label: 'Settings', icon: '🔧' },
]

export default function AdminLayout() {
  const [loggedIn, setLoggedIn] = useState(() => store.isAuthed())
  const navigate = useNavigate()
  const settings = store.getSettings()

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />

  const logout = () => {
    store.logout()
    setLoggedIn(false)
    navigate('/admin')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F6F8' }}>
      {/* Sidebar */}
      <aside style={{ width: '248px', background: '#0A1F3D', color: 'white', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <div style={{ padding: '24px 24px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '38px', height: '38px', background: '#E8192C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '20px', fontFamily: 'Montserrat, sans-serif' }}>
            {settings.logoLetter}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontFamily: 'Montserrat, sans-serif', fontSize: '15px', lineHeight: 1.1 }}>{settings.siteName}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>Admin Panel</div>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
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

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 40px', maxWidth: '100%', overflowX: 'hidden' }}>
        <Outlet />
      </main>
    </div>
  )
}
