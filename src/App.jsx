import React from 'react'
import LoginPage from './pages/login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import {RedirectToSignIn, SignedOut} from '@clerk/clerk-react'
import AboutUsPage from './pages/about-us'

const App = () => {
  return (
    <div className='min-h-screen  pb-2 '>
      <BrowserRouter>
        <Navbar />

        <main >
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
            <Route path="/about-us" element={<AboutUsPage/>} />

          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
      
   
    </div>
  );
};

export default App;
