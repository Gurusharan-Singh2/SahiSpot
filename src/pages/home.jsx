import Hero from '@/components/Hero'
import Working from '@/components/Working'
import React from 'react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.12),transparent_18%),linear-gradient(180deg,#08111f_0%,#09131d_45%,#030712_100%)]">
      <Hero/> 
      <Working/>
    </div>
  )
}

export default HomePage
