import { API_ENDPOINT } from '@/constants'
import { IServiceResponse } from '@/types/service'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const serviceApi = createApi({
  reducerPath: 'serviceApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    getServices: builder.query<IServiceResponse, void>({
      query: () => ({
        url: '/services',
        method: 'GET'
      })
    })
  })
})

export const { useGetServicesQuery } = serviceApi
