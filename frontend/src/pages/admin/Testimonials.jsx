import ResourceManager from '../../components/admin/ResourceManager'

const CATEGORIES = ['ERP', 'CRM', 'Healthcare', 'Manufacturing', 'Retail', 'Education']

export default function Testimonials() {
  return (
    <ResourceManager
      resource="testimonials"
      title="Testimonials"
      subtitle="Manage the client testimonials shown on the Home and Testimonials pages."
      addLabel="Add Testimonial"
      columns={[
        { key: 'name', label: 'Client', render: (i) => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ position: 'relative', width: '34px', height: '34px', borderRadius: '50%', background: '#0A1F3D', color: 'white', fontSize: '13px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {(i.name || '?').charAt(0)}
              {i.image && <img src={i.image} alt={i.name} onError={(e) => { e.currentTarget.style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
            </span>
            <span>
              <strong style={{ color: '#0A1F3D', display: 'block' }}>{i.name}</strong>
              <span style={{ fontSize: '12px', color: '#888' }}>{i.title}</span>
            </span>
          </span>
        ) },
        { key: 'company', label: 'Company' },
        { key: 'rating', label: 'Rating', render: (i) => <span style={{ color: '#E8192C' }}>{'★'.repeat(i.rating || 0)}</span> },
        { key: 'category', label: 'Category' },
      ]}
      fields={[
        { key: 'name', label: 'Client Name', type: 'text' },
        { key: 'title', label: 'Job Title', type: 'text' },
        { key: 'company', label: 'Company', type: 'text' },
        { key: 'country', label: 'Location', type: 'text' },
        { key: 'rating', label: 'Rating (1–5)', type: 'number', min: 1, max: 5, default: 5 },
        { key: 'category', label: 'Category', type: 'select', options: CATEGORIES, default: 'ERP' },
        { key: 'text', label: 'Testimonial', type: 'textarea' },
        { key: 'image', label: 'Client Photo', type: 'image', full: true },
      ]}
    />
  )
}
