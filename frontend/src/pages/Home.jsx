import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../data/store'

const INDUSTRY_HIGHLIGHTS = [
  { icon: '🏦', title: 'Banking & Finance', metric: '40%', label: 'Cost Reduction', desc: 'Modernizing financial operations with AI-driven automation and compliance tools.' },
  { icon: '🏥', title: 'Healthcare', metric: '60%', label: 'Efficiency Boost', desc: 'Transforming patient care with intelligent healthcare management systems.' },
  { icon: '🛍️', title: 'Retail', metric: '35%', label: 'Revenue Growth', desc: 'Driving retail success through omnichannel and personalised customer experiences.' },
  { icon: '🏭', title: 'Manufacturing', metric: '50%', label: 'Downtime Reduction', desc: 'Smart manufacturing solutions for operational excellence and quality control.' },
  { icon: '🎓', title: 'Education', metric: '70%', label: 'Engagement Increase', desc: 'Revolutionising learning with AI-powered educational technology platforms.' },
]

const TESTIMONIALS = [
  { name: 'Aarav Sharma', title: 'CTO, Himalayan Tech', country: '🇳🇵 Kathmandu', rating: 5, text: 'AI-Solution transformed our entire ERP infrastructure in just 6 months. The ROI has been exceptional and team adoption was seamless.' },
  { name: 'Bikash Thapa', title: 'CEO, NepalPay Fintech', country: '🇳🇵 Lalitpur', rating: 5, text: 'Their CRM solution increased our sales conversion by 45%. Truly remarkable team — responsive, skilled, and delivered on every promise.' },
  { name: 'Anjali Karki', title: 'COO, MediCare Nepal', country: '🇳🇵 Pokhara', rating: 5, text: 'The healthcare platform they built completely streamlined our patient management. We now serve 3× more patients with the same staff.' },
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
      <Link to="/solutions" style={{ color: '#E8192C', fontSize: '14px', fontWeight: '600' }}>Learn More →</Link>
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
  const [solutions, setSolutions] = useState(() => store.getAll('services').slice(0, 6))
  useEffect(() => store.subscribe(() => setSolutions(store.getAll('services').slice(0, 6))), [])

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)',
        minHeight: '85vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 24px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 15% 85%, rgba(232,25,44,0.18) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(0,114,206,0.25) 0%, transparent 50%)',
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', zIndex: 1 }}>
          <div style={{ width: '10px', height: '10px', background: '#E8192C', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: '500' }}>AI-Powered Software Solutions</span>
        </div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 62px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', lineHeight: 1.15, maxWidth: '900px', marginBottom: '24px', zIndex: 1 }}>
          Transforming Business Through{' '}
          <span style={{ color: '#E8192C' }}>AI-Powered</span> Software Solutions
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '580px', lineHeight: 1.8, marginBottom: '44px', zIndex: 1 }}>
          We deliver cutting-edge enterprise software that drives growth, efficiency, and digital transformation for businesses across the globe.
        </p>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
          <Link to="/solutions" style={{ background: '#E8192C', color: 'white', padding: '16px 40px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', boxShadow: '0 4px 24px rgba(232,25,44,0.45)' }}>Explore Solutions</Link>
          <Link to="/contact" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', padding: '16px 40px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.35)' }}>Free Consultation</Link>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: '#E8192C', padding: '44px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px', textAlign: 'center' }}>
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

      {/* ── Solutions Overview ── */}
      <section style={{ background: '#F5F6F8', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel>OUR SOLUTIONS</SectionLabel>
            <h2 style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '14px' }}>Comprehensive Software Solutions</h2>
            <p style={{ fontSize: '16px', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              From ERP to Cloud infrastructure, end-to-end solutions tailored to your business.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {solutions.map((sol) => <SolutionCard key={sol.id} sol={sol} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link to="/solutions" style={{ background: '#0A1F3D', color: 'white', padding: '14px 36px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>View All Solutions</Link>
          </div>
        </div>
      </section>

      {/* ── Industry Highlights ── */}
      <section style={{ background: '#0A1F3D', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <SectionLabel dark>INDUSTRIES WE SERVE</SectionLabel>
            <h2 style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '14px' }}>Driving Digital Transformation</h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', maxWidth: '500px', margin: '0 auto' }}>
              Proven results across multiple industries with measurable, real-world impact.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '20px' }}>
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
            <h2 style={{ fontSize: '36px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D' }}>What Our Clients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#F5F6F8', borderRadius: '12px', padding: '32px', borderLeft: '4px solid #E8192C' }}>
                <div style={{ color: '#E8192C', fontSize: '18px', marginBottom: '16px', letterSpacing: '2px' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ fontSize: '15px', color: '#555', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '24px' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', background: '#0A1F3D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#0A1F3D', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{t.title}</div>
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
          <h2 style={{ fontSize: '40px', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>Ready to Transform Your Business?</h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '44px', lineHeight: 1.7 }}>
            Join 500+ companies that trust AI-Solution for their digital transformation journey.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" style={{ background: 'white', color: '#E8192C', padding: '16px 44px', borderRadius: '30px', fontSize: '16px', fontWeight: '700' }}>Get Started Today</Link>
            <Link to="/solutions" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '16px 44px', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '2px solid rgba(255,255,255,0.4)' }}>View Solutions</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
