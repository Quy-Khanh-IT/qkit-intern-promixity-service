'use client'
import { store } from '@/redux/store'
import React, { useRef, ReactNode } from 'react'
import { Provider } from 'react-redux'

interface StoreProviderProps {
  children: ReactNode
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const storeRef = useRef<typeof store>(store)

  return <Provider store={storeRef.current}>{children}</Provider>
}

export default StoreProvider
