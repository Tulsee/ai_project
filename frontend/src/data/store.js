// ─────────────────────────────────────────────────────────────────────────────
// Data store — backed by the FastAPI backend, with a synchronous read cache.
//
// Components read synchronously (`getAll`, `getSettings`) from an in-memory
// cache and subscribe to changes. On load we hydrate the cache from the API and
// emit a change event so subscribed components re-render with live data. Writes
// call the API, update the cache, and emit. The component-facing API is the same
// shape it had when this was a localStorage layer.
// ─────────────────────────────────────────────────────────────────────────────

import * as api from './api'

const DEFAULT_HEROES = {
  home: { badge: 'AI-Powered Software Services', title: 'Transforming Business Through AI-Powered Software Services', subtitle: 'We deliver cutting-edge enterprise software that drives growth, efficiency, and digital transformation for businesses across the globe.', textColor: '#ffffff' },
  services: { badge: 'OUR SERVICES', title: 'Enterprise Software Services', subtitle: 'From ERP to VPS — a complete suite of AI-powered services that drive real business results.', textColor: '#ffffff' },
  industries: { badge: 'INDUSTRIES', title: 'Industry-Specific Services', subtitle: 'Deep domain expertise across 5 key verticals with proven, measurable outcomes.', textColor: '#ffffff' },
  testimonials: { badge: 'CLIENT STORIES', title: 'What Our Clients Say', subtitle: 'Real results from real clients across all 7 provinces of Nepal and 5 industries.', textColor: '#ffffff' },
  articles: { badge: 'INSIGHTS & ARTICLES', title: 'Latest Insights', subtitle: 'Expert perspectives on enterprise technology, digital transformation, and industry trends.', textColor: '#ffffff' },
  gallery: { badge: 'GALLERY & EVENTS', title: 'Our Moments & Events', subtitle: 'Conferences, workshops, and milestones that define our journey.', textColor: '#ffffff' },
}

const DEFAULT_SETTINGS = {
  siteName: 'AI-Solution',
  logoType: 'text', // 'text' | 'image'
  logoLetter: 'A',
  logoImage: '',
  tagline: 'Transforming businesses through innovative AI-powered software services.',
  primaryColor: '#E8192C',
  darkColor: '#0A1F3D',
  accentColor: '#0072CE',
  // Per-page banner background images
  bannerHome: 'https://picsum.photos/seed/ai-hero-home/1600/600',
  bannerSolutions: 'https://picsum.photos/seed/ai-services/1600/600',
  bannerIndustries: 'https://picsum.photos/seed/ai-industries/1600/600',
  bannerTestimonials: 'https://picsum.photos/seed/ai-testimonials/1600/600',
  bannerArticles: 'https://picsum.photos/seed/ai-articles/1600/600',
  bannerGallery: 'https://picsum.photos/seed/ai-gallery/1600/600',
  heroes: DEFAULT_HEROES,
}

// Merge backend settings over the defaults, deep-merging the per-page heroes so
// every page always has a full { badge, title, subtitle, textColor } shape.
function mergeSettings(incoming = {}) {
  const merged = { ...DEFAULT_SETTINGS, ...incoming }
  merged.heroes = {}
  for (const page of Object.keys(DEFAULT_HEROES)) {
    merged.heroes[page] = { ...DEFAULT_HEROES[page], ...((incoming.heroes && incoming.heroes[page]) || {}) }
  }
  return merged
}

const PUBLIC_COLLECTIONS = ['services', 'events', 'photos', 'blogs', 'testimonials']

// In-memory cache that components read synchronously.
const cache = {
  services: [],
  events: [],
  photos: [],
  blogs: [],
  testimonials: [],
  inquiries: [],
  settings: { ...DEFAULT_SETTINGS },
}

// ── Tiny pub/sub so components re-read after hydration or edits ──
const emit = () => window.dispatchEvent(new CustomEvent('ai-store-change'))
export const subscribe = (cb) => {
  window.addEventListener('ai-store-change', cb)
  return () => window.removeEventListener('ai-store-change', cb)
}

