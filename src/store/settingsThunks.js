// src/store/settingsThunks.js
import {
  setTimerMode,
  setCurrentTimeFromMode,
  setTotalSeconds,
  setSecondsLeft,
  setDefault,
  setAlarmState,
  setAlarmSound,
  setAlarmVolume,
  setButtonSoundState,
} from "./settingsSlice";

/**
 * Set timer mode (1|2|3) and reset currenttime/totalseconds/secondsleft
 * Usage: dispatch(setTimerModeAndReset(2))
 */
export const setTimerModeAndReset = (mode) => (dispatch, getState) => {
  dispatch(setTimerMode(mode));
  // update currenttime from the selected mode
  dispatch(setCurrentTimeFromMode());

  // re-read settings after setting currenttime
  const { settings } = getState();
  const minutes = Number(settings.currenttime) || 0;
  const secs = Math.max(0, Math.floor(minutes * 60));

  dispatch(setTotalSeconds(secs));
  dispatch(setSecondsLeft(secs));
};

/**
 * Reset cycle and timer to defaults.
 * If keepAudio === true, preserves alarmenabled, alarmsound, alarmvolume, buttonsound.
 * Usage: dispatch(resetCycleAndTimer({ keepAudio: true }))
 */
export const resetCycleAndTimer =
  ({ keepAudio = false } = {}) =>
  (dispatch, getState) => {
    let preserved = {};
    if (keepAudio) {
      const { settings } = getState();
      preserved = {
        alarmenabled: settings.alarmenabled,
        alarmsound: settings.alarmsound,
        alarmvolume: settings.alarmvolume,
        buttonsound: settings.buttonsound,
      };
    }

    // reset everything to defaults
    dispatch(setDefault());

    // if preserving audio, reapply them
    if (keepAudio) {
      const { alarmenabled, alarmsound, alarmvolume, buttonsound } = preserved;
      dispatch(setAlarmState(alarmenabled));
      dispatch(setAlarmSound(alarmsound));
      dispatch(setAlarmVolume(alarmvolume));
      dispatch(setButtonSoundState(buttonsound));
    }
  };
