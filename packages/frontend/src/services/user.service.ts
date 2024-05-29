import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IUserInformation } from '@/types/user'
import { createApi } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['UserInfo'],
  endpoints: (builder) => ({
    getProfile: builder.query<IUserInformation, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET'
      }),
      providesTags: ['UserInfo']
    })
  })
})

export const { useGetProfileQuery } = userApi
