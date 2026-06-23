import ResourceManager from '../../components/admin/ResourceManager'

export default function Gallery() {
  return (
    <ResourceManager
      resource="photos"
      title="Gallery Photos"
      subtitle="Manage the photos shown on the public Gallery page."
      addLabel="Add Photo"
      columns={[
        { key: 'preview', label: 'Preview', render: (i) => (
          i.image
            ? <img src={i.image} alt={i.title} style={{ width: '64px', height: '40px', borderRadius: '6px', objectFit: 'cover', display: 'block' }} />
            : <div style={{ width: '64px', height: '40px', borderRadius: '6px', background: '#e5e7eb' }} />
        ) },
        { key: 'title', label: 'Title', render: (i) => <strong style={{ color: '#0A1F3D' }}>{i.title}</strong> },
        { key: 'subtitle', label: 'Subtitle' },
      ]}
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle / Location', type: 'text' },
        { key: 'image', label: 'Photo', type: 'image', full: true },
      ]}
    />
  )
}
