import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { ISelectedBusiness } from '@/types/business'

const initialState: ISelectedBusiness = {
  selectedBusinessId: null,
  selectedBusinessData: null
}

export const selectedBusinessSlice = createSlice({
  name: 'selectedBusiness',
  initialState,
  reducers: {
    setSelectedBusiness: (state, action: PayloadAction<ISelectedBusiness>) => {
      state.selectedBusinessId = action.payload.selectedBusinessId
      state.selectedBusinessData = action.payload.selectedBusinessData
    }
  }
})

export const { setSelectedBusiness } = selectedBusinessSlice.actions
export default selectedBusinessSlice.reducer
