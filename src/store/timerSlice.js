import { createSlice } from "@reduxjs/toolkit";

/**
 * Timer slice - runtime timer state (separate from persisted settings).
 *
 * Fields:
 *  - running: boolean
 *  - totalSeconds: number
 *  - secondsLeft: number
 *  - endTimestamp: number|null   // ms epoch for when timer should end (runtime only)
 *  - alarmTriggered: boolean
 */

const initialState = {
  running: false,
  totalSeconds: 25 * 60,
  secondsLeft: 25 * 60,
  endTimestamp: null,
  alarmTriggered: false,
};

const slice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setTotalSeconds(state, action) {
      const v = Number(action.payload);
      if (Number.isFinite(v) && v >= 0) {
        state.totalSeconds = Math.floor(v);
      }
    },
    setSecondsLeft(state, action) {
      const v = Number(action.payload);
      if (Number.isFinite(v) && v >= 0) {
        state.secondsLeft = Math.floor(v);
      }
    },
    startTimer(state) {
      state.running = true;
      state.alarmTriggered = false;
    },
    pauseTimer(state) {
      state.running = false;
      // endTimestamp kept to allow recalculation in thunks if needed
      // optionally we clear it.
      state.endTimestamp = null;
    },
    stopTimer(state) {
      state.running = false;
      state.endTimestamp = null;
      state.secondsLeft = state.totalSeconds;
      // Clear any alarm when the timer is stopped
      state.alarmTriggered = false;
    },
    setEndTimestamp(state, action) {
      state.endTimestamp = action.payload || null;
    },
    tick(state, action) {
      // Accept an injected now for testability
      const now = action?.payload?.now ?? Date.now();
      if (state.endTimestamp && state.running) {
        const secs = Math.max(0, Math.ceil((state.endTimestamp - now) / 1000));
        state.secondsLeft = secs;
        if (secs <= 0) {
          state.running = false;
          state.endTimestamp = null;
          state.alarmTriggered = true;
        }
      }
    },
    triggerAlarm(state) {
      state.alarmTriggered = true;
      state.running = false;
    },
    resetTimerForMode(state, action) {
      // payload: { totalSeconds }
      const total = Number(
        action?.payload?.totalSeconds ?? action?.payload ?? state.totalSeconds
      );
      if (Number.isFinite(total) && total >= 0) {
        state.totalSeconds = Math.floor(total);
        state.secondsLeft = Math.floor(total);
      }
      state.running = false;
      state.endTimestamp = null;
      state.alarmTriggered = false;
    },
  },
});

export const {
  setTotalSeconds,
  setSecondsLeft,
  startTimer,
  pauseTimer,
  stopTimer,
  setEndTimestamp,
  tick,
  triggerAlarm,
  resetTimerForMode,
} = slice.actions;

export default slice.reducer;
