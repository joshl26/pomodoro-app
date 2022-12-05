import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    pomodoro: 1,
    short: 1,
    long: 1,
    autobreak: false,
    autopomo: false,
    timermode: 1,
    timerenabled: false,
    currenttime: 1,
    cycle: [1, 2, 1, 2, 1, 2, 1, 2, 3],
    counter: 0,
    cyclecomplete: false,
  },
  reducers: {
    pomoIncrement: (state) => {
      //limit pomodoro state to 40 minutes (max)
      if (Number(state.pomodoro) >= 40) {
        state.pomodoro = 40;
      } else {
        state.pomodoro += 1;
      }
    },
    pomoDecrement: (state) => {
      //limit pomodoro state to 20 minutes (min)
      if (Number(state.pomodoro) <= 1) {
        state.pomodoro = 1;
      } else {
        state.pomodoro -= 1;
      }
    },
    pomoIncrementByAmount: (state, action) => {
      state.pomodoro += action.payload;
    },

    shortIncrement: (state) => {
      //limit short state to 10 minutes (max)
      if (Number(state.short) >= 10) {
        state.short = 10;
      } else {
        state.short += 1;
      }
    },
    shortDecrement: (state) => {
      //limit short state to 5 minutes (min)
      if (Number(state.short) <= 1) {
        state.short = 1;
      } else {
        state.short -= 1;
      }
    },
    shortIncrementByAmount: (state, action) => {
      state.short += action.payload;
    },

    longIncrement: (state) => {
      //limit long state to 25 minutes (max)
      if (Number(state.long) >= 30) {
        state.long = 30;
      } else {
        state.long += 1;
      }
    },
    longDecrement: (state) => {
      //limit short state to 10 minutes (min)
      if (Number(state.long) <= 1) {
        state.long = 1;
      } else {
        state.long -= 1;
      }
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
    timerMode: (state, action) => {
      state.timermode = action.payload;
    },
    timerEnabled: (state) => {
      state.timerenabled = !state.timerenabled;
    },
    setTimerEnabled: (state, action) => {
      state.timerenabled = action.payload;
    },
    setCurrentTime: (state) => {
      //Check timermode and set current time accordingly
      if (Number(state.timermode) > 3) {
        return;
      }
      if (Number(state.timermode) <= 0) {
        return;
      }
      if (Number(state.timermode) === 1) {
        state.currenttime = state.pomodoro;
      }
      if (Number(state.timermode) === 2) {
        state.currenttime = state.short;
      }
      if (Number(state.timermode) === 3) {
        state.currenttime = state.long;
      }
    },
    setDefault: (state) => {
      state.pomodoro = 25;
      state.short = 5;
      state.long = 15;
      state.autobreak = false;
      state.autopomo = false;
      state.timermode = 1;
      state.timerenabled = false;
      state.currenttime = 25;
      state.cycle = [1, 2, 1, 2, 1, 2, 1, 2, 3];
      state.counter = 0;
    },
    counterIncrement: (state) => {
      if (Number(state.counter) <= 8) {
        state.counter += 1;
        if (Number(state.counter) === 8) {
          state.counter = 0;
        }
      }
    },
    counterDecrement: (state) => {
      if (Number(state.counter) > 0) {
        state.counter -= 1;
      }
    },
    setCycleComplete: (state, action) => {
      state.cyclecomplete = action.payload;
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
  autoPomo,
  autoBreak,
  timerMode,
  timerEnabled,
  setTimerEnabled,
  setCurrentTime,
  setDefault,
  counterIncrement,
  setCycleComplete,
} = settingsSlice.actions;

export default settingsSlice.reducer;
