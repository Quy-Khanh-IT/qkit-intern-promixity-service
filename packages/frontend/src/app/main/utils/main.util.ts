import { ROUTE } from '@/constants'
import { ColorConstant } from '@/types/common'
import { RoleEnum, StatusEnum } from '@/types/enum'
import { ADMIN_SIDEBAR_OPTIONS, BUSINESS_SIDEBAR_OPTIONS, USER_SIDEBAR_OPTIONS } from '../admin.constant'
import { SidebarOption, SidebarOptions } from '@/types/menu'

export const generateRoleColor = (role: string): string => {
  let color: string = ColorConstant._PINK

  if (role === (RoleEnum._ADMIN as string)) {
    color = ColorConstant._GREEN
  } else if (role === (RoleEnum._USER as string)) {
    color = ColorConstant._GEEK_BLUE
  } else if (role === (RoleEnum._BUSINESS as string)) {
    color = ColorConstant._GOLD
  }

  return color
}

export const generateStatusColor = (status: string): string => {
  let color: string = ColorConstant._PINK

  if (status === (StatusEnum._APPROVED as string)) {
    color = ColorConstant._GREEN
  } else if (status === (StatusEnum._PENDING as string)) {
    color = ColorConstant._GEEK_BLUE
  } else if (status === (StatusEnum._REJECTED as string)) {
    color = ColorConstant._GOLD
  } else if (status === (StatusEnum._BANNED as string)) {
    color = ColorConstant._RED
  } else if (status === (StatusEnum._CLOSED as string)) {
    color = ColorConstant._GREY
  }

  return color
}

export const directRoutes = (role: string, adminRoute: string, userRoute: string): string => {
  if (role === (RoleEnum._ADMIN as string)) {
    return adminRoute
  } else if (role === (RoleEnum._USER as string) || role === (RoleEnum._BUSINESS as string)) {
    return userRoute
  }
  return ROUTE.ROOT
}

export const findKeyMenuBasedRoute = (role: string, routeValue: string): string => {
  let key: string = '1'

  const findKey = (options: SidebarOptions): string | undefined => {
    const foundOption = Object.entries(options).find(([routeAlias, _objectValue]: [string, SidebarOption]) => {
      const routeTemp: string = ROUTE[routeAlias as keyof typeof ROUTE]
      return routeValue.includes(routeTemp)
    })
    return foundOption ? foundOption[1].key : undefined
  }

  if (role === (RoleEnum._ADMIN as string)) {
    const adminKey = findKey(ADMIN_SIDEBAR_OPTIONS)
    if (adminKey) key = adminKey
  } else if (role === (RoleEnum._BUSINESS as string)) {
    const userKey = findKey(BUSINESS_SIDEBAR_OPTIONS)
    if (userKey) key = userKey
  } else if (role === (RoleEnum._USER as string)) {
    const userKey = findKey(USER_SIDEBAR_OPTIONS)
    if (userKey) key = userKey
  }

  return key
}

export const findRouteMenuBasedKey = (role: string, key: string): string => {
  let routeValue: string = '1'

  const findRoute = (options: SidebarOptions): string | undefined => {
    const foundOption = Object.entries(options).find(([_routeAlias, objectValue]: [string, SidebarOption]) => {
      return objectValue.key === key
    })
    return foundOption ? ROUTE[foundOption[0] as keyof typeof ROUTE] : undefined
  }

  if (role === (RoleEnum._ADMIN as string)) {
    const adminRoute = findRoute(ADMIN_SIDEBAR_OPTIONS)
    if (adminRoute) routeValue = adminRoute
  } else if (role === (RoleEnum._BUSINESS as string)) {
    const businessRoute = findRoute(BUSINESS_SIDEBAR_OPTIONS)
    if (businessRoute) routeValue = businessRoute
  } else if (role === (RoleEnum._USER as string)) {
    const userRoute = findRoute(USER_SIDEBAR_OPTIONS)
    if (userRoute) routeValue = userRoute
  }

  return routeValue
}
