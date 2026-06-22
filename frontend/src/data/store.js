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

const DEFAULT_SETTINGS = {
  siteName: 'AI-Solution',
  logoLetter: 'A',
  tagline: 'Transforming businesses through innovative AI-powered software solutions.',
  primaryColor: '#E8192C',
  darkColor: '#0A1F3D',
  accentColor: '#0072CE',
}

const PUBLIC_COLLECTIONS = ['services', 'events', 'photos', 'blogs']

// In-memory cache that components read synchronously.
const cache = {
  services: [],
  events: [],
  photos: [],
  blogs: [],
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
  cache.settings = { ...DEFAULT_SETTINGS, ...settings }
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
  cache.settings = { ...DEFAULT_SETTINGS, ...updated }
  applyTheme(cache.settings)
  emit()
  return cache.settings
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
