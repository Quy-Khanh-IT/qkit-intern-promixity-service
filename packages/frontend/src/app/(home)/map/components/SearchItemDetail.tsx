'use client'
import React from 'react'
import './search-item-detail.scss'
import { Image } from 'antd'
import StarRating from './StarRating'
import ItemService from './search-item/ItemService'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedBusiness } from '@/redux/slices/selected-business.slice'
import { IBusiness } from '@/types/business'
import { RootState } from '@/redux/store'

export default function SearchItemDetail(): React.ReactNode {
  const dispatch = useDispatch()
  const business: IBusiness | null = useSelector((state: RootState) => state.selectedBusiness.selectedBusinessData)

  const handleOnClose = (): void => {
    dispatch(setSelectedBusiness({ selectedBusinessId: null, selectedBusinessData: null }))
  }

  return (
    <>
      {business ? (
        <div className='detail-container'>
          <div onClick={handleOnClose} className='close-btn d-flex align-items-center justify-content-center'>
            <i className='fa-solid fa-xmark'></i>
          </div>
          <Image
            src={business.images?.[0]?.url ? business.images?.[0]?.url : './images/default_business.png'}
            width={360}
            height={240}
            alt='business-image'
            className='detail-thumb'
            fallback='./images/default_business.png'
          />
          <div className='detail-content-wrapper w-100'>
            <div className='p-3'>
              <h5 className='detail-title'>{business.name}</h5>
              <StarRating rating={business.overallRating} totalReview={business.totalReview} />
              <div className='business-category'>{business.category.name}</div>
            </div>

            <div className='navigation-menu container '>
              <div className='menu-tab-list row'>
                <div className=' menu-title col-md-4  pt-2 d-flex justify-content-center align-items-center'>
                  <div className='active pb-2'>Overview</div>
                </div>
                <div className='menu-title col-md-4   pt-2 d-flex justify-content-center align-items-center'>
                  <div className=' pb-2'>Reviews</div>
                </div>
                <div className='menu-title col-md-4   pt-2 d-flex justify-content-center align-items-center'>
                  <div className=' pb-2'>About</div>
                </div>
              </div>
            </div>

            <div className='service-wrapper p-3 pt-4 pb-4 d-flex align-items-center justify-content-between'>
              <div className='service-list d-flex  align-items-center '>
                <ItemService isDetail={true} services={business.services} />
              </div>
              <div className='next-icon'>
                <i className='fa-solid fa-angle-right'></i>
              </div>
            </div>

            <div className='detail-content-wrapper p-3'>
              <div className='list-detail'>
                <div className='detail-item d-flex align-items-center mt-2'>
                  <div className='detail-icon pe-3'>
                    <i className='fa-solid fa-location-dot'></i>
                  </div>
                  <div className='detail-content'>
                    97/1 ấp Long Đức 1, T.p, tổ 13, Tam Phước, Thành phố Biên Hòa, Đồng Nai, Vietnam
                  </div>
                </div>

                <div className='detail-item d-flex align-items-center mt-3'>
                  <div className='detail-icon pe-3'>
                    <i className='fa-regular fa-clock'></i>
                  </div>
                  <div className='detail-content'>OPEN Close 10PM</div>
                </div>

                <div className='detail-item d-flex align-items-center mt-3'>
                  <div className='detail-icon pe-3'>
                    <i className='fa-solid fa-phone'></i>
                  </div>
                  <div className='detail-content'>+84 909764132</div>
                </div>

                <div className='detail-item d-flex align-items-center mt-3'>
                  <div className='detail-icon pe-3'>
                    <i className='fa-solid fa-location-crosshairs'></i>
                  </div>
                  <div className='detail-content'>VXC5+QM Thành phố Biên Hòa, Dong Nai, Vietnam</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
