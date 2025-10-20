// src/components/Timer.jsx
import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  selectIsAutoStart,
  selectCurrentTime,
  selectCyclePaused,
  selectAlarmSettings,
} from "../store/selectors";

import { useTimerMode } from "../hooks/useTimerMode";
import { useAutoStartCycle } from "../hooks/useAutoStartCycle";
import { setAutoStart } from "../store/settingsSlice";

import {
  startTimerWithSeconds,
  resumeTimer,
  pauseTimerThunk,
} from "../store/timerThunks";
import { tick as tickAction } from "../store/timerSlice";

/* ProgressBar */
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

export default function Timer() {
  const dispatch = useDispatch();

  // Settings selectors
  const autoStartState = useSelector(selectIsAutoStart);
  const cyclePausedState = useSelector(selectCyclePaused);
  const currentTime = useSelector(selectCurrentTime); // minutes for current mode
  const alarmSettings = useSelector(selectAlarmSettings) || {};
  const { volume: alarmVolume = 0.8, buttonSound: buttonSoundState = true } =
    alarmSettings;

  // Runtime timer slice
  const timer = useSelector((s) => s.timer || {});
  const {
    running = false,
    totalSeconds: runtimeTotalSeconds,
    secondsLeft: runtimeSecondsLeft,
    alarmTriggered = false,
  } = timer;

  const totalSeconds = Math.max(
    1,
    Number(runtimeTotalSeconds) || Math.max(1, Number(currentTime) * 60)
  );
  const secondsLeft = Number.isFinite(Number(runtimeSecondsLeft))
    ? Math.max(0, Math.floor(Number(runtimeSecondsLeft)))
    : totalSeconds;

  const elapsedSeconds = Math.max(0, totalSeconds - secondsLeft);
  const progressPercent = Math.min(
    100,
    Math.max(0, (elapsedSeconds / totalSeconds) * 100)
  );

  const { stop: stopAudio, load: loadAudio } = useGlobalAudioPlayer();
  const tickIntervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      loadAudio(TickingSlowSound, {
        autoplay: true,
        initialVolume: alarmVolume,
        loop: true,
      });
    } else {
      stopAudio();
    }
  }, [running, alarmVolume, loadAudio, stopAudio]);

  useEffect(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }

    if (running) {
      dispatch(tickAction({ now: Date.now() }));
      tickIntervalRef.current = setInterval(() => {
        dispatch(tickAction({ now: Date.now() }));
      }, 1000);
    }

    return () => {
      if (tickIntervalRef.current) {
        clearInterval(tickIntervalRef.current);
        tickIntervalRef.current = null;
      }
    };
  }, [running, dispatch]);

  // When alarm triggers: reset & optionally autostart next cycle (compute seconds from currentTime)
  useEffect(() => {
    if (alarmTriggered) {
      stopAudio();
      dispatch(resetCycleAndTimer({ keepAudio: true }));

      if (autoStartState) {
        const nextTotal = Math.max(1, Number(currentTime) * 60);
        // start the next timer immediately
        dispatch(startTimerWithSeconds(nextTotal));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alarmTriggered]); // intentionally only depend on alarmTriggered

  const formatTime = (value) => value.toString().padStart(2, "0");
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const playButtonSound = useCallback(() => {
    if (buttonSoundState) {
      loadAudio(ButtonPressSound, { autoplay: true, initialVolume: 0.5 });
    }
  }, [buttonSoundState, loadAudio]);

  const handleStart = useCallback(() => {
    dispatch(startTimerWithSeconds(totalSeconds));
  }, [dispatch, totalSeconds]);

  const handlePause = useCallback(() => {
    dispatch(pauseTimerThunk());
  }, [dispatch]);

  const handleResume = useCallback(() => {
    dispatch(resumeTimer());
  }, [dispatch]);

  const { currentMode, switchMode, getModeName } = useTimerMode();
  const { advance, retreat } = useAutoStartCycle();

  const forwardButtonClicked = useCallback(() => {
    playButtonSound();
    if (autoStartState) {
      advance(true);
      handleStart();
      return;
    }
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

  // Move switchMode(1) side-effect into a useEffect that watches autoStartState transitions
  const prevAutoStartRef = useRef(autoStartState);
  useEffect(() => {
    if (!prevAutoStartRef.current && autoStartState) {
      // autoStart changed from false -> true, perform the navigation effect
      switchMode(1);
    }
    prevAutoStartRef.current = autoStartState;
  }, [autoStartState, switchMode]);

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
        if (!running && !cyclePausedState) {
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
      running,
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
                    // only update the settings here; side-effects moved to useEffect above
                    dispatch(setAutoStart(isChecked));
                  }}
                />
                <span>Auto Start Breaks</span>
              </label>
            </div>
          </>
        );
      },
    [autoStartState, dispatch, playButtonSound]
  );

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
