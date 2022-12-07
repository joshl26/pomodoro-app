import React from "react";
import { useEffect } from "react";
import { useCountdown } from "./useCountdown";
import DateTimeDisplay from "./DateTimeDisplay";
import classes from "./CountDownTimer.module.css";
import Progress from "./Progress";
import { useSelector, useDispatch } from "react-redux";
import Container from "react-bootstrap/esm/Container";
import { Row } from "react-bootstrap";

import {
  setTimerEnabled,
  timerMode,
  counterIncrement,
  setCounter,
} from "../store/settingsSlice";

const ExpiredNotice = () => {
  const counter = useSelector((state) => state.settings.counter);
  const autoBreak = useSelector((state) => state.settings.autobreak);
  const cycle = useSelector((state) => state.settings.cycle[counter]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (autoBreak === false) {
      dispatch(setTimerEnabled(false));
      // dispatch(setCycle(true));
    }

    if (autoBreak === true) {
      if (counter <= 8) {
        dispatch(setTimerEnabled(false));
        dispatch(counterIncrement());
        dispatch(timerMode(cycle));
        dispatch(setTimerEnabled(true));
      }

      if (counter > 8) {
        dispatch(setTimerEnabled(false));
        // dispatch(setCycle());
        dispatch(setCounter(1));
        dispatch(timerMode(1));
        dispatch(setTimerEnabled(true));
      }
    }

    console.log("Use effect");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Row>
        <h1>Loading Next Round...</h1>
        <div className={classes.spacer_large} />
      </Row>
    </Container>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds, x }) => {
  function paddedSeconds() {
    if (seconds < 10) {
      return `0${seconds}`;
    } else return seconds;
  }
  function paddedMinutes() {
    if (minutes < 10) {
      return `0${minutes}`;
    } else return minutes;
  }

  return (
    <div>
      <div className={classes.spacer} />
      <Progress percent={x} />
      <div className={classes.show_counter}>
        <div className={classes.countdown_link}>
          <DateTimeDisplay
            value={paddedMinutes()}
            type={"Mins"}
            isDanger={false}
          />
          <p>:</p>
          <DateTimeDisplay
            value={paddedSeconds()}
            type={"Seconds"}
            isDanger={false}
          />
        </div>
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate, time }) => {
  const [days, hours, minutes, seconds, x] = useCountdown(targetDate, time);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return <ShowCounter minutes={minutes} seconds={seconds} x={x} />;
  }
};

export default CountdownTimer;