// ── Synchronous reads (from cache) ────────────────────────────────────────────
export function getAll(resource) {
  return cache[resource] || []
}
export function getSettings() {
  return cache.settings
}
export function getUsername() {
  return api.getUsername()
}
export function isAuthed() {
  return api.isAuthed()
}

// ── Hydration ─────────────────────────────────────────────────────────────────
export async function hydratePublic() {
  const [settings, ...lists] = await Promise.all([
    api.get('/settings'),
    ...PUBLIC_COLLECTIONS.map((r) => api.get(`/${r}`)),
  ])
  cache.settings = mergeSettings(settings)
  PUBLIC_COLLECTIONS.forEach((r, i) => { cache[r] = lists[i] })
  applyTheme(cache.settings)
  emit()
}

export async function hydrateInquiries() {
  if (!api.isAuthed()) return
  cache.inquiries = await api.get('/inquiries', { auth: true })
  emit()
}

// ── Collection writes ─────────────────────────────────────────────────────────
export async function save(resource, item) {
  // Inquiries are created publicly (contact form + chatbot booking).
  if (resource === 'inquiries') {
    const created = await api.post('/inquiries', item)
    if (api.isAuthed()) {
      cache.inquiries = [...cache.inquiries, created]
      emit()
    }
    return created
  }

  // Content collections require an admin token.
  const { id, ...body } = item
  const saved = id
    ? await api.put(`/${resource}/${id}`, body, { auth: true })
    : await api.post(`/${resource}`, body, { auth: true })

  const list = [...(cache[resource] || [])]
  const idx = list.findIndex((x) => x.id === saved.id)
  if (idx >= 0) list[idx] = saved
  else list.push(saved)
  cache[resource] = list
  emit()
  return saved
}

export async function remove(resource, id) {
  await api.del(`/${resource}/${id}`, { auth: true })
  cache[resource] = (cache[resource] || []).filter((x) => x.id !== id)
  emit()
}

export async function clear(resource) {
  await api.del(`/${resource}`, { auth: true })
  cache[resource] = []
  emit()
}

// ── Settings ──────────────────────────────────────────────────────────────────
export async function saveSettings(patch) {
  const updated = await api.put('/settings', patch, { auth: true })
  cache.settings = mergeSettings(updated)
  applyTheme(cache.settings)
  emit()
  return cache.settings
}

// Build a page-hero background. When a banner image is set we show the image
// itself (no brand-colour tint) with only a light neutral scrim so the white
// heading stays readable. With no image we fall back to the brand gradient.
export function bannerBg(url) {
  const scrim = 'linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.45))'
  return url
    ? `${scrim}, url("${url}") center / cover no-repeat`
    : 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)'
}

// True when a usable banner image URL is set (used to hide brand-colour
// decorations on the hero when a photo is shown).
export function hasBanner(url) {
  return typeof url === 'string' && url.trim() !== ''
}

export function applyTheme(settings = cache.settings) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', settings.primaryColor)
  root.style.setProperty('--color-dark', settings.darkColor)
  root.style.setProperty('--color-accent', settings.accentColor)
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function login(username, password) {
  const data = await api.post('/auth/login', { username, password })
  api.setToken(data.access_token, data.username)
  await hydrateInquiries()
  emit()
  return data.username
}

export function logout() {
  api.clearToken()
  cache.inquiries = []
  emit()
}

export async function saveCredentials({ current_password, new_username, new_password }) {
  return api.put(
    '/auth/credentials',
    { current_password, new_username, new_password },
    { auth: true },
  )
}

// ── Boot: apply cached theme immediately, then hydrate from the backend ───────
applyTheme()
hydratePublic().catch((err) => console.error('Failed to load site data:', err.message))
hydrateInquiries().catch(() => { /* not logged in or token expired */ })
