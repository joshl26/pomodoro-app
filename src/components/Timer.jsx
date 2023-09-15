import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTimer } from "react-timer-hook";
import classes from "./Timer.module.css";
import SecondaryButtons from "./SecondaryButtons";
import Container from "react-bootstrap/esm/Container";
import { Row, Col } from "react-bootstrap";
import { setTimerEnabled, timerEnabled } from "../store/settingsSlice";
import Progress from "./Progress";
import { FaBeer } from "react-icons/fa";

export default function Timer() {
  const currentTime = useSelector((state) => state.settings.currenttime);

  const expiryTimestamp = new Date();

  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + currentTime * 60);

  // useEffect(() => {}, [currentTime]);

  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const timeMode = useSelector((state) => state.settings.timermode);
  const timerEnabledState = useSelector((state) => state.settings.timerenabled);
  const autoBreaks = useSelector((state) => state.settings.autobreak);
  const counter = useSelector((state) => state.settings.counter);
  const cycleComplete = useSelector((state) => state.settings.cyclecomplete);
  // const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  // const alarmSoundState = useSelector((state) => state.settings.alarmsound);

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

  function buttonStyle() {
    var btnStyle = `${classes.action_btn1}`;

    if (timerEnabledState === false && Number(timeMode) === 1) {
      btnStyle = `${classes.action_btn1}`;
    }

    if (timerEnabledState === true && Number(timeMode) === 1) {
      btnStyle = `${classes.action_btn1_active}`;
    }

    if (timerEnabledState === false && Number(timeMode) === 2) {
      btnStyle = `${classes.action_btn2}`;
    }

    if (timerEnabledState === true && Number(timeMode) === 2) {
      btnStyle = `${classes.action_btn2_active}`;
    }

    if (timerEnabledState === false && Number(timeMode) === 3) {
      btnStyle = `${classes.action_btn3}`;
    }

    if (timerEnabledState === true && Number(timeMode) === 3) {
      btnStyle = `${classes.action_btn3_active}`;
    }

    return btnStyle;
  }

  return (
    <div style={{ textAlign: "center" }}>
      <Container>
        <div className={classes.content}>
          <Row>
            <Col className={classes.align_center}>
              {autoBreaks === true ? (
                <h3>Pomodoro Cycle: {Number(counter)}</h3>
              ) : (
                <h3> </h3>
              )}
            </Col>
            <div className={classes.spacer} />
          </Row>
          <SecondaryButtons />
          <Container>
            <div style={{ fontSize: "100px" }}>
              <span>{minutes}</span>
              <span>:</span>
              {seconds < 10 ? <span>0</span> : ""}
              <span>{seconds}</span>
            </div>
            <div>
              <Row>
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
                  <Col>
                    <button
                      className={buttonStyle()}
                      onClick={pauseButtonClicked}
                    >
                      Pause
                    </button>
                    <FaBeer />
                  </Col>
                )}

                {/* <Col>
                  <button className={buttonStyle()} onClick={resume}>
                    Resume
                  </button>
                </Col>
                <Col>
                  <button
                    className={buttonStyle()}
                    onClick={() => {
                      const time = new Date();
                      time.setSeconds(time.getSeconds() + currentTime * 60);
                      restart(time);
                    }}
                  >
                    Restart
                  </button>
                </Col> */}
              </Row>
              {ternary() === true ? (
                <button
                  className={buttonStyle()}
                  onClick={() => {
                    // player({}).stop();
                    // new Audio(sound).play();
                    dispatch(timerEnabled());
                    // dispatch(setCycleStart());
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
            <Col sm={12} className={classes.align_center}>
              {autoBreaks ? (
                <p>
                  <button
                    onClick={() => {
                      //   dispatch(autoBreak(false));
                      //   dispatch(setCounter(0));
                    }}
                    className={classes.autobreak_btn}
                  >
                    Auto Start Breaks:
                  </button>
                  ENABLED
                </p>
              ) : (
                <p>
                  <button
                    onClick={() => {
                      //   dispatch(autoBreak(true));
                      //   dispatch(setCounter(1));
                      //   dispatch(timerMode(1));
                      //   dispatch(setCurrentTime(pomoTime));
                    }}
                    className={classes.autobreak_btn}
                  >
                    Auto Start Breaks:
                  </button>{" "}
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
