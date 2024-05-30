import { AxiosRequestConfig } from 'axios'

export type HttpRequestParamsInterface<D = unknown> = AxiosRequestConfig<D> & {
  requiresToken?: boolean
  data?: D
}
