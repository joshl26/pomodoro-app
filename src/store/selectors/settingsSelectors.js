// src/store/selectors/settingsSelectors.js

export const selectSettings = (state) => state.settings;

export const selectTimerMode = (state) => state.settings.timermode;
export const selectCurrentTime = (state) => state.settings.currenttime;
export const selectTotalSeconds = (state) => state.settings.totalseconds;
export const selectSecondsLeft = (state) => state.settings.secondsleft;
export const selectCycle = (state) => state.settings.cycle;
export const selectCounter = (state) => state.settings.counter;
export const selectCycleComplete = (state) => state.settings.cyclecomplete;

export const selectIsAutoStart = (state) => Boolean(state.settings.autostart);
export const selectAlarmSettings = (state) => ({
  enabled: state.settings.alarmenabled,
  sound: state.settings.alarmsound,
  volume: state.settings.alarmvolume,
  buttonSound: state.settings.buttonsound,
});
