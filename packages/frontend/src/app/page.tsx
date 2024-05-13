'use client'
import Footer from '@/app/components/Footer'
import HeroSection from '@/app/components/HeroSection'
import Navbar from '@/app/components/NavBar'
import ServiceSlider from '@/app/components/ServiceSlider'
import AboutusSection from './components/AboutUsSection'
import StarsCanvas from './components/canvas/Star'
import CredibilitySection from './components/CredibilitySection'
import NavProcessbar from './components/NavProcessBar'

export default function Home() {
  return (
    <main>
      <NavProcessbar />
      <Navbar />
      <div style={{ position: 'relative', zIndex: 0 }} className='scroll-bar-1'>
        <HeroSection />
        <CredibilitySection />
        <StarsCanvas />
        <AboutusSection />
      </div>
      <ServiceSlider />

      <Footer />
    </main>
  )
}
