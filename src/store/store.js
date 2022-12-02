import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import settingsReducer from "./settingsSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    settings: settingsReducer,
  },
});
