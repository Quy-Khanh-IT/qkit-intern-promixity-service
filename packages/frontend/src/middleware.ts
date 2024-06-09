import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTE, StorageKey } from './constants'
import { cookies, headers } from 'next/headers'
import { RoleEnum } from './types/enum'
import { toast } from 'react-toastify'
import { TOAST_MSG } from './constants/common'
import { adminRoutes, authRoutes, checkValidRoutes, userRoutes } from './middleware/middleware.util'

export function middleware(req: NextRequest): NextResponse {
  const token = cookies().get(StorageKey._ACCESS_TOKEN)
  const role = cookies().get(StorageKey._USER_ROLE)
  const pathName = req.nextUrl.pathname
  const referer: string = getReferer()

  const returnNextResponse = (routeDirect: string): NextResponse => {
    return NextResponse.redirect(new URL(referer ? referer : routeDirect, req.url))
  }

  // Access protected routes without token
  if (checkValidRoutes(pathName) && !token) {
    if (role?.value === (RoleEnum._ADMIN as string)) {
      return NextResponse.redirect(new URL(ROUTE.ADMIN_LOGIN, req.url))
    } else if (pathName == ROUTE.USER_LOGIN) {
      return NextResponse.redirect(new URL(ROUTE.USER_LOGIN, req.url))
    }
  }

  if (token) {
    // Admin-specific route access
    if (adminRoutes.includes(pathName)) {
      if (role?.value === RoleEnum._ADMIN) {
        return NextResponse.next()
      } else {
        toast.error(TOAST_MSG.NO_AUTHORIZATION)
        return returnNextResponse(ROUTE.ADMIN_LOGIN)
      }
    }

    // User-specific route access
    if (userRoutes.includes(pathName)) {
      if (role?.value === RoleEnum._USER || RoleEnum._BUSINESS) {
        return NextResponse.next()
      } else {
        toast.error(TOAST_MSG.NO_AUTHORIZATION)
        return returnNextResponse(ROUTE.USER_LOGIN)
      }
    }

    if (authRoutes.includes(pathName)) {
      if (role?.value === RoleEnum._ADMIN) {
        return returnNextResponse(ROUTE.DASHBOARD)
      } else if (role?.value === RoleEnum._USER || RoleEnum._BUSINESS) {
        return returnNextResponse(ROUTE.USER_PROFILE)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*']
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
