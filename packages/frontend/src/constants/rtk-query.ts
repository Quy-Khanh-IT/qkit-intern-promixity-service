import { BaseQueryFn, CreateApiOptions, EndpointDefinitions, SubscriptionOptions } from '@reduxjs/toolkit/query'

export const RTK_FETCH = {
  REFRESH_ON_FOCUS: true,
  REFRESH_ON_RECONNECT: true,
  REFRESH_ON_MOUNT_OR_ARG_CHANGE: 1,
  POOLING_INTERVAL: 10000
}

export const defaultFetchOptions: Pick<
  CreateApiOptions<BaseQueryFn, EndpointDefinitions>,
  'refetchOnFocus' | 'refetchOnMountOrArgChange'
> = {
  refetchOnFocus: RTK_FETCH.REFRESH_ON_FOCUS,
  refetchOnMountOrArgChange: RTK_FETCH.REFRESH_ON_MOUNT_OR_ARG_CHANGE
}

export const fetchVersionOptions: Pick<
  SubscriptionOptions,
  'refetchOnFocus' | 'pollingInterval' | 'refetchOnReconnect'
> = {
  refetchOnFocus: RTK_FETCH.REFRESH_ON_FOCUS,
  refetchOnReconnect: RTK_FETCH.REFRESH_ON_RECONNECT,
  pollingInterval: RTK_FETCH.POOLING_INTERVAL
}
