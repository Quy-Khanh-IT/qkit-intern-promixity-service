'use client'
import React, { useState } from 'react'
import './search-item-detail.scss'
import { Image } from 'antd'
import StarRating from './StarRating'

import { useDispatch, useSelector } from 'react-redux'
import { setSelectedBusiness } from '@/redux/slices/selected-business.slice'
import { IBusiness } from '@/types/business'
import { RootState } from '@/redux/store'

import Overview from './detail-navigation-menu/Overview'
import About from './detail-navigation-menu/About'

export default function SearchItemDetail(): React.ReactNode {
  const dispatch = useDispatch()
  const business: IBusiness | null = useSelector((state: RootState) => state.selectedBusiness.selectedBusinessData)

  const handleOnClose = (): void => {
    dispatch(setSelectedBusiness({ selectedBusinessId: null, selectedBusinessData: null }))
  }

  const [menuActive, setMenuActive] = useState<string>('Overview')

  const handleOnChangeMenu = (menu: string): void => {
    setMenuActive(menu)
  }

  return (
    <>
      {business ? (
        <div className='detail-container'>
          <div className='detail-container-wrapper h-100 v-100 scroll-bar-2'>
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
                  <div
                    onClick={() => handleOnChangeMenu('Overview')}
                    className=' menu-title col-md-4  pt-2 d-flex justify-content-center align-items-center'
                  >
                    <div className={`pb-2 ${menuActive === 'Overview' ? 'active' : ''}`}>Overview</div>
                  </div>
                  <div
                    onClick={() => handleOnChangeMenu('Reviews')}
                    className='menu-title col-md-4   pt-2 d-flex justify-content-center align-items-center'
                  >
                    <div className={`pb-2 ${menuActive === 'Reviews' ? 'active' : ''}`}>Reviews</div>
                  </div>
                  <div
                    onClick={() => handleOnChangeMenu('About')}
                    className='menu-title col-md-4   pt-2 d-flex justify-content-center align-items-center'
                  >
                    <div className={`pb-2 ${menuActive === 'About' ? 'active' : ''}`}>About</div>
                  </div>
                </div>
              </div>

              <>
                {menuActive === 'Overview' ? (
                  <Overview business={business} />
                ) : menuActive === 'Reviews' ? (
                  <div>Reviews</div>
                ) : (
                  <About business={business} />
                )}
              </>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}
