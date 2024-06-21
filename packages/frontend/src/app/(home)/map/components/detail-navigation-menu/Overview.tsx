import { IBusiness } from '@/types/business'
import ItemService from '../search-item/ItemService'
import ItemStatus from '../search-item/ItemStatus'
import { Carousel, Image } from 'antd'
import './overview.scss'

export default function Overview({
  business,
  handleOnChangeMenu
}: {
  business: IBusiness
  handleOnChangeMenu(menu: string): void
}): React.ReactNode {
  return (
    <div>
      <div
        onClick={() => handleOnChangeMenu('About')}
        className='service-wrapper p-3 pt-4 pb-4 d-flex align-items-center justify-content-between'
      >
        <div className='service-list d-flex  align-items-center '>
          <ItemService isDetail={true} services={business.services} />
        </div>
        <div className='next-icon'>
          <i className='fa-solid fa-angle-right'></i>
        </div>
      </div>

      <div className='detail-main-content p-3'>
        <div className='list-detail'>
          <div className='detail-item d-flex align-items-center mt-2'>
            <div className='detail-icon pe-3'>
              <i className='fa-solid fa-location-dot'></i>
            </div>
            <div className='detail-content'>{business.fullAddress}</div>
          </div>

          <div className='detail-item d-flex align-items-center mt-3'>
            <div className='detail-icon pe-3'>
              <i className='fa-regular fa-clock'></i>
            </div>
            <div className='detail-content'>
              <ItemStatus business={business} />
            </div>
          </div>

          <div className='detail-item d-flex align-items-center mt-3'>
            <div className='detail-icon pe-3'>
              <i className='fa-solid fa-phone'></i>
            </div>
            <div className='detail-content'>+84 {business.phoneNumber}</div>
          </div>

          <div className='detail-item d-flex align-items-center mt-3'>
            <div className='detail-icon pe-3'>
              <i className='fa-solid fa-location-crosshairs'></i>
            </div>
            <div className='detail-content'>{` ${business.district}, ${business.province}, ${business.country}`}</div>
          </div>
        </div>
      </div>
      <div className='list-image-wrapper p-3'>
        <div className='title'>Photos</div>

        <Carousel className='mt-2 mb-2' arrows infinite={false}>
          {business && business.images && business.images.length > 0
            ? business.images.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image.url ? image.url : './images/default_business.png'}
                    alt='business-image'
                    fallback='./images/default_business.png'
                    height={160}
                    width={322}
                    className='image-item'
                    style={{ overflow: 'hidden', position: 'relative' }}
                  />
                </div>
              ))
            : ''}
        </Carousel>
      </div>
    </div>
  )
}
