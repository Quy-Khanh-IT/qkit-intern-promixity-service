'use client'
import { useState } from 'react'
import './about-section.scss'
import { Image } from 'antd'

export default function AboutUsSection() {
  const [tabs, setTabs] = useState<number>(0)

  const handleTabs = (index: number) => {
    setTabs(index)
  }

  return (
    <div id='aboutus' className='aboutus-section-container container'>
      <div className='aboutus-section-top'>
        <div className='aboutus-content'>
          <div className='sub-title'>ABOUT US</div>
          <div className='title'>
            <h1>
              {' '}
              We provide the best <strong>finding</strong> service for you
              <Image src='./images/zigzag.png' alt='zigzag' />
            </h1>
          </div>

          <ul className='nav-tabs'>
            <li onClick={() => handleTabs(0)} className={tabs === 0 ? 'nav-item active' : 'nav-item'}>
              About PS
            </li>
            <li onClick={() => handleTabs(1)} className={tabs === 1 ? 'nav-item active' : 'nav-item'}>
              Our Mission
            </li>
            <li onClick={() => handleTabs(2)} className={tabs === 2 ? 'nav-item active' : 'nav-item'}>
              {' '}
              Our Vision
            </li>
          </ul>

          <div className='tab-content'>
            {tabs === 0 ? (
              <div className='tab-item'>
                <div className='content'>
                  We are a team passionate about connecting communities through technology. With the mission of
                  providing an easy and meaningful connection experience, we built proximity service to help people
                  connect with each other and the world around them in a smart and convenient way.
                </div>
                <ul className='critia-list'>
                  <li className='critia-item'>
                    <i className='fa-solid fa-check'></i>
                    <div> Smart and convenient community connection.</div>
                  </li>
                  <li className='critia-item'>
                    <i className='fa-solid fa-check'></i>
                    The team is passionate about technology and connection.
                  </li>
                </ul>
              </div>
            ) : tabs === 1 ? (
              <div className='tab-item'>
                <div className='content'>
                  Our mission is to create a powerful, connected community where people can share, interact, and
                  experience meaningfully. We are committed to providing a reliable and easy-to-use proximity service
                  that helps people connect with each other more naturally and closely.
                </div>
                <ul className='critia-list'>
                  <li className='critia-item'>
                    <i className='fa-solid fa-check'></i>
                    <div> Provide a reliable and easy-to-use connection platform.</div>
                  </li>
                  <li className='critia-item'>
                    <i className='fa-solid fa-check'></i>
                    Build a strong and meaningful community of connections.
                  </li>
                </ul>
              </div>
            ) : tabs === 2 ? (
              <div className='tab-item'>
                <div className='content'>
                  Our vision is to become an indispensable part of people&apos;s daily lives, by providing a smart and
                  convenient connectivity platform. We hope to create a strong community where people can enjoy
                  memorable relationships and experiences in everyday life.
                </div>
                <ul className='critia-list'>
                  <li className='critia-item'>
                    <i className='fa-solid fa-check'></i>
                    <div>Become an indispensable part of daily life.</div>
                  </li>
                  <li className='critia-item'>
                    <i className='fa-solid fa-check'></i>
                    Build a strong community, enjoy relationships and memorable experiences.
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <div className='aboutus-thumb'>
          <Image className='thumb-1' src='./images/earth-aboutus.svg' alt='thumb' />
        </div>
      </div>
      <div className='aboutus-section-bottom'>
        <ul className='bento-wrapper'>
          <li className='data-item primary-item'>
            <h2>300k+ Users</h2>
          </li>
          <li className='data-item'>2</li>
          <li className='data-item'>3</li>
          <li className='data-item'>4</li>
        </ul>
      </div>
    </div>
  )
}
