import { IDayOfWeek } from './business'
import { BooleanEnum, RoleEnum, SortEnum, StatusEnum, UserOptionEnum } from './enum'

interface IGelAllQuery {
  offset: number
  limit: number
  startDate?: string
  endDate?: string
  sortBy: SortEnum
  isDeleted: boolean
}

export interface IGetAllUsersQuery extends IGelAllQuery {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: RoleEnum[]
}

export interface IGetAllBusinessQuery extends IGelAllQuery {
  name: string
  phoneNumber: string
  categoryIds: string[]
  starsRating: string[]
  sortTotalReviewsBy: SortEnum
  sortRatingBy: SortEnum
  address: string
  status: string[]
  dayOfWeek: IDayOfWeek[]
}

export interface IGetAllNotificationQuery {
  offset: number
  limit: number
  isRead: BooleanEnum
}

export interface IBusinessUserStatisticQuery {
  timeline: string
  year: number
  month: number
  statusBusiness: StatusEnum | 'all'
  statusUser: UserOptionEnum | 'all'
}
