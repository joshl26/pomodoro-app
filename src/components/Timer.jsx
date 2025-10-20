import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButtons from "./SecondaryButtons";

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

import { setAutoStart } from "../store/settingsSlice";

import ProgressBar from "./ProgressBar";
import { TimerControls } from "./TimerControls";
import ResetAndAuto from "./ResetAndAuto";
import ModeIndicator from "./ModeIndicator";
import TimeDisplay from "./TimeDisplay";

import { tick as tickAction } from "../store/timerSlice";

function Timer() {
  const dispatch = useDispatch();

  // Selectors
  const autoStartState = useSelector(selectIsAutoStart);
  const cyclePausedState = useSelector(selectCyclePaused);
  const currentTime = useSelector(selectCurrentTime);
  const timer = useSelector(selectTimer);
  const rawAlarmSettings = useSelector(selectAlarmSettings);

  // FIX 1: Memoize alarm settings properly
  const alarmSettings = useMemo(() => {
    if (!rawAlarmSettings) {
      return {
        enabled: false,
        sound: "No Sound",
        volume: 0.8,
        buttonSound: true,
      };
    }
    return {
      enabled: rawAlarmSettings.enabled,
      sound: rawAlarmSettings.sound,
      volume: rawAlarmSettings.volume,
      buttonSound: rawAlarmSettings.buttonSound,
    };
  }, [rawAlarmSettings]);

  const {
    running = false,
    totalSeconds: runtimeTotalSeconds,
    secondsLeft: runtimeSecondsLeft,
    alarmTriggered = false,
  } = timer || {};

  const { volume: alarmVolume = 0.8, buttonSound: buttonSoundState = true } =
    alarmSettings;

  // FIX 2: Memoize calculated values
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

  const elapsedSeconds = useMemo(() => {
    return Math.max(0, totalSeconds - secondsLeft);
  }, [totalSeconds, secondsLeft]);

  // FIX 3: Add missing return statement in progressPercent
  const progressPercent = useMemo(() => {
    return Math.min(100, Math.max(0, (elapsedSeconds / totalSeconds) * 100));
  }, [elapsedSeconds, totalSeconds]);

  // FIX 4: Memoize time display values
  const { minutes, seconds } = useMemo(() => {
    return {
      minutes: Math.floor(secondsLeft / 60),
      seconds: secondsLeft % 60,
    };
  }, [secondsLeft]);

  // Audio manager
  const { play, stop, playButtonSound } = useAudioManager();
  const tickIntervalRef = useRef(null);
  const currentAlarmRef = useRef(null);

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

  // Alarm triggered effect
  useEffect(() => {
    if (alarmTriggered) {
      stop("tick");
      dispatch(resetTimerForModeThunk({ keepAudio: true }));

      if (alarmSettings.enabled) {
        const soundName =
          alarmSettings.sound && alarmSettings.sound !== "No Sound"
            ? alarmSettings.sound
            : "alarm";

        currentAlarmRef.current = soundName;
        play(soundName, {
          loop: true,
          volume: alarmSettings.volume ?? alarmVolume,
        }).catch(() => {});
      }

      if (autoStartState) {
        const nextTotal = Math.max(1, Number(currentTime) * 60);
        dispatch(startTimerWithSeconds(nextTotal));
      }
    } else {
      if (currentAlarmRef.current) {
        stop(currentAlarmRef.current);
        currentAlarmRef.current = null;
      }
    }
  }, [
    alarmTriggered,
    alarmSettings.enabled,
    alarmSettings.sound,
    alarmSettings.volume,
    autoStartState,
    currentTime,
    dispatch,
    play,
    stop,
    alarmVolume,
  ]);

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

  const { currentMode, switchMode, getModeName } = useTimerMode();
  const { advance, retreat } = useAutoStartCycle();

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

  // FIX 5: Memoize reset handler
  const handleReset = useCallback(() => {
    playBtnSound();
    dispatch(resetTimerForModeThunk({ keepAudio: true }));
  }, [playBtnSound, dispatch]);

  // FIX 6: Memoize autostart toggle handler
  const handleToggleAutoStart = useCallback(
    (checked) => {
      dispatch(setAutoStart(checked));
    },
    [dispatch]
  );

  // FIX 7: Memoize mode name (avoid recalculation on every render)
  const currentModeName = useMemo(() => {
    return getModeName();
  }, [getModeName]);

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
      if (currentAlarmRef.current) {
        stop(currentAlarmRef.current);
        currentAlarmRef.current = null;
      }
      stop("tick");
    };
  }, [stop]);

  return (
    <div className="timer-container">
      <div className="timer-content">
        <ModeIndicator currentModeName={currentModeName} />
        <TimeDisplay minutes={minutes} seconds={seconds} />
        <ProgressBar
          progressPercent={progressPercent}
          currentMode={currentMode}
        />

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

      <SecondaryButtons />
    </div>
  );
}

// FIX 8: Wrap Timer in React.memo for Phase 6 optimization
export default React.memo(Timer);
