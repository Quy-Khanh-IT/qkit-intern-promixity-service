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

    const openTime: Dayjs = dayjs()
      .startOf('day')
      .hour(parseInt(todaySchedule.openTime.split(':')[0], 10))
      .minute(parseInt(todaySchedule.openTime.split(':')[1], 10))

    const closeTime: Dayjs = dayjs()
      .startOf('day')
      .hour(parseInt(todaySchedule.closeTime.split(':')[0], 10))
      .minute(parseInt(todaySchedule.closeTime.split(':')[1], 10))

    // Special handling for '00:00' close time and open time
    if (todaySchedule.openTime === '00:00' && todaySchedule.closeTime === '00:00') {
      return (
        <div className='business-open-status'>
          <span className='active-status'>OPEN ALL DAY</span>
        </div>
      )
    }

    if (!openTime.isValid() || !closeTime.isValid()) {
      console.error('Invalid Time:', {
        openTime: todaySchedule.openTime,
        closeTime: todaySchedule.closeTime
      })
      return <div className='business-open-status'>Invalid Time</div>
    }

    if (currentTime.isBefore(openTime)) {
      return (
        <div className='business-open-status'>
          <span className='close-status'>CLOSE</span> - Opens at {openTime.format('HH:mm A')}
        </div>
      )
    }

    if (currentTime.isAfter(closeTime)) {
      const nextOpenTime: Dayjs | null = findNextOpenTime(business.dayOfWeek, dayOfWeekMap, currentTime)
      if (nextOpenTime) {
        return (
          <div className='business-open-status'>
            <span className='close-status'> CLOSE</span> - Opens at {nextOpenTime.format('hh:mm A')}
          </div>
        )
      } else {
        return (
          <div className='business-open-status'>
            <span className='close-status'>CLOSE</span> - No upcoming open time found
          </div>
        )
      }
    }

    const minutesUntilClose: number = closeTime.diff(currentTime, 'minute')

    if (minutesUntilClose <= 30) {
      return (
        <div className='business-open-status'>
          <span className='close-soon-status'>CLOSE SOON</span> - Closes at {closeTime.format('HH:mm')} in{' '}
          {minutesUntilClose} minutes
        </div>
      )
    }

    return (
      <div className='business-open-status'>
        <span className='active-status'>OPEN</span> - Closes at {closeTime.format('HH:mm A')}
      </div>
    )
  }

  const findNextOpenTime = (
    dayOfWeek: IDayOfWeek[],
    dayOfWeekMap: { [key: number]: string },
    currentTime: Dayjs
  ): Dayjs | null => {
    const sortedDayOfWeek = [...dayOfWeek].sort((a, b) => {
      const dayA = Object.keys(dayOfWeekMap).find((key) => dayOfWeekMap[parseInt(key)] === a.day)
      const dayB = Object.keys(dayOfWeekMap).find((key) => dayOfWeekMap[parseInt(key)] === b.day)
      return parseInt(dayA || '0') - parseInt(dayB || '0')
    })

    for (const schedule of sortedDayOfWeek) {
      const openTime: Dayjs = dayjs()
        .startOf('day')
        .add(dayjs(`${schedule.openTime}`, 'HH:mm').hour(), 'hour')
        .add(dayjs(`${schedule.openTime}`, 'HH:mm').minute(), 'minute')

      if (openTime.isAfter(currentTime)) {
        return openTime
      }
    }

    return null
  }

  return (
    <div className='business-detail-wrapper container pb-4 d-flex justify-content-between pt-4'>
      <div className='content-left'>
        <div className='business-title'>
          {business.name}
          <span className='distance'>{` - ${business._distance} m `}</span>
        </div>
        <div className='business-rating d-flex align-items-center mb-1 mt-1'>
          <div className='rating-count'>{business.overallRating}</div>
          <div className='rating-star '>{getStars(business.overallRating)}</div>
          <div className='total-rating'>{`(${business.totalReview})`}</div>
        </div>
        <div className='d-flex mb-1'>
          <div className='business-category'>{business.category.name}</div>
          <div className='ms-1 me-1'>-</div>
          <div className='business-address'>{business.addressLine}</div>
        </div>
        <div className='business-status-wrapper'>{getBusinessStatus()}</div>
        <div className='mt-3 d-flex'>{renderServices()}</div>
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
