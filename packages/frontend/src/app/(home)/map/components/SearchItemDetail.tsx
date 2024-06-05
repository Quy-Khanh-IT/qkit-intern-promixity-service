import React from 'react'
import './search-item-detail.scss'
import { Image } from 'antd'
import StarRating from './StarRating'

export default function SearchItemDetail(): React.ReactNode {
  return (
    <>
      <div className='detail-container'>
        <Image
          src={'./images/default_business.png'}
          width={360}
          height={240}
          alt='business-image'
          className='detail-thumb'
          fallback='./images/default_business.png'
        />
        <div className='detail-content-wrapper w-100'>
          <div className='p-3'>
            <h5 className='detail-title'>G CAFE Đồng Nai</h5>
            <StarRating rating={5} totalReview={133} />
            <div className='business-category'>Nhà hàng</div>
          </div>

          <div className='navigation-menu container '>
            <div className='menu-tab-list row pb-2 ps-3'>
              <div className='menu-title col-md-4 '>Overview</div>
              <div className='menu-title col-md-4'>Reviews</div>
              <div className='menu-title col-md-4'>About</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
