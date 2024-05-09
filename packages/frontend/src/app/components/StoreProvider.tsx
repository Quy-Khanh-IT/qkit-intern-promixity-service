import React, { useRef, ReactNode, useState } from 'react'
import { Provider } from 'react-redux'
import { persistor, store } from '../../../redux/store'
import { PersistGate } from 'redux-persist/integration/react'

interface StoreProviderProps {
  children: ReactNode
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const storeRef = useRef(store)
  const [SetSun, setSetSun] = useState()

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default StoreProvider
