import { useSelector, useDispatch } from "react-redux";

import {
  timerEnabled,
  setCounter,
  autoBreak,
  timerMode,
  setCurrentTime,
  setCycleStart,
} from "../store/settingsSlice";

import classes from "./Timer.module.css";
import SecondaryButtons from "./SecondaryButtons";
import CountdownTimer from "./CountDownTimer";
import Container from "react-bootstrap/esm/Container";
import { Row, Col } from "react-bootstrap";
import sound from "../assets/button-press.wav";
import bellSound from "../assets/alarm-bell.mp3";
import digitalSound from "../assets/alarm-digital.mp3";
import kitchenSound from "../assets/alarm-kitchen.mp3";
import { player } from "../utilities/util";

const Timer = () => {
  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const timeMode = useSelector((state) => state.settings.timermode);
  const timeEnabled = useSelector((state) => state.settings.timerenabled);
  const currentTime = useSelector((state) => state.settings.currenttime);
  const autoBreaks = useSelector((state) => state.settings.autobreak);
  const counter = useSelector((state) => state.settings.counter);
  const cycleComplete = useSelector((state) => state.settings.cyclecomplete);
  const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  const alarmSoundState = useSelector((state) => state.settings.alarmsound);

  const dispatch = useDispatch();

  const ternary = () => {
    const adjVolume = alarmVolumeState / 100;

    if (cycleComplete === true) {
      if (alarmSoundState === "Bell") {
        player({
          asset: bellSound,
          volume: adjVolume,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "Digital") {
        player({
          asset: digitalSound,
          volume: adjVolume,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "Kitchen") {
        player({
          asset: kitchenSound,
          volume: adjVolume,
          loop: false,
        }).play();
      }

      return true;
    } else return false;
  };
  // const ternary = false;

  const totalTimeMS = currentTime * 60 * 1000;
  const NOW_IN_MS = new Date().getTime();

  const dateTimeAfterThreeDays = NOW_IN_MS + totalTimeMS;

  function buttonStyle() {
    let btnStyle = `${classes.action_btn1}`;

    if (timeEnabled === false && Number(timeMode) === 1) {
      btnStyle = `${classes.action_btn1}`;
    }

    if (timeEnabled === true && Number(timeMode) === 1) {
      btnStyle = `${classes.action_btn1_active}`;
    }

    if (timeEnabled === false && Number(timeMode) === 2) {
      btnStyle = `${classes.action_btn2}`;
    }

    if (timeEnabled === true && Number(timeMode) === 2) {
      btnStyle = `${classes.action_btn2_active}`;
    }

    if (timeEnabled === false && Number(timeMode) === 3) {
      btnStyle = `${classes.action_btn3}`;
    }

    if (timeEnabled === true && Number(timeMode) === 3) {
      btnStyle = `${classes.action_btn3_active}`;
    }

    return btnStyle;
  }

  return (
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
          <div className={classes.time}>
            {timeEnabled === true ? (
              <CountdownTimer
                targetDate={dateTimeAfterThreeDays}
                time={totalTimeMS}
              />
            ) : (
              <>
                {Number(timeMode) === 1 ? <p>{pomoTime}:00</p> : ""}
                {Number(timeMode) === 2 ? <p>{shortTime}:00</p> : ""}
                {Number(timeMode) === 3 ? <p>{longTime}:00</p> : ""}
              </>
            )}
          </div>
          <div>
            {cycleComplete === false ? (
              <button
                className={buttonStyle()}
                onClick={() => {
                  dispatch(timerEnabled());
                  new Audio(sound).play();
                }}
              >
                {timeEnabled === false ? "START" : "STOP"}
              </button>
            ) : (
              ""
            )}

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
          <Col sm={12} className={classes.align_center}>
            {autoBreaks ? (
              <p>
                <button
                  onClick={() => {
                    dispatch(autoBreak(false));
                    dispatch(setCounter(0));
                  }}
                  className={classes.autobreak_btn}
                >
                  Auto Start Breaks:
                </button>{" "}
                ENABLED
              </p>
            ) : (
              <p>
                <button
                  onClick={() => {
                    dispatch(autoBreak(true));
                    dispatch(setCounter(1));
                    dispatch(timerMode(1));
                    dispatch(setCurrentTime(pomoTime));
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
  );
};

export default Timer;
