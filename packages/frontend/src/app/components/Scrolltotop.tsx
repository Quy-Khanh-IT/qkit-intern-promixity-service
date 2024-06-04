'use client'
import { useState, useEffect } from 'react'
import './scroll-to-top.scss'

const ScrollToTopButton = (): React.ReactNode => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const handleScroll = (): void => {
    if (window.scrollY > 200) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return (): void => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`scroll-to-top ${isVisible ? 'show' : ''}`} onClick={scrollToTop}>
      <i className='fa-solid fa-angle-up'></i>
    </div>
  )
}

export default ScrollToTopButton
