import { IBusiness } from './business'
import { Icon } from 'leaflet'

export interface IMapProps {
  position: [number, number]
  zoom: number
  isFly?: boolean
  setStopFly?: () => void
  searchPosition?: [number, number] | null
  businesses?: IBusiness[]
  radius?: number
}

export interface IMarkerProps {
  key: string
  position: [number, number]
  icon?: Icon
}
