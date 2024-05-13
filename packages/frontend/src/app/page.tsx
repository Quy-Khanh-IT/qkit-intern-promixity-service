'use client'
import Footer from '@/app/components/Footer'
import HeroSection from '@/app/components/HeroSection'
import Navbar from '@/app/components/Navbar'
import ServiceSlider from '@/app/components/ServiceSlider'
import AboutusSection from './components/AboutusSection'
import StarsCanvas from './components/canvas/Star'
import CredibilitySection from './components/CredibilitySection'
import NavProcessbar from './components/NavProcessbar'

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
