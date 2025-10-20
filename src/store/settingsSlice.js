import { createSlice } from "@reduxjs/toolkit";

/**
 * Helper to clamp a value between min and max (inclusive)
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

// Version for future migrations
const VERSION = 1;

const DEFAULT_CYCLE = [1, 2, 1, 2, 1, 2, 1, 2, 3];

// Enhanced initial state with grouped settings
export const initialState = {
  version: VERSION,
  timers: {
    pomodoro: 25, // minutes
    short: 5,
    long: 15,
  },
  current: {
    timermode: 1,
    currenttime: 25, // minutes
    totalseconds: 1500,
    secondsleft: 1500,
    autostart: false,
    cyclecomplete: false,
    cyclestarted: false,
    cyclepaused: false,
  },
  cycle: {
    sequence: DEFAULT_CYCLE,
    counter: 0, // index into cycle (0..cycle.length-1)
  },
  alarm: {
    enabled: false,
    sound: "No Sound",
    volume: 0.5,
    buttonSound: false,
  },
};

/**
 * Shallow equality check to prevent unnecessary updates
 */
const shallowEqual = (objA, objB) => {
  if (objA === objB) return true;
  if (!objA || !objB) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((key) => objA[key] === objB[key]);
};

/**
 * Safe number update helper
 */
