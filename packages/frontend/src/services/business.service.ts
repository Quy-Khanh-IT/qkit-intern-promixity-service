import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IBusiness, ICreateBusiness } from '@/types/business'
import { FilterOptions, IOptionsPipe, SelectionOptions } from '@/types/common'
import { IPaginationResponse } from '@/types/pagination'
import { IGetAllBusinessQuery } from '@/types/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import qs from 'qs'

export const businessApi = createApi({
  reducerPath: 'businessApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['BusinessInfo', 'BusinessPrivateList', 'BusinessList', 'Status'],
  endpoints: (builder) => ({
    // /user
    getPrivateBusinessProfile: builder.query<IBusiness, string>({
      query: (id) => ({
        url: `/businesses/${id}`,
        method: 'GET'
      }),
      providesTags: ['BusinessInfo']
    }),

    createBusiness: builder.mutation<IBusiness, ICreateBusiness>({
      query: (data) => {
        const { location, ...rest } = data
        const [lat, lng] = location.coordinates
        const body = {
          ...rest,
          location: {
            coordinates: [lng, lat]
          }
        }
        return {
          url: `/businesses`,
          method: 'POST',
          body
        }
      },
      invalidatesTags: ['BusinessList']
    }),
    // business
    getAllPrivateBusinesses: builder.query<IPaginationResponse<IBusiness>, IGetAllBusinessQuery>({
      query: (params) => {
        const queryString = qs.stringify(params, { arrayFormat: 'repeat' })
        return {
          url: `/businesses/users?${queryString}`,
          method: 'GET'
        }
      },
      transformResponse: (response: IPaginationResponse<IBusiness>): IPaginationResponse<IBusiness> => {
        const data: IBusiness[] = response.data.map((item: IBusiness) => {
          const categoryName = item.category?.name
          return {
            ...item,
            categoryName,
            overallRating: parseFloat(item.overallRating?.toFixed(1))
          } as IBusiness
        })
        return {
          ...response,
          data
        } as IPaginationResponse<IBusiness>
      },
      providesTags: ['BusinessPrivateList']
    }),

    // /admin
    getAllBusinesses: builder.query<IPaginationResponse<IBusiness>, IGetAllBusinessQuery>({
      query: (params) => {
        const queryString = qs.stringify(params, { arrayFormat: 'repeat' })
        return {
          url: `/businesses?${queryString}`,
          method: 'GET'
        }
      },
      transformResponse: (response: IPaginationResponse<IBusiness>): IPaginationResponse<IBusiness> => {
        const data: IBusiness[] = response.data.map((item: IBusiness) => {
          const categoryName = item.category?.name
          return {
            ...item,
            categoryName,
            overallRating: parseFloat(item.overallRating?.toFixed(1))
          } as IBusiness
        })
        return {
          ...response,
          data
        } as IPaginationResponse<IBusiness>
      },
      providesTags: ['BusinessList']
    }),
    getAllBusinessStatus: builder.query<IOptionsPipe, void>({
      query: () => ({
        url: `/businesses/status`,
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
      providesTags: ['Status']
    }),
    getAllBusinessActions: builder.query<SelectionOptions[], void>({
      query: () => ({
        url: `/businesses/actions`,
        method: 'GET'
      }),
      transformResponse: (response: string[]): SelectionOptions[] =>
        response.map(
          (action: string) =>
            ({
              label: action.toUpperCase(),
              value: action
            }) as SelectionOptions
        ),
      providesTags: ['Status']
    }),
    restoreDeletedBusiness: builder.mutation<void, string>({
      query: (id) => ({
        url: `/businesses/${id}/restore`,
        method: 'PATCH'
      }),
      invalidatesTags: ['BusinessList']
    }),
    updateBusinessStatus: builder.mutation<void, { type: string; id: string }>({
      query: (payload) => ({
        url: `/businesses/${payload.id}/status?type=${payload.type}`,
        method: 'PATCH'
      }),
      invalidatesTags: ['BusinessList']
    }),
    deleteBusiness: builder.mutation<void, { type: string; id: string }>({
      query: (payload) => ({
        url: `/businesses/${payload.id}`,
        method: 'DELETE',
        params: { type: payload.type }
      }),
      invalidatesTags: ['BusinessList']
    })
  })
})

export const {
  useGetPrivateBusinessProfileQuery,
  useGetAllBusinessesQuery,
  useGetAllPrivateBusinessesQuery,
  useGetAllBusinessStatusQuery,
  useGetAllBusinessActionsQuery,
  useUpdateBusinessStatusMutation,
  useRestoreDeletedBusinessMutation,
  useDeleteBusinessMutation,
  useCreateBusinessMutation
} = businessApi
