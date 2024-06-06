import { StatusEnum } from './enum'

export interface IBusiness {
  name: string
  description: string
  phoneNumber: string
  website: string
  category: ICategory
  categoryName?: string // alias for category.name
  services: IService[]
  overallRating: number
  totalReview: number
  addressLine: string
  fullAddress: string
  province: string
  district: string
  country: string
  dayOfWeek: IDayOfWeek[]
  location: {
    coordinates: [number, number]
    type: string
  }
  userId?: Buffer
  status: StatusEnum
  images: IBusinessImage[]
  stars: IStar[]
  created_at: string
  updated_at: string
  deleted_at: string | null
  id: string
  score: number
  user_id: string
  _distance: number
}

export interface IStar {
  star: string
  count: number
}

export interface ICategory {
  name: string
  id: string
}

export interface IBusinessImage {
  url: string
  public_id: string
  etag: string
  phash: string
}

export interface IDayOfWeek {
  day: string
  openTime: string
  closeTime: string
  order?: number
}

export interface IBusinessCategory {
  name: string
  id: string
  description: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface IService {
  id: string
  name: string
  description: string
  order: number
}
