import { ROUTE } from '@/constants'

export const authRoutes = [ROUTE.USER_LOGIN, ROUTE.ADMIN_LOGIN]
export const adminRoutes = [ROUTE.DASHBOARD, ROUTE.MANAGE_USER, ROUTE.MANAGE_BUSINESS, ROUTE.ADMIN_PROFILE]
export const userRoutes = [ROUTE.USER_PROFILE]

export const checkValidRoutes = (presentPath: string): boolean => {
  if (adminRoutes.includes(presentPath) || userRoutes.includes(presentPath)) {
    return true
  }
  return false
}
