import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/otps' }),
  endpoints: (builder) => ({
    registrationOTP: builder.mutation({
      query: (body: { email: string }) => ({
        url: 'registration',
        method: 'POST',
        body
      })
    })
  })
})

export const { useRegistrationOTPMutation } = otpApi
