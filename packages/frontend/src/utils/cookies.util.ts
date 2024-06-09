import Cookies from 'js-cookie'

export const setCookieFromClient = (key: string, value: string): void => {
  Cookies.set(key, value, {
    expires: 7, // Expires in 7 days
    path: '/',
    sameSite: 'strict'
  })
}

export const removeCookieFromClient = (key: string): void => {
  Cookies.remove(key, {
    path: '/',
    sameSite: 'strict'
  })
}

export const clearCookiesFromClient = (): void => {
  const allCookies = Cookies.get()

  for (const key in allCookies) {
    if (Object.prototype.hasOwnProperty.call(allCookies, key)) {
      Cookies.remove(key, {
        path: '/',
        sameSite: 'strict'
      })
    }
  }
}
