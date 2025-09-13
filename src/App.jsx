import React from 'react'
import LoginPage from './pages/login'
import Navbar from './Navbar'
import Hero from './Hero'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home'
import Footer from './Footer'
import Working from './Working'

const App = () => {
  return (
    <div className='min-h-screen w-screen bg-gray-50'>
      <BrowserRouter>
            <Navbar/>

      <Routes>
        <Route element={<HomePage/>} path='/'/>
        <Route element={<LoginPage/>} path='/login-signup'/>


      </Routes>
      </BrowserRouter>
      <Footer/>
     
    </div>
  )
}

export default App