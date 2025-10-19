import React, { useEffect, useMemo, useCallback } from "react";
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

import { resetCycleAndTimer } from "../store/settingsThunks";

import {
  selectSecondsLeft,
  selectIsAutoStart,
  selectAlarmSettings,
  selectCurrentTime,
  selectCyclePaused,
} from "../store/selectors";

import { useTimerMode } from "../hooks/useTimerMode";
import { useTimerControls } from "../hooks/useTimerControls";
import { useAutoStartCycle } from "../hooks/useAutoStartCycle";
import { setAutoStart } from "../store/settingsSlice";

/**
 * Small pure ProgressBar component extracted to avoid ambiguous useMemo deps.
 * React.memo ensures it only re-renders when props change.
 */
const ProgressBar = React.memo(function ProgressBar({
  progressPercent,
  currentMode,
}) {
  const bgColor =
    currentMode === 1
      ? "var(--primary-color)"
      : currentMode === 2
        ? "var(--secondary-color)"
        : "var(--tertiary-color)";

  return (
    <div className="progress-container" aria-hidden>
      <div
        className="progress-bar"
        style={{
          width: `${progressPercent}%`,
          backgroundColor: bgColor,
        }}
      />
    </div>
  );
});

/**
 * Timer component - renders pomodoro timer and controls.
 * Uses centralized selectors and custom hooks for mode, controls and audio.
 */
