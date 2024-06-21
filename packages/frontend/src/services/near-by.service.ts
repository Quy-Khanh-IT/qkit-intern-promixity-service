import { API_ENDPOINT_NEAR_BY } from '@/constants'
import { IFindNearByPayLoad, IFindNearByResponse } from '@/types/near-by'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const nearByApi = createApi({
  reducerPath: 'nearByApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT_NEAR_BY }),
  tagTypes: ['NearBy'],
  endpoints: (builder) => ({
    findNearBy: builder.query<IFindNearByResponse, IFindNearByPayLoad>({
      query: (params) => ({
        url: '/find-nearby',
        method: 'GET',
        params
      }),
      providesTags: ['NearBy']
    })
  })
})

export const { useFindNearByQuery } = nearByApi
