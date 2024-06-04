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

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [businessApi.reducerPath]: businessApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [nearByApi.reducerPath]: nearByApi.reducer,
    mapProps: mapPropsSlice.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer
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
      rtkQueryErrorLogger
    )
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>