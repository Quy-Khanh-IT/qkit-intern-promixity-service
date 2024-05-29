import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTE, StorageKey } from './constants'
import { cookies, headers } from 'next/headers'
import { RoleEnum } from './types/enum'
import { toast } from 'react-toastify'
import { TOAST_MSG } from './constants/common'

// Các route yêu cầu người dùng phải đăng nhập
const authRoutes = [ROUTE.USER_LOGIN, ROUTE.ADMIN_LOGIN]
const adminRoutes = [ROUTE.MANAGE_USER, ROUTE.MANAGE_BUSINESS]
const userRoutes = [ROUTE.ABOUT]

export function middleware(req: NextRequest): NextResponse {
  // Lấy token
  const token = cookies().get(StorageKey._ACCESS_TOKEN)
  const role = cookies().get(StorageKey._USER)
  const pathName = req.nextUrl.pathname
  const referer: string = getReferer()

  // Access protected routes without token
  if (checkValidRoutes(req) && !token) {
    return NextResponse.redirect(new URL(ROUTE.USER_LOGIN, req.url))
  }

  if (token) {
    // Admin-specific route access
    if (adminRoutes.includes(pathName)) {
      if (role?.value === RoleEnum._ADMIN) {
        return NextResponse.next()
      }
    }
    // User-specific route access
    else if (userRoutes.includes(pathName)) {
      if (role?.value === RoleEnum._USER) {
        return NextResponse.next()
      } else {
        toast.error(TOAST_MSG.NO_AUTHORIZATION)
        return NextResponse.redirect(new URL(referer ? referer : ROUTE.USER_LOGIN, req.url))
      }
    }

    if (authRoutes.includes(pathName)) {
      if (role?.value === RoleEnum._ADMIN) {
        return NextResponse.redirect(new URL(referer ? referer : ROUTE.MANAGE_USER, req.url))
      } else if (role?.value === RoleEnum._USER) {
        return NextResponse.redirect(new URL(referer ? referer : ROUTE.ABOUT, req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
  // '/((?!api|public|login|signup|_next/static|_next/image|favicon.ico).*)',
}

const checkValidRoutes = (req: NextRequest): boolean => {
  if (adminRoutes.includes(req.nextUrl.pathname) || userRoutes.includes(req.nextUrl.pathname)) {
    return true
  }
  return false
}

const getReferer = (): string => {
  const referer = headers().get('referer')
  let refererSplit: string = ''
  if (referer) {
    const localhostUrl = process.env.LOCALHOST_URL || ''
    refererSplit = referer.split(localhostUrl)[1]
  } else {
    console.log('Referer header is not present.')
  }
  return refererSplit
}
