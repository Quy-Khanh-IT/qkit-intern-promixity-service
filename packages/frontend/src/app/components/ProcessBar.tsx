'use client'
import './process-bar.scss'
export default function NavProcessBar(): React.ReactNode {
  const navClick = (name: string): void => {
    const element = document.getElementById(name)

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className='process-bar'>
      <div className='nav-inner'>
        <div className='nav-item'>
          <button onClick={() => navClick('hero')} className='nav-item-button is-active'>
            <span className='nav-item-button-inner'></span>
          </button>
          <button onClick={() => navClick('cred')} className='nav-item-button'>
            <span className='nav-item-button-inner'></span>
          </button>
          <button onClick={() => navClick('about-us')} className='nav-item-button'>
            <span className='nav-item-button-inner'></span>
          </button>
          <button className='nav-item-button'>
            <span className='nav-item-button-inner'></span>
          </button>
          <button className='nav-item-button'>
            <span className='nav-item-button-inner'></span>
          </button>
        </div>
      </div>
    </nav>
  )
}
