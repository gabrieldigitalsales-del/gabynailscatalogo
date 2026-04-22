import React, { useEffect } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { queryClientInstance } from '@/lib/query-client'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import PageNotFound from './lib/PageNotFound'

// Pages
import Home from './pages/Home'
import Booking from './pages/Booking'

// Admin
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './components/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import AdminSlides from './pages/admin/AdminSlides'
import AdminServices from './pages/admin/AdminServices'
import AdminPortfolio from './pages/admin/AdminPortfolio'
import AdminProfessionals from './pages/admin/AdminProfessionals'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminTestimonials from './pages/admin/AdminTestimonials'
import AdminFAQ from './pages/admin/AdminFAQ'
import AdminCourseLeads from './pages/admin/AdminCourseLeads'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSchedule from './pages/admin/AdminSchedule'

function FullScreenLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-off-white">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-champagne border-t-gold rounded-full animate-spin mx-auto mb-4" />
        <p className="font-serif text-charcoal/40 text-sm">Carregando...</p>
      </div>
    </div>
  )
}

function RequireAdmin({ children }) {
  const { checkSession, isAuthenticated, isLoadingAuth } = useAuth()

  useEffect(() => {
    checkSession()
  }, [checkSession])

  if (isLoadingAuth) {
    return <FullScreenLoader />
  }

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return children
}

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/agendar" element={<Booking />} />

      <Route
        path="/admin"
        element={(
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        )}
      >
        <Route index element={<Dashboard />} />
        <Route path="slides" element={<AdminSlides />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="portfolio" element={<AdminPortfolio />} />
        <Route path="professionals" element={<AdminProfessionals />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="faq" element={<AdminFAQ />} />
        <Route path="course-leads" element={<AdminCourseLeads />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}
