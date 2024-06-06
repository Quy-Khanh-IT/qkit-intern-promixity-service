import { IService } from '@/types/business'
import React from 'react'
import './item-service.scss'
export default function ItemService({
  services,
  isDetail
}: {
  services: IService[]
  isDetail?: boolean
}): React.ReactNode {
  const maxServices = isDetail ? 2 : 3
  const servicesToShow: IService[] = services.slice(0, maxServices)

  if (services.length === 0) return null

  return servicesToShow.map((service, index) => (
    <React.Fragment key={service.id}>
      {isDetail ? <i className='fa-solid fa-check me-1 check-icon'></i> : ''}
      <div>{service.name}</div>
      {index < servicesToShow.length - 1 && (
        <div className='ms-2 me-2 dot'>
          <i className='fa-solid fa-circle'></i>
        </div>
      )}
    </React.Fragment>
  ))
}
