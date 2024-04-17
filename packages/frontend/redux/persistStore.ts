import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export default (reducers: any) => {
  const persistConfig = {
    key: "root",
    storage,
  };

  const persistedReducer = persistReducer(persistConfig, reducers);

  return persistedReducer;
};
