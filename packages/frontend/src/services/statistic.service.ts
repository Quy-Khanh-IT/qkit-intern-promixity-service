import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IBusinessUserStatisticQuery } from '@/types/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import {
  IBusinessStatusStatistic,
  IBusinessStatusStatisticItem,
  IBusinessUserStatistic,
  ICategoryStatistic
} from '../types/statistic'
import qs from 'qs'

export const statisticApi = createApi({
  reducerPath: 'statisticApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['CategoryStatistic', 'BusinessUserStatistic', 'BusinessStatusStatistic'],
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
    }),
    getBusinessStatusStatistic: builder.query<IBusinessStatusStatistic, void>({
      query: () => {
        return {
          url: `/statistics/businesses/status`,
          method: 'GET'
        }
      },
      transformResponse: (response: IBusinessStatusStatistic): IBusinessStatusStatistic => {
        const dataTemp: IBusinessStatusStatisticItem[] = [...response.data].sort((itemA, itemB) =>
          itemA.status.localeCompare(itemB.status)
        )
        return {
          ...response,
          data: dataTemp
        } as IBusinessStatusStatistic
      },
      providesTags: ['BusinessStatusStatistic']
    })
  })
})

export const {
  useGetCategoryStatisticQuery,
  useLazyGetBusinessUserStatisticQuery,
  useGetBusinessStatusStatisticQuery
} = statisticApi
