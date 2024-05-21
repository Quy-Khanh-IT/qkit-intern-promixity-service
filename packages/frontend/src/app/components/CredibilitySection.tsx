'use client'
import './creadibility-section.scss'
import { useRef } from 'react'

export default function AboutUsSection() {
  return (
    <div id='cred' className='cred-section-container container'>
      <div className='cred-section-header'>
        <h1>
          Trusted by <strong>200,000+</strong>
        </h1>
        <h1>leading organization</h1>
      </div>

      <div className='list-card'>
        <div className='ts-card'>
          <div className='ts-card-content'>
            <div className='ts-card-title'>OBSERVE</div>
            <div className='ts-card-description'>
              <div className='title'>{`> 100M`}</div>
              <div className='subtitle'>views</div>
            </div>
            <div className='ts-card-detail'>
              <div className='detail-content'>view more </div>
              <i className='fa-solid fa-arrow-right-long'></i>
            </div>
          </div>
        </div>
        <div
          className='ts-card'
          style={
            {
              '--card-color': '#146ef5',
              '--blur-color': 'rgba(21, 115, 255, 0.45)'
            } as any
          }
        >
          <div className='ts-card-content'>
            <div className='ts-card-title'>RESPONSE SPEED</div>
            <div className='ts-card-description'>
              <div className='title'>{`4X`}</div>
              <div className='subtitle'>faster speed to market</div>
            </div>
            <div className='ts-card-detail'>
              <div className='detail-content'>view more </div>
              <i className='fa-solid fa-arrow-right-long'></i>
            </div>
          </div>
        </div>
        <div
          className='ts-card'
          style={
            {
              '--card-color': '#ed52cb',
              '--blur-color': 'rgba(237, 82, 203,0.4)'
            } as any
          }
        >
          <div className='ts-card-content'>
            <div className='ts-card-title'>OBSERVE</div>
            <div className='ts-card-description'>
              <div className='title'>{`37 %`}</div>
              <div className='subtitle'>traffic increase one week post-launch</div>
            </div>
            <div className='ts-card-detail'>
              <div className='detail-content'>view more </div>
              <i className='fa-solid fa-arrow-right-long'></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
