"use client";
import React, { useRef, ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../../redux/store";

interface StoreProviderProps {
  children: ReactNode;
}

const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  const storeRef = useRef(store);

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
