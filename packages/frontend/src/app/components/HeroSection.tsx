'use client'
import EarthCanvas from './canvas/Earth'
import { motion } from 'framer-motion'
import { slideIn } from '../../utils/motion'
import './hero-section.scss'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const [text] = useTypewriter({
    words: ['Chính', 'Bách', 'Ngọc', 'Tuấn', 'Khánh', 'QKIT Intern Team'],
    typeSpeed: 120
  })

  const router = useRouter()

  return (
    <div id='hero' className='hero-wrap '>
      <div className='hero-content'>
        <div>
          <h1>PROXIMITY SERVICE</h1>
          <div className={text === 'QKIT Intern Team' ? 'subtitle done' : 'subtitle'}>
            Created by: {text}
            <span style={{ color: 'white' }}>
              <Cursor cursorStyle={text === 'QKIT Intern Team' ? '🔥' : '|'} />
            </span>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',

              margin: '16px 0 24px 24px'
            }}
          >
            <button onClick={() => router.push('/signin')} className='hero-btn'>
              JOIN NOW
            </button>
          </div>
          <div style={{ maxWidth: '700px', marginTop: '8px' }}>
            <span>
              Welcome to <strong style={{ color: '#64ffda', fontWeight: '500' }}> Proximity Service</strong> !
              We`&apos;re a platform dedicated to providing exceptional location-based experiences with unique
              customization options and utilities. With advanced technology and a vast database, we make it easy for you
              to find places, calculate distances, and even create proximity zones. Discover how{' '}
              <strong style={{ color: '#64ffda', fontWeight: '500' }}> Proximity Service</strong> can enhance your
              journey starting now!
            </span>
          </div>
        </div>
      </div>
      <div className='hero-container'>
        <motion.div variants={slideIn('right', 'tween', 0.2, 1)} className='planet'>
          <EarthCanvas />
        </motion.div>
      </div>
    </div>
  )
}
