import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '@/services/auth.service'
import { otpApi } from '@/services/otp.service'
import { addressApi } from '@/services/address.service'
import { rtkQueryErrorLogger } from '@/utils/catching-error-rtk-util'

// const persistedReducer = storePersist(reducers);

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [otpApi.reducerPath]: otpApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, otpApi.middleware, addressApi.middleware, rtkQueryErrorLogger)
})

setupListeners(store.dispatch)

// export const persistor = persistStore(store);

export type RootState = ReturnType<typeof reducers>
