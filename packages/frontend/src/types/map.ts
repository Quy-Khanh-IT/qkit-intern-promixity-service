import { IBusiness, ITimeOption } from './business'
import { Icon } from 'leaflet'

export interface IMapProps {
  position: [number, number]
  zoom: number
  isFly?: boolean
  handleSetStopFly?: () => void
  searchPosition?: [number, number] | null
  businesses?: IBusiness[]
  radius?: number
  clickPosition?: [number, number] | null
  handleSetClickPosition?: (_value: [number, number] | null) => void
}

export interface ISearchSider {
  collapsed: boolean
  businesses: IBusiness[] | [] | undefined
  showSpinner: boolean
  onClose: () => void
  totalResult: number | undefined
  handleItemClick: () => void
  rating: number
  handleOnChangeRating: (_value: string) => void
  categoryId: string | null
  handleOnChangeCategory: (_value: string) => void
  handleOnChangeTimeOption: (_type: string, _value: string) => void
  timeOption: ITimeOption
  handleOnApplyTimeFilter: () => void
  handleChangeFetch: (value: boolean) => void
}

export interface ITimeFilterProps {
  handleOnChangeTimeOption: (_type: string, _value: string) => void
  timeOption: ITimeOption
  handleOnApplyTimeFilter: () => void
}

export interface IMarkerProps {
  key: string
  position: [number, number]
  icon?: Icon
}
