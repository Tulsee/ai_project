import { useState, useEffect, useRef } from 'react'
import * as store from '../data/store'
import faq from '../data/faq.json'

// Any component can pop the assistant open by calling openAssistant().
export const OPEN_CHAT_EVENT = 'ai-open-chat'
export function openAssistant() {
  window.dispatchEvent(new CustomEvent(OPEN_CHAT_EVENT))
}

// ── Match a user message against the FAQ list ───────────────────────────────
// Simple keyword + word-overlap scoring. Returns the best answer, or null.
function findAnswer(input) {
  const text = input.toLowerCase().trim()
  if (!text) return null

  const words = text.split(/\W+/).filter(w => w.length > 2)
  let best = null
  let bestScore = 0

  for (const item of faq) {
    let score = 0
    const haystack = [item.question, ...(item.keywords || [])].join(' ').toLowerCase()

    for (const kw of item.keywords || []) {
      if (text.includes(kw.toLowerCase())) score += 3
    }
    for (const w of words) {
      if (haystack.includes(w)) score += 1
    }

    if (score > bestScore) {
      bestScore = score
      best = item
    }
  }

  return bestScore > 0 ? best.answer : null
}

// Detect when the user wants to book / schedule something.
const BOOKING_INTENT = /\b(book|appointment|schedule|meeting|reserve|consultation|appoint)\b/i

// ── Guided booking flow ─────────────────────────────────────────────────────
// Each step asks one thing. `ctx` holds answers collected so far.
const BOOKING_STEPS = [
  {
    key: 'purpose',
    prompt: () => "Happy to help you book an appointment! 📅\n\nFirst — what would you like to book?",
    options: () => ['Consultation', 'Product demo', 'Technical support', 'Project discussion'],
  },
  {
    key: 'service',
    prompt: () => "Great choice! Which service are you most interested in?",
    options: ctx => [...ctx.services, 'Not sure yet'],
  },
  {
    key: 'name',
    prompt: () => "Could I get your full name, please?",
  },
  {
    key: 'email',
    prompt: () => "Thanks! What's the best email to reach you at?",
    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    error: "Hmm, that doesn't look like a valid email. Mind re-entering it?",
  },
  {
    key: 'phone',
    prompt: () => 'And a phone number we can call? (type "skip" if you\'d rather not)',
    transform: v => (/^skip$/i.test(v.trim()) ? '—' : v.trim()),
  },
  {
    key: 'availability',
    prompt: ctx => `Almost done, ${ctx.name?.split(' ')[0] || 'there'}! When are you available? Share a preferred date & time.`,
    options: () => ['Tomorrow morning', 'Tomorrow afternoon', 'This weekend', 'Next week'],
  },
]

const FALLBACK =
  "Sorry, I don't have an answer for that yet. Try asking about our services, " +
  "industries, hosting, or events — or I can help you book an appointment."

const GREETING =
  "👋 Hi! I'm the AI-Solution assistant. Ask me anything, pick a question below, or book an appointment."

const thinkDelay = text => Math.min(1600, 600 + (text?.length || 0) * 12)

