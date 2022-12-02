import { createSlice } from "@reduxjs/toolkit";

export const pomodoroTimeSlice = createSlice({
  name: "pomodoro",
  initialState: {
    value: 25,
  },
  reducers: {
    pomodoroIncrement: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    pomodoroDecrement: (state) => {
      state.value -= 1;
    },
    pmodoroIncrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { pomodoroIncrement, pomodoroDecrement, pomodoroIncrementByAmount } = pomodoroTimeSlice.actions;

export default pomodoroTimeSlice.reducer;
