export const saveToSessionStorage = (key: string, data: unknown): void => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving to session storage:', error)
    }
  } else {
    console.warn('sessionStorage is not available')
  }
}

export const getFromSessionStorage = (key: string): unknown => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      const dataString = sessionStorage.getItem(key)
      if (dataString) {
        return JSON.parse(dataString)
      } else {
        return null
      }
    } catch (error) {
      console.error('Error getting from session storage:', error)
      return null
    }
  } else {
    console.warn('sessionStorage is not available')
    return null
  }
}

export const removeFromSessionStorage = (key: string): void => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      sessionStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from session storage:', error)
    }
  } else {
    console.warn('sessionStorage is not available')
  }
}

export const clearSessionStorage = (): void => {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    try {
      sessionStorage.clear()
    } catch (error) {
      console.error('Error clearing session storage:', error)
    }
  } else {
    console.warn('sessionStorage is not available')
  }
}
