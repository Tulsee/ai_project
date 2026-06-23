import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'
import { openAssistant } from '../components/Chatbot'

const INDUSTRY_HIGHLIGHTS = [
  { icon: '🏦', title: 'Banking & Finance', metric: '40%', label: 'Cost Reduction', desc: 'Modernizing financial operations with AI-driven automation and compliance tools.' },
  { icon: '🏥', title: 'Healthcare', metric: '60%', label: 'Efficiency Boost', desc: 'Transforming patient care with intelligent healthcare management systems.' },
  { icon: '🛍️', title: 'Retail', metric: '35%', label: 'Revenue Growth', desc: 'Driving retail success through omnichannel and personalised customer experiences.' },
  { icon: '🏭', title: 'Manufacturing', metric: '50%', label: 'Downtime Reduction', desc: 'Smart manufacturing services for operational excellence and quality control.' },
  { icon: '🎓', title: 'Education', metric: '70%', label: 'Engagement Increase', desc: 'Revolutionising learning with AI-powered educational technology platforms.' },
]

function SectionLabel({ children, dark }) {
  return (
    <div style={{
      display: 'inline-block',
      background: dark ? 'rgba(232,25,44,0.2)' : 'rgba(232,25,44,0.1)',
      color: '#E8192C',
      padding: '6px 16px', borderRadius: '20px',
      fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '16px',
    }}>{children}</div>
  )
}

function SolutionCard({ sol }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white', borderRadius: '12px', padding: '32px',
        boxShadow: hovered ? '0 12px 36px rgba(0,0,0,0.13)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s', borderTop: '3px solid #E8192C',
      }}>
      <div style={{ fontSize: '32px', marginBottom: '14px' }}>{sol.icon}</div>
      <div style={{ display: 'inline-block', background: 'rgba(0,114,206,0.1)', color: '#0072CE', padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700', marginBottom: '12px' }}>{sol.badge}</div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0A1F3D', marginBottom: '10px', fontFamily: 'Montserrat, sans-serif' }}>{sol.title}</h3>
      <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.65, marginBottom: '18px' }}>{sol.desc}</p>
      <ul style={{ padding: 0, marginBottom: '20px' }}>
        {sol.features.map(f => (
          <li key={f} style={{ fontSize: '13px', color: '#555', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#E8192C', fontWeight: '700', fontSize: '15px' }}>✓</span> {f}
          </li>
        ))}
      </ul>
      <Link to="/services" style={{ color: '#E8192C', fontSize: '14px', fontWeight: '600' }}>Learn More →</Link>
    </div>
  )
}

function IndustryCard({ ind }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(232,25,44,0.15)' : 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px', padding: '28px 18px', textAlign: 'center',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.25s',
      }}>
      <div style={{ fontSize: '28px', marginBottom: '12px' }}>{ind.icon}</div>
      <div style={{ fontSize: '30px', fontWeight: '900', color: '#E8192C', fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>{ind.metric}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '5px 0 10px' }}>{ind.label}</div>
      <div style={{ fontSize: '13px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{ind.title}</div>
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{ind.desc}</p>
    </div>
  )
}

