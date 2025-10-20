// src/store/selectors/index.js
// Centralized selectors for settings + timer slices.
// Adjust paths if your slices live in different files.

export const selectSettings = (state) => state.settings || {};
export const selectTimer = (state) => state.timer || {};

// Settings-specific selectors
export const selectIsAutoStart = (state) =>
  Boolean(state?.settings?.current?.autostart);

export const selectCyclePaused = (state) =>
  Boolean(state?.settings?.current?.cyclepaused);

export const selectCurrentTime = (state) =>
  // minutes for current mode (settings.current.currenttime)
  Number(
    state?.settings?.current?.currenttime ||
      state?.settings?.timers?.pomodoro ||
      25
  );

export const selectAlarmSettings = (state) => state?.settings?.alarm || {};

// Timer runtime selectors (if you need them elsewhere)
export const selectSecondsLeft = (state) =>
  Number(state?.timer?.secondsLeft ?? state?.timer?.secondsleft ?? 0);

export const selectIsRunning = (state) => Boolean(state?.timer?.running);

// Convenience selectors for individual timers
export const selectPomodoro = (state) =>
  Number(state?.settings?.timers?.pomodoro ?? 25);

export const selectShort = (state) =>
  Number(state?.settings?.timers?.short ?? 5);

export const selectLong = (state) =>
  Number(state?.settings?.timers?.long ?? 15);
