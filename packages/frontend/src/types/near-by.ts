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
  pageSize: number
  currentPage: number
  totalPage: number | null
  data: IBusiness[] | []
  links: {
    first: string
    previous: string | null
    next: string | null
    last: string
  }
}
