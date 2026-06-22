import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as store from '../../data/store'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await store.login(username, password)
      onLogin()
    } catch (err) {
      setError(err.message || 'Invalid username or password.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A1F3D 0%, #0072CE 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '16px', padding: '48px 40px', width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '56px', height: '56px', background: '#0A1F3D', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '24px', fontFamily: 'Montserrat, sans-serif', margin: '0 auto 16px' }}>A</div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Montserrat, sans-serif', color: '#0A1F3D', marginBottom: '6px' }}>Admin Portal</h1>
          <p style={{ fontSize: '14px', color: '#888' }}>Sign in to manage your website</p>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#dc2626', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={lbl}>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" style={field} />
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={lbl}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={field} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', background: loading ? '#aaa' : '#E8192C', color: 'white', border: 'none', padding: '14px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#bbb' }}>
          Demo credentials: <strong>admin</strong> / <strong>admin123</strong>
        </div>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Link to="/" style={{ fontSize: '13px', color: '#888' }}>← Back to Website</Link>
        </div>
      </div>
    </div>
  )
}

const lbl = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }
const field = { width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'Inter, sans-serif' }
