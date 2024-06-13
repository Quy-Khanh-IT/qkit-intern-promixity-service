import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from '@/utils/local-storage.util'
import { useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (_value: T) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const value = getFromLocalStorage<T>(key)
    return value !== null && value !== undefined ? value : initialValue
  })

  const setValue = (value: T): void => {
    try {
      saveToLocalStorage<T>(key, value)
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
