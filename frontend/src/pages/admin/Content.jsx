import { useState } from 'react'
import ResourceManager from '../../components/admin/ResourceManager'
import { pageTitle } from '../../components/admin/ui'

const GRADIENTS = [
  { value: 'linear-gradient(135deg, #0A1F3D, #0072CE)', label: 'Navy → Blue' },
  { value: 'linear-gradient(135deg, #E8192C, #b01020)', label: 'Red' },
  { value: 'linear-gradient(135deg, #7c3aed, #4f46e5)', label: 'Purple' },
  { value: 'linear-gradient(135deg, #059669, #047857)', label: 'Green' },
  { value: 'linear-gradient(135deg, #d97706, #b45309)', label: 'Amber' },
]

export default function Content() {
  const [tab, setTab] = useState('photos')

  return (
    <div>
      <h2 style={pageTitle}>Photos & Blogs</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '20px' }}>Manage gallery photos and blog articles shown on the public site.</p>

      <div style={{ display: 'inline-flex', background: '#eef0f3', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
        {[{ id: 'photos', label: '🖼️ Photos' }, { id: 'blogs', label: '📝 Blogs' }].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '8px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600, fontFamily: 'Inter, sans-serif',
              background: tab === t.id ? 'white' : 'transparent',
              color: tab === t.id ? '#0A1F3D' : '#888',
              boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'photos' ? (
        <ResourceManager
          resource="photos"
          title="Gallery Photos"
          addLabel="Add Photo"
          columns={[
            { key: 'preview', label: 'Preview', render: (i) => (
              <div style={{ width: '64px', height: '40px', borderRadius: '6px', background: i.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{i.icon}</div>
            ) },
            { key: 'title', label: 'Title', render: (i) => <strong style={{ color: '#0A1F3D' }}>{i.title}</strong> },
            { key: 'subtitle', label: 'Subtitle' },
          ]}
          fields={[
            { key: 'icon', label: 'Icon (emoji)', type: 'text', default: '🌐' },
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'subtitle', label: 'Subtitle / Location', type: 'text' },
            { key: 'gradient', label: 'Background', type: 'select', options: GRADIENTS, default: GRADIENTS[0].value },
          ]}
        />
      ) : (
        <ResourceManager
          resource="blogs"
          title="Blog Posts"
          addLabel="Add Post"
          columns={[
            { key: 'title', label: 'Title', render: (i) => <strong style={{ color: '#0A1F3D' }}>{i.title}</strong> },
            { key: 'category', label: 'Category', render: (i) => (
              <span style={{ background: `${i.categoryColor}18`, color: i.categoryColor, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>{i.category}</span>
            ) },
            { key: 'author', label: 'Author' },
            { key: 'date', label: 'Date' },
          ]}
          fields={[
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'category', label: 'Category', type: 'text' },
            { key: 'categoryColor', label: 'Category Color', type: 'color', default: '#0072CE' },
            { key: 'borderColor', label: 'Top Border Color', type: 'color', default: '#0072CE' },
            { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
            { key: 'author', label: 'Author', type: 'text' },
            { key: 'date', label: 'Date', type: 'text' },
            { key: 'readTime', label: 'Read Time', type: 'text', default: '5 min read' },
          ]}
        />
      )}
    </div>
  )
}
