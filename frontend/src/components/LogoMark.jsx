// Renders the brand mark: an uploaded logo image when logoType === 'image',
// otherwise the logo letter inside a coloured box. The site name is rendered
// separately by each caller (Navbar / Footer / AdminLayout) since its colour
// differs per context.
export default function LogoMark({ settings, boxColor = '#0A1F3D', size = 36 }) {
  if (settings.logoType === 'image' && settings.logoImage) {
    return (
      <img
        src={settings.logoImage}
        alt={settings.siteName || 'Logo'}
        style={{ height: size, width: 'auto', maxWidth: size * 3.4, objectFit: 'contain', borderRadius: '8px', display: 'block' }}
      />
    )
  }
  return (
    <div style={{ width: size, height: size, background: boxColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: Math.round(size * 0.5), fontFamily: 'Montserrat, sans-serif', flexShrink: 0 }}>
      {settings.logoLetter}
    </div>
  )
}
