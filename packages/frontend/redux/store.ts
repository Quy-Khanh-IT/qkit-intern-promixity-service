import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./reducers/themeReducer";
import reducers from "./reducers";

export const store = configureStore({
  reducer: reducers,
});

export type RootState = ReturnType<typeof store.getState>;
