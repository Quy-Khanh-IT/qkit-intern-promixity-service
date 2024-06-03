import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { IMapProps } from '../../types/map'

const defaultPosition: [number, number] = [10.78, 106.78]
const initialState: IMapProps = {
  position: defaultPosition,
  zoom: 10,
  searchPosition: null
}

export const mapPropsSlice = createSlice({
  name: 'mapProps',
  initialState,
  reducers: {
    setPosition: (state, action: PayloadAction<[number, number]>) => {
      state.position = action.payload
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload
    },
    setSearchPosition: (state, action: PayloadAction<[number, number] | null>) => {
      state.searchPosition = action.payload
    }
  }
})

export const { setPosition, setZoom, setSearchPosition } = mapPropsSlice.actions
export default mapPropsSlice.reducer
