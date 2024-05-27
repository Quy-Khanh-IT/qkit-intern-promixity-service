import { baseQueryWithAuth } from '@/constants/baseQuery'
import { createApi } from '@reduxjs/toolkit/query/react'
import { ILoginPayload, ILoginResponse, RegisterData, VerifyEmail } from '@/types/auth'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({
    loginUser: builder.mutation<ILoginResponse, ILoginPayload>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body
      })
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST'
      })
    }),
    registerUser: builder.mutation<void, RegisterData>({
      query: (body) => ({
        url: '/sign-up',
        method: 'POST',
        body
      })
    }),
    verifyEmail: builder.mutation<void, VerifyEmail>({
      query: (body) => ({
        url: '/verify-email',
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
