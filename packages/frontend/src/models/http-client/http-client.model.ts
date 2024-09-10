import axios, { AxiosInstance, AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import qs from 'qs'

import { StorageKey } from '@/constants/storage'
import { generateError } from '@/utils/catching-error.util'
import { getFromLocalStorage } from '@/utils/local-storage.util'

import { HttpClientInterface } from './http-client.interface'
import { ErrorResponse } from '@/types/error'
type HttpClientOption = CreateAxiosDefaults

export class HttpClientModel implements HttpClientInterface {
  private axios: AxiosInstance

  public getToken(): string {
    const ACCESS_TOKEN = getFromLocalStorage(StorageKey._ACCESS_TOKEN) as string
    return ACCESS_TOKEN
  }

  private constructor(option?: HttpClientOption) {
    this.axios = axios.create({
      paramsSerializer: {
        serialize: (params) => {
          return qs.stringify(params)
        }
      },
      ...option
    })

    this.axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (config.headers) {
          const token = this.getToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          } else {
            window.location.href = '/signin'
            throw new Error('Token is required')
          }
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  public request<T>(parameters: InternalAxiosRequestConfig): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.axios
        .request(parameters)
        .then((response: AxiosResponse) => {
          resolve(response.data as T)
        })
        .catch((error: AxiosResponse) => {
          reject(error)

          if (error instanceof Error) {
            const customError = error as ErrorResponse
            if (customError) {
              generateError(customError)
            }
          }
        })
    })
  }

  public get<T>(parameters: InternalAxiosRequestConfig): Promise<T> {
    parameters.method = 'GET'
    return this.request<T>(parameters)
  }

  public post<T>(parameters: InternalAxiosRequestConfig): Promise<T> {
    parameters.method = 'POST'
    return this.request<T>(parameters)
  }

  public put<T>(parameters: InternalAxiosRequestConfig): Promise<T> {
    parameters.method = 'PUT'
    return this.request<T>(parameters)
  }

  public patch<T>(parameters: InternalAxiosRequestConfig): Promise<T> {
    parameters.method = 'PATCH'
    return this.request<T>(parameters)
  }

  public delete<T>(parameters: InternalAxiosRequestConfig): Promise<T> {
    parameters.method = 'DELETE'
    return this.request<T>(parameters)
  }

  private static instance: HttpClientModel

  public static getInstance(): HttpClientModel {
    if (!HttpClientModel.instance) {
      HttpClientModel.instance = new HttpClientModel()
    }
    return HttpClientModel.instance
  }

  public static createInstance(option: HttpClientOption): HttpClientModel {
    return new HttpClientModel(option)
  }
}
