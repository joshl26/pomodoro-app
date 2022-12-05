import { useSelector, useDispatch } from "react-redux";

import { timerEnabled } from "../store/settingsSlice";

import classes from "./Timer.module.css";
import SecondaryButtons from "./SecondaryButtons";
import CountdownTimer from "./CountDownTimer";
import Container from "react-bootstrap/esm/Container";
import { Row, Col } from "react-bootstrap";

const Timer = () => {
  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const timeMode = useSelector((state) => state.settings.timermode);
  const timeEnabled = useSelector((state) => state.settings.timerenabled);
  const currentTime = useSelector((state) => state.settings.currenttime);
  const autoBreak = useSelector((state) => state.settings.autobreak);
  const autoPomo = useSelector((state) => state.settings.autopomo);

  const dispatch = useDispatch();

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
        <SecondaryButtons />
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
          <button
            className={buttonStyle()}
            onClick={() => {
              dispatch(timerEnabled());
            }}
          >
            {timeEnabled === false ? "START" : "STOP"}
          </button>
        </div>
      </div>
      <Container>
        <Row>
          <Col className={classes.align_center}>
            {autoBreak ? (
              <p>Auto Start Break: ENABLED</p>
            ) : (
              <p>Auto Start Break: DISABLED</p>
            )}
          </Col>
          <Col className={classes.align_center}>
            {autoPomo ? (
              <p>Auto Start Pomo: ENABLED</p>
            ) : (
              <p>Auto Start Pomo: DISABLED</p>
            )}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Timer;
