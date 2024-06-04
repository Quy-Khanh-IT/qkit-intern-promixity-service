import { LOCAL_ENDPOINT } from '@/constants'

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
