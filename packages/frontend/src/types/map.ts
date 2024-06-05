import { IBusiness } from './business'
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
  handleSetClickPosition?: (value: [number, number] | null) => void
}

export interface ISearchSider {
  collapsed: boolean
  businesses: IBusiness[] | [] | undefined
  showSpinner: boolean
  onClose: () => void
  totalResult: number | undefined
  handleItemClick: () => void
}

export interface IMarkerProps {
  key: string
  position: [number, number]
  icon?: Icon
}
