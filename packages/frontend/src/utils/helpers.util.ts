import { LOCAL_ENDPOINT } from '@/constants'
import { NotificationEnum, SortEnum, SortEnumAlias } from '@/types/enum'
import qs from 'qs'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export function formatDate(inputDate: string): string {
  const dateObj = new Date(inputDate)

  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  const seconds = String(dateObj.getSeconds()).padStart(2, '0')

  const formattedDate = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`

  return formattedDate
}

export function compareDates(date1: string, date2: string): number {
  const dateObj1 = new Date(date1)
  const dateObj2 = new Date(date2)

  return dateObj1.getTime() - dateObj2.getTime()
}

export const getPresentUrl = (): string => {
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.href
    const coreUrl = currentUrl && currentUrl.split(LOCAL_ENDPOINT || '')[1]
    return coreUrl
  }
  return ''
}

export const getTimeHistory = (expiryTime: string): string => {
  if (expiryTime === '') return ''
  dayjs.extend(relativeTime)
  return dayjs(new Date(expiryTime)).fromNow()
}

export const convertNotificationType = (type: string): string => {
  if (Object.values(NotificationEnum).includes(type as NotificationEnum)) {
    return type.toUpperCase()
  }
  return NotificationEnum._NO_SPECIFIC_TYPE.toUpperCase()
}

export const convertSortOrder = (order: string): string => {
  if (order === (SortEnumAlias._ASCEND as string)) {
    return SortEnum._ASC
  } else if (order === (SortEnumAlias._DESCEND as string)) {
    return SortEnum._DESC
  }
  return order
}

export const parseSearchParamsToObject = (searchParams: string): qs.ParsedQs => {
  return qs.parse(searchParams, { ignoreQueryPrefix: true })
}

export const getTimeUntilExpiry = (expiryTime: number): number => {
  const currentDate = new Date()
  const currentServerTime = new Date(currentDate.getTime())
  const expiryDate = new Date(expiryTime)
  if (currentServerTime <= expiryDate) {
    return Math.floor(expiryDate.getTime() - currentServerTime.getTime())
  } else {
    return 0
  }
}
