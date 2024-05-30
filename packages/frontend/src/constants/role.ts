import { SelectionOptions } from '@/types/common'
import { RoleEnum } from '@/types/enum'

export const ROLE_OPTIONS: SelectionOptions[] = [
  { label: 'ADMIN', value: RoleEnum._ADMIN },
  { label: 'USER', value: RoleEnum._USER },
  { label: 'BUSINESS', value: RoleEnum._BUSINESS }
]
