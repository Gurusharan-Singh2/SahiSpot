import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import AboutUsPage from './pages/about-us'
import AuthPage from './pages/Login-Signup'
import FindParking from './pages/FindParking'
import ManageParking from './pages/ManageParking'
import { Toaster } from 'sonner'
import Lenis from 'lenis'

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
        <Navbar />
        <Toaster position="top-center" richColors />
        <main>
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/login-signup" element={<AuthPage />} />
            <Route path="/about-us" element={<AboutUsPage/>} />
            <Route path="/find-parking" element={<FindParking/>} />
            <Route path="/manage-parking" element={<ManageParking/>} />
            <Route path="/Find_Parking" element={<FindParking/>} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
