import { combineReducers } from '@reduxjs/toolkit'
import themeReducer from './themeReducer'
import testReducer from './testReducer'

const reducers = combineReducers({
  theme: themeReducer,
  test: testReducer
})

export default reducers
