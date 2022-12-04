import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    pomodoro: 25,
    short: 5,
    long: 15,
    autobreak: false,
    autopomo: false,
    longinterval: 15,
    timermode: 1,
    timerenabled: false,
    currenttime: 25,
  },
  reducers: {
    pomoIncrement: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.pomodoro += 1;
    },
    pomoDecrement: (state) => {
      state.pomodoro -= 1;
    },
    pomoIncrementByAmount: (state, action) => {
      state.pomodoro += action.payload;
    },

    shortIncrement: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.short += 1;
    },
    shortDecrement: (state) => {
      state.short -= 1;
    },
    shortIncrementByAmount: (state, action) => {
      state.short += action.payload;
    },

    longIncrement: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.long += 1;
    },
    longDecrement: (state) => {
      state.long -= 1;
    },
    longDecrementByAmount: (state, action) => {
      state.long += action.payload;
    },
    autoPomo: (state) => {
      state.autopomo = !state.autopomo;
    },
    autoBreak: (state) => {
      state.autobreak = !state.autobreak;
    },
    longIntervalIncrement: (state) => {
      state.longinterval += 1;
    },
    longIntervalDecrement: (state) => {
      state.longinterval -= 1;
    },
    timerMode: (state, action) => {
      state.timermode = action.payload;
    },
    timerEnabled: (state) => {
      state.timerenabled = !state.timerenabled;
    },
    setCurrentTime: (state) => {
      // console.log("timer mode: " + state.timermode);
      //Check timermode and set current time accordingly
      if (state.timermode > 3) {
        return;
      }
      if (state.timermode <= 0) {
        return;
      }
      if (state.timermode == 1) {
        state.currenttime = state.pomodoro;
        // console.log(state.currenttime);
      }
      if (state.timermode == 2) {
        state.currenttime = state.short;
        // console.log(state.currenttime);
      }
      if (state.timermode == 3) {
        state.currenttime = state.long;
        // console.log(state.currenttime);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  pomoIncrement,
  pomoDecrement,
  pomoIncrementByAmount,
  shortIncrement,
  shortDecrement,
  shortIncrementByAmount,
  longIncrement,
  longDecrement,
  longDecrementByAmount,
  autoBreak,
  autoPomo,
  longIntervalIncrement,
  longIntervalDecrement,
  timerMode,
  timerEnabled,
  setCurrentTime,
} = settingsSlice.actions;

export default settingsSlice.reducer;
