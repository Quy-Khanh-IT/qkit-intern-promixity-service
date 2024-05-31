'use client'

import { useRouter } from 'next/navigation'
import Header from '@/app/components/Header'
import { Image } from 'antd'
import StarsCanvas from './components/canvas/Star'
import './not-found.scss'

export default function NotFound(): React.ReactNode {
  const router = useRouter()

  const handleBackToHome = (): void => {
    router.push('/')
  }

  return (
    <div className='vh-100 main-container '>
      <Header />
      <div className='h-100 w-100 d-flex flex-column justify-content-center align-items-center not-found-wrapper'>
        <Image className='image-float' src='./images/404-not-found.png' alt='404' preview={false} />
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
