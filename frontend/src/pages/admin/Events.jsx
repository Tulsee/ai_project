import ResourceManager from '../../components/admin/ResourceManager'

export default function Events() {
  return (
    <ResourceManager
      resource="events"
      title="Events Timeline"
      subtitle="Upcoming events and conferences shown on the Gallery page."
      addLabel="Add Event"
      columns={[
        { key: 'title', label: 'Event', render: (i) => (
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>{i.icon}</span>
            <strong style={{ color: '#0A1F3D' }}>{i.title}</strong>
          </span>
        ) },
        { key: 'date', label: 'Date' },
        { key: 'location', label: 'Location' },
        { key: 'badge', label: 'Status', render: (i) => (
          <span style={{ background: `${i.badgeColor}18`, color: i.badgeColor, padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>{i.badge}</span>
        ) },
      ]}
      fields={[
        { key: 'icon', label: 'Icon (emoji)', type: 'text', default: '🌐' },
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'badge', label: 'Status Badge', type: 'select', options: ['Open Registration', 'Free to Attend', 'Coming Soon', 'Sold Out'], default: 'Coming Soon' },
        { key: 'badgeColor', label: 'Badge Color', type: 'color', default: '#d97706' },
        { key: 'desc', label: 'Description', type: 'textarea' },
      ]}
    />
  )
}
