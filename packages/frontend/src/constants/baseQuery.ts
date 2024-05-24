import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HttpStatusCode } from 'axios'

import { API_ENDPOINT, ROUTE } from '~/constants'
import { HttpClientModel } from '~/models/http-client/http-client.model'

const httpClient = HttpClientModel.getInstance()

export const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_ENDPOINT,
  prepareHeaders: (headers) => {
    const token = httpClient.getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
  validateStatus(response) {
    if (response.status === HttpStatusCode.Unauthorized) {
      window.location.href = ROUTE.LOGIN
      throw new Error('Token is required')
    }
    return isSuccess(response)
  }
})
function isSuccess(response: Response): boolean {
  return response.status >= HttpStatusCode.Ok && response.status < HttpStatusCode.MultipleChoices
}
