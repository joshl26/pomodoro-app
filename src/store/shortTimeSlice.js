import { createSlice } from "@reduxjs/toolkit";

export const shortTimeSlice = createSlice({
  name: "short",
  initialState: {
    value: 5,
  },
  reducers: {
    shortIncrement: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    shortDecrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { shortIncrement, shortDecrement, incrementByAmount } =
  shortTimeSlice.actions;

export default shortTimeSlice.reducer;
