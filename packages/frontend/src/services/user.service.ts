import { API_ENDPOINT } from '@/constants'
import { baseQueryWithAuth } from '@/constants/baseQuery'
import { HttpClient } from '@/models/http-client/http-client'
import { HttpRequestParamsInterface } from '@/models/http-client/http-request-params.interface'
import { FilterOptions, IOptionsPipe, SelectionOptions } from '@/types/common'
import { IPaginationResponse } from '@/types/pagination'
import { IGetAllUsersQuery } from '@/types/query'
import { IUpdatePasswordPayload, IUpdateProfilePayload, IUserInformation } from '@/types/user'
import { createApi } from '@reduxjs/toolkit/query/react'
import { omit } from 'lodash-es'
import qs from 'qs'

export const getMyProfile = (userId: string): Promise<IUserInformation> => {
  const params: HttpRequestParamsInterface = {
    requiresToken: true,
    url: `${API_ENDPOINT}/users/${userId}/profile`
  }

  return HttpClient.get(params)
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['UserInfo', 'UserList', 'Roles'],
  endpoints: (builder) => ({
    // /user
    getPrivateUserProfile: builder.query<IUserInformation, { userId: string; userStatus?: string }>({
      query: (payload) => {
        const queryString = qs.stringify(omit(payload, 'userId'), { arrayFormat: 'repeat' })
        return {
          url: `/users/${payload.userId}/profile?${queryString}`,
          method: 'GET'
        }
      },
      providesTags: ['UserInfo']
    }),
    updatePrivateUserProfile: builder.mutation<
      IUserInformation,
      { userId: string; userData: Omit<IUpdateProfilePayload, 'email'> }
    >({
      query: (payload) => ({
        url: `/users/${payload.userId}/profile`,
        method: 'PATCH',
        body: payload.userData
      }),
      invalidatesTags: ['UserInfo']
    }),
    updatePasswordProfile: builder.mutation<void, { userId: string; passwordPayload: IUpdatePasswordPayload }>({
      query: (payload) => ({
        url: `/users/${payload.userId}/password`,
        method: 'PATCH',
        body: payload.passwordPayload
      })
    }),

    // /admin
    getAllUsers: builder.query<IPaginationResponse<IUserInformation>, IGetAllUsersQuery>({
      query: (params) => {
        const queryString = qs.stringify(params, { arrayFormat: 'repeat' })
        return {
          url: `/admin/users?${queryString}`,
          method: 'GET'
        }
      },
      providesTags: ['UserList']
    }),
    getAllRoles: builder.query<IOptionsPipe, void>({
      query: () => ({
        url: `/admin/roles`,
        method: 'GET'
      }),
      transformResponse: (response: string[]): IOptionsPipe => {
        const _tempSelectData: SelectionOptions[] = response?.map(
          (role: string) =>
            ({
              label: role.toUpperCase(),
              value: role
            }) as SelectionOptions
        )

        const _tempFilterData: FilterOptions[] = response?.map(
          (role: string) =>
            ({
              text: role.toUpperCase(),
              value: role
            }) as FilterOptions
        )

        return {
          selectionOpts: _tempSelectData,
          filterOpts: _tempFilterData
        } as IOptionsPipe
      },
      providesTags: ['Roles']
    }),
    updateUserRole: builder.mutation<void, { role: string; id: string }>({
      query: (payload) => ({
        url: `/admin/users/${payload.id}/role`,
        method: 'PATCH',
        body: omit(payload, 'id')
      }),
      invalidatesTags: ['UserList']
    }),
    restoreDeletedUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/restore`,
        method: 'PATCH'
      }),
      invalidatesTags: ['UserList']
    }),
    deleteUser: builder.mutation<void, { deleteType: string; id: string }>({
      query: (payload) => ({
        url: `/admin/users/${payload.id}`,
        method: 'DELETE',
        params: { deleteType: payload.deleteType }
      }),
      invalidatesTags: ['UserList']
    })
  })
})

export const {
  useGetPrivateUserProfileQuery,
  useUpdatePrivateUserProfileMutation,
  useUpdatePasswordProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserRoleMutation,
  useRestoreDeletedUserMutation,
  useGetAllRolesQuery
} = userApi
