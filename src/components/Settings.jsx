import { Fragment, useEffect, useCallback, useState } from "react";
import { player } from "../utilities/util";
import {
  Container,
  Row,
  Col,
  Dropdown,
  ToggleButton,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  pomoIncrement,
  pomoDecrement,
  shortIncrement,
  shortDecrement,
  longIncrement,
  longDecrement,
  setCurrentTime,
  setDefault,
  setAutoStart,
  setCounter,
  setTimerMode,
  setAlarmState,
  setAlarmVolume,
  setAlarmSound,
  setTotalSeconds,
} from "../store/settingsSlice";
import Slider from "./Slider";
import bellSound from "../assets/sounds/alarm-bell.mp3";
import digitalSound from "../assets/sounds/alarm-digital.mp3";
import kitchenSound from "../assets/sounds/alarm-kitchen.mp3";
import { FaPlus, FaMinus } from "react-icons/fa";

import "./Settings.css";

function getNavBarHomeLink() {
  return document.getElementById("home-nav");
}

const Settings = () => {
  const pomodoroCount = useSelector((state) => state.settings.pomodoro);
  const shortCount = useSelector((state) => state.settings.short);
  const longCount = useSelector((state) => state.settings.long);
  const autoStartState = useSelector((state) => state.settings.autostart);
  const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  const timerMode = useSelector((state) => state.settings.timermode);
  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const alarmSoundState = useSelector((state) => state.settings.alarmsound);

  const [volume, setVolume] = useState(alarmVolumeState);

  const dispatch = useDispatch();

  useEffect(() => {
    setVolume(alarmVolumeState);
  }, [setVolume, alarmVolumeState]);

  const backClickHandler = () => {
    dispatch(setAlarmVolume(volume));

    if (timerMode === 1) {
      dispatch(setTotalSeconds(pomoTime * 60));
    }

    if (timerMode === 2) {
      dispatch(setTotalSeconds(shortTime * 60));
    }

    if (timerMode === 3) {
      dispatch(setTotalSeconds(longTime * 60));
    }

    getNavBarHomeLink().click();
    // console.log(getFaviconEl().click());
  };

  const autostartClickHandler = () => {
    // dispatch(setTimerEnabled(false));
    // dispatch(setCurrentTime());

    if (autoStartState) {
      dispatch(setCounter(0));
      dispatch(setTimerMode(1));
      dispatch(setAutoStart(false));
    } else {
      dispatch(setCounter(1));
      dispatch(setTimerMode(1));
      dispatch(setAutoStart(true));
    }
  };

  const alarmClickHandler = (e) => {
    console.log("Event target value" + e.target.outerText);

    dispatch(setAlarmSound(e.target.outerText));

    if (e.target.outerText === "No Sound") {
      dispatch(setAlarmState(false));
    } else {
      dispatch(setAlarmState(true));
    }
  };

  const defaultSettingsClickHandler = () => {
    setVolume(0.5);
    dispatch(setDefault());
  };

  const sliderClickHandler = useCallback(
    (e) => {
      if (alarmSoundState === "Bell") {
        player({
          asset: bellSound,
          volume: alarmVolumeState,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "Digital") {
        player({
          asset: digitalSound,
          volume: alarmVolumeState,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "Kitchen") {
        player({
          asset: kitchenSound,
          volume: alarmVolumeState,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "No Sound") {
        return;
      }

      setVolume(e.target.value);
      dispatch(setAlarmVolume(e.target.value));

      console.log(`Adjusted volume: ${alarmVolumeState}`);

      console.log("slider click handler");
    },
    [dispatch, alarmVolumeState, alarmSoundState]
  );

  return (
    <Fragment>
      <Container className="settings-container">
        <div className="settings-card">
          <Row>
            <Col>
              <h4 className="card-text">SETTINGS</h4>
            </Col>
            <Col className="align-right">
              <Link to="/pomodor/">
                <Button
                  id="back-btn"
                  onClick={backClickHandler}
                  variant="outline-light"
                  className="btn-save"
                >
                  Back
                </Button>
              </Link>
            </Col>
          </Row>
          <div className="spacer-small"></div>
          <div className="divider"></div>
          <div className="spacer-small"></div>
          <h4 className="card-text">Time (minutes)</h4>
          <Row>
            <Col md={4} className="card-text">
              <p className="timer-text">Pomodoro</p>
              <Row>
                <Col className="padding-left">
                  <div className="card-time">
                    <h4 className="time-text">{pomodoroCount}:00</h4>
                  </div>
                </Col>
                <Col className="padding-right">
                  <Row>
                    <Button
                      onClick={() => {
                        dispatch(pomoIncrement());
                        dispatch(setCurrentTime());
                      }}
                      variant="custom"
                    >
                      <FaPlus className="time-change" />
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
                      <FaMinus className="time-change" />
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="card-text">
              <p className="timer-text">Short Break</p>
              <Row>
                <Col className="padding-left">
                  <div className="card-time">
                    <h4 className="time-text">{shortCount}:00</h4>
                  </div>
                </Col>
                <Col className="padding-right">
                  <Row>
                    <Button
                      onClick={() => {
                        dispatch(shortIncrement());
                        dispatch(setCurrentTime());
                      }}
                      variant="custom"
                    >
                      <FaPlus className="time-change" />
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
                      <FaMinus className="time-change" />
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="card-text">
              <p className="timer-text">Long Break</p>
              <Row>
                <Col className="padding-left">
                  <div className="card-time">
                    <h4 className="time-text">{longCount}:00</h4>
                  </div>
                </Col>
                <Col className="padding-right">
                  <Row>
                    <Button
                      onClick={() => {
                        dispatch(longIncrement());
                        dispatch(setCurrentTime());
                      }}
                      variant="custom"
                    >
                      <FaPlus className="time-change" />
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
                      <FaMinus className="time-change" />
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Col>
            <div className="spacer"></div>
          </Row>
          <div className="divider"></div>
          <div className="spacer"></div>
          <Row>
            <Col>
              <h4 className="card-text">Auto start Breaks?</h4>
            </Col>
            <Col style={{ textAlign: "left" }}>
              <ToggleButton
                className="btn-break"
                id="toggle-check"
                type="checkbox"
                variant="outline-light"
                checked={autoStartState}
                value="1"
                onClick={autostartClickHandler}
              >
                {!autoStartState && "No"}
                {autoStartState && "Yes"}
              </ToggleButton>
            </Col>
          </Row>
          <div className="spacer"></div>
          <div className="divider"></div>
          <div className="spacer"></div>
          <Row>
            <Col>
              <h4 className="card-text">Alarm Sounds</h4>
            </Col>
            <Col>
              <Dropdown>
                <Dropdown.Toggle variant="custom-sounds" id="dropdown-basic">
                  {alarmSoundState}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item value="Bell" onClick={alarmClickHandler}>
                    Bell
                  </Dropdown.Item>
                  <Dropdown.Item value="Digital" onClick={alarmClickHandler}>
                    Digital
                  </Dropdown.Item>
                  <Dropdown.Item value="Kitchen" onClick={alarmClickHandler}>
                    Kitchen
                  </Dropdown.Item>
                  <Dropdown.Item value="No Sound" onClick={alarmClickHandler}>
                    No Sound
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col></Col>
          </Row>
          <div className="spacer"></div>
          <div className="divider"></div>
          <div className="spacer"></div>
          <Row>
            <Col>
              <h4 className="card-text">Alarm Volume</h4>
            </Col>
            <Col style={{ paddingLeft: "25px" }}>
              <Slider
                value={alarmVolumeState}
                onChange={sliderClickHandler}
                onClick={sliderClickHandler}
              />
            </Col>
            <Col>
              <h2>{Math.round(alarmVolumeState * 100)}</h2>
            </Col>
          </Row>
          <div className="spacer-small"></div>
          <div className="divider"></div>
          <div className="spacer"></div>
          <Row>
            <Col className="align-center">
              <Button
                onClick={defaultSettingsClickHandler}
                variant="outline-light"
                className="default-settings"
              >
                Restore Defaults
              </Button>
            </Col>
          </Row>
          <div className="spacer"></div>
        </div>
      </Container>
    </Fragment>
  );
};

export default Settings;