export default function Home() {
  const [services, setSolutions] = useState(() => store.getAll('services').slice(0, 6))
  const [settings, setSettings] = useState(() => store.getSettings())
  const [testimonials, setTestimonials] = useState(() => store.getAll('testimonials').slice(0, 3))
  useEffect(() => store.subscribe(() => {
    setSolutions(store.getAll('services').slice(0, 6))
    setSettings(store.getSettings())
    setTestimonials(store.getAll('testimonials').slice(0, 3))
  }), [])

  const hero = (settings.heroes && settings.heroes.home) || {}
  const heroColor = hero.textColor || '#ffffff'

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: store.bannerBg(settings.bannerHome),
        minHeight: '85vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        {!store.hasBanner(settings.bannerHome) && <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 15% 85%, rgba(232,25,44,0.18) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(0,114,206,0.25) 0%, transparent 50%)',
        }} />}
        {hero.badge && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', zIndex: 1 }}>
            <div style={{ width: '10px', height: '10px', background: settings.primaryColor, borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ color: heroColor, opacity: 0.85, fontSize: '14px', fontWeight: '500' }}>{hero.badge}</span>
          </div>
        )}
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 62px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: heroColor, lineHeight: 1.15, maxWidth: '900px', marginBottom: '24px', zIndex: 1, textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
          {hero.title}
        </h1>
        <p style={{ fontSize: '18px', color: heroColor, opacity: 0.9, maxWidth: '580px', lineHeight: 1.8, marginBottom: '44px', zIndex: 1, textShadow: '0 1px 12px rgba(0,0,0,0.35)' }}>
          {hero.subtitle}
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
          <Link to="/services" style={{ background: '#E8192C', color: 'white', padding: '16px 40px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', boxShadow: '0 4px 24px rgba(232,25,44,0.45)' }}>Explore Services</Link>
          <Link to="/contact" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', padding: '16px 40px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.35)' }}>Free Consultation</Link>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: '#E8192C', padding: '44px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '24px', textAlign: 'center' }}>
          {[
            { n: '500+', l: 'Clients Nationwide' },
            { n: '7',    l: 'Provinces Served' },
            { n: '98%',  l: 'Client Satisfaction' },
            { n: '10+',  l: 'Years of Excellence' },
          ].map(s => (
            <div key={s.l}>
              <div style={{ fontSize: '44px', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', marginTop: '8px', fontWeight: '500' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI Virtual Assistant — key unique selling point ── */}
      <section style={{ background: settings.darkColor, padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
          {/* Copy */}
          <div>
            <SectionLabel dark>WHAT SETS US APART</SectionLabel>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', lineHeight: 1.2, marginBottom: '18px' }}>
              Meet your AI-powered virtual assistant
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.85, marginBottom: '28px' }}>
              Our intelligent virtual assistant is the unique edge behind every {settings.siteName} engagement — available 24/7 on every page to answer questions, recommend the right service, and book your consultation in seconds.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
              {[
                'Instant answers about our services, industries & events',
                'Guides you to the right solution for your business',
                'Books appointments and consultations on the spot',
              ].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px', fontSize: '15px', color: 'rgba(255,255,255,0.88)' }}>
                  <span style={{ color: settings.primaryColor, fontWeight: '800', fontSize: '18px', lineHeight: 1.3 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={openAssistant} style={{
              background: settings.primaryColor, color: 'white', border: 'none',
              padding: '16px 36px', borderRadius: '30px', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 28px rgba(0,0,0,0.35)',
              display: 'inline-flex', alignItems: 'center', gap: '10px',
            }}>
              💬 Chat with the assistant
            </button>
          </div>

          {/* Chat mockup */}
          <div style={{ background: 'white', borderRadius: '18px', padding: '20px', maxWidth: '380px', width: '100%', margin: '0 auto', boxShadow: '0 24px 60px rgba(0,0,0,0.35)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '14px', borderBottom: '1px solid #eee', marginBottom: '14px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: settings.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800', fontFamily: 'Montserrat, sans-serif' }}>{settings.logoLetter || 'A'}</div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: settings.darkColor }}>{settings.siteName} Assistant</div>
                <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: '600' }}>● Online now</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#f1f3f5', color: '#1a1a1a', padding: '10px 14px', borderRadius: '14px', borderBottomLeftRadius: '4px', fontSize: '13.5px', lineHeight: 1.5 }}>👋 Hi! How can I help you today?</div>
              <div style={{ alignSelf: 'flex-end', maxWidth: '85%', background: settings.primaryColor, color: 'white', padding: '10px 14px', borderRadius: '14px', borderBottomRightRadius: '4px', fontSize: '13.5px', lineHeight: 1.5 }}>What can you build for a retail chain?</div>
              <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#f1f3f5', color: '#1a1a1a', padding: '10px 14px', borderRadius: '14px', borderBottomLeftRadius: '4px', fontSize: '13.5px', lineHeight: 1.5 }}>Our omnichannel retail platform unifies POS, e-commerce & inventory. Want me to book a quick demo? 📅</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Overview ── */}
      <section style={{ background: '#F5F6F8', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel>OUR SOLUTIONS</SectionLabel>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '14px' }}>Comprehensive Software Services</h2>
            <p style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              From ERP to Cloud infrastructure, end-to-end services tailored to your business.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {services.map((sol) => <SolutionCard key={sol.id} sol={sol} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/services" style={{ background: '#0A1F3D', color: 'white', padding: '14px 36px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>View All Services</Link>
          </div>
        </div>
      </section>

      {/* ── Industry Highlights ── */}
      <section style={{ background: '#0A1F3D', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel dark>INDUSTRIES WE SERVE</SectionLabel>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '14px' }}>Driving Digital Transformation</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', maxWidth: '500px', margin: '0 auto' }}>
              Proven results across multiple industries with measurable, real-world impact.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
            {INDUSTRY_HIGHLIGHTS.map((ind, i) => <IndustryCard key={i} ind={ind} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link to="/industries" style={{ background: '#E8192C', color: 'white', padding: '14px 36px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>View All Industries</Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials Preview ── */}
      <section style={{ background: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel>TESTIMONIALS</SectionLabel>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D' }}>What Our Clients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((t) => (
              <div key={t.id} style={{ background: '#F5F6F8', borderRadius: '12px', padding: '32px', borderLeft: '4px solid #E8192C' }}>
                <div style={{ color: '#E8192C', fontSize: '18px', marginBottom: '16px', letterSpacing: '2px' }}>{'★'.repeat(t.rating || 5)}</div>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '24px' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '44px', height: '44px', background: '#0A1F3D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0, overflow: 'hidden' }}>
                    {(t.name || '?').charAt(0)}
                    {t.image && <img src={t.image} alt={t.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0A1F3D', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{t.title}{t.company ? `, ${t.company}` : ''}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link to="/testimonials" style={{ border: '2px solid #E8192C', color: '#E8192C', padding: '14px 36px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>View All Testimonials</Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ background: 'linear-gradient(135deg, #E8192C 0%, #b01020 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '44px', lineHeight: 1.7 }}>
            Join 500+ companies that trust AI-Solution for their digital transformation journey.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ background: 'white', color: '#E8192C', padding: '16px 44px', borderRadius: '30px', fontSize: '16px', fontWeight: '700' }}>Get Started Today</Link>
            <Link to="/services" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 44px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.4)' }}>View Services</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
