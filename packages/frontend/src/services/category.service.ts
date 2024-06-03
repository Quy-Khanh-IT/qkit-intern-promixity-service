import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IBusinessCategory } from '@/types/business'
import { FilterOptions, IOptionsPipe, SelectionOptions } from '@/types/common'
import { IOptionsPagination } from '@/types/pagination'
import { createApi } from '@reduxjs/toolkit/query/react'

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['CategoryList'],
  endpoints: (builder) => ({
    getAllBusinessCategories: builder.query<IOptionsPipe, void>({
      query: () => {
        return {
          url: `/categories`,
          method: 'GET'
        }
      },
      transformResponse: (response: IOptionsPagination<IBusinessCategory>): IOptionsPipe => {
        const _tempSelectData: SelectionOptions[] = response.items?.map(
          (category: IBusinessCategory) =>
            ({
              label: category.name,
              value: category.id
            }) as SelectionOptions
        )

        const _tempFilterData: FilterOptions[] = response.items?.map(
          (category: IBusinessCategory) =>
            ({
              text: category.name,
              value: category.id
            }) as FilterOptions
        )

        return {
          selectionOpts: _tempSelectData,
          filterOpts: _tempFilterData
        } as IOptionsPipe
      },
      providesTags: ['CategoryList']
    })
  })
})

export const { useGetAllBusinessCategoriesQuery } = categoryApi
