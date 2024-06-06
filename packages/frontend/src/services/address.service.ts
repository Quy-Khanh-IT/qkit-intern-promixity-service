import { API_ENDPOINT } from '@/constants'
import { District, Province } from '@/types/address'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    getProvinces: builder.query<{ count: number; items: Province[] }, void>({
      query: () => '/address/provinces'
    }),
    getDistrictByProvinceCode: builder.query<{ count: number; items: District[] }, string>({
      query: (provinceCode: string) => `/address/districts/${provinceCode}`
    })
  })
})

export const { useGetProvincesQuery, useGetDistrictByProvinceCodeQuery } = addressApi
