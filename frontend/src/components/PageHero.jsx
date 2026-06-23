import * as store from '../data/store'

// Shared page banner / hero. Reads its text + text colour from
// settings.heroes[page] (admin-editable) and its background image from the
// matching banner setting. The badge "pill" uses the solid primary colour with
// white text so it stays clearly visible over any photo.
const BANNER_KEY = {
  home: 'bannerHome',
  services: 'bannerSolutions',
  industries: 'bannerIndustries',
  testimonials: 'bannerTestimonials',
  articles: 'bannerArticles',
  gallery: 'bannerGallery',
}

export default function PageHero({ page, settings }) {
  const hero = (settings.heroes && settings.heroes[page]) || {}
  const banner = settings[BANNER_KEY[page]]
  const color = hero.textColor || '#ffffff'

  return (
    <section style={{ background: store.bannerBg(banner), padding: '80px 24px', textAlign: 'center' }}>
      {hero.badge && (
        <div style={{ display: 'inline-block', background: settings.primaryColor, color: '#ffffff', padding: '7px 18px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, letterSpacing: '1px', marginBottom: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>
          {hero.badge}
        </div>
      )}
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, fontFamily: 'Montserrat, sans-serif', color, marginBottom: '16px', textShadow: '0 2px 18px rgba(0,0,0,0.4)' }}>
        {hero.title}
      </h1>
      {hero.subtitle && (
        <p style={{ fontSize: '18px', color, opacity: 0.92, maxWidth: '560px', margin: '0 auto', lineHeight: 1.7, textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}>
          {hero.subtitle}
        </p>
      )}
    </section>
  )
}
