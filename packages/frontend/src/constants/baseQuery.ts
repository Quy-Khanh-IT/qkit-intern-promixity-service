import { API_ENDPOINT, ROUTE, StorageKey } from '@/constants'
import { checkValidRoutes } from '@/middleware/middleware.util'
import { getFromLocalStorage } from '@/utils/local-storage.util'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { getPresentUrl } from '../utils/helpers.util'
import { IUserInformation } from '@/types/user'
import { RoleEnum } from '@/types/enum'
import cookies from 'js-cookie'

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  prepareHeaders: (headers) => {
    const token = getFromLocalStorage(StorageKey._ACCESS_TOKEN)
    if (token) {
      headers.set('Authorization', `Bearer ${String(token)}`)
    }
    return headers
  },
  validateStatus(response: Response) {
    // const userRole = cookies().get(StorageKey._USER_ROLE)
    const userRole = getFromLocalStorage(StorageKey._USER_ROLE) as string
    const checkProtectedRoute: boolean = checkValidRoutes(getPresentUrl())

    if (response.status === (HttpStatusCode.Unauthorized as number)) {
      console.log('checkProtectedRoute', checkProtectedRoute, userRole);
      if (checkProtectedRoute) {
        toast.error('Token is required ne')
        if (userRole === (RoleEnum._ADMIN as string)) {
          window.location.href = ROUTE.ADMIN_LOGIN
        } else {
          window.location.href = ROUTE.USER_LOGIN
        }
        throw new Error('Token is required')
      }
    }

    return isSuccess(response)
  }
})
function isSuccess(response: Response): boolean {
  return (
    response.status >= (HttpStatusCode.Ok as number) && response.status < (HttpStatusCode.MultipleChoices as number)
  )
}
