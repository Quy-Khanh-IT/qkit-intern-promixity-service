import { HttpStatusCode } from 'axios'
import { API_ENDPOINT, LOCAL_ENDPOINT, ROUTE, StorageKey } from '@/constants'
import { getFromLocalStorage } from '@/utils/storage.util'
import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import { checkValidRoutes } from '@/middleware/middleware.util'
import { toast } from 'react-toastify'

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
    const currentUrl = window.location.href
    const coreUrl = currentUrl && currentUrl.split(LOCAL_ENDPOINT || '')[1]
    const checkProtectedRoute: boolean = checkValidRoutes(coreUrl)

    if (response.status === (HttpStatusCode.Unauthorized as number)) {
      if (checkProtectedRoute) {
        window.location.href = ROUTE.USER_LOGIN
        toast.error('Token is required')
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

export const GET_PROFILE_OPTIONS = {
  ACTIVE: 'active',
  DELETED: 'deleted'
}
