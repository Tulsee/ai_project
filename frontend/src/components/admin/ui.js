// Shared style helpers for the admin UI.

export const card = {
  background: 'white',
  borderRadius: '14px',
  boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
}

export const input = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  background: 'white',
}

export const label = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#374151',
  marginBottom: '6px',
}

export const btn = (color = '#E8192C') => ({
  background: color,
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
})

export const ghostBtn = (color = '#0072CE') => ({
  background: `${color}15`,
  color,
  border: `1px solid ${color}40`,
  padding: '7px 14px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Inter, sans-serif',
})

export const pageTitle = {
  fontSize: '24px',
  fontWeight: 700,
  fontFamily: 'Montserrat, sans-serif',
  color: '#0A1F3D',
  marginBottom: '6px',
}
