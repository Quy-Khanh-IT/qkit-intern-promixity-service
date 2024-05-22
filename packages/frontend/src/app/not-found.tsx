'use client'

import { useRouter } from 'next/navigation'
import NavBar from './components/NavBar'
import StarsCanvas from './components/canvas/Star'
import './not-found.scss'

export default function NotFound() {
  const router = useRouter()

  const handleBackToHome = () => {
    router.push('/')
  }

  return (
    <div className='vh-100 main-container '>
      <NavBar />
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center not-found-wrapper'>
        <img src='./images/404-not-found.png' alt='404' />
        <div className='not-fount-content d-flex flex-column justify-content-center align-items-center'>
          <h2 className='text-center'>Oh Man, Error 404</h2>
          <span>Sorry, the page you looking for is in hiding.</span>
          <button onClick={handleBackToHome} className='mt-5 btn btn-primary btn-home'>
            Back to home page
          </button>
        </div>
      </div>
      <StarsCanvas />
    </div>
  )
}
