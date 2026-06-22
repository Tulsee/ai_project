import ResourceManager from '../../components/admin/ResourceManager'

export default function Services() {
  return (
    <ResourceManager
      resource="services"
      title="Service Portfolio"
      subtitle="Manage the solutions shown on the Home and Solutions pages."
      addLabel="Add Service"
      columns={[
        { key: 'title', label: 'Title', render: (i) => (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>{i.icon}</span>
            <strong style={{ color: '#0A1F3D' }}>{i.title}</strong>
          </span>
        ) },
        { key: 'badge', label: 'Badge' },
        { key: 'color', label: 'Accent', render: (i) => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '4px', background: i.color, display: 'inline-block' }} />
            {i.color}
          </span>
        ) },
        { key: 'features', label: 'Features', render: (i) => `${(i.features || []).length} items` },
      ]}
      fields={[
        { key: 'icon', label: 'Icon (emoji)', type: 'text', default: '⚡' },
        { key: 'badge', label: 'Badge', type: 'text' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'color', label: 'Accent Color', type: 'color', default: '#E8192C' },
        { key: 'desc', label: 'Description', type: 'textarea' },
        { key: 'features', label: 'Features', type: 'list' },
      ]}
    />
  )
}
