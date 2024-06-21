import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IGetAllReviewOfAdminQuery } from '@/types/query'
import qs from 'qs'
import {
  ICreateCommentPayload,
  ICreateResponseCommentPayload,
  ICreateReviewPayload,
  IGetReviewOfBusinessPayload,
  IGetReviewOfBusinessResponse,
  IReply,
  IReplyReply,
  IReview
} from '@/types/review'

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const reviewApi = createApi({
  reducerPath: 'reviewApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['ReviewList', 'NearBy'],
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
    createReview: builder.mutation<IReview, ICreateReviewPayload>({
      query: (params) => ({
        url: `/reviews`,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['ReviewList', 'NearBy']
    }),
    createComment: builder.mutation<IReply, ICreateCommentPayload>({
      query: (params) => ({
        url: `/reviews/${params.reviewId}/comment`,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['ReviewList']
    }),
    createResponseComment: builder.mutation<IReplyReply, ICreateResponseCommentPayload>({
      query: (params) => ({
        url: `/reviews/${params.commentId}/response`,
        method: 'POST',
        body: params
      }),
      invalidatesTags: ['ReviewList']
    })
  })
})

export const {
  useGetReviewsForBusinessQuery,
  useCreateReviewMutation,
  useCreateCommentMutation,
  useCreateResponseCommentMutation,
  useGetReviewsForAdminQuery
} = reviewApi
