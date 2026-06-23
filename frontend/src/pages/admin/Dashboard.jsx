import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../../data/store'
import { card, pageTitle } from '../../components/admin/ui'
import { BarChart, AreaChart, Donut } from '../../components/admin/Charts'

const PALETTE = ['#0072CE', '#E8192C', '#059669', '#7c3aed', '#d97706', '#0A1F3D']

export default function Dashboard() {
  const [data, setData] = useState({ services: [], events: [], photos: [], blogs: [], testimonials: [], inquiries: [] })

  useEffect(() => {
    const load = () => setData({
      services: store.getAll('services'),
      events: store.getAll('events'),
      photos: store.getAll('photos'),
      blogs: store.getAll('blogs'),
      testimonials: store.getAll('testimonials'),
      inquiries: store.getAll('inquiries'),
    })
    load()
    return store.subscribe(load)
  }, [])

  const { services, events, photos, blogs, testimonials, inquiries } = data
  const thisWeek = inquiries.filter((q) => Date.now() - new Date(q.date) < 7 * 86400000).length

  const stats = [
    { label: 'Total Inquiries', value: inquiries.length, icon: '📬', color: '#E8192C', to: '/admin/inquiries' },
    { label: 'Inquiries / 7d', value: thisWeek, icon: '📈', color: '#0A1F3D', to: '/admin/inquiries' },
    { label: 'Services', value: services.length, icon: '⚙️', color: '#0072CE', to: '/admin/services' },
    { label: 'Events', value: events.length, icon: '📅', color: '#059669', to: '/admin/events' },
    { label: 'Articles', value: blogs.length, icon: '📝', color: '#d97706', to: '/admin/articles' },
    { label: 'Photos', value: photos.length, icon: '🖼️', color: '#7c3aed', to: '/admin/gallery' },
    { label: 'Testimonials', value: testimonials.length, icon: '💬', color: '#E8192C', to: '/admin/testimonials' },
  ]

  // Content overview (bar chart)
  const contentBars = [
    { label: 'Services', value: services.length, color: '#0072CE' },
    { label: 'Events', value: events.length, color: '#059669' },
    { label: 'Photos', value: photos.length, color: '#7c3aed' },
    { label: 'Articles', value: blogs.length, color: '#d97706' },
    { label: 'Reviews', value: testimonials.length, color: '#E8192C' },
  ]

  // Inquiries over the last 8 weeks (area chart)
  const WEEKS = 8
  const weekMs = 7 * 86400000
  const now = Date.now()
  const trend = []
  for (let i = WEEKS - 1; i >= 0; i--) {
    const end = now - i * weekMs
    const start = end - weekMs
    const value = inquiries.filter((q) => {
      const t = new Date(q.date).getTime()
      return t > start && t <= end
    }).length
    trend.push({ label: new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), value })
  }

  // Inquiries by country (donut + legend)
  const byCountry = {}
  inquiries.forEach((q) => { if (q.country) byCountry[q.country] = (byCountry[q.country] || 0) + 1 })
  const countries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 6)
  const countrySegments = countries.map(([label, value], i) => ({ label, value, color: PALETTE[i % PALETTE.length] }))

  const recent = inquiries.slice().reverse().slice(0, 5)

  return (
    <div>
      <h2 style={pageTitle}>Dashboard</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '28px' }}>Overview of your website content and customer inquiries.</p>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((s) => (
          <Link key={s.label} to={s.to} style={{ ...card, padding: '20px', borderTop: `3px solid ${s.color}`, display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '30px', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>{s.label}</div>
              </div>
              <div style={{ fontSize: '22px' }}>{s.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Trend + country */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        <div style={{ ...card, padding: '24px' }}>
          <h3 style={sectionTitle}>Inquiries — Last 8 Weeks</h3>
          <p style={subText}>New customer inquiries received per week.</p>
          <AreaChart points={trend} color="#0072CE" />
        </div>

        <div style={{ ...card, padding: '24px' }}>
          <h3 style={sectionTitle}>Inquiries by Country</h3>
          {countrySegments.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#aaa', padding: '20px 0' }}>No data yet.</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '12px', flexWrap: 'wrap' }}>
              <Donut segments={countrySegments} />
              <div style={{ flex: 1, minWidth: '120px' }}>
                {countrySegments.map((s) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: s.color, flexShrink: 0 }} />
                    <span style={{ color: '#555', flex: 1 }}>{s.label}</span>
                    <span style={{ fontWeight: 700, color: '#0A1F3D' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content overview + recent inquiries */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div style={{ ...card, padding: '24px' }}>
          <h3 style={sectionTitle}>Content Overview</h3>
          <p style={subText}>Published items by section.</p>
          <BarChart data={contentBars} />
        </div>

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
      </div>
    </div>
  )
}

const sectionTitle = { fontSize: '16px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D' }
const subText = { fontSize: '12px', color: '#aaa', margin: '2px 0 16px' }
