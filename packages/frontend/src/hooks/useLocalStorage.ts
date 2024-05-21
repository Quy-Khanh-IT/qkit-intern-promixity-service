import { useState } from 'react'
import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from '@/utils/storage.util'

export const useLocalStorage = (
  key: string,
  initialValue: string | boolean
): [unknown, (_value: string | boolean | number) => void, () => void] => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return getFromLocalStorage(key)
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error)
    }
  })

  const setValue = (value: string | boolean | number) => {
    try {
      saveToLocalStorage(key, value)
      setStoredValue(value)
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error)
    }
  }

  const removeValue = () => {
    try {
      removeFromLocalStorage(key)
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key “${key}”:`, error)
    }
  }

  return [storedValue, setValue, removeValue]
}
