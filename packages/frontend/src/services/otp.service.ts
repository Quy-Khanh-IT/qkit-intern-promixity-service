import { API_ENDPOINT } from '@/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_ENDPOINT }),
  endpoints: (builder) => ({
    registrationOTP: builder.mutation({
      query: (body: { email: string }) => ({
        url: '/otps/registration',
        method: 'POST',
        body
      })
    })
  })
})

export const { useRegistrationOTPMutation } = otpApi
