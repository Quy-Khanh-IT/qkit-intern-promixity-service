import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getFromLocalStorage } from './utils/storage.util'
import { StorageKey } from './constants'

// Các route yêu cầu người dùng phải đăng nhập
const protectedRoutes = ['/manage-user', '/manage-business']

export function middleware(req: NextRequest) {
  // Lấy token
  const token = getFromLocalStorage(StorageKey._ACCESS_TOKEN)
  console.log('token', token)

  // Kiểm tra nếu người dùng đang cố gắng truy cập vào route được bảo vệ mà không có token
  // if (protectedRoutes.includes(req.nextUrl.pathname) && !token) {
  //   // Chuyển hướng người dùng đến trang đăng nhập
  //   return NextResponse.redirect(new URL('/admin-signin', req.url))
  // }

  // Nếu có token hoặc route không được bảo vệ, cho phép tiếp tục
  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'] // Định nghĩa các route mà middleware sẽ áp dụng
}
