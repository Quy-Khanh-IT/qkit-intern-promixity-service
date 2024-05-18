import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/address' }),
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: () => '/provinces'
    })
  })
})

export const { useGetProvincesQuery } = addressApi
