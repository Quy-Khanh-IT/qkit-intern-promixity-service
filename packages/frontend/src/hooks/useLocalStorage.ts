import { useState } from 'react'
import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from '@/utils/storage.util'
import { IUserInformation } from '@/types/user'

export const useLocalStorage = (
  key: string,
  initialValue: string | IUserInformation | boolean
): [unknown, (_value: string | boolean | IUserInformation | number) => void, () => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return getFromLocalStorage(key)
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
    }
  })

  const setValue = (value: string | boolean | IUserInformation | number): void => {
    try {
      saveToLocalStorage(key, value)
      setStoredValue(value)
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }

  const removeValue = (): void => {
    try {
      removeFromLocalStorage(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key “${key}”:`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}
