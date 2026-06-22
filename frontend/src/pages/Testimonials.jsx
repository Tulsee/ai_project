import { Link } from 'react-router-dom'

const TESTIMONIALS = [
  { name: 'Aarav Sharma', title: 'Chief Technology Officer', company: 'Himalayan Tech Pvt. Ltd.', country: '🇳🇵 Kathmandu', rating: 5, category: 'ERP', text: 'AI-Solution transformed our entire ERP infrastructure in just 6 months. The ROI has been exceptional, team adoption was seamless, and the support team is genuinely world-class. I cannot recommend them highly enough.' },
  { name: 'Bikash Thapa', title: 'Chief Executive Officer', company: 'NepalPay Fintech', country: '🇳🇵 Lalitpur', rating: 5, category: 'CRM', text: 'Their CRM solution increased our sales conversion by 45% in the first quarter. Truly remarkable team — always responsive, deeply skilled, and they delivered on every single promise from day one.' },
  { name: 'Anjali Karki', title: 'Chief Operating Officer', company: 'MediCare Nepal', country: '🇳🇵 Pokhara', rating: 5, category: 'Healthcare', text: 'The healthcare platform they built completely streamlined our patient management workflow. We now serve 3× more patients with the same number of staff. An absolute game-changer for our organisation.' },
  { name: 'Prakash Adhikari', title: 'VP of Engineering', company: 'Everest Motors', country: '🇳🇵 Birgunj', rating: 5, category: 'Manufacturing', text: 'Their IoT manufacturing intelligence platform cut our unplanned downtime by 50%. The predictive maintenance feature alone has saved us over Rs 25 crore in the past year. Exceptional quality of work.' },
  { name: 'Sunita Rai', title: 'Head of Digital', company: 'Bhatbhateni Retail', country: '🇳🇵 Biratnagar', rating: 5, category: 'Retail', text: 'The omnichannel platform unified our 120 stores with our e-commerce channel overnight. Revenue grew 35% within 6 months and our NPS score jumped 28 points. Outstanding delivery and post-launch support.' },
  { name: 'Rajesh Shrestha', title: 'Director of IT', company: 'Kathmandu EduTech', country: '🇳🇵 Bhaktapur', rating: 5, category: 'Education', text: 'Student engagement on our new adaptive LMS is up 70%. The AI personalisation engine truly adapts to each learner. Our completion rates have never been higher and educators love the analytics dashboard.' },
]

const RATING_BREAKDOWN = [
  { stars: 5, pct: 88 },
  { stars: 4, pct: 9 },
  { stars: 3, pct: 2 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 0 },
]

const CATEGORY_COLORS = {
  ERP: '#E8192C', CRM: '#0072CE', Healthcare: '#059669',
  Manufacturing: '#7c3aed', Retail: '#d97706', Education: '#E8192C',
}

export default function Testimonials() {
  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(232,25,44,0.25)', color: '#E8192C', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>CLIENT STORIES</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>
          What Our Clients Say
        </h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          Real results from real clients across all 7 provinces of Nepal and 5 industries.
        </p>
      </section>

      {/* Rating Summary */}
      <section style={{ background: '#F5F6F8', padding: '64px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '48px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '72px', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', lineHeight: 1 }}>4.9</div>
              <div style={{ color: '#E8192C', fontSize: '24px', letterSpacing: '3px', margin: '8px 0' }}>★★★★★</div>
              <div style={{ fontSize: '13px', color: '#888' }}>Based on 500+ reviews</div>
            </div>
            <div>
              {RATING_BREAKDOWN.map(({ stars, pct }) => (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: '#555', width: '32px', textAlign: 'right', flexShrink: 0 }}>{stars}★</span>
                  <div style={{ flex: 1, height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: stars === 5 ? '#E8192C' : '#0072CE', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#888', width: '36px', flexShrink: 0 }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section style={{ background: 'white', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#F5F6F8', borderRadius: '14px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ color: '#E8192C', fontSize: '18px', letterSpacing: '2px' }}>{'★'.repeat(t.rating)}</div>
                  <span style={{ background: `${CATEGORY_COLORS[t.category]}18`, color: CATEGORY_COLORS[t.category], padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>{t.category}</span>
                </div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '24px', flex: 1 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                  <div style={{ width: '44px', height: '44px', background: '#0A1F3D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '16px', flexShrink: 0 }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0A1F3D', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>{t.title}</div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>{t.company} · {t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#0A1F3D', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '14px' }}>
          Join Our Growing List of Success Stories
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', marginBottom: '32px' }}>
          Ready to become our next case study?
        </p>
        <Link to="/contact" style={{ background: '#E8192C', color: 'white', padding: '14px 40px', borderRadius: '30px', fontSize: '15px', fontWeight: '600' }}>
          Start Your Journey
        </Link>
      </section>
    </div>
  )
}
