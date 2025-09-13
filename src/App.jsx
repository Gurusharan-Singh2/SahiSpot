import React from 'react'
import LoginPage from './pages/login'
import Navbar from './Navbar'
import Hero from './Hero'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home'
import Footer from './Footer'

const App = () => {
  return (
    <div className='min-h-screen w-screen '>
      <BrowserRouter>
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                // <SignedIn>
                //   <HomePage/>
                // </SignedIn>
                <HomePage/>
              }
            />
            <Route
              path="/"
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              }
            />
            <Route path="/login-signup" element={<LoginPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />

          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
      <Footer/>
    {/* <LoginPage/> */}
    </div>
  );
};

export default App;
