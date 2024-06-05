import { IBusiness } from './business'

export interface IFindNearByPayLoad {
  offset?: number
  limit?: number
  q?: string
  latitude: number
  longitude: number
  radius: number
  isHighRating?: boolean
  timeOpenType?: string
  day?: string
  openTime?: string
  start?: number
  categoryId?: string
  isNearest?: boolean
}

export interface IFindNearByResponse {
  totalRecords: number
  pageSize: number
  currentPage: number
  totalPages: number | null
  data: IBusiness[] | []
  links: {
    first: string
    previous: string | null
    next: string | null
    last: string
  }
}
