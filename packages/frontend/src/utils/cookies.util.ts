import Cookies from 'js-cookie'

export const setCookieFromClient = (key: string, value: string): void => {
  Cookies.set(key, value, {
    expires: 7, // Cookie sẽ hết hạn sau 7 ngày
    path: '/',
    // secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng trong môi trường production
    sameSite: 'strict' // Ngăn chặn việc gửi cookie trong các request bên thứ ba
  })
}
