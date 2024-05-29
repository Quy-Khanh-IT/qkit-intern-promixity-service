import { API_ENDPOINT } from '@/constants'

import { HttpClientInterface } from './http-client.interface'
import { HttpClientModel } from './http-client.model'

export const HttpClient: HttpClientInterface = HttpClientModel.createInstance({
  baseURL: API_ENDPOINT
})
