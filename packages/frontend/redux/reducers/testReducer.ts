import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentTheme: 'dark'
}

export const testSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTest: (state, action) => {
      state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark'
    }
  }
})

export const { setTest } = testSlice.actions
export default testSlice.reducer
