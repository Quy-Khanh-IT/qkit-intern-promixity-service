import { RoleEnum, SortEnum } from './enum'

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
  categoryId: string
  starsRating: string[]
  district: string
  province: string
  status: string[]
  dayOfWeek: string
}
