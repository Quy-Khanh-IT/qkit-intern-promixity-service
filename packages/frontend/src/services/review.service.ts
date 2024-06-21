import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IGetAllReviewOfAdminQuery } from '@/types/query'
import { IGetReviewOfBusinessPayload, IGetReviewOfBusinessResponse, IReview } from '@/types/review'
import { createApi } from '@reduxjs/toolkit/query/react'
import qs from 'qs'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithAuth,
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
    }),
    getReviewsById: builder.query<IReview, string>({
      query: (reviewId) => `/reviews/${reviewId}?offset=1`,
      providesTags: ['ReviewList']
    })
  })
})

export const { useGetReviewsForBusinessQuery, useGetReviewsForAdminQuery, useGetReviewsByIdQuery } = reviewApi
