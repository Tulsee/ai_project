// ─────────────────────────────────────────────────────────────────────────────
// Thin HTTP client for the FastAPI backend.
//
// Base URL defaults to "/api" (proxied to the backend by Vite in dev — see
// vite.config.js). Override in production with VITE_API_URL, e.g.
//   VITE_API_URL=https://api.example.com/api
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'ai_admin_token'
const USER_KEY = 'ai_admin_user'

// ── Token storage (admin session) ──
export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUsername = () => localStorage.getItem(USER_KEY) || ''
export const isAuthed = () => !!getToken()
export const setToken = (token, username) => {
  localStorage.setItem(TOKEN_KEY, token)
  if (username) localStorage.setItem(USER_KEY, username)
}
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ── Core request helper ──
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth && getToken()) headers['Authorization'] = `Bearer ${getToken()}`

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?')
  }

  if (res.status === 401) clearToken() // token rejected/expired

  if (!res.ok) {
    let detail = res.statusText
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch { /* non-JSON error body */ }
    throw new Error(typeof detail === 'string' ? detail : 'Request failed')
  }

  if (res.status === 204) return null
  const ct = res.headers.get('content-type') || ''
  return ct.includes('application/json') ? res.json() : res.text()
}

export const get = (path, opts) => request(path, { ...opts, method: 'GET' })
export const post = (path, body, opts) => request(path, { ...opts, method: 'POST', body })
export const put = (path, body, opts) => request(path, { ...opts, method: 'PUT', body })
export const del = (path, opts) => request(path, { ...opts, method: 'DELETE' })
