import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IBusinessUserStatisticQuery } from '@/types/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import { IBusinessUserStatistic, ICategoryStatistic } from '../types/statistic'
import qs from 'qs'

export const statisticApi = createApi({
  reducerPath: 'statisticApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['CategoryStatistic', 'BusinessUserStatistic'],
  endpoints: (builder) => ({
    getCategoryStatistic: builder.query<ICategoryStatistic, void>({
      query: () => {
        return {
          url: `/statistics/categories`,
          method: 'GET'
        }
      },
      providesTags: ['CategoryStatistic']
    }),
    getBusinessUserStatistic: builder.query<IBusinessUserStatistic, IBusinessUserStatisticQuery>({
      query: (params) => {
        const queryString = qs.stringify(params, { arrayFormat: 'repeat' })
        return {
          url: `/statistics/businesses-users?${queryString}`,
          method: 'GET'
        }
      },
      providesTags: ['BusinessUserStatistic']
    })
  })
})

export const { useGetCategoryStatisticQuery, useLazyGetBusinessUserStatisticQuery } = statisticApi
