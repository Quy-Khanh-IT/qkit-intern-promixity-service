import { baseQueryWithAuth } from '@/constants/baseQuery'
import {
  ICreateReviewPayload,
  IGetReviewOfBusinessPayload,
  IGetReviewOfBusinessResponse,
  IReview
} from '@/types/review'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Review', 'NearBy'],
  endpoints: (builder) => ({
    getReviewsForBusiness: builder.query<IGetReviewOfBusinessResponse, IGetReviewOfBusinessPayload>({
      query: (params) => ({
        url: `/reviews/${params.businessId}/filter`,
        method: 'GET',
        params
      }),
      providesTags: ['Review']
    }),
    createReview: builder.mutation<IReview, ICreateReviewPayload>({
      query: (params) => ({
        url: `/reviews`,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['Review', 'NearBy']
    })
  })
})

export const { useGetReviewsForBusinessQuery, useCreateReviewMutation } = reviewApi
