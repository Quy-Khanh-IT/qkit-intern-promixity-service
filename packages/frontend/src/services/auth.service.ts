import { baseQueryWithAuth } from '@/constants/baseQuery'
import { createApi } from '@reduxjs/toolkit/query/react'
import { ILoginPayload, ILoginResponse, IRegisterUser } from '../types/auth'

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
    registerUser: builder.mutation<void, IRegisterUser>({
      query: (body) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body
      })
    }),
    verifyEmail: builder.mutation<void, VerifyEmail>({
      query: (body) => ({
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
