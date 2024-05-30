import { API_ENDPOINT } from '@/constants'
import { baseQueryWithAuth } from '@/constants/baseQuery'
import { HttpClient } from '@/models/http-client/http-client'
import { HttpRequestParamsInterface } from '@/models/http-client/http-request-params.interface'
import { IPaginationResponse } from '@/types/pagination'
import { GetAllUsersQuery } from '@/types/query'
import { IUserInformation } from '@/types/user'
import { createApi } from '@reduxjs/toolkit/query/react'

export const getMyProfile = (userId: string): Promise<IUserInformation> => {
  const params: HttpRequestParamsInterface = {
    requiresToken: true,
    url: `${API_ENDPOINT}/users/${userId}`
  }

  return HttpClient.get(params)
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['UserInfo', 'UserList'],
  endpoints: (builder) => ({
    // /user
    getProfile: builder.query<IUserInformation, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: 'GET'
      }),
      providesTags: ['UserInfo']
    }),

    // /admin
    getAllUsers: builder.query<IPaginationResponse<IUserInformation>, GetAllUsersQuery>({
      query: (params) => ({
        url: `/admin/users`,
        method: 'GET',
        params
      }),
      providesTags: ['UserList']
    })
  })
})

export const { useGetProfileQuery, useGetAllUsersQuery } = userApi
