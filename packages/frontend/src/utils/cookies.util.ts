import Cookies from 'js-cookie'

export const setCookieFromClient = (key: string, value: string): void => {
  Cookies.set(key, value, {
    expires: 7, // Expires in 7 days
    path: '/',
    // secure: process.env.NODE_ENV === 'production', // only works on https
    sameSite: 'strict'
  })
}
