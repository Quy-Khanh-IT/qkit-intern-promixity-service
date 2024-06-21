import { IBusiness, IDayOfWeek } from '@/types/business'
import dayjs, { Dayjs } from 'dayjs'
import React from 'react'

export default function ItemStatus({ business }: { business: IBusiness }): React.ReactNode {
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

  const currentDayIndex = sortedDayOfWeek.findIndex((schedule) => schedule.day === dayOfWeekMap[currentTime.day()])

  for (let i = 1; i <= sortedDayOfWeek.length; i++) {
    const nextDayIndex = (currentDayIndex + i) % sortedDayOfWeek.length
    const schedule = sortedDayOfWeek[nextDayIndex]

    const nextOpenTime = dayjs()
      .day((currentTime.day() + i) % 7)
      .startOf('day')
      .hour(parseInt(schedule.openTime.split(':')[0], 10))
      .minute(parseInt(schedule.openTime.split(':')[1], 10))

    if (nextOpenTime.isAfter(currentTime)) {
      return nextOpenTime
    }
  }

  return null
}
