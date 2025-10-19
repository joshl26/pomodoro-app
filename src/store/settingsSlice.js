import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper to clamp a value between min and max (inclusive)
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const DEFAULT_CYCLE = [1, 2, 1, 2, 1, 2, 1, 2, 3];

export const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    pomodoro: 25, // minutes
    short: 5,
    long: 15,
    autostart: false,
    timermode: 1,
    currenttime: 25, // minutes
    totalseconds: 1500,
    secondsleft: 1500,
    cycle: DEFAULT_CYCLE,
    counter: 0, // index into cycle (0..cycle.length-1)
    cyclecomplete: false,
    cyclestarted: false,
    cyclepaused: false,
    buttonsound: false,
    alarmenabled: false,
    alarmsound: "No Sound",
    alarmvolume: 0.5,
  },
  reducers: {
    /**
     * Reset settings to defaults
     */
    setDefault: (state) => {
      state.pomodoro = 25;
      state.short = 5;
      state.long = 15;
      state.autostart = false;
      state.timermode = 1;
      state.currenttime = 25;
      state.totalseconds = 1500;
      state.secondsleft = 1500;
      state.cycle = [...DEFAULT_CYCLE];
      state.counter = 0;
      state.cyclecomplete = false;
      state.cyclestarted = false;
      state.cyclepaused = false;
      state.buttonsound = false;
      state.alarmenabled = false;
      state.alarmsound = "No Sound";
      state.alarmvolume = 0.5;
    },

    /* -------------------- increments / decrements -------------------- */

    pomoIncrement: (state) => {
      state.pomodoro = clamp(Number(state.pomodoro) + 1, 1, 40);
    },
    pomoDecrement: (state) => {
      state.pomodoro = clamp(Number(state.pomodoro) - 1, 1, 40);
    },

    shortIncrement: (state) => {
      state.short = clamp(Number(state.short) + 1, 1, 10);
    },
    shortDecrement: (state) => {
      state.short = clamp(Number(state.short) - 1, 1, 10);
    },

    longIncrement: (state) => {
      state.long = clamp(Number(state.long) + 1, 1, 30);
    },
    longDecrement: (state) => {
      state.long = clamp(Number(state.long) - 1, 1, 30);
    },

    /* -------------------- basic setters -------------------- */

    setAutoStart: (state, action) => {
      state.autostart = Boolean(action.payload);
    },

    setCyclePaused: (state, action) => {
      state.cyclepaused = Boolean(action.payload);
    },

    /**
     * Set timer mode.
     * Accepts 1 (pomodoro), 2 (short), 3 (long).
     * Note: this reducer only sets the mode; consider using a thunk
     * to reset timer seconds when changing mode (see suggested thunks).
     */
    setTimerMode: (state, action) => {
      const m = Number(action.payload);
      if (m >= 1 && m <= 3) {
        state.timermode = m;
      }
    },

    /**
     * Compute currenttime (minutes) from timermode.
     * This can be invoked after changing timers or settings.
     */
    setCurrentTimeFromMode: (state) => {
      switch (Number(state.timermode)) {
        case 1:
          state.currenttime = Number(state.pomodoro);
          break;
        case 2:
          state.currenttime = Number(state.short);
          break;
        case 3:
          state.currenttime = Number(state.long);
          break;
        default:
          // keep existing value if mode is invalid
          break;
      }
    },

    /**
     * Set counter by value (validated and clamped to cycle range)
     */
    setCounter: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v)) {
        // clamp to valid indices [0, cycle.length - 1]
        const maxIdx = Math.max(0, (state.cycle || DEFAULT_CYCLE).length - 1);
        state.counter = clamp(Math.floor(v), 0, maxIdx);
      }
    },

    /**
     * Increment counter (advance cycle). Wraps to 0 when reaching the end.
     */
    counterIncrement: (state) => {
      const cycleLen = (state.cycle || DEFAULT_CYCLE).length || 1;
      state.counter = (Number(state.counter) + 1) % cycleLen;
    },

    /**
     * Decrement counter (go back in cycle). Wraps to last index when below 0.
     */
    counterDecrement: (state) => {
      const cycleLen = (state.cycle || DEFAULT_CYCLE).length || 1;
      const newVal = Number(state.counter) - 1;
      state.counter = ((newVal % cycleLen) + cycleLen) % cycleLen; // ensures positive wrap
    },

    /**
     * Set cycle complete (boolean)
     */
    setCycleComplete: (state, action) => {
      state.cyclecomplete = Boolean(action?.payload ?? true);
    },

    /**
     * Mark cycle as started
     */
    setCycleStart: (state) => {
      state.cyclecomplete = false;
      state.cyclestarted = true;
    },

    /**
     * Replace the cycle array (validate payload is array)
     */
    setCycle: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        state.cycle = [...action.payload];
        // ensure counter within new bounds
        state.counter = clamp(state.counter, 0, state.cycle.length - 1);
      }
    },

    /* -------------------- alarm / sound -------------------- */

    setAlarmState: (state, action) => {
      state.alarmenabled = Boolean(action.payload);
    },

    setButtonSoundState: (state, action) => {
      state.buttonsound = Boolean(action.payload);
    },

    setAlarmVolume: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v)) {
        state.alarmvolume = clamp(v, 0, 1);
      }
    },

    setAlarmSound: (state, action) => {
      if (typeof action.payload === "string") {
        state.alarmsound = action.payload;
      }
    },

    /* -------------------- seconds / totals -------------------- */

    setSecondsLeft: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v) && v >= 0) {
        state.secondsleft = Math.max(0, Math.floor(v));
      }
    },

    setTotalSeconds: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v) && v >= 0) {
        state.totalseconds = Math.max(0, Math.floor(v));
      }
    },
  },
});

// Export actual action creators implemented above
export const {
  setDefault,
  pomoIncrement,
  pomoDecrement,
  shortIncrement,
  shortDecrement,
  longIncrement,
  longDecrement,
  setAutoStart,
  setCyclePaused,
  setTimerMode,
  setCurrentTimeFromMode,
  counterIncrement,
  counterDecrement,
  setCounter,
  setCycleComplete,
  setCycleStart,
  setCycle,
  setAlarmState,
  setButtonSoundState,
  setAlarmVolume,
  setAlarmSound,
  setSecondsLeft,
  setTotalSeconds,
} = settingsSlice.actions;

// Backwards-compat alias for older imports (optional)
export { setCurrentTimeFromMode as setCurrentTime };

export default settingsSlice.reducer;
