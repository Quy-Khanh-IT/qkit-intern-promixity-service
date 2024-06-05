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

export default function SearchItem({
  business,
  handleItemClick
}: {
  business: IBusiness
  handleItemClick: () => void
}): React.ReactNode {
  const [lastClickTime, setLastClickTime] = useState<number | null>(null)
  const dispatch = useDispatch()
  const selectedBusinessId = useSelector((state: RootState) => state.selectedBusiness.selectedBusinessId)
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
      return parseInt(dayA || '0', 10) - parseInt(dayB || '0', 10)
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
        <div className='business-status-wrapper'>{getBusinessStatus()}</div>
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
