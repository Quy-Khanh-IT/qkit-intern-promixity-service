"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { setTheme } from "../../../redux/reducers/themeReducer";
import { setTest } from "../../../redux/reducers/testReducer";

const AboutPage: React.FC = () => {
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );
  const dispatch = useDispatch();

  const handleChangeTheme = () => {
    dispatch(setTest(undefined));
  };

  return (
    <div>
      <h1>About Page</h1>
      <div>Current theme: {currentTheme}</div>
      <button onClick={handleChangeTheme}>Change theme color</button>
    </div>
  );
};

export default AboutPage;
