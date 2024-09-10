import React, { useState } from 'react'
import './search-item.scss'
import { IBusiness, IDayOfWeek, ISelectedBusiness } from '@/types/business'
import { Image } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import StarRating from './StarRating'
import ItemService from './search-item/ItemService'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedBusiness } from '@/redux/slices/selected-business.slice'
import { RootState } from '@/redux/store'
import ItemStatus from './search-item/ItemStatus'

export default function SearchItem({
  business,
  handleItemClick,
  handleChangeFetch
}: {
  business: IBusiness
  handleItemClick: () => void
  handleChangeFetch: (value: boolean) => void
}): React.ReactNode {
  const [lastClickTime, setLastClickTime] = useState<number | null>(null)
  const dispatch = useDispatch()
  const selectedBusinessId = useSelector((state: RootState) => state.selectedBusiness.selectedBusinessId)

  const handleOnClick = (): void => {
    const currentTime = new Date().getTime()

    const data: ISelectedBusiness = {
      selectedBusinessId: business.id,
      selectedBusinessData: business
    }
    dispatch(setSelectedBusiness(data))

    if (lastClickTime && currentTime - lastClickTime < 300) {
      // when double click
      handleItemClick()
    } else {
      setLastClickTime(currentTime)
    }
  }

  return (
    <div
      onClick={handleOnClick}
      className={`business-detail-wrapper ${selectedBusinessId === business.id ? 'selected' : ''} container pb-4 d-flex justify-content-between pt-4`}
    >
      <div className='content-left pe-1'>
        <div className='business-title'>
          {business.name}
          <span className='distance'>{` - ${business._distance}m `}</span>
        </div>
        <StarRating rating={business.overallRating} totalReview={business.totalReview} />
        <div className='d-flex mb-1'>
          <div className='business-category'>{business.category.name}</div>
          <div className='ms-1 me-1'>-</div>
          <div className='business-address'>{business.addressLine}</div>
        </div>
        <div className='business-status-wrapper'>
          <ItemStatus business={business} />
        </div>
        <div className='mt-3 d-flex align-items-center'>
          <ItemService services={business.services} />
        </div>
      </div>
      <div className='content-right'>
        <Image
          src={business.images?.[0]?.url ? business.images?.[0]?.url : './images/default_business.png'}
          width={84}
          height={84}
          alt='business-image'
          className='business-image'
          fallback='./images/default_business.png'
        />
      </div>
    </div>
  )
}
