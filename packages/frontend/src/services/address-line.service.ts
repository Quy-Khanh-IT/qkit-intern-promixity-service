import { API_ENDPOINT_NOMINATIM } from '@/constants'
import { IAddressLinePayload, IAddressLineResponse } from '@/types/address'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const addressLineApi = createApi({
  reducerPath: 'addressLineApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT_NOMINATIM }),
  endpoints: (builder) => ({
    getAddressLine: builder.query<IAddressLineResponse[], IAddressLinePayload>({
      query: (params) => ({
        url: '/search.php?',
        method: 'GET',
        params
      })
    })
  })
})

export const { useGetAddressLineQuery } = addressLineApi
