import { useState } from 'react'
import { Link } from 'react-router-dom'

const INDUSTRIES = [
  {
    icon: '🏦', title: 'Banking & Finance', metric: '40%', metricLabel: 'Cost Reduction',
    desc: 'Modernizing financial institutions with AI-driven automation, compliance, and intelligent risk management.',
    challenge: 'Legacy systems, regulatory compliance burdens, rising operational costs, and the need for real-time fraud detection threatened competitiveness in the evolving digital-first financial landscape.',
    solution: 'We deployed an integrated AI platform combining automated compliance monitoring, real-time transaction analytics, and a customer-facing digital banking portal — reducing manual workload by 60%.',
    tags: ['Compliance Automation', 'Fraud Detection', 'Digital Banking', 'Risk Management'],
    color: '#0072CE',
  },
  {
    icon: '🏥', title: 'Healthcare', metric: '60%', metricLabel: 'Efficiency Boost',
    desc: 'Transforming patient care with intelligent healthcare management, EMR integration, and AI diagnostics.',
    challenge: 'Fragmented patient records, administrative bottlenecks, and communication gaps between departments were reducing care quality and increasing error rates.',
    solution: 'We built a unified EMR platform with AI-assisted diagnosis support, automated appointment scheduling, and real-time inter-departmental communication — cutting paperwork by 70%.',
    tags: ['EMR Integration', 'AI Diagnostics', 'Patient Portal', 'Telemedicine'],
    color: '#059669',
  },
  {
    icon: '🛍️', title: 'Retail', metric: '35%', metricLabel: 'Revenue Growth',
    desc: 'Driving retail transformation through omnichannel platforms, AI-based inventory, and personalisation engines.',
    challenge: 'Disconnected online and offline channels, poor inventory visibility, and generic customer experiences were driving high cart-abandonment rates and shrinking margins.',
    solution: 'Our omnichannel retail platform unified POS, e-commerce, and warehouse management into a single view, with an AI personalisation engine that boosted repeat purchases by 45%.',
    tags: ['Omnichannel', 'Inventory AI', 'Personalisation', 'POS Integration'],
    color: '#d97706',
  },
  {
    icon: '🏭', title: 'Manufacturing', metric: '50%', metricLabel: 'Downtime Reduction',
    desc: 'Enabling smart manufacturing through IoT integration, predictive maintenance, and production analytics.',
    challenge: 'Unplanned equipment downtime, manual quality inspections, and lack of real-time production visibility were causing significant revenue losses and delivery delays.',
    solution: 'We implemented an IoT-connected manufacturing intelligence platform with predictive maintenance alerts, automated quality control via computer vision, and live OEE dashboards.',
    tags: ['IoT Integration', 'Predictive Maintenance', 'Quality Control', 'OEE Analytics'],
    color: '#7c3aed',
  },
  {
    icon: '🎓', title: 'Education', metric: '70%', metricLabel: 'Engagement Increase',
    desc: 'Revolutionising learning with adaptive LMS platforms, AI tutors, and data-driven student performance analytics.',
    challenge: 'One-size-fits-all curricula, limited performance visibility, and poor engagement in remote/hybrid learning environments were widening the achievement gap.',
    solution: 'Our adaptive LMS analyses individual learning patterns to serve personalised content paths, while real-time analytics dashboards give educators actionable insights for early intervention.',
    tags: ['Adaptive LMS', 'AI Tutoring', 'Performance Analytics', 'Hybrid Learning'],
    color: '#E8192C',
  },
]

function IndustryCard({ ind }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ background: 'white', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
      {/* Header */}
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          background: '#0A1F3D', padding: '28px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', userSelect: 'none',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', background: `${ind.color}25`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{ind.icon}</div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: 'white', fontFamily: 'Montserrat, sans-serif' }}>{ind.title}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{ind.desc}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: '900', color: ind.color, fontFamily: 'Montserrat, sans-serif', lineHeight: 1 }}>{ind.metric}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', marginTop: '4px' }}>{ind.metricLabel}</div>
          </div>
          <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', flexShrink: 0, transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
            ▼
          </div>
        </div>
      </div>

      {/* Body */}
      {open && (
        <div style={{ padding: '36px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', background: '#fee2e2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚠️</div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0A1F3D', fontFamily: 'Montserrat, sans-serif' }}>The Challenge</h4>
              </div>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.75 }}>{ind.challenge}</p>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '28px', height: '28px', background: '#dcfce7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>✅</div>
                <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#0A1F3D', fontFamily: 'Montserrat, sans-serif' }}>Our Solution</h4>
              </div>
              <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.75 }}>{ind.solution}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {ind.tags.map(tag => (
              <span key={tag} style={{ background: `${ind.color}15`, color: ind.color, padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{tag}</span>
            ))}
          </div>
          <Link to="/contact" style={{ background: ind.color, color: 'white', padding: '12px 28px', borderRadius: '25px', fontSize: '14px', fontWeight: '600', display: 'inline-block' }}>
            Discuss Your Project →
          </Link>
        </div>
      )}
    </div>
  )
}

export default function Industries() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(232,25,44,0.25)', color: '#E8192C', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>INDUSTRIES</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>
          Industry-Specific Solutions
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
          Deep domain expertise across 5 key verticals with proven, measurable outcomes.
        </p>
      </section>

      <section style={{ background: '#F5F6F8', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {INDUSTRIES.map((ind, i) => <IndustryCard key={i} ind={ind} />)}
        </div>
      </section>
    </div>
  )
}
