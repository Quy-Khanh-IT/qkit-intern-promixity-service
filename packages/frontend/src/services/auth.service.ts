import { ForgotPassword, RegisterData, ResetPassword, VerifyEmail } from '@/types/auth'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/auth' }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: 'login',
        method: 'POST',
        body
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: 'logout',
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
    }),
    resetPassword: builder.mutation({
      query: (body: ResetPassword) => ({
        url: 'reset-password',
        method: 'POST',
        body,
        headers: {
          'request-token-header': body.requestTokenHeader
        }
      })
    }),
    forgotPassword: builder.mutation({
      query: (body: ForgotPassword) => ({
        url: 'forgot-password',
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
  useResetPasswordMutation,
  useForgotPasswordMutation
} = authApi
