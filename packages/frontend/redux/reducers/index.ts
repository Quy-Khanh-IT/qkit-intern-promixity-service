import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./themeReducer";

const reducers = combineReducers({
  theme: themeReducer,
});

export default reducers;
