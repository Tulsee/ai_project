import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'

export default function Gallery() {
  const [photos, setPhotos] = useState(() => store.getAll('photos'))
  const [events, setEvents] = useState(() => store.getAll('events'))
  useEffect(() => store.subscribe(() => {
    setPhotos(store.getAll('photos'))
    setEvents(store.getAll('events'))
  }), [])

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(232,25,44,0.25)', color: '#E8192C', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>GALLERY & EVENTS</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>Our Moments & Events</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          Conferences, workshops, and milestones that define our journey.
        </p>
      </section>

      {/* Photo Grid */}
      <section style={{ background: '#F5F6F8', padding: '72px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '32px' }}>Photo Gallery</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {photos.map((photo, i) => (
              <div key={i} style={{
                borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                gridColumn: i === 0 ? 'span 2' : undefined,
                height: i === 0 ? '280px' : '200px',
                background: photo.gradient,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', position: 'relative',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.9 }}>{photo.icon}</div>
                <div style={{ color: 'white', fontWeight: '700', fontSize: '16px', fontFamily: 'Montserrat, sans-serif', textAlign: 'center', padding: '0 16px' }}>{photo.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginTop: '6px' }}>{photo.subtitle}</div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '24px' }}>
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
