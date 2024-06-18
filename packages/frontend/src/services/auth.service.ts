import { baseQueryWithAuth } from '@/constants/baseQuery'
import {
  IForgotPasswordPayload,
  ILoginPayload,
  ILoginResponse,
  IRegisterUserPayload,
  IRegisterUserResponse,
  IResetPasswordPayload,
  IVerifyEmailPayload
} from '@/types/auth'
import { createApi } from '@reduxjs/toolkit/query/react'

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
    registerUser: builder.mutation<IRegisterUserResponse, IRegisterUserPayload>({
      query: (body) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body
      })
    }),
    verifyEmail: builder.mutation<void, IVerifyEmailPayload>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
        headers: {
          'verify-token-header': body.verifyTokenHeader
        }
      })
    }),
    refreshToken: builder.mutation<ILoginResponse, string>({
      query: (refreshToken) => ({
        url: '/auth/refreshToken',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
    }),
    resetPassword: builder.mutation<void, IResetPasswordPayload>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
        headers: {
          'request-token-header': body.requestTokenHeader
        }
      })
    }),
    forgotPassword: builder.mutation<void, IForgotPasswordPayload>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body
      })
    })
  })
})

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useRefreshTokenMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation
} = authApi
