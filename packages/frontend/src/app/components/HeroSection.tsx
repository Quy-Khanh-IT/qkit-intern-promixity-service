'use client'
import EarthCanvas from './canvas/Earth'
import { motion } from 'framer-motion'
import { slideIn } from '../../utils/motion'
import './hero-section.scss'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import { useRouter } from 'next/navigation'

export default function HeroSection(): React.ReactNode {
  const teamMembers: string[] = ['Chính', 'Bách', 'Ngọc', 'Tuấn', 'Khánh', 'QKIT Intern Team']
  const typeSpeedTransform: number = 120

  const [text] = useTypewriter({
    words: teamMembers,
    typeSpeed: typeSpeedTransform
  })

  const router = useRouter()

  return (
    <div id='hero' className='hero-wrap container d-flex align-items-center justify-content-center  pb-3'>
      <div className='row w-100'>
        <div className='hero-content col-lg-6 d-flex flex-column align-items-center justify-content-center mb-5 mb-lg-0'>
          <div>
            <h1>PROXIMITY SERVICE</h1>
            <div className={text === teamMembers[teamMembers.length - 1] ? 'subtitle done' : 'subtitle'}>
              Created by: {text}
              <span style={{ color: 'white' }}>
                <Cursor cursorStyle={text === teamMembers[teamMembers.length - 1] ? '🔥' : '|'} />
              </span>
            </div>
            <div className='d-flex align-items-center w-100 hero-content-wrapper'>
              <button onClick={() => router.push('/map')} className='hero-btn'>
                JOIN NOW
              </button>
            </div>
            <div className='content-detail'>
              <span>
                Welcome to <strong style={{ color: '#64ffda', fontWeight: '500' }}> Proximity Service</strong> !
                We`&apos;re a platform dedicated to providing exceptional location-based experiences with unique
                customization options and utilities. With advanced technology and a vast database, we make it easy for
                you to find places, calculate distances, and even create proximity zones. Discover how{' '}
                <strong style={{ color: '#64ffda', fontWeight: '500' }}> Proximity Service</strong> can enhance your
                journey starting now!
              </span>
            </div>
          </div>
        </div>
        <div className='hero-container col-lg-6 d-flex justify-content-center align-items-center'>
          <motion.div variants={slideIn('right', 'tween', 0.2, 1)} className='planet'>
            <EarthCanvas />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
