import { RegisterData, VerifyEmail } from '@/types/auth'
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ILoginPayload, ILoginResponse } from '../types/auth'
import { API_ENDPOINT, StorageKey } from '@/constants'
import { getFromLocalStorage } from '@/utils/storage.util'
import { baseQueryWithAuth } from '@/constants/baseQuery'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    loginUser: builder.mutation<ILoginResponse, ILoginPayload>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    }),
    registerUser: builder.mutation({
      query: (body: RegisterData) => ({
        url: 'sign-up',
        method: 'POST',
        body
      })
    }),
    verifyEmail: builder.mutation({
      query: (body: VerifyEmail) => ({
        url: 'verify-email',
        method: 'POST',
        body,
        headers: {
          'verify-token-header': body.verifyTokenHeader
        }
      })
    })
  })
})

export const { useLoginUserMutation, useRegisterUserMutation, useVerifyEmailMutation } = authApi
