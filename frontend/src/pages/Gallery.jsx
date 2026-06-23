import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'
import PageHero from '../components/PageHero'
import { useIsMobile } from '../hooks/useMediaQuery'

export default function Gallery() {
  const [photos, setPhotos] = useState(() => store.getAll('photos'))
  const [events, setEvents] = useState(() => store.getAll('events'))
  const [settings, setSettings] = useState(() => store.getSettings())
  const isMobile = useIsMobile()
  useEffect(() => store.subscribe(() => {
    setPhotos(store.getAll('photos'))
    setEvents(store.getAll('events'))
    setSettings(store.getSettings())
  }), [])

  return (
    <div>
      <PageHero page="gallery" settings={settings} />

      {/* Photo Grid */}
      <section style={{ background: '#F5F6F8', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '32px' }}>Photo Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {photos.map((photo, i) => (
              <div key={i} style={{
                borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                gridColumn: i === 0 && !isMobile ? 'span 2' : undefined,
                height: i === 0 && !isMobile ? '280px' : '200px',
                background: '#e5e7eb',
                cursor: 'pointer', position: 'relative',
              }}>
                {photo.image && (
                  <img
                    src={photo.image}
                    alt={photo.title}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 16px 14px', background: 'linear-gradient(to top, rgba(10,31,61,0.85), rgba(10,31,61,0))' }}>
                  <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', fontFamily: 'Montserrat, sans-serif' }}>{photo.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginTop: '4px' }}>{photo.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(232,25,44,0.1)', color: '#E8192C', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px' }}>UPCOMING</div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D' }}>Events & Conferences</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {events.map((ev, i) => (
              <div key={i} style={{ background: '#F5F6F8', borderRadius: '14px', padding: '28px', borderLeft: '4px solid #E8192C', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '52px', height: '52px', background: '#0A1F3D', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{ev.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0A1F3D', fontFamily: 'Montserrat, sans-serif' }}>{ev.title}</h3>
                    <span style={{ background: `${ev.badgeColor}18`, color: ev.badgeColor, padding: '2px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{ev.badge}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#E8192C', fontWeight: '600', marginBottom: '4px' }}>📅 {ev.date}</div>
                  <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>📍 {ev.location}</div>
                  <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.65 }}>{ev.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
