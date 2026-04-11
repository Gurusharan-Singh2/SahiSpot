import React, { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AboutUsPage from './pages/about-us'
import ContactUsPage from './pages/contact-us'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import VerifyOtp from './pages/auth/VerifyOtp'
import ForgotPassword from './pages/auth/ForgotPassword'
import { ProtectedRoute } from './components/ProtectedRoute'
import FindParking from './pages/FindParking'
import ManageParking from './pages/ManageParking'
import LocationDetails from './pages/LocationDetails'
import PaymentPage from './pages/PaymentPage'
import UserDashboard from './pages/UserDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { Toaster } from 'sonner'
import Lenis from 'lenis'
import GlobalLoader from './components/GlobalLoader'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [pathname])

  return null
}

const App = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <div className='min-h-screen pb-2'>
      <BrowserRouter>
        <ScrollToTop />
        <GlobalLoader />
        <Navbar />
        <Toaster position="top-center" richColors />
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/auth/verify-otp" element={<VerifyOtp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/login-signup" element={<Navigate to="/auth/login" replace />} />
            <Route path="/about-us" element={<AboutUsPage/>} />
            <Route path="/contact-us" element={<ContactUsPage/>} />
            <Route path="/find-parking" element={<FindParking/>} />
            <Route path="/locations/:id" element={<LocationDetails/>} />
            <Route path="/payment/:bookingId" element={<PaymentPage/>} />
            <Route path="/Find_Parking" element={<FindParking/>} />
            {/* Protected routes placeholder */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["owner"]} />}>
              <Route path="/manage-parking" element={<ManageParking/>} />
              <Route path="/owner" element={<OwnerDashboard />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={["admin", "super_admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
