import { IBusiness } from '@/types/business'
import './about.scss'

export default function About({ business }: { business: IBusiness }): React.ReactNode {
  return (
    <div className='p-3'>
      <div className='title'>Service options</div>
      <div className='list-service mt-2'>
        {business && business.services && business.services.length > 0 ? (
          business.services.map((service, index) => (
            <div className='item-service d-flex align-items-center mb-2' key={service.id}>
              <i className='fa-solid fa-check me-2'></i>
              <div className='service-name'>{service.name}</div>
            </div>
          ))
        ) : (
          <div className='item-service'>No service available</div>
        )}
      </div>
    </div>
  )
}
