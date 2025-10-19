import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SecondaryButtons.css";

// Import thunks
import { resetCycleAndTimer } from "../store/settingsThunks";

// Import selectors
import { selectAlarmSettings } from "../store/selectors/settingsSelectors";

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
  const alarmSettings = useSelector(selectAlarmSettings);

  const handleReset = () => {
    dispatch(resetCycleAndTimer({ keepAudio: true }));
  };

  const handlePomoIncrement = () => {
    dispatch(pomoIncrement());
  };

  const handlePomoDecrement = () => {
    dispatch(pomoDecrement());
  };

  const handleShortIncrement = () => {
    dispatch(shortIncrement());
  };

  const handleShortDecrement = () => {
    dispatch(shortDecrement());
  };

  const handleLongIncrement = () => {
    dispatch(longIncrement());
  };

  const handleLongDecrement = () => {
    dispatch(longDecrement());
  };

  const handleAutoStartChange = (e) => {
    dispatch(setAutoStart(e.target.checked));
  };

  const handleAlarmStateChange = (e) => {
    dispatch(setAlarmState(e.target.checked));
  };

  const handleAlarmSoundChange = (e) => {
    dispatch(setAlarmSound(e.target.value));
  };

  const handleAlarmVolumeChange = (e) => {
    dispatch(setAlarmVolume(parseFloat(e.target.value)));
  };

  const handleButtonSoundChange = (e) => {
    dispatch(setButtonSoundState(e.target.checked));
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
              onClick={handlePomoDecrement}
            >
              -
            </button>
            <span className="setting-value">
              {useSelector((state) => state.settings.pomodoro)} min
            </span>
            <button
              className="setting-btn increment"
              onClick={handlePomoIncrement}
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
              onClick={handleShortDecrement}
            >
              -
            </button>
            <span className="setting-value">
              {useSelector((state) => state.settings.short)} min
            </span>
            <button
              className="setting-btn increment"
              onClick={handleShortIncrement}
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
              onClick={handleLongDecrement}
            >
              -
            </button>
            <span className="setting-value">
              {useSelector((state) => state.settings.long)} min
            </span>
            <button
              className="setting-btn increment"
              onClick={handleLongIncrement}
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
              checked={alarmSettings.autoStart}
              onChange={handleAutoStartChange}
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
              onChange={handleAlarmStateChange}
              className="setting-checkbox"
            />
            Enable Alarm
          </label>
        </div>

        <div className="setting-group">
          <label className="setting-label">Alarm Sound</label>
          <select
            value={alarmSettings.sound}
            onChange={handleAlarmSoundChange}
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
            onChange={handleAlarmVolumeChange}
            className="setting-slider"
          />
        </div>

        <div className="setting-group">
          <label className="setting-label checkbox-label">
            <input
              type="checkbox"
              checked={alarmSettings.buttonSound}
              onChange={handleButtonSoundChange}
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
