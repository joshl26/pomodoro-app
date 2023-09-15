import "./Settings.css";
import Slider from "./Slider";
import bellSound from "../assets/alarm-bell.mp3";
import digitalSound from "../assets/alarm-digital.mp3";
import kitchenSound from "../assets/alarm-kitchen.mp3";
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
  setAlarmState,
  setAlarmVolume,
  setAlarmSound,
} from "../store/settingsSlice";
import { useEffect } from "react";
import { Fragment } from "react";
import { player } from "../utilities/util";
import { useCallback } from "react";

function getNavBarHomeLink() {
  return document.getElementById("home_nav");
}

const Settings = () => {
  const pomodoroCount = useSelector((state) => state.settings.pomodoro);
  const shortCount = useSelector((state) => state.settings.short);
  const longCount = useSelector((state) => state.settings.long);
  const autoBreakBool = useSelector((state) => state.settings.autobreak);
  const alarmVolumeState = useSelector((state) => state.settings.alarmvolume);
  const alarmSoundState = useSelector((state) => state.settings.alarmsound);
  const [volume, setVolume] = useState(alarmVolumeState);

  let adjustedVolume = alarmVolumeState / 100;

  const dispatch = useDispatch();

  useEffect(() => {
    setVolume(alarmVolumeState);
  }, [setVolume, alarmVolumeState]);

  // useEffect(() => {
  //   var adjustedVolume = alarmVolumeState / 100;
  // }, []);

  const backClickHandler = () => {
    dispatch(setAlarmVolume(volume));
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
    setVolume(50);
    dispatch(setDefault());
  };

  const sliderClickHandler = useCallback(
    (e) => {
      // adjustedVolume = e.target.value / 100;

      if (alarmSoundState === "Bell") {
        player({
          asset: bellSound,
          volume: adjustedVolume,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "Digital") {
        player({
          asset: digitalSound,
          volume: adjustedVolume,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "Kitchen") {
        player({
          asset: kitchenSound,
          volume: adjustedVolume,
          loop: false,
        }).play();
      }

      if (alarmSoundState === "No Sound") {
        return;
      }

      setVolume(e.target.value);
      dispatch(setAlarmVolume(e.target.value));

      console.log(`Adjusted volume: ${adjustedVolume}`);

      console.log("slider click handler");
    },
    [dispatch, adjustedVolume, alarmSoundState]
  );

  return (
    <Fragment>
      <div className="cover" />
      <Container className="container">
        <div className="card">
          <Row>
            <Col>
              <h4 className="card_text">SETTINGS</h4>
            </Col>
            <Col className="align_right">
              <Link to="/pomodor/">
                <Button
                  id="back_btn"
                  onClick={backClickHandler}
                  variant="outline-light"
                  className="btn_save"
                >
                  Back
                </Button>
              </Link>
            </Col>
          </Row>
          <div className="spacer_small"></div>
          <div className="divider"></div>
          <div className="spacer_small"></div>
          <h4 className="card_text">Time (minutes)</h4>
          <Row>
            <Col md={4} className="card_text">
              <p className="timer_text">Pomodoro</p>
              <Row>
                <Col className="padding_left">
                  <div className="card_time">
                    <h4 className="time_text">{pomodoroCount}:00</h4>
                  </div>
                </Col>
                <Col className="padding_right">
                  <Row>
                    <Button
                      onClick={() => {
                        dispatch(pomoIncrement());
                        dispatch(setCurrentTime());
                      }}
                      variant="custom"
                    >
                      <h4 className="text_increment">+</h4>
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
                      <h4 className="text_increment">-</h4>
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="card_text">
              <p className="timer_text">Short Break</p>
              <Row>
                <Col className="padding_left">
                  <div className="card_time">
                    <h4 className="time_text">{shortCount}:00</h4>
                  </div>
                </Col>
                <Col className="padding_right">
                  <Row>
                    <Button
                      onClick={() => {
                        dispatch(shortIncrement());
                        dispatch(setCurrentTime());
                      }}
                      variant="custom"
                    >
                      <h4 className="text_increment">+</h4>
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
                      <h4 className="text_increment">-</h4>
                    </Button>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col md={4} className="card_text">
              <p className="timer_text">Long Break</p>
              <Row>
                <Col className="padding_left">
                  <div className="card_time">
                    <h4 className="time_text">{longCount}:00</h4>
                  </div>
                </Col>
                <Col className="padding_right">
                  <Row>
                    <Button
                      onClick={() => {
                        dispatch(longIncrement());
                        dispatch(setCurrentTime());
                      }}
                      variant="custom"
                    >
                      <h4 className="text_increment">+</h4>
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
                      <h4 className="text_increment">-</h4>
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
              <h4 className="card_text">Auto start Breaks?</h4>
            </Col>
            <Col style={{ textAlign: "left" }}>
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
            </Col>
          </Row>
          <div className="spacer"></div>
          <div className="divider"></div>
          <div className="spacer"></div>
          <Row>
            <Col>
              <h4 className="card_text">Alarm Sounds</h4>
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
              <h4 className="card_text">Alarm Volume</h4>
            </Col>
            <Col style={{ paddingLeft: "25px" }}>
              <Slider
                value={alarmVolumeState}
                onChange={sliderClickHandler}
                onClick={sliderClickHandler}
              />
            </Col>
            <Col>
              <h2>{alarmVolumeState}</h2>
            </Col>
          </Row>
          <div className="spacer_small"></div>
          <div className="divider"></div>
          <div className="spacer"></div>

          <Row>
            <Col className="align_center">
              <Button
                onClick={defaultSettingsClickHandler}
                variant="outline-light"
                className="btn_save"
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
