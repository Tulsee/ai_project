import ResourceManager from '../../components/admin/ResourceManager'

export default function Articles() {
  return (
    <ResourceManager
      resource="blogs"
      title="Articles"
      subtitle="Manage the insight articles shown on the public Articles page."
      addLabel="Add Article"
      columns={[
        { key: 'title', label: 'Title', render: (i) => <strong style={{ color: '#0A1F3D' }}>{i.title}</strong> },
        { key: 'category', label: 'Category', render: (i) => (
          <span style={{ background: `${i.categoryColor}18`, color: i.categoryColor, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>{i.category}</span>
        ) },
        { key: 'author', label: 'Author', render: (i) => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ position: 'relative', width: '28px', height: '28px', borderRadius: '50%', background: '#0A1F3D', color: 'white', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {(i.author || '?').charAt(0)}
              {i.authorImage && <img src={i.authorImage} alt={i.author} onError={(e) => { e.currentTarget.style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
            </span>
            {i.author}
          </span>
        ) },
        { key: 'date', label: 'Date' },
      ]}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'category', label: 'Category', type: 'text' },
        { key: 'categoryColor', label: 'Category Color', type: 'color', default: '#0072CE' },
        { key: 'borderColor', label: 'Top Border Color', type: 'color', default: '#0072CE' },
        { key: 'excerpt', label: 'Excerpt', type: 'textarea' },
        { key: 'author', label: 'Author', type: 'text' },
        { key: 'authorImage', label: 'Author Photo', type: 'image', full: true },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'readTime', label: 'Read Time', type: 'text', default: '5 min read' },
      ]}
    />
  )
}
