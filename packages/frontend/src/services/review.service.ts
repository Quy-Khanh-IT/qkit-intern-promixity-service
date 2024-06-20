import { API_ENDPOINT } from '@/constants'
import { IGetReviewOfAdminQuery } from '@/types/query'
import { IGetReviewOfBusinessPayload, IGetReviewOfBusinessResponse } from '@/types/review'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  tagTypes: ['ReviewList'],
  endpoints: (builder) => ({
    getReviewsForBusiness: builder.query<IGetReviewOfBusinessResponse, IGetReviewOfBusinessPayload>({
      query: (params) => ({
        url: `/reviews/${params.businessId}/filter`,
        method: 'GET',
        params
      }),
      providesTags: ['ReviewList']
    }),
    getReviewsForAdmin: builder.query<IGetReviewOfBusinessResponse, IGetReviewOfAdminQuery>({
      query: (params) => ({
        url: `/reviews`,
        method: 'GET',
        params
      }),
      providesTags: ['ReviewList']
    })
  })
})

export const { useGetReviewsForBusinessQuery, useGetReviewsForAdminQuery } = reviewApi