export default function Timer() {
  const dispatch = useDispatch();

  // Redux selectors (centralized)
  const autoStartState = useSelector(selectIsAutoStart);
  const cyclePausedState = useSelector(selectCyclePaused);
  const currentTime = useSelector(selectCurrentTime); // minutes for current mode
  const secondsLeft = useSelector(selectSecondsLeft);
  const alarmSettings = useSelector(selectAlarmSettings) || {};
  const { volume: alarmVolume = 0.8, buttonSound: buttonSoundState = true } =
    alarmSettings;

  // Compute expiry timestamp from currentTime (minutes)
  const expiryTimestamp = useMemo(() => {
    const ts = new Date();
    ts.setSeconds(ts.getSeconds() + Math.max(1, Number(currentTime) || 1) * 60);
    return ts;
  }, [currentTime]);

  // useTimer from react-timer-hook
  const {
    seconds,
    minutes,
    isRunning,
    start: startTimer,
    resume: resumeTimer,
    pause: pauseTimer,
  } = useTimer({
    autoStart: autoStartState,
    expiryTimestamp,
    onExpire: () => {
      cycleExpired();
    },
  });

  // Provide timer control functions into hook that composes control behavior
  const { handleStart, handlePause, handleResume } = useTimerControls(
    startTimer,
    pauseTimer,
    resumeTimer
  );

  // Mode & cycle hooks
  const { currentMode, switchMode, getModeName } = useTimerMode();
  const { advance, retreat } = useAutoStartCycle();

  // Audio player — only use load/stop which are actually used
  const { stop: stopAudio, load: loadAudio } = useGlobalAudioPlayer();

  // Tick sound: load while running, stop when not running
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

  // Helpers & derived values
  const totalSeconds = Math.max(1, Number(currentTime) * 60);
  const elapsedSeconds = Math.max(
    0,
    totalSeconds - (secondsLeft ?? totalSeconds)
  );
  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsedSeconds / totalSeconds) * 100)
  );

  const formatTime = (value) => value.toString().padStart(2, "0");

  const playButtonSound = useCallback(() => {
    if (buttonSoundState) {
      loadAudio(ButtonPressSound, { autoplay: true, initialVolume: 0.5 });
    }
  }, [buttonSoundState, loadAudio]);

  function cycleExpired() {
    dispatch(resetCycleAndTimer({ keepAudio: true }));
    if (autoStartState) {
      handleStart();
    }
  }

  // Navigation handlers (memoized)
  const forwardButtonClicked = useCallback(() => {
    playButtonSound();
    if (autoStartState) {
      advance(true);
      handleStart();
      return;
    }
    // manual cycle: 1 -> 2 -> 3 -> 1
    const next = currentMode === 1 ? 2 : currentMode === 2 ? 3 : 1;
    switchMode(next);
  }, [
    playButtonSound,
    autoStartState,
    advance,
    handleStart,
    currentMode,
    switchMode,
  ]);

  const backwardButtonClicked = useCallback(() => {
    playButtonSound();
    if (autoStartState) {
      retreat(true);
      handleStart();
      return;
    }
    // manual cycle: 1 <- 2 <- 3 <- 1
    const prev = currentMode === 1 ? 3 : currentMode === 2 ? 1 : 2;
    switchMode(prev);
  }, [
    playButtonSound,
    autoStartState,
    retreat,
    handleStart,
    currentMode,
    switchMode,
  ]);

  // Presentational subcomponents (inline, memoized)
  const ModeIndicator = useMemo(
    () => () => <div className="mode-indicator">{getModeName()}</div>,
    [getModeName]
  );

  const TimeDisplay = useMemo(
    () => () => (
      <div className="time-display" aria-live="polite" aria-atomic="true">
        <span className="time-minutes">{formatTime(minutes)}</span>
        <span className="time-separator">:</span>
        <span className="time-seconds">{formatTime(seconds)}</span>
      </div>
    ),
    [minutes, seconds]
  );

  const ControlButtons = useMemo(
    () =>
      function ControlButtonsInner() {
        if (!isRunning && !cyclePausedState) {
          return (
            <button
              className="control-btn start-btn"
              onClick={() => {
                handleStart();
                playButtonSound();
              }}
              data-testid="start-btn"
            >
              <FaPlay /> Start
            </button>
          );
        }

        return (
          <div className="running-controls">
            <button
              className="control-btn nav-btn"
              onClick={backwardButtonClicked}
              aria-label="Previous cycle"
              data-testid="previous-cycle-btn"
            >
              <FaStepBackward />
            </button>

            {cyclePausedState ? (
              <button
                className="control-btn pause-btn"
                onClick={() => {
                  handleResume();
                  playButtonSound();
                }}
                aria-label="Resume timer"
                data-testid="resume-btn"
              >
                <FaPlay /> Resume
              </button>
            ) : (
              <button
                className="control-btn pause-btn"
                onClick={() => {
                  handlePause();
                  playButtonSound();
                }}
                aria-label="Pause timer"
                data-testid="pause-btn"
              >
                <FaPause /> Pause
              </button>
            )}

            <button
              className="control-btn nav-btn"
              onClick={forwardButtonClicked}
              aria-label="Next cycle"
              data-testid="next-cycle-btn"
            >
              <FaStepForward />
            </button>
          </div>
        );
      },
    [
      isRunning,
      cyclePausedState,
      handleStart,
      handlePause,
      handleResume,
      forwardButtonClicked,
      backwardButtonClicked,
      playButtonSound,
    ]
  );

  const ResetAndAuto = useMemo(
    () =>
      function ResetAutoInner() {
        return (
          <>
            <div className="reset-container">
              <button
                className="control-btn reset-btn"
                onClick={() => {
                  playButtonSound();
                  dispatch(resetCycleAndTimer({ keepAudio: true }));
                }}
                data-testid="reset-btn"
              >
                <FaRedo /> Reset Timer
              </button>
            </div>

            <div className="autobreak-container">
              <label className="autobreak-toggle">
                <input
                  type="checkbox"
                  data-testid="auto-start-breaks-timer"
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
          </>
        );
      },
    [autoStartState, dispatch, switchMode, playButtonSound]
  );

  // Render
  return (
    <div className="timer-container">
      <div className="timer-content">
        <ModeIndicator />
        <TimeDisplay />
        <ProgressBar
          progressPercent={progressPercent}
          currentMode={currentMode}
        />

        <div className="timer-controls">
          <ControlButtons />
        </div>

        <ResetAndAuto />
      </div>

      <SecondaryButtons />
    </div>
  );
}
