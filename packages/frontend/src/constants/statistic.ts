import { SelectionOptions } from '@/types/common'

export const STATISTIC_OPTIONS_VALUE = {
  _MONTH: 'month',
  _YEAR: 'year'
}

export const CANVAS_DATE_FORMAT = {
  _MONTH: 'DD MMM',
  _YEAR: 'MMM YYYY'
}

export const STATISTIC_MONTHS: SelectionOptions[] = [
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' }
]