export default function Chatbot() {
  const [settings, setSettings] = useState(store.getSettings)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([{ from: 'bot', text: GREETING }])
  const [typing, setTyping] = useState(false)
  // Booking flow: { active, stepIndex, data }
  const [flow, setFlow] = useState({ active: false, stepIndex: 0, data: {} })
  const bodyRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => store.subscribe(() => setSettings(store.getSettings())), [])
  useEffect(() => () => clearTimeout(timer.current), [])

  // Let any CTA across the site open the assistant (see openAssistant()).
  useEffect(() => {
    const open = () => setOpen(true)
    window.addEventListener(OPEN_CHAT_EVENT, open)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, open)
  }, [])

  // Auto-scroll to the latest message / typing indicator
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [messages, typing, open])

  const primary = settings.primaryColor || '#E8192C'
  const dark = settings.darkColor || '#0A1F3D'
  const serviceNames = store.getAll('services').map(s => s.title)

  // Show a "thinking…" indicator, then reveal the bot message after a delay.
  const botSay = text => {
    setTyping(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, { from: 'bot', text }])
    }, thinkDelay(text))
  }

  const pushUser = text => setMessages(m => [...m, { from: 'user', text }])

  const startBooking = () => {
    const data = { services: serviceNames }
    setFlow({ active: true, stepIndex: 0, data })
    botSay(BOOKING_STEPS[0].prompt(data))
  }

  const cancelBooking = () => {
    setFlow({ active: false, stepIndex: 0, data: {} })
    botSay("No problem — I've cancelled that. Let me know if there's anything else!")
  }

  const advanceBooking = text => {
    const step = BOOKING_STEPS[flow.stepIndex]
    if (step.validate && !step.validate(text)) {
      botSay(step.error || "That doesn't look right — could you try again?")
      return
    }
    const value = step.transform ? step.transform(text) : text.trim()
    const data = { ...flow.data, [step.key]: value }
    const next = flow.stepIndex + 1

    if (next < BOOKING_STEPS.length) {
      setFlow({ active: true, stepIndex: next, data })
      botSay(BOOKING_STEPS[next].prompt(data))
    } else {
      // All info collected — persist as an inquiry the admin panel can see.
      store.save('inquiries', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: '',
        country: '',
        jobTitle: 'Appointment (chatbot)',
        details:
          `[Appointment request via chatbot]\n` +
          `Purpose: ${data.purpose}\nService: ${data.service}\nPreferred time: ${data.availability}`,
        date: new Date().toISOString(),
      }).catch((err) => console.error('Could not save appointment:', err.message))
      setFlow({ active: false, stepIndex: 0, data: {} })
      const first = data.name?.split(' ')[0] || 'there'
      botSay(
        `✅ You're all set, ${first}! Here's your appointment request:\n\n` +
        `• Purpose: ${data.purpose}\n• Service: ${data.service}\n` +
        `• Name: ${data.name}\n• Email: ${data.email}\n• Phone: ${data.phone}\n` +
        `• Preferred time: ${data.availability}\n\n` +
        `Our team will reach out shortly to confirm. Anything else I can help with?`
      )
    }
  }

  // Single entry point for any user input (typed or option click).
  const handle = raw => {
    const text = (raw ?? input).trim()
    if (!text || typing) return
    pushUser(text)
    setInput('')

    if (flow.active) advanceBooking(text)
    else if (BOOKING_INTENT.test(text)) startBooking()
    else botSay(findAnswer(text) || FALLBACK)
  }

  // Options for the current booking step (if any)
  const currentStep = flow.active ? BOOKING_STEPS[flow.stepIndex] : null
  const stepOptions = currentStep?.options ? currentStep.options(flow.data) : null

  // Walkthrough suggestions (only outside the booking flow)
  const asked = new Set(messages.filter(m => m.from === 'user').map(m => m.text))
  const remaining = faq.filter(f => !asked.has(f.question))
  const suggestions = remaining.slice(0, 3).map(f => f.question)
  const lastIsBot = messages[messages.length - 1].from === 'bot'
  const isFirst = messages.length === 1

  return (
    <>
      <style>{`@keyframes ai-bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}`}</style>

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          width: '60px', height: '60px', borderRadius: '50%', border: 'none',
          background: primary, color: 'white', fontSize: '26px', cursor: 'pointer',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px', zIndex: 1000,
          width: '350px', maxWidth: 'calc(100vw - 48px)', height: '480px',
          maxHeight: 'calc(100vh - 140px)',
          background: 'white', borderRadius: '16px', overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          {/* Header */}
          <div style={{ background: dark, color: 'white', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%', background: primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontFamily: 'Montserrat, sans-serif',
            }}>{settings.logoLetter || 'A'}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{settings.siteName || 'AI-Solution'} Assistant</div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>Typically replies instantly</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={bodyRef} style={{
            flex: 1, overflowY: 'auto', padding: '16px', background: '#f6f7f9',
            display: 'flex', flexDirection: 'column', gap: '10px',
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%',
                background: m.from === 'user' ? primary : 'white',
                color: m.from === 'user' ? 'white' : '#1a1a1a',
                padding: '10px 14px', borderRadius: '14px',
                borderBottomRightRadius: m.from === 'user' ? '4px' : '14px',
                borderBottomLeftRadius: m.from === 'user' ? '14px' : '4px',
                fontSize: '14px', lineHeight: '1.5', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', whiteSpace: 'pre-wrap',
              }}>{m.text}</div>
            ))}

            {/* Thinking indicator */}
            {typing && (
              <div style={{
                alignSelf: 'flex-start', background: 'white', padding: '12px 16px',
                borderRadius: '14px', borderBottomLeftRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                display: 'flex', gap: '4px',
              }}>
                {[0, 1, 2].map(d => (
                  <span key={d} style={{
                    width: '7px', height: '7px', borderRadius: '50%', background: '#aaa',
                    animation: `ai-bounce 1.2s infinite ${d * 0.2}s`,
                  }} />
                ))}
              </div>
            )}

            {/* Booking step options */}
            {!typing && flow.active && stepOptions && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '2px' }}>
                {stepOptions.map(opt => (
                  <button key={opt} onClick={() => handle(opt)} style={chipStyle(primary)}>{opt}</button>
                ))}
              </div>
            )}

            {/* Cancel link during booking */}
            {!typing && flow.active && (
              <button onClick={cancelBooking} style={{
                alignSelf: 'flex-start', background: 'none', border: 'none', color: '#999',
                fontSize: '12px', cursor: 'pointer', textDecoration: 'underline', padding: '2px',
              }}>Cancel booking</button>
            )}

            {/* Walkthrough suggestions + book button (outside booking flow) */}
            {!typing && !flow.active && lastIsBot && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                <button onClick={startBooking} style={{
                  textAlign: 'left', background: primary, border: 'none', color: 'white',
                  padding: '10px 12px', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}>📅 Book an appointment</button>

                {suggestions.length > 0 && (
                  <div style={{ fontSize: '12px', color: '#888', fontWeight: 600, padding: '2px 2px 0' }}>
                    {isFirst ? 'Or pick a question:' : 'You might also want to ask:'}
                  </div>
                )}
                {suggestions.map(q => (
                  <button key={q} onClick={() => handle(q)} style={chipStyle(primary, true)}>{q}</button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); handle() }}
            style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid #eee', background: 'white' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={flow.active ? 'Type your answer…' : 'Type your question…'}
              disabled={typing}
              style={{ flex: 1, border: '1px solid #ddd', borderRadius: '20px', padding: '10px 14px', fontSize: '14px', outline: 'none' }}
            />
            <button type="submit" disabled={typing} style={{
              background: primary, color: 'white', border: 'none', borderRadius: '50%',
              width: '40px', height: '40px', cursor: typing ? 'default' : 'pointer',
              fontSize: '16px', flexShrink: 0, opacity: typing ? 0.5 : 1,
            }}>➤</button>
          </form>
        </div>
      )}
    </>
  )
}

// Pill-style button shared by options and suggestions
function chipStyle(primary, block) {
  return {
    textAlign: 'left', background: 'white', border: `1px solid ${primary}`, color: primary,
    padding: '8px 12px', borderRadius: '12px', fontSize: '13px', cursor: 'pointer',
    display: block ? 'block' : 'inline-block',
  }
}
