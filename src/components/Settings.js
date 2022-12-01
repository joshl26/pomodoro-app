import "./Settings.css";
import classes from "./Settings.module.css";

import { Container } from "react-bootstrap";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useState, useEffect } from "react";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ToggleButton from "react-bootstrap/esm/ToggleButton";

const Settings = () => {
  const [autoBreak, setAutoBreak] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [shortBreakTime, setShortBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);

  const autoBreakButtonHandler = (event) => {
    setAutoBreak(event.currentTarget.checked);
  };

  const autoStartButtonHandler = (event) => {
    setAutoStart(event.currentTarget.checked);
  };

  const pomodoroTimeIncrement = () => {
    console.log("Increment Pomodoro Time");
    console.log(pomodoroTime);
    let count = pomodoroTime + 1;
    setPomodoroTime(count);
    console.log(pomodoroTime);
  };

  const pomodoroTimeDecrement = () => {
    console.log("Increment Pomodoro Time");
    console.log(pomodoroTime);
    let count = pomodoroTime - 1;
    setPomodoroTime(count);
    console.log(pomodoroTime);
  };

  const shortBreakIncrement = () => {
    console.log("Increment Pomodoro Time");
    console.log(shortBreakTime);
    let count = shortBreakTime + 1;
    setShortBreakTime(count);
    console.log(shortBreakTime);
  };

  const shortBreakDecrement = () => {
    console.log("Increment Pomodoro Time");
    console.log(shortBreakTime);
    let count = shortBreakTime - 1;
    setShortBreakTime(count);
    console.log(shortBreakTime);
  };

  const longBreakIncrement = () => {
    console.log("Increment Pomodoro Time");
    console.log(longBreakTime);
    let count = longBreakTime + 1;
    setLongBreakTime(count);
    console.log(longBreakTime);
  };

  const longBreakDecrement = () => {
    console.log("Increment Pomodoro Time");
    console.log(longBreakTime);
    let count = longBreakTime - 1;
    setLongBreakTime(count);
    console.log(longBreakTime);
  };

  return (
    <Container className={classes.container}>
      <div className={classes.card}>
        <Row>
          <Col>
            <h4 className={classes.card_text}>SETTINGS</h4>
          </Col>
          <Col className={classes.align_right}>
            <Link to="/pomodor">CLOSE</Link>
          </Col>
        </Row>
        <div className={classes.divider}></div>
        <div className={classes.spacer_small}></div>
        <h4 className={classes.card_text}>Time (minutes)</h4>
        <Row>
          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Pomodoro</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{pomodoroTime}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button onClick={pomodoroTimeIncrement} variant="custom">
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button onClick={pomodoroTimeDecrement} variant="custom">
                    <h4 className={classes.text_increment}>-</h4>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Short Break</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{shortBreakTime}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button onClick={shortBreakIncrement} variant="custom">
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button onClick={shortBreakDecrement} variant="custom">
                    <h4 className={classes.text_increment}>-</h4>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Long Break</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{longBreakTime}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button onClick={longBreakIncrement} variant="custom">
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={longBreakDecrement}
                    value="negative"
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>-</h4>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>

          <div className={classes.spacer}></div>
        </Row>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Auto start Breaks?</h4>
        <ButtonGroup className="mb-2">
          <ToggleButton
            id="toggle-check"
            type="checkbox"
            variant="outline-secondary"
            checked={autoBreak}
            value="1"
            onChange={autoBreakButtonHandler}
          >
            {!autoBreak && "No"}
            {autoBreak && "Yes"}
          </ToggleButton>
        </ButtonGroup>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Auto start Pomodoros?</h4>
        <ButtonGroup className="mb-2">
          <ToggleButton
            id="toggle-check2"
            type="checkbox"
            variant="outline-secondary"
            checked={autoStart}
            value="1"
            onChange={autoStartButtonHandler}
          >
            {!autoStart && "No"}
            {autoStart && "Yes"}
          </ToggleButton>
        </ButtonGroup>

        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Long Break interval?</h4>
        <div className={classes.spacer_small}></div>

        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>

        <Row>
          <Col className={classes.align_right}>
            <Button variant="outline-secondary" className={classes.btn_save}>
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Settings;
