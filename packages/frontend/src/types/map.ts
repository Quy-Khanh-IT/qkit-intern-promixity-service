import { IBusiness } from './business'

export interface IMapProps {
  position: [number, number]
  zoom: number
  isFly?: boolean
  setStopFly?: () => void
  searchPosition?: [number, number] | null
  businesses?: IBusiness[]
}
