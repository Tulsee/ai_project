import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API calls to the FastAPI backend so the frontend can use
    // same-origin relative URLs (/api/...) with no CORS in development.
    proxy: {
      '/api': 'http://127.0.0.1:8000',
    },
  },
})
