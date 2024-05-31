'use client'
import './credibility-section.scss'

export default function CredibilitySection(): React.ReactNode {
  return (
    <div id='cred' className='cred-section-container container'>
      <div className='cred-section-header'>
        <h1>
          Trusted by <strong>200,000+</strong>
        </h1>
        <h1>leading organization</h1>
      </div>

      <div className='row list-card container d-flex justify-content-center align-items-center'>
        <div className='col-lg-4 col-md-6 col-sm-12 card-wrapper'>
          <div className='ts-card first-card'>
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
        </div>
        <div className='col-lg-4 col-md-6 col-sm-12'>
          <div className='ts-card'>
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
        </div>
        <div className='col-lg-4 col-md-6 col-sm-12'>
          <div className='ts-card last-card'>
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
    </div>
  )
}
