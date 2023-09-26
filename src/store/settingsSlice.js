import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    pomodoro: 25,
    short: 5,
    long: 15,
    autostart: false,
    timermode: 1,
    currenttime: 25,
    totalseconds: 1500,
    secondsleft: 1500,
    cycle: [1, 2, 1, 2, 1, 2, 1, 2, 3],
    counter: 0,
    cyclecomplete: false,
    cyclestarted: false,
    cyclepaused: false,
    alarmenabled: false,
    alarmsound: "No Sound",
    alarmvolume: 0.5,
  },
  reducers: {
    setDefault: (state) => {
      console.log("Reset to defaults...");
      state.pomodoro = 25;
      state.short = 5;
      state.long = 15;
      state.autostart = false;
      state.timermode = 1;
      state.currenttime = 25;
      state.totalseconds = 1500;
      state.secondsleft = 1500;
      state.cycle = [1, 2, 1, 2, 1, 2, 1, 2, 3];
      state.counter = 0;
      state.cyclecomplete = false;
      state.cyclestarted = false;
      state.cyclepaused = false;
      state.alarmenabled = false;
      state.alarmsound = "No Sound";
      state.alarmvolume = 0.5;
    },
    pomoIncrement: (state) => {
      // console.log("Pomo increment...");
      //limit pomodoro state to 40 minutes (max)
      if (Number(state.pomodoro) >= 40) {
        state.pomodoro = 40;
      } else {
        state.pomodoro += 1;
      }
    },
    pomoDecrement: (state) => {
      // console.log("Pomo decrement...");
      //limit pomodoro state to 20 minutes (min)
      if (Number(state.pomodoro) <= 1) {
        state.pomodoro = 1;
      } else {
        state.pomodoro -= 1;
      }
    },
    shortIncrement: (state) => {
      // console.log("Short increment...");
      //limit short state to 10 minutes (max)
      if (Number(state.short) >= 10) {
        state.short = 10;
      } else {
        state.short += 1;
      }
    },
    shortDecrement: (state) => {
      // console.log("Short decrement...");
      //limit short state to 5 minutes (min)
      if (Number(state.short) <= 1) {
        state.short = 1;
      } else {
        state.short -= 1;
      }
    },
    longIncrement: (state) => {
      // console.log("Long increment...");
      //limit long state to 25 minutes (max)
      if (Number(state.long) >= 30) {
        state.long = 30;
      } else {
        state.long += 1;
      }
    },
    longDecrement: (state) => {
      // console.log("Long decrement...");
      //limit short state to 10 minutes (min)
      if (Number(state.long) <= 1) {
        state.long = 1;
      } else {
        state.long -= 1;
      }
    },
    setAutoStart: (state, action) => {
      console.log("Auto start state set: " + action.payload);
      state.autostart = action.payload;
    },
    setCyclePaused: (state, action) => {
      console.log("Cycle paused state set: " + action.payload);
      state.cyclepaused = action.payload;
    },

    setTimerMode: (state, action) => {
      console.log("Timer mode state set: " + action.payload);
      state.timermode = action.payload;
    },
    setCurrentTime: (state) => {
      console.log("Current time state set...");
      //Check timermode and set current time accordingly
      if (Number(state.timermode) > 3) {
        return;
      }
      if (Number(state.timermode) < 0) {
        return;
      }
      if (Number(state.timermode) === 0) {
        state.currenttime = state.pomodoro;
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
    counterIncrement: (state) => {
      console.log("Counter increment...");
      if (Number(state.counter) < 9) {
        state.counter += 1;
        return;
      } else if (Number(state.counter) > 9) {
        state.counter = 1;
        return;
      }
    },

    setCounter: (state, action) => {
      console.log("Set Counter: " + action.payload);
      state.counter = action.payload;
    },
    setCycleComplete: (state) => {
      console.log("setCycleComplete");
      state.cyclecomplete = true;
    },
    setCycleStart: (state) => {
      state.cyclecomplete = false;
    },
    setCycle: (state, action) => {
      console.log("Set Cycle Complete: " + action.payload);
      state.cyclecomplete = action.payload;
    },

    setAlarmState: (state, action) => {
      console.log("Toggle Alarm State");
      state.alarmenabled = action.payload;
    },

    setAlarmVolume: (state, action) => {
      console.log("Set Alarm Volume" + action.payload);
      state.alarmvolume = action.payload;
    },

    setAlarmSound: (state, action) => {
      console.log("Set Alarm Sound" + action.payload);
      state.alarmsound = action.payload;
    },
    setSecondsLeft: (state, action) => {
      // console.log("Set seconds left" + action.payload);
      state.secondsleft = action.payload;
    },
    setTotalSeconds: (state, action) => {
      console.log("Set Total Seconds" + action.payload);
      state.totalseconds = action.payload;
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
  setAutoStart,
  setTimerMode,
  setCurrentTime,
  setDefault,
  counterIncrement,
  counterDecrement,
  setCounter,
  setCycleComplete,
  setCycleStart,
  setCycle,
  setCyclePaused,
  setAlarmState,
  setAlarmVolume,
  setAlarmSound,
  setSecondsLeft,
  setTotalSeconds,
} = settingsSlice.actions;

export default settingsSlice.reducer;
