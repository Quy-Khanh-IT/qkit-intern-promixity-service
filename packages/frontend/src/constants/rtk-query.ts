/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateApiOptions, SubscriptionOptions } from '@reduxjs/toolkit/query'

export const RTK_FETCH = {
  REFRESH_ON_FOCUS: true,
  REFRESH_ON_MOUNT_OR_ARG_CHANGE: 1,
  POOLING_INTERVAL: 10000
}

export const defaultFetchOptions: Pick<CreateApiOptions<any, any>, 'refetchOnFocus' | 'refetchOnMountOrArgChange'> = {
  refetchOnFocus: RTK_FETCH.REFRESH_ON_FOCUS,
  refetchOnMountOrArgChange: RTK_FETCH.REFRESH_ON_MOUNT_OR_ARG_CHANGE
}

export const fetchVersionOptions: Pick<SubscriptionOptions, 'refetchOnFocus' | 'pollingInterval'> = {
  refetchOnFocus: RTK_FETCH.REFRESH_ON_FOCUS,
  pollingInterval: RTK_FETCH.POOLING_INTERVAL
}
