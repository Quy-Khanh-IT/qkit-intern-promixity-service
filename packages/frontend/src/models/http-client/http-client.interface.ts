import { HttpRequestParamsInterface } from './http-request-params.interface'

export interface HttpClientInterface {
  get<T>(_params: HttpRequestParamsInterface): Promise<T>
  post<T>(_params: HttpRequestParamsInterface): Promise<T>
  put<T>(_params: HttpRequestParamsInterface): Promise<T>
  patch<T>(_params: HttpRequestParamsInterface): Promise<T>
  delete<T>(_params: HttpRequestParamsInterface): Promise<T>
}
