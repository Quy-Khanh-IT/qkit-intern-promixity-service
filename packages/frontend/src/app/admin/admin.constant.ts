import { FilterOptions, SelectionOptions } from '@/types/common'

export const DELETE_OPTIONS = {
  SOFT: 'soft',
  HARD: 'hard'
}

export const SIDEBAR_MENU_OPTIONS = {
  DASHBOARD: {
    key: '1',
    label: 'Dashboard'
  },
  MANAGE_USER: {
    key: '2',
    label: 'Manage user'
  },
  MANAGE_BUSINESS: {
    key: '3',
    label: 'Manage business'
  },
  MANAGE_REVIEW: {
    key: '4',
    label: 'Manage review'
  }
}

export const RATING_OPTIONS_FILTERS: FilterOptions[] = [
  {
    text: '5 ⭐️',
    value: '5'
  },
  {
    text: '4 ⭐️',
    value: '4'
  },
  {
    text: '3 ⭐️',
    value: '3'
  },
  {
    text: '2 ⭐️',
    value: '2'
  },
  {
    text: '1 ⭐️',
    value: '1'
  },
  {
    text: '0 ⭐️',
    value: '0'
  }
] as const

export const RATING_SELECT_FILTERS: SelectionOptions[] = [
  {
    label: '5 ⭐️',
    value: '5'
  },
  {
    label: '4 ⭐️',
    value: '4'
  },
  {
    label: '3 ⭐️',
    value: '3'
  },
  {
    label: '2 ⭐️',
    value: '2'
  },
  {
    label: '1 ⭐️',
    value: '1'
  },
  {
    label: '0 ⭐️',
    value: '0'
  }
] as const
