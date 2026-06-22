import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './data/store' // hydrates data from the backend + applies theme on load
import Layout from './components/Layout'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import Solutions from './pages/Solutions'
import Industries from './pages/Industries'
import Testimonials from './pages/Testimonials'
import Articles from './pages/Articles'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Inquiries from './pages/admin/Inquiries'
import Services from './pages/admin/Services'
import Events from './pages/admin/Events'
import Content from './pages/admin/Content'
import Settings from './pages/admin/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="solutions" element={<Solutions />} />
          <Route path="industries" element={<Industries />} />
          <Route path="testimonials" element={<Testimonials />} />
          <Route path="articles" element={<Articles />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin panel (protected inside AdminLayout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="services" element={<Services />} />
          <Route path="events" element={<Events />} />
          <Route path="content" element={<Content />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* Floating chatbot — appears on every page (public + admin) */}
      <Chatbot />
    </BrowserRouter>
  )
}
