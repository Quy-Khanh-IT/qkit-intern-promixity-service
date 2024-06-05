import { BooleanEnum, RoleEnum, SortEnum } from './enum'

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
  categoryIds: string[]
  // address
  starsRating: string[]
  status: string[]
}

export interface IGetAllNotificationQuery {
  offset: number
  limit: number
  isRead: BooleanEnum
}
