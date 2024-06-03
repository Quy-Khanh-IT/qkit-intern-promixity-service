import { ColorConstant } from '@/types/common'
import { RoleEnum, StatusEnum } from '@/types/enum'

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

export const generateStatusColor = (role: string): string => {
  let color: string = ColorConstant._PINK

  if (role === (StatusEnum._APPROVED as string)) {
    color = ColorConstant._GREEN
  } else if (role === (StatusEnum._PENDING as string)) {
    color = ColorConstant._GEEK_BLUE
  } else if (role === (StatusEnum._REJECTED as string)) {
    color = ColorConstant._GOLD
  } else if (role === (StatusEnum._BANNED as string)) {
    color = ColorConstant._RED
  } else if (role === (StatusEnum._CLOSED as string)) {
    color = ColorConstant._GREY
  }

  return color
}
