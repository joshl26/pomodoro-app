import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";
import { Row, Col, Container } from "react-bootstrap";
import {
  setTimerEnabled,
  timerEnabled,
  setSecondsLeft,
  setCycleStart,
  autoBreak,
  setCounter,
  setTimerMode,
  setCurrentTime,
  setTotalSeconds,
} from "../store/settingsSlice";
import { FaForward } from "react-icons/fa";
import "./Timer.css";
import SecondaryButtons from "./SecondaryButtons";
import { player } from "../utilities/util";

import sound from "../assets/alarm-bell.mp3";

export default function Timer() {
  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const timerMode = useSelector((state) => state.settings.timermode);
  const autoBreakState = useSelector((state) => state.settings.autobreak);
  const timerEnabledState = useSelector((state) => state.settings.timerenabled);
  const currentTime = useSelector((state) => state.settings.currenttime);
  const autoBreaks = useSelector((state) => state.settings.autobreak);
  const counter = useSelector((state) => state.settings.counter);
  const cycleComplete = useSelector((state) => state.settings.cyclecomplete);
  const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  const alarmSoundState = useSelector((state) => state.settings.alarmsound);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + currentTime * 60);

  const updateExpiryTimestamp = (event) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + event * 60);
    restart(expiryTimestamp, false);
  };

  useEffect(() => {}, [currentTime]);

  console.log("Timer " + currentTime, "Expiry Timestamp " + expiryTimestamp);

  const dispatch = useDispatch();

  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    autoStart: false,
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  useEffect(() => {
    dispatch(setSecondsLeft(totalSeconds));
  }, [totalSeconds, dispatch]);

  const ternary = () => {
    if (cycleComplete === true) {
      return true;
    } else return false;
  };

  const startButtonClicked = () => {
    if (isRunning) {
      start();
      dispatch(setTimerEnabled(true));
      console.log("start button");
    } else {
      resume();
      dispatch(setTimerEnabled(true));
      console.log("start button");
    }
  };

  const pauseButtonClicked = () => {
    pause();
    dispatch(setTimerEnabled(false));
    console.log("start button");
  };

  const fastForwardButton = () => {
    // player({}).stop();
    // new Audio(sound).play();
    // dispatch(timerEnabled());
    // dispatch(setCycleStart());

    dispatch(setTimerEnabled(false));

    if (timerMode === 1) {
      dispatch(setTimerMode(2));
      dispatch(setCurrentTime());
      dispatch(setTotalSeconds(shortTime * 60));
      dispatch(setSecondsLeft(shortTime * 60));
      const expiryTimestamp = new Date();
      expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + shortTime * 60);
      restart(expiryTimestamp, false);
    }

    if (timerMode === 2) {
      dispatch(setTimerMode(3));
      dispatch(setCurrentTime());
      dispatch(setTotalSeconds(longTime * 60));
      dispatch(setSecondsLeft(longTime * 60));
      const expiryTimestamp = new Date();
      expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + longTime * 60);
      restart(expiryTimestamp, false);
    }

    if (timerMode === 3) {
      dispatch(setTimerMode(1));
      dispatch(setCurrentTime());
      dispatch(setTotalSeconds(pomoTime * 60));
      dispatch(setSecondsLeft(pomoTime * 60));
      const expiryTimestamp = new Date();
      expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + pomoTime * 60);
      restart(expiryTimestamp, false);
    }
  };

  function buttonStyle() {
    var btnStyle;

    if (timerEnabledState === false && Number(timerMode) === 1) {
      btnStyle = `action-btn1`;
    }

    if (timerEnabledState === true && Number(timerMode) === 1) {
      btnStyle = `action-btn1-active`;
    }

    if (timerEnabledState === false && Number(timerMode) === 2) {
      btnStyle = `action-btn2`;
    }

    if (timerEnabledState === true && Number(timerMode) === 2) {
      btnStyle = `action-btn2-active`;
    }

    if (timerEnabledState === false && Number(timerMode) === 3) {
      btnStyle = `action-btn3`;
    }

    if (timerEnabledState === true && Number(timerMode) === 3) {
      btnStyle = `action-btn3-active`;
    }

    return btnStyle;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Container>
        <div className="timer-content">
          <Row>
            <Col className="align-center">
              {autoBreaks === true ? (
                <h3>Pomodoro Cycle: {Number(counter)}</h3>
              ) : (
                <h3> </h3>
              )}
            </Col>
            <div className="spacer" />
          </Row>
          <SecondaryButtons
            autoBreakState={autoBreakState}
            timerEnabled={timerEnabledState}
            currentTime={currentTime}
            pomoTime={pomoTime}
            timerMode={timerMode}
            shortTime={shortTime}
            longTime={longTime}
            updateExpiryTimestamp={updateExpiryTimestamp}
            restart={restart}
          />
          <Container>
            <div style={{ fontSize: "100px" }}>
              <span>{minutes}</span>
              <span>:</span>
              {seconds < 10 ? <span>0</span> : ""}
              <span>{seconds}</span>
            </div>
            <div>
              <Row className="timer-control">
                {timerEnabledState === false ? (
                  <Col>
                    <button
                      className={buttonStyle()}
                      onClick={startButtonClicked}
                    >
                      Start
                    </button>
                  </Col>
                ) : (
                  <>
                    <Col></Col>
                    <Col>
                      <button
                        className={buttonStyle()}
                        onClick={pauseButtonClicked}
                      >
                        Pause
                      </button>
                    </Col>
                    <Col>
                      <FaForward
                        className="fast-forward"
                        onClick={fastForwardButton}
                      />
                    </Col>
                  </>
                )}
              </Row>
              {ternary() === true ? (
                <button
                  className={buttonStyle()}
                  onClick={() => {
                    player({}).stop();
                    new Audio(sound).play();
                    dispatch(timerEnabled());
                    dispatch(setCycleStart());
                  }}
                >
                  Next Round
                </button>
              ) : (
                ""
              )}
            </div>
          </Container>
        </div>
        <Container>
          <Row>
            <Col sm={12} className="align-center">
              {autoBreaks ? (
                <p>
                  <button
                    onClick={() => {
                      dispatch(autoBreak(false));
                      dispatch(setCounter(0));
                    }}
                    className="autobreak-btn"
                  >
                    Auto Start Breaks:
                  </button>
                  ENABLED
                </p>
              ) : (
                <p>
                  <button
                    onClick={() => {
                      dispatch(autoBreak(true));
                      dispatch(setCounter(1));
                      dispatch(setTimerMode(1));
                      dispatch(setCurrentTime(pomoTime));
                      dispatch(setTotalSeconds(pomoTime * 60));
                      dispatch(setSecondsLeft(pomoTime * 60));
                      const expiryTimestamp = new Date();
                      expiryTimestamp.setSeconds(
                        expiryTimestamp.getSeconds() + pomoTime * 60
                      );
                      restart(expiryTimestamp, false);
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
    </div>
  );
}
