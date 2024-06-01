import { ColorConstant } from '@/types/common'
import { RoleEnum } from '@/types/enum'

export const generateRoleColor = (role: string): string => {
  let color: string = ''

  if (role === (RoleEnum._ADMIN as string)) {
    color = ColorConstant._GREEN
  } else if (role === (RoleEnum._USER as string)) {
    color = ColorConstant._GEEK_BLUE
  } else if (role === (RoleEnum._BUSINESS as string)) {
    color = ColorConstant._VOLCANO
  }

  return color
}
