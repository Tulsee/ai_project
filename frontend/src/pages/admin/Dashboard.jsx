import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../../data/store'
import { card, pageTitle } from '../../components/admin/ui'

export default function Dashboard() {
  const [data, setData] = useState({ services: [], events: [], photos: [], blogs: [], inquiries: [] })

  useEffect(() => {
    const load = () => setData({
      services: store.getAll('services'),
      events: store.getAll('events'),
      photos: store.getAll('photos'),
      blogs: store.getAll('blogs'),
      inquiries: store.getAll('inquiries'),
    })
    load()
    return store.subscribe(load)
  }, [])

  const { services, events, photos, blogs, inquiries } = data
  const thisWeek = inquiries.filter((q) => Date.now() - new Date(q.date) < 7 * 86400000).length

  const stats = [
    { label: 'Total Inquiries', value: inquiries.length, icon: '📬', color: '#E8192C', to: '/admin/inquiries' },
    { label: 'Services', value: services.length, icon: '⚙️', color: '#0072CE', to: '/admin/services' },
    { label: 'Events', value: events.length, icon: '📅', color: '#059669', to: '/admin/events' },
    { label: 'Photos', value: photos.length, icon: '🖼️', color: '#7c3aed', to: '/admin/content' },
    { label: 'Blog Posts', value: blogs.length, icon: '📝', color: '#d97706', to: '/admin/content' },
    { label: 'Inquiries / 7d', value: thisWeek, icon: '📈', color: '#0A1F3D', to: '/admin/inquiries' },
  ]

  // Inquiries by country
  const byCountry = {}
  inquiries.forEach((q) => { if (q.country) byCountry[q.country] = (byCountry[q.country] || 0) + 1 })
  const countries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const maxCountry = Math.max(1, ...countries.map(([, n]) => n))

  const recent = inquiries.slice().reverse().slice(0, 5)

  return (
    <div>
      <h2 style={pageTitle}>Dashboard</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>Overview of your website content and customer inquiries.</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map((s) => (
          <Link key={s.label} to={s.to} style={{ ...card, padding: '20px', borderTop: `3px solid ${s.color}`, display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '32px', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>{s.label}</div>
              </div>
              <div style={{ fontSize: '24px' }}>{s.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
        {/* Recent inquiries */}
        <div style={{ ...card, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={sectionTitle}>Recent Inquiries</h3>
            <Link to="/admin/inquiries" style={{ fontSize: '13px', color: '#0072CE', fontWeight: 600 }}>View all →</Link>
          </div>
          {recent.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#aaa', padding: '20px 0' }}>No inquiries yet.</p>
          ) : (
            recent.map((q) => (
              <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f4f4f5' }}>
                <div style={{ width: '38px', height: '38px', background: '#0A1F3D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>{(q.name || '?').charAt(0)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#0A1F3D' }}>{q.name} <span style={{ color: '#aaa', fontWeight: 400 }}>· {q.company}</span></div>
                  <div style={{ fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.details}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#bbb', whiteSpace: 'nowrap' }}>{new Date(q.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
              </div>
            ))
          )}
        </div>

        {/* By country */}
        <div style={{ ...card, padding: '24px' }}>
          <h3 style={{ ...sectionTitle, marginBottom: '18px' }}>Inquiries by Country</h3>
          {countries.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#aaa', padding: '20px 0' }}>No data yet.</p>
          ) : (
            countries.map(([country, n]) => (
              <div key={country} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '5px' }}>
                  <span>{country}</span><span style={{ fontWeight: 600 }}>{n}</span>
                </div>
                <div style={{ height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(n / maxCountry) * 100}%`, background: '#0072CE', borderRadius: '4px' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const sectionTitle = { fontSize: '16px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D' }
