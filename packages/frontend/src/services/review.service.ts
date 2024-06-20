import { API_ENDPOINT } from '@/constants'
import { IGetAllReviewOfAdminQuery } from '@/types/query'
import { IGetReviewOfBusinessPayload, IGetReviewOfBusinessResponse } from '@/types/review'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import qs from 'qs'

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
    getReviewsForAdmin: builder.query<IGetReviewOfBusinessResponse, IGetAllReviewOfAdminQuery>({
      query: (payload) => {
        const queryString = qs.stringify(payload, { arrayFormat: 'repeat' })
        return {
          url: `/reviews?${queryString}`,
          method: 'GET'
        }
      },
      providesTags: ['ReviewList']
    })
  })
})

export const { useGetReviewsForBusinessQuery, useGetReviewsForAdminQuery } = reviewApi
