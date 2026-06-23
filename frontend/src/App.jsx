import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './data/store' // hydrates data from the backend + applies theme on load
import { DialogProvider } from './components/ui/Dialog'
import Layout from './components/Layout'
import Chatbot from './components/Chatbot'
import Home from './pages/Home'
import Services from './pages/Services'
import Industries from './pages/Industries'
import Testimonials from './pages/Testimonials'
import Articles from './pages/Articles'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'

import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Inquiries from './pages/admin/Inquiries'
import AdminServices from './pages/admin/Services'
import Events from './pages/admin/Events'
import AdminArticles from './pages/admin/Articles'
import AdminGallery from './pages/admin/Gallery'
import AdminTestimonials from './pages/admin/Testimonials'
import Banners from './pages/admin/Banners'
import Settings from './pages/admin/Settings'

export default function App() {
  return (
    <DialogProvider>
      <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
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
          <Route path="services" element={<AdminServices />} />
          <Route path="events" element={<Events />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="banners" element={<Banners />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>

      {/* Floating chatbot — appears on every page (public + admin) */}
      <Chatbot />
      </BrowserRouter>
    </DialogProvider>
  )
}
