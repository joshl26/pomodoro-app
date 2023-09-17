import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";
import { Row, Col, Container } from "react-bootstrap";
import {
  setSecondsLeft,
  setCycleStart,
  setAutoBreak,
  setCounter,
  setTimerMode,
  setCurrentTime,
  setTotalSeconds,
  counterIncrement,
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
  // const timerEnabledState = useSelector((state) => state.settings.timerenabled);
  const currentTime = useSelector((state) => state.settings.currenttime);
  const counter = useSelector((state) => state.settings.counter);
  const cycleComplete = useSelector((state) => state.settings.cyclecomplete);
  const cycle = useSelector((state) => state.settings.cycle);

  // const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  // const alarmSoundState = useSelector((state) => state.settings.alarmsound);
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + currentTime * 60);

  const updateExpiryTimestamp = (event) => {
    const expiryTimestamp = new Date();
    expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + event * 60);
    restart(expiryTimestamp, false);
  };

  useEffect(() => {}, [currentTime]);

  // console.log("Timer " + currentTime, "Expiry Timestamp " + expiryTimestamp);

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
    onExpire: () => {
      if (autoBreakState === true) {
        dispatch(counterIncrement());
        console.log(cycle[counter]);
        if (cycle[counter] === 1) {
          setPomoTime(true);
          start();
        }

        if (cycle[counter] === 2) {
          setShortTime(true);
          start();
        }

        if (cycle[counter] === 3) {
          setLongTime(true);
          start();
        }
      }
      console.warn("onExpire called");
    },
  });

  useEffect(() => {
    dispatch(setSecondsLeft(totalSeconds));
    // dispatch(setTotalSeconds(totalSeconds));
  }, [totalSeconds, dispatch]);

  const startButtonClicked = () => {
    start();
    console.log("start button");
  };

  const pauseButtonClicked = () => {
    pause();
    console.log("start button");
  };

  //  autostart is boolean value
  const setShortTime = () => {
    dispatch(setTimerMode(2));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(shortTime * 60));
    dispatch(setSecondsLeft(shortTime * 60));
    updateExpiryTimestamp(shortTime);
  };

  const setLongTime = () => {
    dispatch(setTimerMode(3));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(longTime * 60));
    dispatch(setSecondsLeft(longTime * 60));
    updateExpiryTimestamp(longTime);
  };

  const setPomoTime = () => {
    dispatch(setTimerMode(1));
    dispatch(setCurrentTime());
    dispatch(setTotalSeconds(pomoTime * 60));
    dispatch(setSecondsLeft(pomoTime * 60));
    updateExpiryTimestamp(pomoTime);
  };

  const fastForwardButton = () => {
    // player({}).stop();
    // new Audio(sound).play();
    // dispatch(timerEnabled());
    // dispatch(setCycleStart());

    if (autoBreakState === true) {
      dispatch(counterIncrement());
      // dispatch(setTimerEnabled(true));

      if (timerMode === 1) {
        setPomoTime(true);
      }

      if (timerMode === 2) {
        setShortTime(true);
      }

      if (timerMode === 3) {
        setLongTime(true);
      }
    } else {
      if (timerMode === 1) {
        setPomoTime(false);
      }

      if (timerMode === 2) {
        setShortTime(false);
      }

      if (timerMode === 3) {
        setLongTime(false);
      }
    }
  };

  function buttonStyle() {
    var btnStyle;

    if (isRunning === false && Number(timerMode) === 1) {
      btnStyle = `action-btn1`;
    }

    if (isRunning === true && Number(timerMode) === 1) {
      btnStyle = `action-btn1-active`;
    }

    if (isRunning === false && Number(timerMode) === 2) {
      btnStyle = `action-btn2`;
    }

    if (isRunning === true && Number(timerMode) === 2) {
      btnStyle = `action-btn2-active`;
    }

    if (isRunning === false && Number(timerMode) === 3) {
      btnStyle = `action-btn3`;
    }

    if (isRunning === true && Number(timerMode) === 3) {
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
              {autoBreakState === true ? (
                <h3>Pomodoro Cycle: {Number(counter)}</h3>
              ) : (
                <h3> </h3>
              )}
            </Col>
            <div className="spacer" />
          </Row>
          <SecondaryButtons
            autoBreakState={autoBreakState}
            isRunning={isRunning}
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
                {isRunning === false ? (
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
                      {autoBreakState === false ? (
                        <FaForward
                          className="fast-forward"
                          onClick={fastForwardButton}
                        />
                      ) : (
                        ""
                      )}
                    </Col>
                  </>
                )}
              </Row>
            </div>
          </Container>
        </div>
        <Container>
          <Row>
            <Col sm={12} className="align-center">
              {autoBreakState ? (
                <p>
                  <button
                    onClick={() => {
                      dispatch(setAutoBreak(false));
                      dispatch(setCounter(0));
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
                  ENABLED
                </p>
              ) : (
                <p>
                  <button
                    onClick={() => {
                      dispatch(setAutoBreak(true));
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
