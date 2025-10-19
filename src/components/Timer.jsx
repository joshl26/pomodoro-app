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
  selectTimerMode,
  selectSecondsLeft,
  selectCycle,
  selectCounter,
  selectIsAutoStart,
  selectAlarmSettings,
  selectCurrentTime,
  selectCycleComplete,
} from "../store/selectors/settingsSelectors";

// Import actions
import {
  setSecondsLeft,
  setCounter,
  counterIncrement,
  setCycleComplete,
  setCyclePaused,
  counterDecrement,
  setAutoStart,
} from "../store/settingsSlice";

export default function Timer() {
  // Use selectors instead of direct state access
  const pomoTimeState = useSelector((state) => state.settings.pomodoro);
  const shortTimeState = useSelector((state) => state.settings.short);
  const longTimeState = useSelector((state) => state.settings.long);
  const timerModeState = useSelector(selectTimerMode);
  const autoStartState = useSelector(selectIsAutoStart);
  const cyclePausedState = useSelector((state) => state.settings.cyclepaused);
  const currentTime = useSelector(selectCurrentTime);
  const counter = useSelector(selectCounter);
  const secondsLeft = useSelector(selectSecondsLeft);
  const alarmSettings = useSelector(selectAlarmSettings);

  // Derived values from alarmSettings
  const alarmVolume = alarmSettings.volume;
  const buttonSoundState = alarmSettings.buttonSound;

  const cycle = useSelector(selectCycle);
  const cycleComplete = useSelector(selectCycleComplete);

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

  const dispatch = useDispatch();

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
    }
  }, [isRunning, alarmVolume, loadAudio]);

  const cycleExpired = () => {
    dispatch(setCycleComplete(true));

    if (autoStartState === true) {
      const expiryTimestamp = new Date();
      expiryTimestamp.setSeconds(
        expiryTimestamp.getSeconds() + currentTime * 60
      );
      restartTimer(expiryTimestamp);
      startTimer();
    }
  };

  // Use thunks for setting timer modes
  const setShortTimeState = (shouldAutoStart) => {
    dispatch(setTimerModeAndReset(2));
    // Update expiry timestamp with the new time
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(
      expiryTimestamp.getSeconds() + shortTimeState * 60
    );
    restartTimer(expiryTimestamp, shouldAutoStart);
  };

  const setLongTimeState = (shouldAutoStart) => {
    dispatch(setTimerModeAndReset(3));
    // Update expiry timestamp with the new time
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(
      expiryTimestamp.getSeconds() + longTimeState * 60
    );
    restartTimer(expiryTimestamp, shouldAutoStart);
  };

  const setPomoTimeState = (shouldAutoStart) => {
    dispatch(setTimerModeAndReset(1));
    // Update expiry timestamp with the new time
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(
      expiryTimestamp.getSeconds() + pomoTimeState * 60
    );
    restartTimer(expiryTimestamp, shouldAutoStart);
  };

  const buttonClickSound = () => {
    if (buttonSoundState) {
      loadAudio(ButtonPressSound, {
        autoplay: true,
        initialVolume: 0.5,
      });
    }
  };

  const startButtonClicked = () => {
    startTimer();
    buttonClickSound();
  };

  const pauseButtonClicked = () => {
    pauseTimer();
    dispatch(setCyclePaused(true));
    buttonClickSound();
  };

  const resumeButtonClicked = () => {
    resumeTimer();
    dispatch(setCyclePaused(false));
    buttonClickSound();
  };

  const forwardButtonClicked = () => {
    buttonClickSound();
    dispatch(setCyclePaused(false));

    if (autoStartState === true) {
      dispatch(counterIncrement());

      // Use mode handlers based on cycle
      const nextMode = cycle[(counter + 1) % cycle.length];

      if (nextMode === 1) {
        setPomoTimeState(true);
      } else if (nextMode === 2) {
        setShortTimeState(true);
      } else if (nextMode === 3) {
        setLongTimeState(true);
      }
    } else {
      // Manual mode transition
      if (timerModeState === 1) {
        setShortTimeState(false);
      } else if (timerModeState === 2) {
        setLongTimeState(false);
      } else if (timerModeState === 3) {
        setPomoTimeState(false);
      }
    }
  };

  const backwardButtonClicked = () => {
    buttonClickSound();
    dispatch(setCyclePaused(false));

    if (autoStartState === true) {
      dispatch(counterDecrement());

      // Calculate previous counter value
      const cycleLength = cycle.length;
      const prevCounter = (counter - 1 + cycleLength) % cycleLength;
      const prevMode = cycle[prevCounter];

      if (prevMode === 1) {
        setPomoTimeState(true);
      } else if (prevMode === 2) {
        setShortTimeState(true);
      } else if (prevMode === 3) {
        setLongTimeState(true);
      }
    } else {
      // Manual mode transition
      if (timerModeState === 1) {
        setLongTimeState(false);
      } else if (timerModeState === 2) {
        setPomoTimeState(false);
      } else if (timerModeState === 3) {
        setShortTimeState(false);
      }
    }
  };

  // Format time with leading zeros
  const formatTime = (value) => {
    return value.toString().padStart(2, "0");
  };

  // Get mode name for display
  const getModeName = () => {
    switch (timerModeState) {
      case 1:
        return "Focus";
      case 2:
        return "Short Break";
      case 3:
        return "Long Break";
      default:
        return "Focus";
    }
  };

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
                timerModeState === 1
                  ? "var(--primary-color)"
                  : timerModeState === 2
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
              onClick={startButtonClicked}
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
                  onClick={resumeButtonClicked}
                >
                  <FaPlay /> Resume
                </button>
              ) : (
                <button
                  className="control-btn pause-btn"
                  onClick={pauseButtonClicked}
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
                dispatch(setAutoStart(e.target.checked));
                if (e.target.checked) {
                  dispatch(setCounter(1));
                  dispatch(setTimerModeAndReset(1));
                } else {
                  dispatch(setCounter(0));
                  dispatch(setTimerModeAndReset(1));
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
