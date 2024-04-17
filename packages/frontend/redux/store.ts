import { configureStore } from "@reduxjs/toolkit";
import storePersist from "./persistStore";
import reducers from "./reducers";
import { persistStore } from "redux-persist";

const persistedReducer = storePersist(reducers);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
