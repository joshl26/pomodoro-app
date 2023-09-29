import React, { useEffect } from "react";
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

// import { player } from "../utilities/util";

// import sound from "../assets/alarm-bell.mp3";

export default function Timer() {
  const pomoTimeState = useSelector((state) => state.settings.pomodoro);
  const shortTimeState = useSelector((state) => state.settings.short);
  const longTimeState = useSelector((state) => state.settings.long);
  const timerModeState = useSelector((state) => state.settings.timermode);
  const autoStartState = useSelector((state) => state.settings.autostart);
  const cyclePausedState = useSelector((state) => state.settings.cyclepaused);
  const currentTime = useSelector((state) => state.settings.currenttime);
  const counter = useSelector((state) => state.settings.counter);
  const secondsLeft = useSelector((state) => state.settings.secondsleft);
  var alarmVolume = useSelector((state) => state.settings.alarmvolume);
  var buttonSoundState = useSelector((state) => state.settings.buttonsound);

  // const cycleComplete = useSelector((state) => state.settings.cyclecomplete);
  // const cycle = useSelector((state) => state.settings.cycle);
  // const timerEnabledState = useSelector((state) => state.settings.timerenabled);

  const {
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
    playing: isPlaying,
    load: loadAudio,
  } = useGlobalAudioPlayer();

  // const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  // const alarmSoundState = useSelector((state) => state.settings.alarmsound);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + currentTime * 60);

  const updateExpiryTimestamp = (event) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + event * 60);
    restartTimer(expiryTimestamp, false);
  };

  // console.log("Timer " + currentTime, "Expiry Timestamp " + expiryTimestamp);

  const dispatch = useDispatch();

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
    onExpire: () => {
      cycleExpired();
    },
  });

  useEffect(() => {
    dispatch(setSecondsLeft(totalSeconds));

    if (isRunning) {
      loadAudio(TickingSlowSound, {
        autoplay: true,
        initialVolume: alarmVolume,
      });
    } else {
      // pauseAudio();
    }
  }, [
    buttonSoundState,
    secondsLeft,
    currentTime,
    isRunning,
    totalSeconds,
    dispatch,
    cyclePausedState,
    autoStartState,
    alarmVolume,
    timerModeState,
    pauseAudio,
    playAudio,
    loadAudio,
  ]);

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

    // if (autoStartState === true) {
    //   dispatch(counterIncrement());
    //   console.log(cycle[counter]);
    //   if (cycle[counter] === 1) {
    //     setPomoTimeState(true);
    //     start();
    //   }

    //   if (cycle[counter] === 2) {
    //     setShortTimeState(true);
    //     start();
    //   }

    //   if (cycle[counter] === 3) {
    //     setLongTimeState(true);
    //     start();
    //   }
    // }
    // console.warn("onExpire called");
  };

  //  autostart is boolean value
  const setShortTimeState = () => {
    dispatch(setTimerMode(2));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(shortTimeState * 60));
    dispatch(setSecondsLeft(shortTimeState * 60));
    updateExpiryTimestamp(shortTimeState);
  };

  const setLongTimeState = () => {
    dispatch(setTimerMode(3));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(longTimeState * 60));
    dispatch(setSecondsLeft(longTimeState * 60));
    updateExpiryTimestamp(longTimeState);
  };

  const setPomoTimeState = () => {
    dispatch(setTimerMode(1));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(pomoTimeState * 60));
    dispatch(setSecondsLeft(pomoTimeState * 60));
    updateExpiryTimestamp(pomoTimeState);
  };

  const buttonClickSound = () => {
    console.log(buttonSoundState);

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
    // updateExpiryTimestamp(currentTime);
    // console.log("start button");
  };

  const pauseButtonClicked = () => {
    pauseTimer();
    dispatch(setCyclePaused(true));
    buttonClickSound();
    // console.log("pause button");
  };

  const resumeButtonClicked = () => {
    resumeTimer();
    dispatch(setCyclePaused(false));
    buttonClickSound();
    // console.log("resume button");
  };

  const forwardButtonClicked = () => {
    // player({}).stop();
    // new Audio(sound).play();
    // dispatch(timerEnabled());
    // dispatch(setCycleStart());

    buttonClickSound();

    dispatch(setCyclePaused(false));

    if (autoStartState === true) {
      dispatch(counterIncrement());

      // dispatch(setTimerEnabled(true));

      if (timerModeState === 1) {
        setPomoTimeState(true);
      }

      if (timerModeState === 2) {
        setShortTimeState(true);
      }

      if (timerModeState === 3) {
        setLongTimeState(true);
      }
    } else {
      if (timerModeState === 1) {
        setShortTimeState(false);
      }

      if (timerModeState === 2) {
        setLongTimeState(false);
      }

      if (timerModeState === 3) {
        setPomoTimeState(false);
      }
    }
  };

  const backwardButtonClicked = () => {
    buttonClickSound();

    dispatch(setCyclePaused(false));

    if (autoStartState === true) {
      dispatch(counterDecrement());

      if (timerModeState === 1) {
        setLongTimeState(true);
      }

      if (timerModeState === 2) {
        setPomoTimeState(true);
      }

      if (timerModeState === 3) {
        setShortTimeState(true);
      }
    } else {
      if (timerModeState === 1) {
        setLongTimeState(false);
      }

      if (timerModeState === 2) {
        setPomoTimeState(false);
      }

      if (timerModeState === 3) {
        setShortTimeState(false);
      }
    }
  };

  function buttonStyle() {
    var btnStyle;

    if (isRunning === false && Number(timerModeState) === 1) {
      btnStyle = `action-btn1`;
    }

    if (isRunning === true && Number(timerModeState) === 1) {
      btnStyle = `action-btn1-active`;
    }

    if (isRunning === false && Number(timerModeState) === 2) {
      btnStyle = `action-btn2`;
    }

    if (isRunning === true && Number(timerModeState) === 2) {
      btnStyle = `action-btn2-active`;
    }

    if (isRunning === false && Number(timerModeState) === 3) {
      btnStyle = `action-btn3`;
    }

    if (isRunning === true && Number(timerModeState) === 3) {
      btnStyle = `action-btn3-active`;
    }

    return btnStyle;
  }

  return (
    <Container>
      {/* <h3>IsRunning: {String(isRunning)}</h3>
        <h3>Auto Start: {String(autoStartState)}</h3>
        <h3>Paused: {String(cyclePausedState)}</h3> */}
      <div className="timer-content">
        <Row>
          <Col className="align-center">
            {autoStartState === true ? (
              <>
                <h3>Pomodoro Cycle: {Number(counter)}</h3>
              </>
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
        <Container>
          <div className="main-timer-text">
            <span>{minutes}</span>
            <span>:</span>
            {seconds < 10 ? <span>0</span> : ""}
            <span>{seconds}</span>
          </div>
          <Row className="timer-control">
            {isRunning === false && cyclePausedState === false ? (
              <Col>
                <button className={buttonStyle()} onClick={startButtonClicked}>
                  Start
                </button>
              </Col>
            ) : (
              <>
                <Col>
                  {autoStartState === false ? (
                    <FaStepBackward
                      className="step-button"
                      onClick={backwardButtonClicked}
                    />
                  ) : (
                    ""
                  )}
                </Col>
                {cyclePausedState === true ? (
                  <Col>
                    <button
                      className={buttonStyle()}
                      onClick={resumeButtonClicked}
                    >
                      Resume
                    </button>
                  </Col>
                ) : (
                  <Col>
                    <button
                      className={buttonStyle()}
                      onClick={pauseButtonClicked}
                    >
                      Pause
                    </button>
                  </Col>
                )}

                <Col>
                  {autoStartState === false ? (
                    <FaStepForward
                      className="step-button"
                      onClick={forwardButtonClicked}
                    />
                  ) : (
                    ""
                  )}
                </Col>
              </>
            )}
          </Row>
        </Container>
      </div>
      <Container>
        <Row>
          <Col sm={12} className="align-center">
            {autoStartState ? (
              <p>
                <button
                  onClick={() => {
                    dispatch(setAutoStart(false));
                    dispatch(setCounter(0));
                    dispatch(setTimerMode(1));
                    dispatch(setCurrentTime(pomoTimeState));
                    dispatch(setTotalSeconds(pomoTimeState * 60));
                    dispatch(setSecondsLeft(pomoTimeState * 60));
                    const expiryTimestamp = new Date();
                    expiryTimestamp.setSeconds(
                      expiryTimestamp.getSeconds() + pomoTimeState * 60
                    );
                    restartTimer(expiryTimestamp, false);
                  }}
                  className="autobreak-btn"
                >
                  Auto Start Breaks:
                </button>{" "}
                ENABLED
              </p>
            ) : (
              <p>
                <button
                  onClick={() => {
                    dispatch(setAutoStart(true));
                    dispatch(setCounter(1));
                    dispatch(setTimerMode(1));
                    dispatch(setCurrentTime(pomoTimeState));
                    dispatch(setTotalSeconds(pomoTimeState * 60));
                    dispatch(setSecondsLeft(pomoTimeState * 60));
                    const expiryTimestamp = new Date();
                    expiryTimestamp.setSeconds(
                      expiryTimestamp.getSeconds() + pomoTimeState * 60
                    );
                    restartTimer(expiryTimestamp, false);
                  }}
                  className="autobreak-btn"
                >
                  Auto Start Breaks:
                </button>
                DISABLED
              </p>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
