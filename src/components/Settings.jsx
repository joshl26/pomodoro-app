/* eslint-disable no-unused-vars */
import { useEffect, useCallback, useState } from "react";
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
import { useGlobalAudioPlayer } from "react-use-audio-player";
import "./Settings.css";

/**
 * Settings Component
 * Manages user preferences for timer durations, sounds, and auto-start behavior
 * @component
 * @returns {React.ReactElement} The settings interface
 */
const Settings = () => {
  // ============================================
  // SELECTORS - Redux State
  // ============================================
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

  // ============================================
  // HOOKS & STATE
  // ============================================
  const [volume, setVolume] = useState(alarmVolumeState);
  const dispatch = useDispatch();

  const { play: playAudio, load: loadAudio } = useGlobalAudioPlayer();

  // ============================================
  // EFFECTS
  // ============================================

  /**
   * Sync local volume state with Redux alarm volume
   */
  useEffect(() => {
    setVolume(alarmVolumeState);
  }, [alarmVolumeState]);

  // ============================================
  // CALLBACKS
  // ============================================

  /**
   * Play button click sound if enabled
   */
  const buttonClickSound = useCallback(() => {
    if (buttonSoundState) {
      loadAudio(ButtonPressSound, {
        autoplay: true,
        initialVolume: alarmVolumeState,
      });
    }
  }, [buttonSoundState, alarmVolumeState, loadAudio]);

  /**
   * Get home navigation link element
   */
  const getNavBarHomeLink = useCallback(() => {
    return document.getElementById("home-nav");
  }, []);

  /**
   * Handle back button - save changes and navigate home
   */
  const backClickHandler = useCallback(() => {
    dispatch(setAlarmVolume(volume));
    buttonClickSound();

    const modeToSecondsMap = {
      1: pomoTime * 60,
      2: shortTime * 60,
      3: longTime * 60,
    };

    dispatch(setTotalSeconds(modeToSecondsMap[timerMode] || pomoTime * 60));
    getNavBarHomeLink().click();
  }, [
    volume,
    dispatch,
    buttonClickSound,
    timerMode,
    pomoTime,
    shortTime,
    longTime,
    getNavBarHomeLink,
  ]);

  /**
   * Handle auto-start toggle
   */
  const autostartClickHandler = useCallback(() => {
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
  }, [autoStartState, dispatch, buttonClickSound]);

  /**
   * Handle button sound toggle
   */
  const buttonSoundClickHandler = useCallback(() => {
    buttonClickSound();
    dispatch(setButtonSoundState(!buttonSoundState));
  }, [buttonSoundState, dispatch, buttonClickSound]);

  /**
   * Handle alarm sound selection
   */
  const alarmClickHandler = useCallback(
    (e) => {
      const selectedSound = e.target.outerText;
      buttonClickSound();
      dispatch(setAlarmSound(selectedSound));

      if (selectedSound === "No Sound") {
        dispatch(setAlarmState(false));
      } else {
        dispatch(setAlarmState(true));
      }
    },
    [dispatch, buttonClickSound]
  );

  /**
   * Handle alarm volume slider changes
   */
  const sliderClickHandler = useCallback(
    (e) => {
      const newVolume = Number(e.target.value);
      setVolume(newVolume);
      dispatch(setAlarmVolume(newVolume));

      // Play preview sound based on current selection
      const soundMap = {
        Bell: bellSound,
        Digital: digitalSound,
        Kitchen: kitchenSound,
      };

      if (soundMap[alarmSoundState]) {
        loadAudio(soundMap[alarmSoundState], {
          autoplay: true,
          initialVolume: newVolume,
        });
      }
    },
    [alarmSoundState, dispatch, loadAudio]
  );

  /**
   * Handle restore defaults button
   */
  const defaultSettingsClickHandler = useCallback(() => {
    buttonClickSound();
    setVolume(0.5);
    dispatch(setDefault());
  }, [dispatch, buttonClickSound]);

  // ============================================
  // COMPONENTS
  // ============================================

  /**
   * Time adjustment buttons (increment/decrement)
   */
  const TimeButtons = ({ buttonTime }) => {
    const timerMap = {
      pomo: { increment: pomoIncrement, decrement: pomoDecrement },
      short: { increment: shortIncrement, decrement: shortDecrement },
      long: { increment: longIncrement, decrement: longDecrement },
    };

    const { increment, decrement } = timerMap[buttonTime] || {};

    return (
      <Col className="padding-right">
        <Col>
          <Button
            onClick={() => {
              buttonClickSound();
              increment && dispatch(increment());
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
              decrement && dispatch(decrement());
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <Container className="settings-container">
      <h1>Settings</h1>
      <div className="spacer-small" />

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

        <div className="spacer-small" />
        <div className="divider" />
        <div className="spacer-small" />

        {/* Time Settings */}
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
              <TimeButtons buttonTime="pomo" />
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
              <TimeButtons buttonTime="short" />
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
              <TimeButtons buttonTime="long" />
            </Row>
          </Col>
          <div className="spacer" />
        </Row>

        <div className="divider" />
        <div className="spacer" />

        {/* Auto-start Toggle */}
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
              {autoStartState ? "Yes" : "No"}
            </ToggleButton>
          </Col>
        </Row>

        <div className="spacer" />
        <div className="divider" />
        <div className="spacer" />

        {/* Button Sounds Toggle */}
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
              {buttonSoundState ? "Yes" : "No"}
            </ToggleButton>
          </Col>
        </Row>

        <div className="spacer" />
        <div className="divider" />
        <div className="spacer" />

        {/* Alarm Sound Dropdown */}
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
                <Dropdown.Item onClick={alarmClickHandler}>Bell</Dropdown.Item>
                <Dropdown.Item onClick={alarmClickHandler}>
                  Digital
                </Dropdown.Item>
                <Dropdown.Item onClick={alarmClickHandler}>
                  Kitchen
                </Dropdown.Item>
                <Dropdown.Item onClick={alarmClickHandler}>
                  No Sound
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col />
        </Row>

        <div className="spacer" />
        <div className="divider" />
        <div className="spacer" />

        {/* Alarm Volume Slider */}
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

        <div className="divider" />
        <div className="spacer" />

        {/* Restore Defaults Button */}
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

        <div className="spacer" />
      </div>
    </Container>
  );
};

export default Settings;
