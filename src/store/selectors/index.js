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

/* -------------------------------------------------------------------------- */
/* Timer Selectors                                                             */
/* -------------------------------------------------------------------------- */

export const selectTimers = (state) => selectSettings(state).timers || {};

export const selectPomodoro = (state) => selectTimers(state).pomodoro ?? 25;

export const selectShort = (state) => selectTimers(state).short ?? 5;

export const selectLong = (state) => selectTimers(state).long ?? 15;

/* -------------------------------------------------------------------------- */
/* Current State Selectors                                                     */
/* -------------------------------------------------------------------------- */

export const selectCurrent = (state) => selectSettings(state).current || {};

export const selectTimerModeRaw = (state) =>
  selectCurrent(state).timermode ?? 1;

export const selectIsAutoStartRaw = (state) =>
  Boolean(selectCurrent(state).autostart ?? false);

export const selectSecondsLeftRaw = (state) =>
  selectCurrent(state).secondsleft ?? null;

export const selectCurrentTimeRaw = (state) =>
  selectCurrent(state).currenttime ?? null;

export const selectTotalSecondsRaw = (state) =>
  selectCurrent(state).totalseconds ?? 1500;

/* -------------------------------------------------------------------------- */
/* Cycle Selectors                                                            */
/* -------------------------------------------------------------------------- */

export const selectCycle = (state) => selectSettings(state).cycle || {};

export const selectCycleSequence = (state) =>
  selectCycle(state).sequence || [1, 2, 1, 2, 1, 2, 1, 2, 3];

export const selectCycleCounter = (state) => selectCycle(state).counter ?? 0;

export const selectCyclePausedRaw = (state) =>
  Boolean(selectCurrent(state).cyclepaused ?? false);

export const selectCycleCompleteRaw = (state) =>
  Boolean(selectCurrent(state).cyclecomplete ?? false);

export const selectCycleStartedRaw = (state) =>
  Boolean(selectCurrent(state).cyclestarted ?? false);

/* -------------------------------------------------------------------------- */
/* Alarm Selectors                                                            */
/* -------------------------------------------------------------------------- */

export const selectAlarm = (state) => selectSettings(state).alarm || {};

export const selectButtonSoundRaw = (state) =>
  Boolean(selectAlarm(state).buttonSound ?? false);

export const selectAlarmVolumeRaw = (state) => selectAlarm(state).volume ?? 0.5;

export const selectAlarmSoundRaw = (state) =>
  selectAlarm(state).sound ?? "No Sound";

export const selectAlarmEnabledRaw = (state) =>
  Boolean(selectAlarm(state).enabled ?? false);

/* -------------------------------------------------------------------------- */
/* Derived / Memoized Selectors (reselect)                                   */
/* -------------------------------------------------------------------------- */

// Stable default objects
const DEFAULT_ALARM_SETTINGS = {
  volume: 0.5,
  buttonSound: false,
  enabled: false,
  sound: "No Sound",
};

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
 * Returns normalized alarm settings with sensible defaults
 */
export const selectAlarmSettings = createSelector(
  [
    selectAlarmVolumeRaw,
    selectButtonSoundRaw,
    selectAlarmEnabledRaw,
    selectAlarmSoundRaw,
  ],
  (volume, buttonSound, enabled, sound) => {
    // Return default object if all values are at defaults
    if (
      volume === 0.5 &&
      buttonSound === false &&
      enabled === false &&
      sound === "No Sound"
    ) {
      return DEFAULT_ALARM_SETTINGS;
    }

    // Otherwise create new object
    return {
      volume: typeof volume === "number" ? volume : 0.5,
      buttonSound: Boolean(buttonSound),
      enabled: Boolean(enabled),
      sound: typeof sound === "string" ? sound : "No Sound",
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
  [selectCurrentTime, selectSecondsLeft, selectTotalSecondsRaw],
  (currentTimeMinutes, secondsLeft, totalSecondsRaw) => {
    const totalSeconds =
      totalSecondsRaw || Math.max(1, Number(currentTimeMinutes) * 60);
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

/**
 * selectCycleLength
 * Returns the length of the cycle sequence
 */
export const selectCycleLength = createSelector(
  [selectCycleSequence],
  (sequence) => sequence.length
);

/**
 * selectCurrentModeValue
 * Returns the current timer value based on mode
 */
export const selectCurrentModeValue = createSelector(
  [selectTimerMode, selectPomodoro, selectShort, selectLong],
  (mode, pomodoro, short, long) => {
    switch (mode) {
      case 1:
        return pomodoro;
      case 2:
        return short;
      case 3:
        return long;
      default:
        return pomodoro;
    }
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

export const selectCycleStarted = createSelector(
  [selectCycleStartedRaw],
  Boolean
);

/* Convenience selectors for alarm sub-values */
export const selectAlarmVolume = createSelector([selectAlarmSettings], (a) =>
  typeof a.volume === "number" ? a.volume : 0.5
);

export const selectButtonSound = createSelector([selectAlarmSettings], (a) =>
  typeof a.buttonSound === "boolean" ? a.buttonSound : false
);

export const selectAlarmEnabled = createSelector([selectAlarmSettings], (a) =>
  typeof a.enabled === "boolean" ? a.enabled : false
);

export const selectAlarmSound = createSelector([selectAlarmSettings], (a) =>
  typeof a.sound === "string" ? a.sound : "No Sound"
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
  // Base
  selectSettings,

  // Timers
  selectTimers,
  selectPomodoro,
  selectShort,
  selectLong,

  // Current state
  selectCurrent,
  selectTimerMode,
  selectIsAutoStart,
  selectCurrentTime,
  selectSecondsLeft,
  selectTotalSecondsRaw,

  // Cycle
  selectCycle,
  selectCycleSequence,
  selectCycleCounter,
  selectCycleLength,
  selectCyclePaused,
  selectCycleComplete,
  selectCycleStarted,
  selectCurrentModeValue,

  // Alarm
  selectAlarm,
  selectAlarmSettings,
  selectAlarmVolume,
  selectButtonSound,
  selectAlarmEnabled,
  selectAlarmSound,

  // Progress
  selectProgress,

  // Utilities
  selectTimerModeRaw,
  selectIsAutoStartRaw,
  selectSecondsLeftRaw,
  selectCurrentTimeRaw,
};

export default selectors;
