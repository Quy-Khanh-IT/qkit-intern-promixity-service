import React from 'react'
import './search-item.scss'
import { IBusiness, IDayOfWeek } from '@/types/business'
import { Image } from 'antd'
import dayjs, { Dayjs } from 'dayjs'

export default function SearchItem({ business }: { business: IBusiness }): React.ReactNode {
  const getStars = (rating: number): React.ReactNode => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <>
        {Array.from({ length: fullStars }, (_, index) => (
          <i key={`full-${index}`} className='fa-solid fa-star star-fill'></i>
        ))}
        {hasHalfStar && <i className='fa-solid fa-star-half star-fill'></i>}
        {Array.from({ length: emptyStars }, (_, index) => (
          <i key={`empty-${index}`} className='fa-solid fa-star'></i>
        ))}
      </>
    )
  }

  const renderServices = (): React.ReactNode => {
    const maxServices = 3
    const servicesToShow = business.services.slice(0, maxServices)
    return servicesToShow.map((service, index) => (
      <React.Fragment key={service.id}>
        <div>{service.name}</div>
        {index < servicesToShow.length - 1 && <div className='ms-1 me-1'>-</div>}
      </React.Fragment>
    ))
  }

  const getBusinessStatus = (): React.ReactNode => {
    const today: number = dayjs().day()
    const currentTime: Dayjs = dayjs()
    const dayOfWeekMap: { [key: number]: string } = {
      0: 'sunday',
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday'
    }

    const todaySchedule: IDayOfWeek | undefined = business.dayOfWeek.find(
      (day: IDayOfWeek) => day.day === dayOfWeekMap[today]
    )

    if (!todaySchedule) return null

    const openTime: Dayjs = dayjs(todaySchedule.openTime, 'HH:mm')
    const closeTime: Dayjs = dayjs(todaySchedule.closeTime, 'HH:mm')
    console.log(openTime, closeTime, todaySchedule)
    if (!openTime.isValid() || !closeTime.isValid()) {
      return <div className='business-open-status'>Invalid Time</div>
    }

    if (currentTime.isBefore(openTime)) {
      return <div className='business-open-status'>CLOSE - Opens at {openTime.format('HH:mm')}</div>
    }

    if (currentTime.isAfter(closeTime)) {
      return <div className='business-open-status'>CLOSE - Opens at {openTime.format('HH:mm')}</div>
    }

    const minutesUntilClose: number = closeTime.diff(currentTime, 'minute')

    if (minutesUntilClose <= 30) {
      return (
        <div className='business-open-status'>
          CLOSE SOON - Closes at {closeTime.format('HH:mm')} in {minutesUntilClose} minutes
        </div>
      )
    }

    return <div className='business-open-status'>OPEN - Closes at {closeTime.format('HH:mm')}</div>
  }

  return (
    <div className='business-detail-wrapper pb-4 d-flex justify-content-between pt-4'>
      <div className='content-left'>
        <div className='business-title'>{business.name}</div>
        <div className='business-rating d-flex align-items-center'>
          <div className='rating-count'>{business.overallRating}</div>
          <div className='rating-star '>{getStars(business.overallRating)}</div>
          <div className='total-rating'>{`(${business.totalReview})`}</div>
        </div>
        <div className='d-flex'>
          <div className='business-category'>{business.category.name}</div>
          <div className='ms-1 me-1'>-</div>
          <div className='business-address'>{business.addressLine}</div>
        </div>
        <div className='business-status-wrapper'>{getBusinessStatus()}</div>
        <div className='mt-3 d-flex'>{renderServices()}</div>
      </div>
      <div className='content-right'>
        <Image src={business.images?.[0]?.url} width={84} height={84} alt='business-image' className='business-image' />
      </div>
    </div>
  )
}
