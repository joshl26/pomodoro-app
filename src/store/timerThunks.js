import {
  startTimer as startAction,
  setEndTimestamp,
  tick,
  pauseTimer as pauseAction,
  resetTimerForMode,
} from "./timerSlice";

/**
 * Start timer given a seconds value.
 * Sets an endTimestamp for accurate timekeeping and marks running.
 *
 * Returns the endTimestamp for potential use by caller.
 */
export const startTimerWithSeconds = (seconds) => (dispatch) => {
  const now = Date.now();
  const secs = Math.max(0, Math.floor(Number(seconds) || 0));
  const end = now + secs * 1000;
  dispatch(setEndTimestamp(end));
  dispatch(startAction());
  return end;
};

export const resumeTimer = () => (dispatch, getState) => {
  const { timer } = getState();
  const now = Date.now();
  const secs = Math.max(0, Math.floor(Number(timer.secondsLeft) || 0));
  const end = now + secs * 1000;
  dispatch(setEndTimestamp(end));
  dispatch(startAction());
  return end;
};

export const pauseTimerThunk = () => (dispatch, getState) => {
  const { timer } = getState();
  if (timer.endTimestamp && timer.running) {
    dispatch(tick({ now: Date.now() }));
  }
  dispatch(pauseAction());
};

export const resetTimerForModeThunk = (totalSeconds) => (dispatch) => {
  // Reset timer slice fields to a given totalSeconds
  dispatch(resetTimerForMode({ totalSeconds }));
};
