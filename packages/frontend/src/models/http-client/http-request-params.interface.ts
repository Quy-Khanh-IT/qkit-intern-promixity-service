/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosRequestConfig } from 'axios'

export type HttpRequestParamsInterface<D = any> = AxiosRequestConfig<D> & {
  requiresToken?: boolean
  data?: D
}
