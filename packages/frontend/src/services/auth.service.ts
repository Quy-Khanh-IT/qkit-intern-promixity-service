import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ILoginPayload, ILoginResponse, IRegisterUser } from '../types/auth'
import { API_ENDPOINT } from '@/constants'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
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
      query: (body: IRegisterUser) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body
      })
    })
  })
})

export const { useLoginUserMutation, useRegisterUserMutation } = authApi
