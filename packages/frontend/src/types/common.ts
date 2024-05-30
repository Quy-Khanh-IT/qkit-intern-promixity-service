import { TableProps } from 'antd'

export type ColumnsType<T extends object> = TableProps<T>['columns']

export interface SelectionOptions {
  label: string
  value: string
}

export interface IDecodedData {
  data: string
}

export const ColorConstant = {
  _GREEN: 'green',
  _GEEK_BLUE: 'geekblue',
  _VOLCANO: 'volcano'
} as const
