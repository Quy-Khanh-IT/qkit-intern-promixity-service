'use client'
import Footer from '@/app/components/Footer'
import HeroSection from '@/app/components/HeroSection'
import Navbar from '@/app/components/NavBar'
import ServiceSlider from '@/app/components/ServiceSlider'
import StarsCanvas from './components/canvas/Star'
import CredibilitySection from './components/CredibilitySection'
import NavProcessBar from './components/NavProcessBar'
import AboutUsSection from './components/AboutUsSection'

export default function Home() {
  return (
    <main>
      <NavProcessBar />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 0 }} className='scroll-bar-1'>
        <HeroSection />
        <CredibilitySection />
        <StarsCanvas />
        <AboutUsSection />
      </div>
      <ServiceSlider />

      <Footer />
    </main>
  )
}
