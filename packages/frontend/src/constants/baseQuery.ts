import { API_ENDPOINT, LOCAL_ENDPOINT, ROUTE, StorageKey } from '@/constants'
import { checkValidRoutes } from '@/middleware/middleware.util'
import { RoleEnum } from '@/types/enum'
import { getFromLocalStorage } from '@/utils/local-storage.util'
import { BaseQueryApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { HttpStatusCode } from 'axios'
import { toast } from 'react-toastify'
import { getPresentUrl } from '../utils/helpers.util'

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  prepareHeaders: (headers, api: Pick<BaseQueryApi, 'getState' | 'extra' | 'endpoint' | 'type' | 'forced'>) => {
    const token = getFromLocalStorage(StorageKey._ACCESS_TOKEN)
    const refreshToken = getFromLocalStorage(StorageKey._REFRESH_TOKEN)
    if (api.endpoint === 'refreshToken') {
      headers.set('Authorization', `Bearer ${String(refreshToken)}`)
    } else {
      if (token) {
        headers.set('Authorization', `Bearer ${String(token)}`)
      }
    }
    return headers
  },
  validateStatus(response: Response) {
    const userRole = getFromLocalStorage(StorageKey._USER_ROLE) as string
    const checkProtectedRoute: boolean = checkValidRoutes(getPresentUrl())

    if (response.status === (HttpStatusCode.Unauthorized as number)) {
      if (checkProtectedRoute) {
        toast.error('Token is required')
        if (userRole === (RoleEnum._ADMIN as string)) {
          window.location.href = LOCAL_ENDPOINT + ROUTE.ADMIN_LOGIN
        } else {
          window.location.href = LOCAL_ENDPOINT + ROUTE.USER_LOGIN
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
