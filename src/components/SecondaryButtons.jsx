import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SecondaryButtons.css";

// Import thunks
import { resetCycleAndTimer } from "../store/settingsThunks";

// Import selectors
import {
  selectAlarmSettings,
  selectPomodoro,
  selectShortBreak,
  selectLongBreak,
  selectIsAutoStart,
} from "../store/selectors/settingsSelectors";

// Import actions
import {
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

const SecondaryButtons = () => {
  const dispatch = useDispatch();

  // Select all needed state once
  const alarmSettings = useSelector(selectAlarmSettings);
  const pomoTime = useSelector(selectPomodoro);
  const shortTime = useSelector(selectShortBreak);
  const longTime = useSelector(selectLongBreak);
  const autoStart = useSelector(selectIsAutoStart);

  const handleReset = () => {
    dispatch(resetCycleAndTimer({ keepAudio: true }));
  };

  return (
    <div className="settings-container">
      <div className="settings-section">
        <h3 className="settings-title">Timer Durations</h3>

        <div className="setting-group">
          <label className="setting-label">Focus Time</label>
          <div className="setting-controls">
            <button
              className="setting-btn decrement"
              onClick={() => dispatch(pomoDecrement())}
            >
              -
            </button>
            <span className="setting-value">{pomoTime} min</span>
            <button
              className="setting-btn increment"
              onClick={() => dispatch(pomoIncrement())}
            >
              +
            </button>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Short Break</label>
          <div className="setting-controls">
            <button
              className="setting-btn decrement"
              onClick={() => dispatch(shortDecrement())}
            >
              -
            </button>
            <span className="setting-value">{shortTime} min</span>
            <button
              className="setting-btn increment"
              onClick={() => dispatch(shortIncrement())}
            >
              +
            </button>
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Long Break</label>
          <div className="setting-controls">
            <button
              className="setting-btn decrement"
              onClick={() => dispatch(longDecrement())}
            >
              -
            </button>
            <span className="setting-value">{longTime} min</span>
            <button
              className="setting-btn increment"
              onClick={() => dispatch(longIncrement())}
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="settings-title">Preferences</h3>

        <div className="setting-group">
          <label className="setting-label checkbox-label">
            <input
              type="checkbox"
              checked={autoStart}
              onChange={(e) => dispatch(setAutoStart(e.target.checked))}
              className="setting-checkbox"
            />
            Auto Start Breaks
          </label>
        </div>

        <div className="setting-group">
          <label className="setting-label checkbox-label">
            <input
              type="checkbox"
              checked={alarmSettings.enabled}
              onChange={(e) => dispatch(setAlarmState(e.target.checked))}
              className="setting-checkbox"
            />
            Enable Alarm
          </label>
        </div>

        <div className="setting-group">
          <label className="setting-label">Alarm Sound</label>
          <select
            value={alarmSettings.sound}
            onChange={(e) => dispatch(setAlarmSound(e.target.value))}
            className="setting-select"
          >
            <option value="No Sound">No Sound</option>
            <option value="Bell">Bell</option>
            <option value="Beep">Beep</option>
            <option value="Chime">Chime</option>
          </select>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            Volume: {Math.round(alarmSettings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={alarmSettings.volume}
            onChange={(e) =>
              dispatch(setAlarmVolume(parseFloat(e.target.value)))
            }
            className="setting-slider"
          />
        </div>

        <div className="setting-group">
          <label className="setting-label checkbox-label">
            <input
              type="checkbox"
              checked={alarmSettings.buttonSound}
              onChange={(e) => dispatch(setButtonSoundState(e.target.checked))}
              className="setting-checkbox"
            />
            Button Sound
          </label>
        </div>
      </div>

      <div className="settings-section">
        <div className="setting-group">
          <button onClick={handleReset} className="reset-all-btn">
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondaryButtons;
