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
            <Navbar/>

      <Routes>
        <Route element={<HomePage/>} path='/'/>
        <Route element={<LoginPage/>} path='/login-signup'/>


      </Routes>
      </BrowserRouter>
      <Footer/>
    {/* <LoginPage/> */}
    </div>
  )
}

export default App