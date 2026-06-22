import { useState, useEffect } from 'react'
import * as store from '../../data/store'
import { card, btn, ghostBtn, pageTitle } from '../../components/admin/ui'

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const refresh = () => setInquiries(store.getAll('inquiries'))
    refresh()
    return store.subscribe(refresh)
  }, [])

  const filtered = inquiries
    .filter((q) => [q.name, q.email, q.company, q.country].some((v) => v?.toLowerCase().includes(search.toLowerCase())))
    .slice().reverse()

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Country', 'Job Title', 'Details', 'Date']
    const rows = inquiries.map((q) => [q.name, q.email, q.phone, q.company, q.country, q.jobTitle, (q.details || '').replace(/,/g, ';'), new Date(q.date).toLocaleDateString()])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v || ''}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a')
    a.href = url; a.download = 'inquiries.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const deleteOne = async (q) => {
    if (window.confirm(`Delete inquiry from ${q.name}?`)) {
      try { await store.remove('inquiries', q.id) } catch (err) { alert(err.message || 'Delete failed.') }
    }
  }
  const clearAll = async () => {
    if (window.confirm('Delete ALL inquiries? This cannot be undone.')) {
      try { await store.clear('inquiries') } catch (err) { alert(err.message || 'Clear failed.') }
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={pageTitle}>Customer Inquiries</h2>
          <p style={{ fontSize: '14px', color: '#888' }}>Messages submitted through the contact form.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={exportCSV} style={btn('#0072CE')}>Export CSV</button>
          <button onClick={clearAll} style={ghostBtn('#E8192C')}>Clear All</button>
        </div>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0A1F3D' }}>{filtered.length} inquir{filtered.length === 1 ? 'y' : 'ies'}</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, company…" style={{ padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', width: '280px', fontFamily: 'Inter, sans-serif' }} />
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#aaa' }}>
            <div style={{ fontSize: '44px', marginBottom: '10px' }}>📭</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#555' }}>No inquiries found</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Name', 'Email', 'Phone', 'Company', 'Country', 'Job Title', 'Date', 'Details', ''].map((h, i) => (
                    <th key={i} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ ...td, fontWeight: 600, color: '#0A1F3D' }}>{q.name}</td>
                    <td style={{ ...td, color: '#0072CE' }}>{q.email}</td>
                    <td style={td}>{q.phone || '—'}</td>
                    <td style={td}>{q.company}</td>
                    <td style={td}>{q.country || '—'}</td>
                    <td style={td}>{q.jobTitle || '—'}</td>
                    <td style={{ ...td, color: '#aaa', whiteSpace: 'nowrap' }}>{q.date ? new Date(q.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}</td>
                    <td style={{ ...td, maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={q.details}>{q.details}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      <button onClick={() => deleteOne(q)} style={ghostBtn('#E8192C')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const th = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }
const td = { padding: '14px 16px', fontSize: '13px', color: '#333' }
