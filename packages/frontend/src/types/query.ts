import { RoleEnum, SortEnum } from './enum'

export interface GetAllUsersQuery {
  offset: number
  limit: number
  startDate?: string
  endDate?: string
  sortBy: SortEnum
  isDeleted: boolean
  email: string
  firstName: string
  lastName: string
  phone: string
  role: RoleEnum
}
