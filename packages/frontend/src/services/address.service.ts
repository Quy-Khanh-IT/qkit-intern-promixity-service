import { API_ENDPOINT } from '@/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => '/address/provinces'
    }),
    getDistrictByProvinceCode: builder.query({
      query: (provinceCode: string) => `/address/districts/${provinceCode}`
    })
  })
})

export const { useGetProvincesQuery, useGetDistrictByProvinceCodeQuery } = addressApi
