import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface ISidebarSliceProps {
  sidebarTabState: boolean
}

const initialState: ISidebarSliceProps = {
  sidebarTabState: false
}

export const sidebarPropsSlice = createSlice({
  name: 'selectedSidebarTab',
  initialState,
  reducers: {
    setSidebarTab: (state, _action: PayloadAction<void>) => {
      state.sidebarTabState = !state.sidebarTabState
    }
  }
})

export const { setSidebarTab } = sidebarPropsSlice.actions
export default sidebarPropsSlice.reducer
