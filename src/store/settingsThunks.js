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
    dispatch(setTimerMode(mode));
    dispatch(setCurrentTimeFromMode());

    const state = getState().settings;
    const totalSeconds = state.currenttime * 60;
    dispatch(setTotalSeconds(totalSeconds));
    dispatch(setSecondsLeft(totalSeconds));

    dispatch(setCyclePaused(false));
    if (autoStart) {
      dispatch(setCycleStart());
    } else {
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
    const currentMode = state.cycle[state.counter];
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
    const currentMode = state.cycle[state.counter];
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
    // Additional reset logic can be added here if needed

    if (!keepAudio) {
      // If you want to stop audio here, you can dispatch an action or handle it in component
    }
  };
