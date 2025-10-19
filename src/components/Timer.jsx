import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";
import {
  FaPlay,
  FaPause,
  FaRedo,
  FaStepForward,
  FaStepBackward,
} from "react-icons/fa";
import "./Timer.css";
import SecondaryButtons from "./SecondaryButtons";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import ButtonPressSound from "../assets/sounds/button-press.wav";
import TickingSlowSound from "../assets/sounds/ticking-slow.mp3";

// Import thunks
import {
  setTimerModeAndReset,
  resetCycleAndTimer,
} from "../store/settingsThunks";

// Import selectors
import {
  selectSecondsLeft,
  selectIsAutoStart,
  selectAlarmSettings,
  selectCurrentTime,
  selectCycleComplete,
  selectCyclePaused,
} from "../store/selectors/settingsSelectors";

// Import custom hooks
import { useTimerMode } from "../hooks/useTimerMode";
import { useTimerControls } from "../hooks/useTimerControls";
import { useAutoStartCycle } from "../hooks/useAutoStartCycle";
import { setAutoStart } from "../store/settingsSlice";

export default function Timer() {
  const dispatch = useDispatch();

  // Selectors
  const pomoTimeState = useSelector((state) => state.settings.pomodoro);
  const shortTimeState = useSelector((state) => state.settings.short);
  const longTimeState = useSelector((state) => state.settings.long);
  const autoStartState = useSelector(selectIsAutoStart);
  const cyclePausedState = useSelector(selectCyclePaused);
  const currentTime = useSelector(selectCurrentTime);
  const secondsLeft = useSelector(selectSecondsLeft);
  const alarmSettings = useSelector(selectAlarmSettings);
  const cycleComplete = useSelector(selectCycleComplete);

  const { volume: alarmVolume, buttonSound: buttonSoundState } = alarmSettings;

  // Custom hooks
  const { currentMode, switchMode, getModeName } = useTimerMode();
  const { isPaused, handleStart, handlePause, handleResume } = useTimerControls(
    startTimer,
    pauseTimer,
    resumeTimer
  );
  const { advance, retreat } = useAutoStartCycle();

  const {
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
    playing: isPlaying,
    load: loadAudio,
  } = useGlobalAudioPlayer();

  // Calculate expiry timestamp using currentTime from Redux
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + currentTime * 60);

  const {
    seconds,
    minutes,
    isRunning,
    start: startTimer,
    resume: resumeTimer,
    pause: pauseTimer,
    restart: restartTimer,
  } = useTimer({
    autoStart: autoStartState,
    expiryTimestamp,
    onExpire: () => {
      cycleExpired();
    },
  });

  useEffect(() => {
    if (isRunning) {
      loadAudio(TickingSlowSound, {
        autoplay: true,
        initialVolume: alarmVolume,
      });
    } else {
      stopAudio();
    }
  }, [isRunning, alarmVolume, loadAudio, stopAudio]);

  const cycleExpired = () => {
    dispatch(resetCycleAndTimer({ keepAudio: true }));

    if (autoStartState) {
      handleStart();
    }
  };

  const buttonClickSound = () => {
    if (buttonSoundState) {
      loadAudio(ButtonPressSound, {
        autoplay: true,
        initialVolume: 0.5,
      });
    }
  };

  const forwardButtonClicked = () => {
    buttonClickSound();

    if (autoStartState) {
      advance(true);
      handleStart();
    } else {
      // Manual mode transition cycle: pomo -> short -> long -> pomo
      if (currentMode === 1) {
        switchMode(2);
      } else if (currentMode === 2) {
        switchMode(3);
      } else {
        switchMode(1);
      }
    }
  };

  const backwardButtonClicked = () => {
    buttonClickSound();

    if (autoStartState) {
      retreat(true);
      handleStart();
    } else {
      // Manual mode transition cycle: pomo <- short <- long <- pomo
      if (currentMode === 1) {
        switchMode(3);
      } else if (currentMode === 2) {
        switchMode(1);
      } else {
        switchMode(2);
      }
    }
  };

  // Format time with leading zeros
  const formatTime = (value) => value.toString().padStart(2, "0");

  return (
    <div className="timer-container">
      <div className="timer-content">
        {/* Mode indicator */}
        <div className="mode-indicator">{getModeName()}</div>

        {/* Time display */}
        <div className="time-display">
          <span className="time-minutes">{formatTime(minutes)}</span>
          <span className="time-separator">:</span>
          <span className="time-seconds">{formatTime(seconds)}</span>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${((currentTime * 60 - secondsLeft) / (currentTime * 60)) * 100}%`,
              backgroundColor:
                currentMode === 1
                  ? "var(--primary-color)"
                  : currentMode === 2
                    ? "var(--secondary-color)"
                    : "var(--tertiary-color)",
            }}
          ></div>
        </div>

        {/* Control buttons */}
        <div className="timer-controls">
          {!isRunning && !cyclePausedState ? (
            <button
              className="control-btn start-btn"
              onClick={() => {
                handleStart();
                buttonClickSound();
              }}
            >
              <FaPlay /> Start
            </button>
          ) : (
            <div className="running-controls">
              <button
                className="control-btn nav-btn"
                onClick={backwardButtonClicked}
              >
                <FaStepBackward />
              </button>

              {cyclePausedState ? (
                <button
                  className="control-btn pause-btn"
                  onClick={() => {
                    handleResume();
                    buttonClickSound();
                  }}
                >
                  <FaPlay /> Resume
                </button>
              ) : (
                <button
                  className="control-btn pause-btn"
                  onClick={() => {
                    handlePause();
                    buttonClickSound();
                  }}
                >
                  <FaPause /> Pause
                </button>
              )}

              <button
                className="control-btn nav-btn"
                onClick={forwardButtonClicked}
              >
                <FaStepForward />
              </button>
            </div>
          )}
        </div>

        {/* Reset button */}
        <div className="reset-container">
          <button
            className="control-btn reset-btn"
            onClick={() => {
              buttonClickSound();
              dispatch(resetCycleAndTimer({ keepAudio: true }));
            }}
          >
            <FaRedo /> Reset Timer
          </button>
        </div>

        {/* Auto-start toggle */}
        <div className="autobreak-container">
          <label className="autobreak-toggle">
            <input
              type="checkbox"
              checked={autoStartState}
              onChange={(e) => {
                const isChecked = e.target.checked;
                dispatch(setAutoStart(isChecked));
                if (isChecked) {
                  switchMode(1);
                }
              }}
            />
            <span>Auto Start Breaks</span>
          </label>
        </div>
      </div>

      {/* Secondary buttons */}
      <SecondaryButtons />
    </div>
  );
}
