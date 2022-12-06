import React from "react";
import { useEffect } from "react";
import { useCountdown } from "./useCountdown";
import DateTimeDisplay from "./DateTimeDisplay";
import classes from "./CountDownTimer.module.css";
import Progress from "./Progress";
import { useSelector, useDispatch } from "react-redux";
import Container from "react-bootstrap/esm/Container";
import { Row, Col } from "react-bootstrap";

import {
  setCycle,
  setTimerEnabled,
  timerEnabled,
} from "../store/settingsSlice";

import Button from "react-bootstrap/esm/Button";

const ExpiredNotice = () => {
  const autoBreak = useSelector((state) => state.settings.autobreak);

  const dispatch = useDispatch();

  console.log("countdown timer");

  if (autoBreak === true) {
        dispatch(setTimerEnabled(true));
      } else {
        dispatch(setTimerEnabled(false));
      }

  return (
    <Container>
      <div className={classes.expired_notice}>
        <Row>
          <Col>
            <Button>RESET</Button>
          </Col>
          <Col>
            <Button>CONTINUE</Button>
          </Col>
        </Row>
      </div>
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
        <a
          target="_blank"
          rel="noopener noreferrer"
          className={classes.countdown_link}
        >
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
        </a>
      </div>
    </div>
  );
};

const CountdownTimer = ({ targetDate, time }) => {
  const [days, hours, minutes, seconds, x] = useCountdown(targetDate, time);

  const autoBreak = useSelector((state) => state.settings.autobreak);
  const counter = useSelector((state) => state.settings.counter);
  const cycle = useSelector((state) => state.settings.cycle[counter]);
  const cycleComplete = useSelector((state) => state.settings.cyclecomplete);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
        x={x}
      />
    );
  }
};

export default CountdownTimer;
