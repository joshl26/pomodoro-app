import "./Settings.css";
import classes from "./Settings.module.css";

import { Container } from "react-bootstrap";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import ToggleButton from "react-bootstrap/esm/ToggleButton";
import Slider from "../components/Slider";

import Dropdown from "react-bootstrap/esm/Dropdown";

import { useSelector, useDispatch } from "react-redux";

import { useState } from "react";

import {
  pomoIncrement,
  pomoDecrement,
  shortIncrement,
  shortDecrement,
  longIncrement,
  longDecrement,
  setCurrentTime,
  setDefault,
  autoBreak,
  setCounter,
  timerMode,
  setTimerEnabled,
} from "../store/settingsSlice";

function getNavBarHomeLink() {
  return document.getElementById("home_nav");
}

const Settings = () => {
  const pomodoroCount = useSelector((state) => state.settings.pomodoro);
  const shortCount = useSelector((state) => state.settings.short);
  const longCount = useSelector((state) => state.settings.long);
  const autoBreakBool = useSelector((state) => state.settings.autobreak);

  const [volume, setVolume] = useState(50);

  const BELL_SOUND = "./assets/alarm-bell.mp3";
  const DIGITAL_SOUND = "./assets/alarm-digital.mp3";

  const alarmSounds = [
    {
      value: BELL_SOUND,
      label: "Bell",
    },
    {
      value: DIGITAL_SOUND,
      label: "Digital",
    },
  ];

  const dispatch = useDispatch();

  const backClickHandler = () => {
    getNavBarHomeLink().click();
    // console.log(getFaviconEl().click());
  };

  const saveClickHandler = () => {
    dispatch(setTimerEnabled(false));

    if (autoBreakBool === true) {
      // dispatch(timerMode(1));
      dispatch(setCounter(0));
      dispatch(autoBreak(false));
      dispatch(setCurrentTime());
    } else {
      dispatch(setCounter(1));
      dispatch(autoBreak(true));
      dispatch(timerMode(1));
      dispatch(setCurrentTime());
    }
  };

  const Label = ({ children }) => (
    <label className={classes.label}>{children}</label>
  );

  return (
    <Container className={classes.container}>
      <div className={classes.card}>
        <Row>
          <Col>
            <h4 className={classes.card_text}>SETTINGS</h4>
          </Col>
          <Col className={classes.align_right}>
            <Link to="/pomodor/">
              <Button
                id="back_btn"
                onClick={backClickHandler}
                variant="outline-light"
                className={classes.btn_save}
              >
                Back
              </Button>
            </Link>
          </Col>
        </Row>
        <div className={classes.spacer_small}></div>
        <div className={classes.divider}></div>
        <div className={classes.spacer_small}></div>
        <h4 className={classes.card_text}>Time (minutes)</h4>
        <Row>
          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Pomodoro</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{pomodoroCount}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button
                    onClick={() => {
                      dispatch(pomoIncrement());
                      dispatch(setCurrentTime());
                    }}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={() => {
                      dispatch(pomoDecrement());
                      dispatch(setCurrentTime());
                    }}
                    variant="custom"
                  >
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
                  <h4 className={classes.time_text}>{shortCount}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button
                    onClick={() => {
                      dispatch(shortIncrement());
                      dispatch(setCurrentTime());
                    }}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={() => {
                      dispatch(shortDecrement());
                      dispatch(setCurrentTime());
                    }}
                    variant="custom"
                  >
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
                  <h4 className={classes.time_text}>{longCount}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button
                    onClick={() => {
                      dispatch(longIncrement());
                      dispatch(setCurrentTime());
                    }}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={() => {
                      dispatch(longDecrement());
                      dispatch(setCurrentTime());
                    }}
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
        <ToggleButton
          className="btn_break"
          id="toggle-check"
          type="checkbox"
          variant="outline-light"
          checked={autoBreakBool}
          value="1"
          onClick={saveClickHandler}
        >
          {!autoBreakBool && "No"}
          {autoBreakBool && "Yes"}
        </ToggleButton>
        <div className={classes.spacer_small}></div>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <Row>
          <Col>
            <h4 className={classes.card_text}>Alarm Sounds</h4>
          </Col>
          <Col>
            <Dropdown>
              <Dropdown.Toggle variant="custom-sounds" id="dropdown-basic">
                Bell
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item value="Bell">Bell</Dropdown.Item>
                <Dropdown.Item value="Digital">Digital</Dropdown.Item>
                <Dropdown.Item value="Kitchen">Kitchen</Dropdown.Item>
                <Dropdown.Item value="No Sound">No Sound</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col></Col>
        </Row>
        <div className={classes.spacer_small}></div>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <Row>
          <Col>
            <h4 className={classes.card_text}>Alarm Volume</h4>
          </Col>
          <Col>
            <Slider onChange={(e) => setVolume(e.target.value)} />
          </Col>
          <Col>
            <h2>{volume}</h2>
          </Col>
        </Row>
        <div className={classes.spacer_small}></div>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>

        <Row>
          <Col className={classes.align_center}>
            <Button
              onClick={() => {
                dispatch(setDefault());
              }}
              variant="outline-light"
              className="btn_save"
            >
              Restore Defaults
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Settings;
