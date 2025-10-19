import React, { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";
import { Row, Col, Container } from "react-bootstrap";
import {
  setSecondsLeft,
  setAutoStart,
  setCounter,
  setTimerMode,
  setCurrentTime,
  setTotalSeconds,
  counterIncrement,
  setCycleComplete,
  setCyclePaused,
  counterDecrement,
} from "../store/settingsSlice";
import { FaStepForward, FaStepBackward } from "react-icons/fa";
import "./Timer.css";
import SecondaryButtons from "./SecondaryButtons";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import ButtonPressSound from "../assets/sounds/button-press.wav";
import TickingSlowSound from "../assets/sounds/ticking-slow.mp3";

/**
 * Timer Component
 * Manages the Pomodoro timer display and controls
 * @component
 * @returns {React.ReactElement} The timer interface
 */
export default function Timer() {
  // ============================================
  // SELECTORS - Redux State
  // ============================================
  const pomoTimeState = useSelector((state) => state.settings.pomodoro);
  const shortTimeState = useSelector((state) => state.settings.short);
  const longTimeState = useSelector((state) => state.settings.long);
  const timerModeState = useSelector((state) => state.settings.timermode);
  const autoStartState = useSelector((state) => state.settings.autostart);
  const cyclePausedState = useSelector((state) => state.settings.cyclepaused);
  const currentTime = useSelector((state) => state.settings.currenttime);
  const counter = useSelector((state) => state.settings.counter);
  // const secondsLeft = useSelector((state) => state.settings.secondsleft);
  const alarmVolume = useSelector((state) => state.settings.alarmvolume);
  const buttonSoundState = useSelector((state) => state.settings.buttonsound);

  // ============================================
  // HOOKS & STATE
  // ============================================
  const dispatch = useDispatch();
  const {
    // play: playAudio,
    load: loadAudio,
  } = useGlobalAudioPlayer();

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + currentTime * 60);

  const {
    totalSeconds,
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
    onExpire: () => cycleExpired(),
  });

  // ============================================
  // EFFECTS - Separated by Concern
  // ============================================

  /**
   * Effect: Update Redux with current total seconds
   * Runs only when totalSeconds changes
   */
  useEffect(() => {
    dispatch(setSecondsLeft(totalSeconds));
  }, [totalSeconds, dispatch]);

  /**
   * Effect: Manage ticking audio based on timer state
   * Runs only when isRunning or alarmVolume changes
   */
  useEffect(() => {
    if (isRunning) {
      loadAudio(TickingSlowSound, {
        autoplay: true,
        initialVolume: alarmVolume,
      });
    }
  }, [isRunning, alarmVolume, loadAudio]);

  // ============================================
  // CALLBACKS - Memoized Event Handlers
  // ============================================

  /**
   * Handle end of timer cycle
   * Triggers cycle complete action and auto-restart if enabled
   */
  const cycleExpired = useCallback(() => {
    dispatch(setCycleComplete(true));

    if (autoStartState === true) {
      const nextExpiryTimestamp = new Date();
      nextExpiryTimestamp.setSeconds(
        nextExpiryTimestamp.getSeconds() + currentTime * 60
      );
      restartTimer(nextExpiryTimestamp);
      startTimer();
    }
  }, [autoStartState, currentTime, dispatch, restartTimer, startTimer]);

  /**
   * Update expiry timestamp for a given time in minutes
   */
  const updateExpiryTimestamp = useCallback(
    (minutesValue) => {
      const newExpiryTimestamp = new Date();
      newExpiryTimestamp.setSeconds(
        newExpiryTimestamp.getSeconds() + minutesValue * 60
      );
      restartTimer(newExpiryTimestamp, false);
    },
    [restartTimer]
  );

  /**
   * Set Pomodoro timer (mode 1)
   */
  const setPomoTimeState = useCallback(() => {
    dispatch(setTimerMode(1));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(pomoTimeState * 60));
    dispatch(setSecondsLeft(pomoTimeState * 60));
    updateExpiryTimestamp(pomoTimeState);
  }, [dispatch, pomoTimeState, updateExpiryTimestamp]);

  /**
   * Set Short break timer (mode 2)
   */
  const setShortTimeState = useCallback(() => {
    dispatch(setTimerMode(2));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(shortTimeState * 60));
    dispatch(setSecondsLeft(shortTimeState * 60));
    updateExpiryTimestamp(shortTimeState);
  }, [dispatch, shortTimeState, updateExpiryTimestamp]);

  /**
   * Set Long break timer (mode 3)
   */
  const setLongTimeState = useCallback(() => {
    dispatch(setTimerMode(3));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(longTimeState * 60));
    dispatch(setSecondsLeft(longTimeState * 60));
    updateExpiryTimestamp(longTimeState);
  }, [dispatch, longTimeState, updateExpiryTimestamp]);

  // ============================================
  // MEMOIZED VALUES (moved before forward/backward callbacks)
  // ============================================

  /**
   * Mode handler map - reduces if-chain patterns
   * Maps timer modes (1, 2, 3) to their handler functions
   * Defined before callbacks that depend on it
   */
  const modeHandlers = useMemo(
    () => ({
      1: setPomoTimeState,
      2: setShortTimeState,
      3: setLongTimeState,
    }),
    [setPomoTimeState, setShortTimeState, setLongTimeState]
  );

  /**
   * Play button click sound if enabled
   */
  const buttonClickSound = useCallback(() => {
    if (buttonSoundState) {
      loadAudio(ButtonPressSound, {
        autoplay: true,
        initialVolume: 0.5,
      });
    }
  }, [buttonSoundState, loadAudio]);

  /**
   * Handle start button click
   */
  const startButtonClicked = useCallback(() => {
    startTimer();
    buttonClickSound();
  }, [startTimer, buttonClickSound]);

  /**
   * Handle pause button click
   */
  const pauseButtonClicked = useCallback(() => {
    pauseTimer();
    dispatch(setCyclePaused(true));
    buttonClickSound();
  }, [pauseTimer, dispatch, buttonClickSound]);

  /**
   * Handle resume button click
   */
  const resumeButtonClicked = useCallback(() => {
    resumeTimer();
    dispatch(setCyclePaused(false));
    buttonClickSound();
  }, [resumeTimer, dispatch, buttonClickSound]);

  /**
   * Handle forward button - transition to next cycle
   */
  const forwardButtonClicked = useCallback(() => {
    buttonClickSound();
    dispatch(setCyclePaused(false));

    if (autoStartState === true) {
      dispatch(counterIncrement());
      // When autoStart is enabled, handlers will set mode/time as needed.
      modeHandlers[timerModeState]?.();
    } else {
      // Cycle through modes: 1→2, 2→3, 3→1
      const nextMode = timerModeState === 3 ? 1 : timerModeState + 1;
      modeHandlers[nextMode]?.();
    }
  }, [
    buttonClickSound,
    dispatch,
    autoStartState,
    timerModeState,
    modeHandlers,
  ]);

  /**
   * Handle backward button - transition to previous cycle
   */
  const backwardButtonClicked = useCallback(() => {
    buttonClickSound();
    dispatch(setCyclePaused(false));

    if (autoStartState === true) {
      dispatch(counterDecrement());
      const prevMode = timerModeState === 1 ? 3 : timerModeState - 1;
      modeHandlers[prevMode]?.();
    } else {
      const prevMode = timerModeState === 1 ? 3 : timerModeState - 1;
      modeHandlers[prevMode]?.();
    }
  }, [
    buttonClickSound,
    dispatch,
    autoStartState,
    timerModeState,
    modeHandlers,
  ]);

  /**
   * Toggle auto-start mode
   */
  const toggleAutoStart = useCallback(() => {
    const newAutoStart = !autoStartState;
    dispatch(setAutoStart(newAutoStart));
    dispatch(setCounter(newAutoStart ? 1 : 0));
    dispatch(setTimerMode(1));
    dispatch(setCurrentTime(pomoTimeState));
    dispatch(setTotalSeconds(pomoTimeState * 60));
    dispatch(setSecondsLeft(pomoTimeState * 60));

    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(
      newExpiryTimestamp.getSeconds() + pomoTimeState * 60
    );
    restartTimer(newExpiryTimestamp, false);
  }, [autoStartState, dispatch, pomoTimeState, restartTimer]);

  /**
   * Button style based on running state and mode
   * Memoized to prevent recalculation on every render
   */
  const buttonStyle = useMemo(() => {
    const styleMap = {
      "false-1": "action-btn1",
      "true-1": "action-btn1-active",
      "false-2": "action-btn2",
      "true-2": "action-btn2-active",
      "false-3": "action-btn3",
      "true-3": "action-btn3-active",
    };
    return styleMap[`${isRunning}-${timerModeState}`] || "action-btn1";
  }, [isRunning, timerModeState]);

  // ============================================
  // RENDER
  // ============================================

  return (
    <Container>
      <div className="timer-content">
        <Row>
          <Col className="align-center">
            {autoStartState === true ? (
              <h3>Pomodoro Cycle: {Number(counter)}</h3>
            ) : (
              <h3> </h3>
            )}
          </Col>
          <div className="spacer" />
        </Row>

        <SecondaryButtons
          buttonSoundState={buttonSoundState}
          alarmVolume={alarmVolume}
          autoStartState={autoStartState}
          isRunning={isRunning}
          currentTime={currentTime}
          pomoTimeState={pomoTimeState}
          timerModeState={timerModeState}
          shortTimeState={shortTimeState}
          longTimeState={longTimeState}
          updateExpiryTimestamp={updateExpiryTimestamp}
          restart={restartTimer}
        />

        {/* Main Timer Display */}
        <div className="main-timer-text">
          <span>{minutes}</span>
          <span>:</span>
          {seconds < 10 ? <span>0</span> : ""}
          <span>{seconds}</span>
        </div>

        {/* Timer Controls */}
        <Container>
          <Row className="timer-control">
            {isRunning === false && cyclePausedState === false ? (
              <Col
                style={{ width: "auto" }}
                className="step-column"
                md={12}
                xs={10}
              >
                <button className={buttonStyle} onClick={startButtonClicked}>
                  Start
                </button>
              </Col>
            ) : (
              <>
                <Col
                  style={{ width: "auto" }}
                  className="action-button"
                  md={2}
                  xs={1}
                >
                  {autoStartState === false ? (
                    <FaStepBackward
                      className="step-button"
                      onClick={backwardButtonClicked}
                    />
                  ) : null}
                </Col>

                <Col style={{ width: "auto" }} md={8} xs={10}>
                  {cyclePausedState === true ? (
                    <button
                      className={buttonStyle}
                      onClick={resumeButtonClicked}
                    >
                      Resume
                    </button>
                  ) : (
                    <button
                      className={buttonStyle}
                      onClick={pauseButtonClicked}
                    >
                      Pause
                    </button>
                  )}
                </Col>

                <Col style={{ width: "auto" }} md={2} xs={1}>
                  {autoStartState === false ? (
                    <FaStepForward
                      className="step-button"
                      onClick={forwardButtonClicked}
                    />
                  ) : null}
                </Col>
              </>
            )}
          </Row>
        </Container>
      </div>

      {/* Auto-Start Toggle */}
      <Container>
        <Row>
          <div className="spacer" />
          <Col sm={12} className="align-center">
            <p>
              <button onClick={toggleAutoStart} className="autobreak-btn">
                Auto Start Breaks:
              </button>
              {autoStartState ? "ENABLED" : "DISABLED"}
            </p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
