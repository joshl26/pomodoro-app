import React, { useCallback, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SecondaryButtons.css";

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

import useAudioManager from "../hooks/useAudioManager";

function SecondaryButtons() {
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

  const { playButtonSound, load, stop, setVolume } = useAudioManager();

  useEffect(() => {
    if (!load) return;
    if (alarmSettings.sound && alarmSettings.sound !== "No Sound") {
      const inst = load(alarmSettings.sound);
      if (inst && typeof setVolume === "function") {
        setVolume(alarmSettings.sound, alarmSettings.volume);
      }
    }
  }, [alarmSettings.sound, alarmSettings.volume, load, setVolume]);

  useEffect(() => {
    if (!load) return;
    if (alarmSettings.buttonSound) {
      load("button");
    }
  }, [alarmSettings.buttonSound, load]);

  useEffect(() => {
    return () => {
      stop("button");
      stop("alarm");
      stop("Bell");
      stop("Digital");
      stop("Kitchen");
    };
  }, [stop]);

  const safePlayButton = useCallback(() => {
    try {
      stop("button");
    } catch {}
    return playButtonSound();
  }, [playButtonSound, stop]);

  const handleReset = useCallback(() => {
    safePlayButton();
    dispatch(setDefault());
  }, [dispatch, safePlayButton]);

  const incDec = useCallback(
    (action) => {
      safePlayButton();
      dispatch(action());
    },
    [dispatch, safePlayButton]
  );

  const handleAutoStartChange = useCallback(() => {
    safePlayButton();
    dispatch(setAutoStart(!autoStart));
  }, [dispatch, autoStart, safePlayButton]);

  const handleAlarmToggle = useCallback(
    (e) => {
      const enabled = e.target.checked;
      safePlayButton();
      dispatch(setAlarmState(enabled));
    },
    [dispatch, safePlayButton]
  );

  const handleAlarmSoundChange = useCallback(
    (e) => {
      const value = e.target.value;
      safePlayButton();
      dispatch(setAlarmSound(value));
      if (value && value !== "No Sound") {
        dispatch(setAlarmState(true));
        if (load) {
          const inst = load(value);
          if (inst && typeof setVolume === "function") {
            setVolume(value, alarmSettings.volume);
          }
        }
      } else {
        dispatch(setAlarmState(false));
      }
    },
    [dispatch, safePlayButton, load, setVolume, alarmSettings.volume]
  );

  const handleVolumeChange = useCallback(
    (e) => {
      const v = parseFloat(e.target.value);
      safePlayButton();
      const numeric = Number.isFinite(v) ? v : 0;
      dispatch(setAlarmVolume(numeric));
      if (
        alarmSettings.sound &&
        alarmSettings.sound !== "No Sound" &&
        typeof setVolume === "function"
      ) {
        setVolume(alarmSettings.sound, numeric);
      }
    },
    [dispatch, safePlayButton, alarmSettings.sound, setVolume]
  );

  const handleButtonSoundToggle = useCallback(() => {
    safePlayButton();
    dispatch(setButtonSoundState(!Boolean(alarmSettings.buttonSound)));
  }, [dispatch, alarmSettings.buttonSound, safePlayButton]);

  return (
    <div className="secondary-buttons-root">
      <section className="settings-section" aria-label="Timer Durations">
        <fieldset>
          <legend>Focus Time</legend>
          <div
            className="setting-controls"
            aria-live="polite"
            data-testid="focus-group"
          >
            <button
              type="button"
              className="setting-btn decrement"
              onClick={() => incDec(pomoDecrement)}
              aria-label="Decrease focus time"
              data-testid="pomo-decrement"
            >
              −
            </button>
            <span className="setting-value" data-testid="pomo-value">
              {pomoTime} min
            </span>
            <button
              type="button"
              className="setting-btn increment"
              onClick={() => incDec(pomoIncrement)}
              aria-label="Increase focus time"
              data-testid="pomo-increment"
            >
              +
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Short Break</legend>
          <div
            className="setting-controls"
            aria-live="polite"
            data-testid="short-group"
          >
            <button
              type="button"
              className="setting-btn decrement"
              onClick={() => incDec(shortDecrement)}
              aria-label="Decrease short break time"
              data-testid="short-decrement"
            >
              −
            </button>
            <span className="setting-value" data-testid="short-value">
              {shortTime} min
            </span>
            <button
              type="button"
              className="setting-btn increment"
              onClick={() => incDec(shortIncrement)}
              aria-label="Increase short break time"
              data-testid="short-increment"
            >
              +
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend>Long Break</legend>
          <div
            className="setting-controls"
            aria-live="polite"
            data-testid="long-group"
          >
            <button
              type="button"
              className="setting-btn decrement"
              onClick={() => incDec(longDecrement)}
              aria-label="Decrease long break time"
              data-testid="long-decrement"
            >
              −
            </button>
            <span className="setting-value" data-testid="long-value">
              {longTime} min
            </span>
            <button
              type="button"
              className="setting-btn increment"
              onClick={() => incDec(longIncrement)}
              aria-label="Increase long break time"
              data-testid="long-increment"
            >
              +
            </button>
          </div>
        </fieldset>
      </section>

      <section className="settings-section" aria-label="Preferences">
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
          <label htmlFor="alarm-sound-select">Alarm Sound</label>
          <select
            id="alarm-sound-select"
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
          <label htmlFor="alarm-volume-slider" id="alarm-volume-label">
            Volume: {Math.round((alarmSettings.volume ?? 0.5) * 100)}%
          </label>
          <input
            type="range"
            id="alarm-volume-slider"
            min="0"
            max="1"
            step="0.01"
            value={alarmSettings.volume ?? 0.5}
            onChange={handleVolumeChange}
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={alarmSettings.volume ?? 0.5}
            aria-valuetext={`${Math.round((alarmSettings.volume ?? 0.5) * 100)} percent`}
            aria-labelledby="alarm-volume-label"
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
            type="button"
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

export default React.memo(SecondaryButtons);
