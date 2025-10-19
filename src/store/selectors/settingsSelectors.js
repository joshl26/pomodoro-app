/**
 * Centralized selectors for the `settings` slice.
 *
 * - Export plain selectors for straightforward access.
 * - Export memoized selectors (using `reselect`) for derived/computed values.
 */

import { createSelector } from "reselect";

/* -------------------------------------------------------------------------- */
/* Base selectors                                                              */
/* -------------------------------------------------------------------------- */

/**
 * Base selector for the settings slice.
 */
export const selectSettings = (state) => state.settings || {};

/* Raw/primitive selectors (direct slice properties) */

export const selectPomodoro = (state) => selectSettings(state).pomodoro ?? 25;

export const selectShort = (state) => selectSettings(state).short ?? 5;

export const selectLong = (state) => selectSettings(state).long ?? 15;

export const selectTimerModeRaw = (state) =>
  selectSettings(state).timermode ?? 1;

export const selectIsAutoStartRaw = (state) =>
  Boolean(selectSettings(state).autostart ?? false);

export const selectSecondsLeftRaw = (state) =>
  selectSettings(state).secondsleft ?? null;

export const selectCurrentTimeRaw = (state) =>
  selectSettings(state).currenttime ?? null;

/* Alarm / audio settings - mapped to actual state structure */
export const selectButtonSoundRaw = (state) =>
  Boolean(selectSettings(state).buttonsound ?? false);

export const selectAlarmVolumeRaw = (state) =>
  selectSettings(state).alarmvolume ?? 0.5;

export const selectAlarmSoundRaw = (state) =>
  selectSettings(state).alarmsound ?? "No Sound";

export const selectAlarmEnabledRaw = (state) =>
  Boolean(selectSettings(state).alarmenabled ?? false);

/* Cycle flags */
export const selectCyclePausedRaw = (state) =>
  Boolean(selectSettings(state).cyclepaused ?? false);

export const selectCycleCompleteRaw = (state) =>
  Boolean(selectSettings(state).cyclecomplete ?? false);

/* -------------------------------------------------------------------------- */
/* Derived / memoized selectors (reselect)                                    */
/* -------------------------------------------------------------------------- */

/**
 * selectTimerMode
 * Normalizes timer mode to numeric 1/2/3 with a safe fallback of 1.
 */
export const selectTimerMode = createSelector([selectTimerModeRaw], (mode) => {
  const n = Number(mode);
  if (!Number.isFinite(n) || n < 1 || n > 3) return 1;
  return Math.floor(n);
});

/**
 * selectIsAutoStart
 * Boolean normalized from raw value.
 */
export const selectIsAutoStart = createSelector(
  [selectIsAutoStartRaw],
  Boolean
);

/**
 * selectAlarmSettings
 * Returns normalized alarm settings with sensible defaults:
 *  - volume: 0.5 (from your state)
 *  - buttonSound: false (from your state)
 */
export const selectAlarmSettings = createSelector(
  [selectAlarmVolumeRaw, selectButtonSoundRaw],
  (volume, buttonSound) => {
    // Return a stable object with the actual values from state
    return {
      volume: typeof volume === "number" ? volume : 0.5,
      buttonSound: Boolean(buttonSound),
    };
  }
);

/**
 * selectCurrentTime
 * Computes the current timer length (minutes) for the active mode.
 */
export const selectCurrentTime = createSelector(
  [
    selectCurrentTimeRaw,
    selectTimerMode,
    selectPomodoro,
    selectShort,
    selectLong,
  ],
  (currentTimeRaw, mode, pomo, shortMin, longMin) => {
    if (currentTimeRaw && Number.isFinite(Number(currentTimeRaw))) {
      return Number(currentTimeRaw);
    }

    switch (mode) {
      case 1:
        return Number(pomo ?? 25);
      case 2:
        return Number(shortMin ?? 5);
      case 3:
        return Number(longMin ?? 15);
      default:
        return Number(pomo ?? 25);
    }
  }
);

/**
 * selectSecondsLeft
 * Returns seconds left if directly stored; otherwise derive from currentTime.
 */
export const selectSecondsLeft = createSelector(
  [selectSecondsLeftRaw, selectCurrentTime],
  (secondsLeftRaw, currentTimeMinutes) => {
    if (secondsLeftRaw !== null && secondsLeftRaw !== undefined)
      return Number(secondsLeftRaw);

    // Derive from currentTime if no explicit secondsLeft
    const total = Math.max(1, Number(currentTimeMinutes) * 60);
    return total;
  }
);

/**
 * selectProgress
 * Returns a simple progress object for UI:
 *  { percent, totalSeconds, elapsedSeconds, secondsLeft }
 */
export const selectProgress = createSelector(
  [selectCurrentTime, selectSecondsLeft],
  (currentTimeMinutes, secondsLeft) => {
    const totalSeconds = Math.max(1, Number(currentTimeMinutes) * 60);
    const left =
      secondsLeft === null || secondsLeft === undefined
        ? totalSeconds
        : Number(secondsLeft);
    const elapsed = Math.max(0, totalSeconds - left);
    const percent = Math.min(100, Math.max(0, (elapsed / totalSeconds) * 100));
    return {
      percent,
      totalSeconds,
      elapsedSeconds: elapsed,
      secondsLeft: left,
    };
  }
);

/* Cycle flags (memoized wrappers) */
export const selectCyclePaused = createSelector(
  [selectCyclePausedRaw],
  Boolean
);

export const selectCycleComplete = createSelector(
  [selectCycleCompleteRaw],
  Boolean
);

/* Convenience selectors for alarm sub-values */
export const selectAlarmVolume = createSelector([selectAlarmSettings], (a) =>
  typeof a.volume === "number" ? a.volume : 0.5
);

export const selectButtonSound = createSelector([selectAlarmSettings], (a) =>
  typeof a.buttonSound === "boolean" ? a.buttonSound : false
);

/* -------------------------------------------------------------------------- */
/* Export convenience default map (optional)                                  */
/* -------------------------------------------------------------------------- */

/**
 * Grouped selectors for easy import:
 * import selectors from '../store/selectors'
 * selectors.selectCurrentTime(state)
 */
const selectors = {
  selectSettings,
  selectPomodoro,
  selectShort,
  selectLong,
  selectTimerMode,
  selectIsAutoStart,
  selectAlarmSettings,
  selectAlarmVolume,
  selectButtonSound,
  selectCurrentTime,
  selectSecondsLeft,
  selectProgress,
  selectCyclePaused,
  selectCycleComplete,
};

export default selectors;
