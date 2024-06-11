import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from '@/constants/baseQuery'
import { IPaginationResponse } from '@/types/pagination'
import { INotification } from '@/types/notification'
import { IGetAllNotificationQuery } from '@/types/query'
import qs from 'qs'

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['NotificationList'],
  endpoints: (builder) => ({
    getAllNotifications: builder.query<IPaginationResponse<INotification>, IGetAllNotificationQuery>({
      query: (payload) => {
        const queryString = qs.stringify(payload, { arrayFormat: 'repeat' })
        return {
          url: `/notifications?${queryString}`,
          method: 'GET'
        }
      },
      providesTags: ['NotificationList']
    }),
    getNotificationsQuantity: builder.query<number, 'object'>({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET'
      }),
      providesTags: ['NotificationList']
    }),
    updateReadNotification: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH'
      })
    }),
    updateAllReadNotification: builder.mutation<void, void>({
      query: () => ({
        url: `/notifications/all/read`,
        method: 'PATCH'
      })
    })
  })
})

export const {
  useLazyGetAllNotificationsQuery,
  useGetNotificationsQuantityQuery,
  useUpdateReadNotificationMutation,
  useUpdateAllReadNotificationMutation
} = notificationApi