const safeNumberUpdate = (state, action, key, min = 0, max = Infinity) => {
  try {
    const value = Number(action.payload);
    if (Number.isFinite(value)) {
      state[key] = clamp(value, min, max);
    }
  } catch (error) {
    console.warn(`Failed to update ${key}:`, error);
  }
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    /**
     * Reset settings to defaults (restores durations too)
     */
    setDefault: () => {
      return { ...initialState };
    },

    /**
     * Update multiple settings at once
     */
    updateSettings: (state, action) => {
      if (action.payload && typeof action.payload === "object") {
        Object.keys(action.payload).forEach((key) => {
          // Handle nested properties
          if (key.includes(".")) {
            const [parent, child] = key.split(".");
            if (state[parent] && child in state[parent]) {
              state[parent][child] = action.payload[key];
            }
          } else if (key in state) {
            state[key] = action.payload[key];
          } else {
            // Check nested objects
            Object.keys(state).forEach((parentKey) => {
              if (
                typeof state[parentKey] === "object" &&
                state[parentKey] !== null
              ) {
                if (key in state[parentKey]) {
                  state[parentKey][key] = action.payload[key];
                }
              }
            });
          }
        });
      }
    },

    /* -------------------- Timer Value Updates -------------------- */

    pomoIncrement: (state) => {
      state.timers.pomodoro = clamp(Number(state.timers.pomodoro) + 1, 1, 40);
    },
    pomoDecrement: (state) => {
      state.timers.pomodoro = clamp(Number(state.timers.pomodoro) - 1, 1, 40);
    },

    shortIncrement: (state) => {
      state.timers.short = clamp(Number(state.timers.short) + 1, 1, 10);
    },
    shortDecrement: (state) => {
      state.timers.short = clamp(Number(state.timers.short) - 1, 1, 10);
    },

    longIncrement: (state) => {
      state.timers.long = clamp(Number(state.timers.long) + 1, 1, 30);
    },
    longDecrement: (state) => {
      state.timers.long = clamp(Number(state.timers.long) - 1, 1, 30);
    },

    /* -------------------- Basic Setters -------------------- */

    setAutoStart: (state, action) => {
      state.current.autostart = Boolean(action.payload);
    },

    /**
     * Set cycle paused. Requires an explicit boolean payload.
     */
    setCyclePaused: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.current.cyclepaused = action.payload;
      } else {
        // Do nothing if payload is not explicit boolean (clean behavior)
        // Optionally: console.warn("setCyclePaused requires boolean payload");
      }
    },

    /**
     * Set timer mode.
     * Accepts 1 (pomodoro), 2 (short), 3 (long).
     */
    setTimerMode: (state, action) => {
      const m = Number(action.payload);
      if (m >= 1 && m <= 3) {
        state.current.timermode = m;
      }
    },

    /**
     * Compute currenttime (minutes) from timermode.
     */
    setCurrentTimeFromMode: (state) => {
      switch (Number(state.current.timermode)) {
        case 1:
          state.current.currenttime = Number(state.timers.pomodoro);
          break;
        case 2:
          state.current.currenttime = Number(state.timers.short);
          break;
        case 3:
          state.current.currenttime = Number(state.timers.long);
          break;
        default:
          break;
      }
    },

    /**
     * Set counter by value (validated and clamped to cycle range)
     */
    setCounter: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v)) {
        const maxIdx = Math.max(
          0,
          (state.cycle.sequence || DEFAULT_CYCLE).length - 1
        );
        state.cycle.counter = clamp(Math.floor(v), 0, maxIdx);
      }
    },

    /**
     * Increment counter (advance cycle). Wraps to 0 when reaching the end.
     */
    counterIncrement: (state) => {
      const cycleLen = (state.cycle.sequence || DEFAULT_CYCLE).length || 1;
      state.cycle.counter = (Number(state.cycle.counter) + 1) % cycleLen;
    },

    /**
     * Decrement counter (go back in cycle). Wraps to last index when below 0.
     */
    counterDecrement: (state) => {
      const cycleLen = (state.cycle.sequence || DEFAULT_CYCLE).length || 1;
      const newVal = Number(state.cycle.counter) - 1;
      state.cycle.counter = ((newVal % cycleLen) + cycleLen) % cycleLen;
    },

    /**
     * Set cycle complete. Requires explicit boolean payload.
     */
    setCycleComplete: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.current.cyclecomplete = action.payload;
      }
    },

    /**
     * Set cycle started. Requires explicit boolean payload.
     * Note: when setting true we also clear cyclecomplete; when setting false we do not change cyclecomplete.
     */
    setCycleStart: (state, action) => {
      if (typeof action.payload === "boolean") {
        state.current.cyclestarted = action.payload;
        if (action.payload === true) {
          state.current.cyclecomplete = false;
        }
      }
    },

    /**
     * Replace the cycle array (validate payload is array)
     */
    setCycle: (state, action) => {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        if (!shallowEqual(state.cycle.sequence, action.payload)) {
          state.cycle.sequence = [...action.payload];
        }
        state.cycle.counter = clamp(
          state.cycle.counter,
          0,
          state.cycle.sequence.length - 1
        );
      }
    },

    /* -------------------- Alarm / Sound -------------------- */

    setAlarmState: (state, action) => {
      state.alarm.enabled = Boolean(action.payload);
    },

    setButtonSoundState: (state, action) => {
      state.alarm.buttonSound = Boolean(action.payload);
    },

    setAlarmVolume: (state, action) => {
      safeNumberUpdate(state.alarm, action, "volume", 0, 1);
    },

    setAlarmSound: (state, action) => {
      if (typeof action.payload === "string") {
        state.alarm.sound = action.payload;
      }
    },

    /* -------------------- Seconds / Totals -------------------- */

    setSecondsLeft: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v) && v >= 0) {
        state.current.secondsleft = Math.max(0, Math.floor(v));
      }
    },

    setTotalSeconds: (state, action) => {
      const v = Number(action.payload);
      if (Number.isFinite(v) && v >= 0) {
        state.current.totalseconds = Math.max(0, Math.floor(v));
      }
    },

    /* -------------------- Development Tools -------------------- */

    ...(process.env.NODE_ENV === "development" && {
      debugState: (state) => {
        console.log(
          "Current settings state:",
          JSON.parse(JSON.stringify(state))
        );
        return state;
      },
    }),
  },
});

// Export action creators
export const {
  setDefault,
  updateSettings,
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

export { setCurrentTimeFromMode as setCurrentTime };

export default settingsSlice.reducer;
