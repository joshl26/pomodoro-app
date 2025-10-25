import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectIsAutoStart,
  selectCurrentTime,
  selectCyclePaused,
  selectAlarmSettings,
  selectTimer,
} from "../store/selectors";

import { useTimerMode } from "../hooks/useTimerMode";
import { useAutoStartCycle } from "../hooks/useAutoStartCycle";
import { useAudioManager } from "../hooks/useAudioManager";

import {
  resetTimerForModeThunk,
  startTimerWithSeconds,
  pauseTimerThunk,
  resumeTimer,
} from "../store/timerThunks";

import {
  setAutoStart,
  setSecondsLeft,
  setTotalSeconds,
} from "../store/settingsSlice";

import { TimerControls } from "./TimerControls";
import ResetAndAuto from "./ResetAndAuto";
import ModeIndicator from "./ModeIndicator";
import TimeDisplay from "./TimeDisplay";

import { tick as tickAction } from "../store/timerSlice";

import "./Timer.css";

function Timer() {
  const dispatch = useDispatch();

  // Selectors
  const autoStartState = useSelector(selectIsAutoStart);
  const cyclePausedState = useSelector(selectCyclePaused);
  const currentTime = useSelector(selectCurrentTime);
  const timer = useSelector(selectTimer);
  const rawAlarmSettings = useSelector(selectAlarmSettings);

  // Destructure alarm settings with defaults
  const {
    enabled: alarmEnabled = false,
    sound: alarmSound = "No Sound",
    volume: alarmVolume = 0.8,
    buttonSound: buttonSoundState = true,
  } = rawAlarmSettings || {};

  const {
    running = false,
    totalSeconds: runtimeTotalSeconds,
    secondsLeft: runtimeSecondsLeft,
    alarmTriggered = false,
  } = timer || {};

  // Memoize calculated values
  const totalSeconds = useMemo(() => {
    return Math.max(
      1,
      Number(runtimeTotalSeconds) || Math.max(1, Number(currentTime) * 60)
    );
  }, [runtimeTotalSeconds, currentTime]);

  const secondsLeft = useMemo(() => {
    return Number.isFinite(Number(runtimeSecondsLeft))
      ? Math.max(0, Math.floor(Number(runtimeSecondsLeft)))
      : totalSeconds;
  }, [runtimeSecondsLeft, totalSeconds]);

  const { minutes, seconds } = useMemo(() => {
    return {
      minutes: Math.floor(secondsLeft / 60),
      seconds: secondsLeft % 60,
    };
  }, [secondsLeft]);

  // Update Redux state for App progress bar
  useEffect(() => {
    if (running) {
      dispatch(setTotalSeconds(totalSeconds));
      dispatch(setSecondsLeft(secondsLeft));
    }
  }, [dispatch, running, totalSeconds, secondsLeft]);

  // Audio manager
  const { play, stop, playButtonSound } = useAudioManager();
  const tickIntervalRef = useRef(null);
  const currentAlarmSoundRef = useRef(null);

  // Play/stop ticking sound while running
  useEffect(() => {
    if (running) {
      play("tick", { loop: true, volume: alarmVolume }).catch(() => {});
    } else {
      stop("tick");
    }
  }, [running, alarmVolume, play, stop]);

  // Interval for dispatching ticks
  useEffect(() => {
    if (tickIntervalRef.current) {
      clearInterval(tickIntervalRef.current);
      tickIntervalRef.current = null;
    }

    if (running) {
      dispatch(tickAction({ now: Date.now() }));
      // Update Redux state for progress bar
      dispatch(setTotalSeconds(totalSeconds));
      dispatch(setSecondsLeft(secondsLeft));

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
  }, [running, dispatch, totalSeconds, secondsLeft]);

  // Alarm triggered effect
  useEffect(() => {
    if (alarmTriggered) {
      stop("tick");
      dispatch(resetTimerForModeThunk({ keepAudio: true }));

      if (alarmEnabled) {
        const soundName =
          alarmSound && alarmSound !== "No Sound" ? alarmSound : "alarm";

        currentAlarmSoundRef.current = soundName;
        play(soundName, {
          loop: true,
          volume: alarmVolume,
        }).catch(() => {});
      }

      if (autoStartState) {
        const nextTotal = Math.max(1, Number(currentTime) * 60);
        dispatch(startTimerWithSeconds(nextTotal));
      }
    } else {
      if (currentAlarmSoundRef.current) {
        stop(currentAlarmSoundRef.current);
        currentAlarmSoundRef.current = null;
      }
    }
  }, [
    alarmTriggered,
    alarmEnabled,
    alarmSound,
    alarmVolume,
    autoStartState,
    currentTime,
    dispatch,
    play,
    stop,
  ]);

  const { currentMode, switchMode, getModeName } = useTimerMode();
  const { advance, retreat } = useAutoStartCycle();

  const currentModeName = useMemo(() => {
    return getModeName();
  }, [getModeName]);

  // Update document title with timer when running
  useEffect(() => {
    if (running) {
      const formattedMinutes = String(minutes).padStart(2, "0");
      const formattedSeconds = String(seconds).padStart(2, "0");
      document.title = `${formattedMinutes}:${formattedSeconds} - ${currentModeName}`;
    } else {
      document.title = "Pomodoro Timer";
    }

    return () => {
      document.title = "Pomodoro Timer";
    };
  }, [running, minutes, seconds, currentModeName]);

  // Button sound wrapper
  const playBtnSound = useCallback(() => {
    if (buttonSoundState === false) return;
    playButtonSound();
  }, [buttonSoundState, playButtonSound]);

  // Handlers
  const handleStart = useCallback(() => {
    dispatch(startTimerWithSeconds(totalSeconds));
  }, [dispatch, totalSeconds]);

  const handlePause = useCallback(() => {
    dispatch(pauseTimerThunk());
  }, [dispatch]);

  const handleResume = useCallback(() => {
    dispatch(resumeTimer());
  }, [dispatch]);

  const forwardButtonClicked = useCallback(() => {
    playBtnSound();
    if (autoStartState) {
      advance(true);
      handleStart();
      return;
    }
    const next = currentMode === 1 ? 2 : currentMode === 2 ? 3 : 1;
    switchMode(next);
  }, [
    playBtnSound,
    autoStartState,
    advance,
    handleStart,
    currentMode,
    switchMode,
  ]);

  const backwardButtonClicked = useCallback(() => {
    playBtnSound();
    if (autoStartState) {
      retreat(true);
      handleStart();
      return;
    }
    const prev = currentMode === 1 ? 3 : currentMode === 2 ? 1 : 2;
    switchMode(prev);
  }, [
    playBtnSound,
    autoStartState,
    retreat,
    handleStart,
    currentMode,
    switchMode,
  ]);

  const handleReset = useCallback(() => {
    playBtnSound();
    dispatch(resetTimerForModeThunk({ keepAudio: true }));
  }, [playBtnSound, dispatch]);

  const handleToggleAutoStart = useCallback(
    (checked) => {
      dispatch(setAutoStart(checked));
    },
    [dispatch]
  );

  // Mode button handler
  const handleModeSelect = useCallback(
    (mode) => {
      playBtnSound();
      switchMode(mode);
    },
    [playBtnSound, switchMode]
  );

  // AutoStart side effect
  const prevAutoStartRef = useRef(autoStartState);
  useEffect(() => {
    if (!prevAutoStartRef.current && autoStartState) {
      switchMode(1);
    }
    prevAutoStartRef.current = autoStartState;
  }, [autoStartState, switchMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentAlarmSoundRef.current) {
        stop(currentAlarmSoundRef.current);
        currentAlarmSoundRef.current = null;
      }
      stop("tick");
    };
  }, [stop]);

  return (
    <section className="timer-container" aria-label="Pomodoro Timer">
      <div className="timer-content">
        <ModeIndicator currentModeName={currentModeName} />

        {/* Mode Selection Buttons */}
        <div
          className="mode-buttons"
          role="group"
          aria-label="Timer mode selection"
        >
          <button
            className={`mode-btn ${currentMode === 1 ? "active" : ""}`}
            onClick={() => handleModeSelect(1)}
            aria-label="Switch to Pomodoro mode"
            aria-pressed={currentMode === 1}
            type="button"
            disabled={running}
          >
            Pomodoro
          </button>
          <button
            className={`mode-btn ${currentMode === 2 ? "active" : ""}`}
            onClick={() => handleModeSelect(2)}
            aria-label="Switch to Short Break mode"
            aria-pressed={currentMode === 2}
            type="button"
            disabled={running}
          >
            Short Break
          </button>
          <button
            className={`mode-btn ${currentMode === 3 ? "active" : ""}`}
            onClick={() => handleModeSelect(3)}
            aria-label="Switch to Long Break mode"
            aria-pressed={currentMode === 3}
            type="button"
            disabled={running}
          >
            Long Break
          </button>
        </div>

        <TimeDisplay minutes={minutes} seconds={seconds} ariaLive="polite" />

        <div className="timer-controls">
          <TimerControls
            running={running}
            cyclePaused={cyclePausedState}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onForward={forwardButtonClicked}
            onBackward={backwardButtonClicked}
            playBtnSound={playBtnSound}
            startBtnTestId="start-btn"
            pauseBtnTestId="pause-btn"
            resumeBtnTestId="resume-btn"
            forwardBtnTestId="forward-btn"
            backwardBtnTestId="backward-btn"
          />
        </div>

        <ResetAndAuto
          autoStartState={autoStartState}
          onToggleAutoStart={handleToggleAutoStart}
          onReset={handleReset}
          playBtnSound={playBtnSound}
          resetBtnTestId="reset-btn"
          autoStartToggleTestId="auto-start-toggle"
        />
      </div>
    </section>
  );
}

export default React.memo(Timer);
