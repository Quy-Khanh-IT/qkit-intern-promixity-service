'use client'
import Footer from '@/app/components/Footer'
import HeroSection from '@/app/components/HeroSection'
import Header from '@/app/components/Header'
import ServiceSlider from '@/app/components/ServiceSlider'
import StarsCanvas from './components/canvas/Star'
import CredibilitySection from './components/CredibilitySection'
import AboutSection from './components/AboutSection'

export default function Home(): React.ReactNode {
  return (
    <main>
      <Header />

      <div style={{ position: 'relative', zIndex: 0 }} className='scroll-bar-1'>
        <HeroSection />
        <CredibilitySection />
        <StarsCanvas />
        <AboutSection />
      </div>
      <ServiceSlider />

      <Footer />
    </main>
  )
}
