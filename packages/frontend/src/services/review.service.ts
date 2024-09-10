import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IGetAllReviewOfAdminQuery } from '@/types/query'
import qs from 'qs'
import {
  ICreateCommentPayload,
  ICreateResponseCommentPayload,
  ICreateReviewPayload,
  IEmotions,
  IGetReviewOfBusinessPayload,
  IGetReviewOfBusinessResponse,
  IReply,
  IReplyReply,
  IReview
} from '@/types/review'

import { createApi } from '@reduxjs/toolkit/query/react'

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
    }),
    getEmotions: builder.query<IEmotions, void>({
      query: () => ({
        url: `/reviews/emotions`,
        method: 'GET'
      })
    }),
    getReviewsById: builder.query<IReview, string>({
      query: (reviewId) => `/reviews/${reviewId}?offset=1`,
      providesTags: ['ReviewList']
    }),
    restoreReviewById: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reviews/${id}/restore`,
        method: 'PATCH'
      }),
      invalidatesTags: ['ReviewList']
    }),
    deleteReviewById: builder.mutation<void, { deleteType: string; reviewId: string }>({
      query: (payload) => ({
        url: `/reviews/${payload.reviewId}?type=${payload.deleteType}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['ReviewList']
    }),
    deleteCommentById: builder.mutation<void, string>({
      query: (commentId) => ({
        url: `/reviews/${commentId}/comments`,
        method: 'DELETE'
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
  useGetReviewsForAdminQuery,
  useGetEmotionsQuery,
  useGetReviewsByIdQuery,
  useDeleteReviewByIdMutation,
  useDeleteCommentByIdMutation,
  useRestoreReviewByIdMutation
} = reviewApi
