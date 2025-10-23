import { createSelector } from "@reduxjs/toolkit";

const DEFAULT_ALARM_SETTINGS = {
  volume: 0.5,
  buttonSound: false,
  enabled: false,
  sound: "No Sound",
};

const DEFAULT_SEQUENCE = [1, 2, 1, 2, 1, 2, 1, 2, 3];

// Constant empty objects to prevent unnecessary re-renders
const EMPTY_SETTINGS = {};
const EMPTY_TIMERS = {};
const EMPTY_CURRENT = {};
const EMPTY_CYCLE = {};

export const selectSettings = (state) => state.settings || EMPTY_SETTINGS;

export const selectTimers = createSelector(
  [selectSettings],
  (settings) => settings.timers || EMPTY_TIMERS
);

export const selectPomodoro = createSelector([selectTimers], (timers) => {
  const val = timers.pomodoro;
  return typeof val === "number" && val > 0 ? val : 25;
});

export const selectShort = createSelector([selectTimers], (timers) => {
  const val = timers.short;
  return typeof val === "number" && val > 0 ? val : 5;
});

export const selectLong = createSelector([selectTimers], (timers) => {
  const val = timers.long;
  return typeof val === "number" && val > 0 ? val : 15;
});

export const selectCurrent = createSelector(
  [selectSettings],
  (settings) => settings.current || EMPTY_CURRENT
);

export const selectTimerModeRaw = createSelector([selectCurrent], (current) => {
  const val = current.timermode;
  return val !== undefined ? val : 1;
});

export const selectIsAutoStartRaw = createSelector([selectCurrent], (current) =>
  Boolean(current.autostart)
);

export const selectSecondsLeftRaw = createSelector(
  [selectCurrent],
  (current) =>
    typeof current.secondsleft === "number" ? current.secondsleft : null
);

export const selectCurrentTimeRaw = createSelector(
  [selectCurrent],
  (current) =>
    typeof current.currenttime === "number" ? current.currenttime : null
);

export const selectTotalSecondsRaw = createSelector(
  [selectCurrent],
  (current) =>
    typeof current.totalseconds === "number" && current.totalseconds > 0
      ? current.totalseconds
      : 1500
);

export const selectCycle = createSelector(
  [selectSettings],
  (settings) => settings.cycle || EMPTY_CYCLE
);

export const selectCycleSequence = createSelector([selectCycle], (cycle) => {
  const seq = cycle.sequence;
  return Array.isArray(seq) && seq.length > 0 ? seq : DEFAULT_SEQUENCE;
});

export const selectCycleCounter = createSelector([selectCycle], (cycle) =>
  typeof cycle.counter === "number" && cycle.counter >= 0 ? cycle.counter : 0
);

export const selectCyclePausedRaw = createSelector([selectCurrent], (current) =>
  Boolean(current.cyclepaused)
);

export const selectCycleCompleteRaw = createSelector(
  [selectCurrent],
  (current) => Boolean(current.cyclecomplete)
);

export const selectCycleStartedRaw = createSelector(
  [selectCurrent],
  (current) => Boolean(current.cyclestarted)
);

// Fixed: Use constant reference instead of creating new object
export const selectAlarm = createSelector(
  [selectSettings],
  (settings) => settings.alarm || DEFAULT_ALARM_SETTINGS
);

export const selectButtonSoundRaw = createSelector([selectAlarm], (alarm) =>
  Boolean(alarm.buttonSound)
);

export const selectAlarmVolumeRaw = createSelector([selectAlarm], (alarm) =>
  typeof alarm.volume === "number" && alarm.volume >= 0 && alarm.volume <= 1
    ? alarm.volume
    : 0.5
);

export const selectAlarmSoundRaw = createSelector([selectAlarm], (alarm) =>
  typeof alarm.sound === "string" && alarm.sound.length > 0
    ? alarm.sound
    : "No Sound"
);

export const selectAlarmEnabledRaw = createSelector([selectAlarm], (alarm) =>
  Boolean(alarm.enabled)
);

let lastAlarmArgs = [];
let lastAlarmResult = DEFAULT_ALARM_SETTINGS;

export const selectAlarmSettings = createSelector(
  [
    selectAlarmVolumeRaw,
    selectButtonSoundRaw,
    selectAlarmEnabledRaw,
    selectAlarmSoundRaw,
  ],
  (volume, buttonSound, enabled, sound) => {
    const args = [volume, buttonSound, enabled, sound];
    const isSame =
      lastAlarmArgs.length === args.length &&
      args.every((arg, index) => arg === lastAlarmArgs[index]);

    if (isSame) {
      return lastAlarmResult;
    }

    if (
      volume === DEFAULT_ALARM_SETTINGS.volume &&
      buttonSound === DEFAULT_ALARM_SETTINGS.buttonSound &&
      enabled === DEFAULT_ALARM_SETTINGS.enabled &&
      sound === DEFAULT_ALARM_SETTINGS.sound
    ) {
      lastAlarmResult = DEFAULT_ALARM_SETTINGS;
    } else {
      lastAlarmResult = { volume, buttonSound, enabled, sound };
    }
    lastAlarmArgs = args;
    return lastAlarmResult;
  }
);

export const selectTimerMode = createSelector([selectTimerModeRaw], (mode) => {
  const n = Number(mode);
  if (!Number.isFinite(n) || n < 1 || n > 3) return 1;
  return Math.floor(n);
});

export const selectIsAutoStart = createSelector(
  [selectIsAutoStartRaw],
  Boolean
);

export const selectCurrentTime = createSelector(
  [
    selectCurrentTimeRaw,
    selectTimerMode,
    selectPomodoro,
    selectShort,
    selectLong,
  ],
  (currentTimeRaw, mode, pomo, shortMin, longMin) => {
    if (currentTimeRaw !== null && Number.isFinite(Number(currentTimeRaw))) {
      return Number(currentTimeRaw);
    }

    switch (mode) {
      case 1:
        return Number(pomo);
      case 2:
        return Number(shortMin);
      case 3:
        return Number(longMin);
      default:
        return Number(pomo);
    }
  }
);

export const selectSecondsLeft = createSelector(
  [selectSecondsLeftRaw, selectCurrentTime],
  (secondsLeftRaw, currentTimeMinutes) => {
    if (secondsLeftRaw !== null && secondsLeftRaw !== undefined)
      return Number(secondsLeftRaw);

    const total = Math.max(1, Number(currentTimeMinutes) * 60);
    return total;
  }
);

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

export const selectCycleLength = createSelector(
  [selectCycleSequence],
  (sequence) => sequence.length
);

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

const selectors = {
  selectSettings,
  selectTimers,
  selectPomodoro,
  selectShort,
  selectLong,
  selectCurrent,
  selectTimerMode,
  selectIsAutoStart,
  selectCurrentTime,
  selectSecondsLeft,
  selectTotalSecondsRaw,
  selectCycle,
  selectCycleSequence,
  selectCycleCounter,
  selectCycleLength,
  selectCyclePaused,
  selectCycleComplete,
  selectCycleStarted,
  selectCurrentModeValue,
  selectAlarm,
  selectAlarmSettings,
  selectAlarmVolume,
  selectButtonSound,
  selectAlarmEnabled,
  selectAlarmSound,
  selectProgress,
  selectTimerModeRaw,
  selectIsAutoStartRaw,
  selectSecondsLeftRaw,
  selectCurrentTimeRaw,
};

export default selectors;
