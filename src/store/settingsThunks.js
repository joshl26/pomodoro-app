import {
  setTimerMode,
  setCurrentTimeFromMode,
  setSecondsLeft,
  setTotalSeconds,
  counterIncrement,
  counterDecrement,
  setCycleComplete,
  setCycleStart,
  setCyclePaused,
  setCounter,
} from "./settingsSlice";

import { resetTimerForModeThunk } from "./timerThunks";

/**
 * Set timer mode and reset timer seconds accordingly.
 * Optionally auto-start the timer.
 *
 * @param {number} mode - Timer mode (1 = pomodoro, 2 = short break, 3 = long break)
 * @param {boolean} [autoStart=false] - Whether to start the timer immediately
 * @returns {Function} Thunk action
 */
export const setTimerModeAndReset =
  (mode, autoStart = false) =>
  (dispatch, getState) => {
    // update the mode in state
    dispatch(setTimerMode(mode));

    // compute the minutes for the new mode directly from timers in state
    const state = getState().settings;
    let currentTime;
    switch (Number(mode)) {
      case 1:
        currentTime = Number(state.timers.pomodoro);
        break;
      case 2:
        currentTime = Number(state.timers.short);
        break;
      case 3:
        currentTime = Number(state.timers.long);
        break;
      default:
        currentTime = Number(state.current.currenttime);
    }

    const totalSeconds = Math.max(0, Math.floor(currentTime * 60));

    // update derived values in settings slice (keeps reducer logic centralized)
    dispatch(setCurrentTimeFromMode());
    dispatch(setTotalSeconds(totalSeconds));
    dispatch(setSecondsLeft(totalSeconds));

    // update timer slice so runtime timer is in sync
    dispatch(resetTimerForModeThunk(totalSeconds));

    // explicitly set paused state to false
    dispatch(setCyclePaused(false));

    // explicitly set cyclestarted according to autoStart (requires boolean payload in settings slice)
    dispatch(setCycleStart(Boolean(autoStart)));

    // if not auto-starting, ensure cyclecomplete is cleared
    if (!autoStart) {
      dispatch(setCycleComplete(false));
    }
  };

/**
 * Advance the cycle counter and reset timer accordingly.
 * Optionally auto-start the timer.
 *
 * @param {boolean} [autoStart=false] - Whether to start the timer immediately
 * @returns {Function} Thunk action
 */
export const advanceCycle =
  (autoStart = false) =>
  (dispatch, getState) => {
    dispatch(counterIncrement());

    const state = getState().settings;
    const currentMode = (state.cycle.sequence || [1])[state.cycle.counter];
    dispatch(setTimerModeAndReset(currentMode, autoStart));
  };

/**
 * Go back one step in the cycle counter and reset timer accordingly.
 * Optionally auto-start the timer.
 *
 * @param {boolean} [autoStart=false] - Whether to start the timer immediately
 * @returns {Function} Thunk action
 */
export const retreatCycle =
  (autoStart = false) =>
  (dispatch, getState) => {
    dispatch(counterDecrement());

    const state = getState().settings;
    const currentMode = (state.cycle.sequence || [1])[state.cycle.counter];
    dispatch(setTimerModeAndReset(currentMode, autoStart));
  };

/**
 * Reset the entire cycle and timer to initial state.
 * Optionally keep audio playing.
 *
 * @param {Object} [options={}] - Options object
 * @param {boolean} [options.keepAudio=false] - Whether to keep audio playing
 * @returns {Function} Thunk action
 */
export const resetCycleAndTimer =
  ({ keepAudio = false } = {}) =>
  (dispatch) => {
    dispatch(setCounter(0));
    dispatch(setTimerModeAndReset(1, false));
    dispatch(setCycleComplete(false));
    dispatch(setCyclePaused(false));

    if (!keepAudio) {
      // If you manage audio in a different slice, you can dispatch an action here
    }
  };
