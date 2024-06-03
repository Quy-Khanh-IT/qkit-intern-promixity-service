import { TableProps } from 'antd'

export type ColumnsType<T extends object> = TableProps<T>['columns']

export interface SelectionOptions {
  label: string
  value: string
}

export interface FilterOptions {
  text: string
  value: string
}

export interface IOptionsPipe {
  selectionOpts: SelectionOptions[]
  filterOpts: FilterOptions[]
}

export interface IDecodedData {
  data: string
}

export const ColorConstant = {
  _GREEN: 'green', // admin - approved
  _GEEK_BLUE: 'geekblue', // user - pending
  _GOLD: 'gold', // business - rejected
  _RED: 'error', // banned
  _GREY: 'default', // closed
  _PINK: 'pink'
} as const

export interface IQuotes {
  content: string
  owner: string
  position: string
}
