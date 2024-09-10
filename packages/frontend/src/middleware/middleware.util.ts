import { ROUTE } from '@/constants'

export const authRoutes = [ROUTE.USER_LOGIN, ROUTE.USER_SIGNUP, ROUTE.USER_FORGOT_PASSWORD, ROUTE.ADMIN_LOGIN]
export const adminRoutes = [ROUTE.DASHBOARD, ROUTE.MANAGE_USER, ROUTE.MANAGE_BUSINESS, ROUTE.ADMIN_PROFILE]
export const userRoutes = [ROUTE.USER_PROFILE, ROUTE.MY_BUSINESS, ROUTE.MY_BUSINESS_CREATE]

export const checkValidRoutes = (presentPath: string): boolean => {
  if (adminRoutes.includes(presentPath) || userRoutes.includes(presentPath)) {
    return true
  }
  return false
}
