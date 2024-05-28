import { API_ENDPOINT } from '@/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    getProfile: builder.mutation({
      query: (body: { email: string; password: string }) => ({
        url: '/admin/users',
        method: 'GET',
        body
      })
    })
  })
})

export const { useGetProfileMutation } = userApi
