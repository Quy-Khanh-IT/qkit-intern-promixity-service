import { TableProps } from 'antd'

export type ColumnsType<T extends object> = TableProps<T>['columns']

export interface SelectionOptions {
  label: string
  value: string
}
