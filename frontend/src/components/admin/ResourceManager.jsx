import { useState, useEffect } from 'react'
import * as store from '../../data/store'
import { card, input, label, btn, ghostBtn, pageTitle } from './ui'

// Config-driven CRUD manager used for Services, Events, Photos and Blogs.
//
// Props:
//   resource  — store collection key ('services' | 'events' | 'photos' | 'blogs')
//   title, subtitle, addLabel
//   columns   — [{ key, label, render? }]  table columns
//   fields    — [{ key, label, type, options?, default?, full? }]  form fields
//             types: text | textarea | color | select | list
export default function ResourceManager({ resource, title, subtitle, addLabel = 'Add New', columns, fields }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({})
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const refresh = () => setItems(store.getAll(resource))
    refresh()
    return store.subscribe(refresh)
  }, [resource])

  const openAdd = () => {
    const init = {}
    fields.forEach((f) => { init[f.key] = f.type === 'list' ? [] : (f.default ?? (f.type === 'color' ? '#0072CE' : '')) })
    setForm(init); setEditingId(null); setOpen(true)
  }
  const openEdit = (item) => { setForm({ ...item }); setEditingId(item.id); setOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (editingId) payload.id = editingId
    try {
      await store.save(resource, payload)
      setOpen(false)
    } catch (err) {
      alert(err.message || 'Could not save. Please try again.')
    }
  }
  const handleDelete = async (item) => {
    if (window.confirm(`Delete "${item[columns[0].key] || 'this item'}"? This cannot be undone.`)) {
      try {
        await store.remove(resource, item.id)
      } catch (err) {
        alert(err.message || 'Could not delete. Please try again.')
      }
    }
  }
  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={pageTitle}>{title}</h2>
          {subtitle && <p style={{ fontSize: '14px', color: '#888' }}>{subtitle}</p>}
        </div>
        <button onClick={openAdd} style={btn()}>+ {addLabel}</button>
      </div>

      <div style={{ ...card, overflow: 'hidden' }}>
        {items.length === 0 ? (
          <div style={{ padding: '56px', textAlign: 'center', color: '#aaa' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#555' }}>No items yet</div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>Click “{addLabel}” to create the first one.</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {columns.map((c) => (
                    <th key={c.key} style={th}>{c.label}</th>
                  ))}
                  <th style={{ ...th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f4f4f5' }}>
                    {columns.map((c) => (
                      <td key={c.key} style={td}>{c.render ? c.render(item) : String(item[c.key] ?? '—')}</td>
                    ))}
                    <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button onClick={() => openEdit(item)} style={{ ...ghostBtn('#0072CE'), marginRight: '8px' }}>Edit</button>
                      <button onClick={() => handleDelete(item)} style={ghostBtn('#E8192C')}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {open && (
        <div style={overlay} onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D' }}>
                {editingId ? 'Edit' : 'Add'} {title.replace(/s$/, '')}
              </h3>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>×</button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 18px' }}>
                {fields.map((f) => (
                  <div key={f.key} style={{ marginBottom: '16px', gridColumn: f.full || f.type === 'textarea' || f.type === 'list' ? '1 / -1' : 'auto' }}>
                    <label style={label}>{f.label}</label>
                    <FieldInput field={f} value={form[f.key]} onChange={(v) => setField(f.key, v)} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setOpen(false)} style={{ ...ghostBtn('#6b7280'), padding: '10px 20px' }}>Cancel</button>
                <button type="submit" style={btn()}>{editingId ? 'Save Changes' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function FieldInput({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return <textarea value={value || ''} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...input, resize: 'vertical', minHeight: '80px' }} />
  }
  if (field.type === 'list') {
    return (
      <>
        <textarea
          value={Array.isArray(value) ? value.join('\n') : ''}
          onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))}
          rows={5}
          placeholder="One item per line"
          style={{ ...input, resize: 'vertical', minHeight: '110px' }}
        />
        <div style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>One item per line</div>
      </>
    )
  }
  if (field.type === 'select') {
    return (
      <select value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...input, cursor: 'pointer' }}>
        <option value="">Select…</option>
        {field.options.map((o) => {
          const val = typeof o === 'string' ? o : o.value
          const lbl = typeof o === 'string' ? o : o.label
          return <option key={val} value={val}>{lbl}</option>
        })}
      </select>
    )
  }
  if (field.type === 'color') {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input type="color" value={value || '#0072CE'} onChange={(e) => onChange(e.target.value)} style={{ width: '44px', height: '40px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', padding: '2px', background: 'white' }} />
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} style={{ ...input, flex: 1 }} />
      </div>
    )
  }
  return <input value={value || ''} onChange={(e) => onChange(e.target.value)} style={input} />
}

const th = { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f0f0f0', whiteSpace: 'nowrap' }
const td = { padding: '14px 16px', fontSize: '13px', color: '#333', verticalAlign: 'middle' }
const overlay = { position: 'fixed', inset: 0, background: 'rgba(10,31,61,0.55)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '48px 24px', zIndex: 2000, overflowY: 'auto' }
const modal = { background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '620px', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }
