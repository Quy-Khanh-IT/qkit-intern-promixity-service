import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '@/services/auth.service'
import { otpApi } from '@/services/otp.service'
import { addressApi } from '@/services/address.service'
import { rtkQueryErrorLogger } from '@/utils/catching-error-rtk-util'
import { userApi } from '@/services/user.service'
import { nearByApi } from '@/services/near-by.service'
import { mapPropsSlice } from './slices/map-props.slice'
import { businessApi } from '@/services/business.service'
import { categoryApi } from '@/services/category.service'
import { notificationApi } from '@/services/notification.service'
import { selectedBusinessSlice } from './slices/selected-business.slice'
import { serviceApi } from '@/services/service.service'
import { statisticApi } from '@/services/statistic.service'
import { addressLineApi } from '@/services/address-line.service'
import { sidebarPropsSlice } from './slices/sidebar.slice'
import { reviewApi } from '@/services/review.service'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [nearByApi.reducerPath]: nearByApi.reducer,
    mapProps: mapPropsSlice.reducer,
    selectedSidebarTab: sidebarPropsSlice.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    selectedBusiness: selectedBusinessSlice.reducer,
    [serviceApi.reducerPath]: serviceApi.reducer,
    [reviewApi.reducerPath]: reviewApi.reducer,
    [statisticApi.reducerPath]: statisticApi.reducer,
    [addressLineApi.reducerPath]: addressLineApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      businessApi.middleware,
      otpApi.middleware,
      addressApi.middleware,
      nearByApi.middleware,
      categoryApi.middleware,
      notificationApi.middleware,
      serviceApi.middleware,
      reviewApi.middleware,
      statisticApi.middleware,
      addressLineApi.middleware,
      rtkQueryErrorLogger,
      reviewApi.middleware
    )
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
