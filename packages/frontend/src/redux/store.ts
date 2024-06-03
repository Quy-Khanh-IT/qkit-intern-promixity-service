import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '@/services/auth.service'
import { otpApi } from '@/services/otp.service'
import { addressApi } from '@/services/address.service'
import { rtkQueryErrorLogger } from '@/utils/catching-error-rtk-util'
import { userApi } from '@/services/user.service'
import { nearByApi } from '@/services/near-by.service'
import { mapPropsSlice } from './slices/map-props.slice'

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [nearByApi.reducerPath]: nearByApi.reducer,
    mapProps: mapPropsSlice.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      otpApi.middleware,
      addressApi.middleware,
      nearByApi.middleware,
      rtkQueryErrorLogger
    )
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
