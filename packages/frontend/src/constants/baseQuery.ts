import { HttpStatusCode } from 'axios'
import { API_ENDPOINT, ROUTE, StorageKey } from '@/constants'
import { getFromLocalStorage } from '@/utils/storage.util'

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
    if (response.status === (HttpStatusCode.Unauthorized as number)) {
      window.location.href = ROUTE.LOGIN
      throw new Error('Token is required')
    }
    console.log('response', response)
    return isSuccess(response)
  }
})
function isSuccess(response: Response): boolean {
  return (
    response.status >= (HttpStatusCode.Ok as number) && response.status < (HttpStatusCode.MultipleChoices as number)
  )
}
