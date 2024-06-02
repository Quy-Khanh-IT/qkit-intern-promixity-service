import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState = {
  currentTheme: 'dark'
}

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, _action: PayloadAction<void>) => {
      state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark'
    }
  }
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
