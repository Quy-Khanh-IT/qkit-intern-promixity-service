import { API_ENDPOINT } from '@/constants'
import { baseQueryWithAuth } from '@/constants/baseQuery'
import { HttpClient } from '@/models/http-client/http-client'
import { HttpRequestParamsInterface } from '@/models/http-client/http-request-params.interface'
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
