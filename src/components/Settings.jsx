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
  setButtonSoundState,
} from "../store/settingsSlice";
import Slider from "./Slider";
import bellSound from "../assets/sounds/alarm-bell.mp3";
import digitalSound from "../assets/sounds/alarm-digital.mp3";
import kitchenSound from "../assets/sounds/alarm-kitchen.mp3";
import { FaPlus, FaMinus } from "react-icons/fa";
import ButtonPressSound from "../assets/sounds/button-press.wav";

import "./Settings.css";
import { useGlobalAudioPlayer } from "react-use-audio-player";

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
  const buttonSoundState = useSelector((state) => state.settings.buttonsound);

  console.log(alarmVolumeState);

  const [volume, setVolume] = useState(alarmVolumeState);

  const dispatch = useDispatch();

  const {
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
    playing: isPlaying,
    load: loadAudio,
  } = useGlobalAudioPlayer();

  const buttonClickSound = () => {
    console.log(buttonSoundState);

    if (buttonSoundState) {
      loadAudio(ButtonPressSound, {
        autoplay: false,
        initialVolume: alarmVolumeState,
      });
      playAudio();
    }
  };

  const TimeButtons = ({ buttonTime }) => {
    return (
      <Col className="padding-right">
        <Col>
          <Button
            onClick={() => {
              buttonClickSound();
              if (buttonTime === "pomo") {
                dispatch(pomoIncrement());
              }
              if (buttonTime === "short") {
                dispatch(shortIncrement());
              }
              if (buttonTime === "long") {
                dispatch(longIncrement());
              }
              dispatch(setCurrentTime());
            }}
            variant="custom"
            className="time-buttons"
          >
            <FaPlus className="time-change" />
          </Button>
        </Col>
        <Col>
          <Button
            onClick={() => {
              buttonClickSound();
              if (buttonTime === "pomo") {
                dispatch(pomoDecrement());
              }
              if (buttonTime === "short") {
                dispatch(shortDecrement());
              }
              if (buttonTime === "long") {
                dispatch(longDecrement());
              }
              dispatch(setCurrentTime());
            }}
            variant="custom"
            className="time-buttons"
          >
            <FaMinus className="time-change" />
          </Button>
        </Col>
      </Col>
    );
  };

  useEffect(() => {
    setVolume(alarmVolumeState);
  }, [setVolume, alarmVolumeState]);

  const backClickHandler = () => {
    dispatch(setAlarmVolume(volume));
    buttonClickSound();

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
    buttonClickSound();
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

  const buttonSoundClickHandler = () => {
    buttonClickSound();
    dispatch(setButtonSoundState(!buttonSoundState));
  };

  const alarmClickHandler = (e) => {
    console.log("Event target value" + e.target.outerText);
    buttonClickSound();
    dispatch(setAlarmSound(e.target.outerText));

    if (e.target.outerText === "No Sound") {
      dispatch(setAlarmState(false));
    } else {
      dispatch(setAlarmState(true));
    }
  };

  const defaultSettingsClickHandler = () => {
    buttonClickSound();
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

      setVolume(Number(e.target.value));
      dispatch(setAlarmVolume(Number(e.target.value)));

      console.log(`Adjusted volume: ${alarmVolumeState}`);

      console.log("slider click handler");
    },
    [dispatch, alarmVolumeState, alarmSoundState]
  );

  return (
    <Container className="settings-container">
      <h1>Settings</h1>
      <div className="spacer-small"></div>

      <div className="settings-card">
        <Row>
          <Col xs={12} md={7}>
            <p className="card-text align-right">
              Tip: Click back to save your changes
            </p>
          </Col>
          <Col xs={12} className="align-right">
            <Link to="/pomodor/">
              <Button
                id="back-btn"
                onClick={backClickHandler}
                variant="outline-light"
                className="btn-back"
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
                  <h4 className="time-text">{pomodoroCount}</h4>
                </div>
              </Col>
              <TimeButtons buttonTime={"pomo"} />
            </Row>
          </Col>
          <Col md={4} className="card-text">
            <p className="timer-text">Short Break</p>
            <Row>
              <Col className="padding-left">
                <div className="card-time">
                  <h4 className="time-text">{shortCount}</h4>
                </div>
              </Col>
              <TimeButtons buttonTime={"short"} />
            </Row>
          </Col>
          <Col md={4} className="card-text">
            <p className="timer-text">Long Break</p>
            <Row>
              <Col className="padding-left">
                <div className="card-time">
                  <h4 className="time-text">{longCount}</h4>
                </div>
              </Col>
              <TimeButtons buttonTime={"long"} />
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
            <h4 className="card-text">Button sounds?</h4>
          </Col>
          <Col style={{ textAlign: "left" }}>
            <ToggleButton
              className="btn-sound"
              id="toggle-sound"
              type="checkbox"
              variant="outline-light"
              checked={buttonSoundState}
              value="1"
              onClick={buttonSoundClickHandler}
            >
              {!buttonSoundState && "No"}
              {buttonSoundState && "Yes"}
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
        <Row className="alarm-volume">
          <Col xs={12} md={4}>
            <h4 className="card-text">Alarm Volume</h4>
          </Col>
          <Col xs={12} md={4} style={{ paddingLeft: "25px" }}>
            <Slider
              value={alarmVolumeState}
              onChange={sliderClickHandler}
              onClick={sliderClickHandler}
            />
          </Col>
          <Col xs={12} md={4}>
            <h2>{Math.round(alarmVolumeState * 100)}</h2>
          </Col>
        </Row>
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
  );
};

export default Settings;
