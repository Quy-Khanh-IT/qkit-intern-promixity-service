import './service-slick.scss'

export default function ServiceSlick(service: { service: { image: string; name: string } }): React.ReactNode {
  return (
    <div className='service-slick'>
      <div className='slick-container'>
        <div>
          <div
            style={{
              borderTopLeftRadius: '26px',
              height: '64px',
              width: '64px',

              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img style={{ height: '42px' }} src={service.service.image} alt='' />
          </div>
        </div>

        <div
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            display: 'flex',
            padding: '12px'
          }}
        >
          <div style={{ color: 'white' }}>{service.service.name}</div>
        </div>
      </div>
    </div>
  )
}
