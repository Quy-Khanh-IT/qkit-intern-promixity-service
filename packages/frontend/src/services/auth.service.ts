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
      query: (body: { email: string; password: string }) => ({
        url: 'register',
        method: 'POST',
        body
      })
    })
  })
})

export const { useLoginUserMutation } = authApi
