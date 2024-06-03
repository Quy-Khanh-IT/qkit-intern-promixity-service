import { useState } from 'react'
import { getFromSessionStorage, removeFromSessionStorage, saveToSessionStorage } from '@/utils/session-storage.util'
import { IUserInformation } from '@/types/user'

export const useSessionStorage = (
  key: string,
  initialValue: string | IUserInformation | boolean
): [unknown, (_value: string | boolean | IUserInformation | number) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<unknown>(() => {
    try {
      return getFromSessionStorage(key) ?? initialValue
    } catch (error) {
      console.warn(`Error reading sessionStorage key “${key}”:`, error)
      return initialValue
    }
  })

  const setValue = (value: string | boolean | IUserInformation | number): void => {
    try {
      saveToSessionStorage(key, value)
      setStoredValue(value)
    } catch (error) {
      console.warn(`Error setting sessionStorage key “${key}”:`, error)
    }
  }

  const removeValue = (): void => {
    try {
      removeFromSessionStorage(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing sessionStorage key “${key}”:`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}
