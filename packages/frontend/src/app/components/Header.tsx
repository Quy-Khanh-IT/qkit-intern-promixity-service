'use client'
import Link from 'next/link'
import './header.scss'
import { useEffect, useState } from 'react'

export default function Header(): React.ReactNode {
  const [toggle, setToggle] = useState<boolean>(false)

  useEffect(() => {
    const handleScroll = (): void => {
      const navbar = document.querySelector('.navbar')
      if (navbar) {
        if (window.scrollY > 0) {
          navbar.classList.add('scroll-down')
        } else {
          navbar.classList.remove('scroll-down')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)

    return (): void => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav className='navbar vw-100'>
      <div className='navbar-container container d-flex justify-content-between align-items-center w-100'>
        <div className='navbar-brand'>
          <Link href={'/'}>
            <img src='/logo.png' alt='Proximity Service' className='navbar-logo' />
          </Link>
        </div>
        <div className='navbar-menu d-none d-sm-block'>
          <div style={{ display: 'flex' }} className='flex'>
            <div className='navbar-item'>
              <Link href={'/about'}>About </Link>
            </div>
            <div className='navbar-item'>
              <Link href={'/work'}>Work </Link>
            </div>
            <div className='navbar-item'>
              <Link href={'/contact'}>Contact </Link>
            </div>
          </div>
        </div>

        <div className='navbar-menu d-block d-sm-none'>
          {!toggle ? (
            <i onClick={() => setToggle(!toggle)} className='fa-solid fa-bars nav-icon'></i>
          ) : (
            <i onClick={() => setToggle(!toggle)} className='fa-solid fa-xmark nav-icon'></i>
          )}

          {toggle ? (
            <div className='navbar-toggle-menu d-block d-sm-none'>
              <ul className='toggle-list'>
                <li className='toggle-item'>
                  <Link href={'/about'}>About</Link>
                </li>
                <li className='toggle-item'>
                  <Link href={'/work'}>Work</Link>
                </li>
                <li className='toggle-item'>
                  <Link href={'/contact'}>Contact</Link>
                </li>
              </ul>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </nav>
  )
}
