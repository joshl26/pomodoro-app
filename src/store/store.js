import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import pomodoroReducer from "../store/pomodoroTimeSlice";
import shortReducer from "../store/shortTimeSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
    pomodoro: pomodoroReducer,
    short: shortReducer,
  },
});
