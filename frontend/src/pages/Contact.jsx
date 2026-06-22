import { useState } from 'react'
import * as store from '../data/store'

const COUNTRIES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim', 'Other']

const inputStyle = {
  width: '100%', padding: '12px 16px',
  border: '1.5px solid #e5e7eb', borderRadius: '8px',
  fontSize: '14px', fontFamily: 'Inter, sans-serif',
  outline: 'none', transition: 'border-color 0.2s',
  background: 'white',
}

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>{label}</label>
      {children}
      {error && <div style={{ color: '#E8192C', fontSize: '12px', marginTop: '4px' }}>{error}</div>}
    </div>
  )
}

function Input({ style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      {...props}
      onFocus={e => { setFocused(true); props.onFocus && props.onFocus(e) }}
      onBlur={e => { setFocused(false); props.onBlur && props.onBlur(e) }}
      style={{ ...inputStyle, borderColor: focused ? '#E8192C' : '#e5e7eb', ...extraStyle }}
    />
  )
}

function Select({ style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <select
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? '#E8192C' : '#e5e7eb', cursor: 'pointer', appearance: 'auto', ...extraStyle }}
    />
  )
}

function Textarea({ style: extraStyle, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <textarea
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{ ...inputStyle, borderColor: focused ? '#E8192C' : '#e5e7eb', resize: 'vertical', minHeight: '120px', ...extraStyle }}
    />
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', country: '', jobTitle: '', details: '' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.company.trim()) e.company = 'Company name is required'
    if (!form.country) e.country = 'Please select your country'
    if (!form.details.trim()) e.details = 'Please describe your requirements'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const e2 = validate()
    setErrors(e2)
    if (Object.keys(e2).length) return

    setSubmitting(true)
    try {
      await store.save('inquiries', { ...form })
      setSubmitted(true)
    } catch (err) {
      setErrors({ submit: err.message || 'Could not send your message. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div>
        <section style={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', padding: '80px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white' }}>Contact Us</h1>
        </section>
        <section style={{ background: '#F5F6F8', padding: '80px 24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '56px 48px', textAlign: 'center', maxWidth: '560px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
            <div style={{ width: '72px', height: '72px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>✅</div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '12px' }}>Message Sent!</h2>
            <p style={{ fontSize: '15px', color: '#666', lineHeight: 1.75, marginBottom: '32px' }}>
              Thank you, <strong>{form.name}</strong>! We've received your inquiry and will get back to you at <strong>{form.email}</strong> within 24 hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', company: '', country: '', jobTitle: '', details: '' }) }}
              style={{ background: '#E8192C', color: 'white', border: 'none', padding: '14px 36px', borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
            >Send Another Message</button>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div>
      <section style={{ background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(232,25,44,0.25)', color: '#E8192C', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '20px' }}>GET IN TOUCH</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: '900', fontFamily: 'Montserrat, sans-serif', color: 'white', marginBottom: '16px' }}>Contact Us</h1>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          Ready to start your transformation? Tell us about your project.
        </p>
      </section>

      <section style={{ background: '#F5F6F8', padding: '64px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          {/* Form */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '40px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '8px' }}>Send us a Message</h2>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>Fill in the details below and we'll respond within 24 hours.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                <Field label="Full Name *" error={errors.name}>
                  <Input value={form.name} onChange={set('name')} placeholder="John Smith" />
                </Field>
                <Field label="Email Address *" error={errors.email}>
                  <Input type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" />
                </Field>
                <Field label="Phone Number" error={errors.phone}>
                  <Input type="tel" value={form.phone} onChange={set('phone')} placeholder="+977 98XX XXXXXX" />
                </Field>
                <Field label="Company Name *" error={errors.company}>
                  <Input value={form.company} onChange={set('company')} placeholder="Acme Corporation" />
                </Field>
                <Field label="Province *" error={errors.country}>
                  <Select value={form.country} onChange={set('country')}>
                    <option value="">Select province...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
                <Field label="Job Title" error={errors.jobTitle}>
                  <Input value={form.jobTitle} onChange={set('jobTitle')} placeholder="CTO / IT Manager" />
                </Field>
              </div>

              <Field label="Project Details *" error={errors.details}>
                <Textarea value={form.details} onChange={set('details')} placeholder="Describe your project, goals, timeline, and any specific requirements..." rows={5} />
              </Field>

              {errors.submit && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' }}>
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: '100%', background: submitting ? '#aaa' : '#E8192C', color: 'white',
                  border: 'none', padding: '16px', borderRadius: '10px',
                  fontSize: '16px', fontWeight: '600', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif', transition: 'background 0.2s',
                }}>
                {submitting ? 'Sending...' : 'Send Message →'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div>
            <div style={{ background: '#0A1F3D', borderRadius: '16px', padding: '36px', color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '700', fontFamily: 'Montserrat, sans-serif', marginBottom: '24px' }}>Contact Information</h3>
              {[
                { icon: '📍', label: 'Address', value: 'Durbar Marg\nKathmandu 44600, Nepal' },
                { icon: '📞', label: 'Phone', value: '+977 1 4123456' },
                { icon: '✉️', label: 'Email', value: 'contact@ai-solution.com.np' },
                { icon: '🕐', label: 'Office Hours', value: 'Sun–Fri: 9:00 AM – 6:00 PM NPT' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: 'rgba(232,25,44,0.08)', border: '1.5px solid rgba(232,25,44,0.2)', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ fontSize: '24px' }}>⚡</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#0A1F3D', fontSize: '14px', marginBottom: '4px' }}>Fast Response Time</div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>We typically respond within 2–4 business hours. Urgent inquiries are answered same-day.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
