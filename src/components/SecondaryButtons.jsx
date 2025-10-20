// src/components/SecondaryButtons.jsx
import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SecondaryButtons.css";

// import ButtonPressSound from "../assets/sounds/button-press.wav"; // still imported for bundler

import {
  setDefault,
  pomoIncrement,
  pomoDecrement,
  shortIncrement,
  shortDecrement,
  longIncrement,
  longDecrement,
  setAutoStart,
  setAlarmState,
  setAlarmSound,
  setAlarmVolume,
  setButtonSoundState,
} from "../store/settingsSlice";

import {
  selectAlarmSettings,
  selectPomodoro,
  selectShort,
  selectLong,
  selectIsAutoStart,
} from "../store/selectors";

import { useAudioManager } from "../hooks/useAudioManager";

export default function SecondaryButtons() {
  const dispatch = useDispatch();
  const rawAlarmSettings = useSelector(selectAlarmSettings);

  const alarmSettings = useMemo(
    () => ({
      enabled: Boolean(rawAlarmSettings?.enabled),
      buttonSound: Boolean(rawAlarmSettings?.buttonSound),
      sound: rawAlarmSettings?.sound ?? "No Sound",
      volume:
        typeof rawAlarmSettings?.volume === "number"
          ? rawAlarmSettings.volume
          : 0.5,
    }),
    [
      rawAlarmSettings?.enabled,
      rawAlarmSettings?.buttonSound,
      rawAlarmSettings?.sound,
      rawAlarmSettings?.volume,
    ]
  );

  const pomoTime = useSelector(selectPomodoro);
  const shortTime = useSelector(selectShort);
  const longTime = useSelector(selectLong);
  const autoStart = useSelector(selectIsAutoStart);

  // use centralized audio hook
  const { playButtonSound } = useAudioManager();

  const handleReset = useCallback(() => {
    playButtonSound();
    dispatch(setDefault());
  }, [dispatch, playButtonSound]);

  const incDec = useCallback(
    (action) => {
      playButtonSound();
      dispatch(action());
    },
    [dispatch, playButtonSound]
  );

  const handleAutoStartChange = useCallback(() => {
    playButtonSound();
    dispatch(setAutoStart(!autoStart));
  }, [dispatch, autoStart, playButtonSound]);

  const handleAlarmToggle = useCallback(
    (e) => {
      const enabled = e.target.checked;
      playButtonSound();
      dispatch(setAlarmState(enabled));
    },
    [dispatch, playButtonSound]
  );

  const handleAlarmSoundChange = useCallback(
    (e) => {
      const value = e.target.value;
      playButtonSound();
      dispatch(setAlarmSound(value));
      if (value && value !== "No Sound") {
        dispatch(setAlarmState(true));
      } else {
        dispatch(setAlarmState(false));
      }
    },
    [dispatch, playButtonSound]
  );

  const handleVolumeChange = useCallback(
    (e) => {
      const v = parseFloat(e.target.value);
      playButtonSound();
      dispatch(setAlarmVolume(Number.isFinite(v) ? v : 0));
    },
    [dispatch, playButtonSound]
  );

  const handleButtonSoundToggle = useCallback(() => {
    playButtonSound();
    dispatch(setButtonSoundState(!Boolean(alarmSettings.buttonSound)));
  }, [dispatch, alarmSettings.buttonSound, playButtonSound]);

  return (
    <div className="secondary-buttons-root">
      <section className="settings-section">
        <h3>Timer Durations</h3>

        <div
          className="setting-group"
          aria-label="Focus time"
          data-testid="focus-group"
        >
          <label className="setting-label">Focus Time</label>
          <div className="setting-controls">
            <button
              className="setting-btn decrement"
              onClick={() => incDec(pomoDecrement)}
              aria-label="Decrease focus time"
              data-testid="pomo-decrement"
            >
              −
            </button>
            <span
              className="setting-value"
              aria-live="polite"
              data-testid="pomo-value"
            >
              {pomoTime} min
            </span>
            <button
              className="setting-btn increment"
              onClick={() => incDec(pomoIncrement)}
              aria-label="Increase focus time"
              data-testid="pomo-increment"
            >
              +
            </button>
          </div>
        </div>

        <div
          className="setting-group"
          aria-label="Short break time"
          data-testid="short-group"
        >
          <label className="setting-label">Short Break</label>
          <div className="setting-controls">
            <button
              className="setting-btn decrement"
              onClick={() => incDec(shortDecrement)}
              aria-label="Decrease short break time"
              data-testid="short-decrement"
            >
              −
            </button>
            <span
              className="setting-value"
              aria-live="polite"
              data-testid="short-value"
            >
              {shortTime} min
            </span>
            <button
              className="setting-btn increment"
              onClick={() => incDec(shortIncrement)}
              aria-label="Increase short break time"
              data-testid="short-increment"
            >
              +
            </button>
          </div>
        </div>

        <div
          className="setting-group"
          aria-label="Long break time"
          data-testid="long-group"
        >
          <label className="setting-label">Long Break</label>
          <div className="setting-controls">
            <button
              className="setting-btn decrement"
              onClick={() => incDec(longDecrement)}
              aria-label="Decrease long break time"
              data-testid="long-decrement"
            >
              −
            </button>
            <span
              className="setting-value"
              aria-live="polite"
              data-testid="long-value"
            >
              {longTime} min
            </span>
            <button
              className="setting-btn increment"
              onClick={() => incDec(longIncrement)}
              aria-label="Increase long break time"
              data-testid="long-increment"
            >
              +
            </button>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h3>Preferences</h3>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(autoStart)}
              onChange={handleAutoStartChange}
              aria-checked={Boolean(autoStart)}
              data-testid="auto-start-toggle"
            />
            Auto Start Breaks
          </label>
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(alarmSettings.enabled)}
              onChange={handleAlarmToggle}
              aria-checked={Boolean(alarmSettings.enabled)}
              data-testid="alarm-enable-toggle"
            />
            Enable Alarm
          </label>
        </div>

        <div className="setting-group">
          <label>Alarm Sound</label>
          <select
            value={alarmSettings.sound ?? "No Sound"}
            onChange={handleAlarmSoundChange}
            aria-label="Select alarm sound"
            data-testid="alarm-sound-select"
          >
            <option value="No Sound">No Sound</option>
            <option value="Bell">Bell</option>
            <option value="Digital">Digital</option>
            <option value="Kitchen">Kitchen</option>
          </select>
        </div>

        <div className="setting-group">
          <label>
            Volume: {Math.round((alarmSettings.volume ?? 0.5) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alarmSettings.volume ?? 0.5}
            onChange={handleVolumeChange}
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={alarmSettings.volume ?? 0.5}
            data-testid="alarm-volume-slider"
          />
        </div>

        <div className="setting-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={Boolean(alarmSettings.buttonSound)}
              onChange={handleButtonSoundToggle}
              aria-checked={Boolean(alarmSettings.buttonSound)}
              data-testid="button-sound-toggle"
            />
            Button Sound
          </label>
        </div>
      </section>

      <section className="settings-section">
        <div className="setting-group">
          <button
            onClick={handleReset}
            className="reset-all-btn"
            data-testid="reset-all-btn"
          >
            Reset All Settings
          </button>
        </div>
      </section>
    </div>
  );
}
