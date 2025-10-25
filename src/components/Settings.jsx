import React, { useEffect, useCallback, useState, useRef } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  pomoIncrement,
  pomoDecrement,
  shortIncrement,
  shortDecrement,
  longIncrement,
  longDecrement,
  setCurrentTimeFromMode,
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
import { FaPlus, FaMinus } from "react-icons/fa";
import useAudioManager from "../hooks/useAudioManager";
import "./Settings.css";

/**
 * Settings component - Allows user to configure timer durations, sounds, and behavior
 * Enhanced with comprehensive accessibility features and SEO
 * @component
 */
const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { play, stop, playButtonSound, load, setVolume } = useAudioManager();

  const {
    timers: { pomodoro: pomodoroCount, short: shortCount, long: longCount },
    autostart: autoStartState,
    timermode: timerMode,
    alarm: {
      volume: alarmVolumeState = 0.5,
      sound: alarmSoundState = "No Sound",
      buttonSound: buttonSoundState = false,
    } = {},
  } = useSelector((state) => state.settings);

  const [volume, setLocalVolume] = useState(alarmVolumeState);
  const sliderPreviewTimer = useRef(null);

  useEffect(() => {
    setLocalVolume(alarmVolumeState);
  }, [alarmVolumeState]);

  useEffect(() => {
    if (!load) return;
    if (alarmSoundState && alarmSoundState !== "No Sound") {
      load(alarmSoundState);
      if (typeof setVolume === "function") {
        setVolume(alarmSoundState, volume);
      }
    }
  }, [alarmSoundState, load, setVolume, volume]);

  useEffect(() => {
    if (!load) return;
    if (buttonSoundState) {
      load("button");
    }
  }, [buttonSoundState, load]);

  useEffect(() => {
    return () => {
      if (sliderPreviewTimer.current) {
        clearTimeout(sliderPreviewTimer.current);
        sliderPreviewTimer.current = null;
      }
      stop("alarm");
      stop("Bell");
      stop("Digital");
      stop("Kitchen");
      stop("button");
    };
  }, [stop]);

  const buttonClickSound = useCallback(() => {
    if (!buttonSoundState) return;
    try {
      stop("button");
    } catch {}
    playButtonSound();
  }, [buttonSoundState, playButtonSound, stop]);

  const backClickHandler = useCallback(() => {
    dispatch(setAlarmVolume(volume));
    buttonClickSound();

    const modeToSecondsMap = {
      1: pomodoroCount * 60,
      2: shortCount * 60,
      3: longCount * 60,
    };

    dispatch(
      setTotalSeconds(modeToSecondsMap[timerMode] || pomodoroCount * 60)
    );

    navigate("/");
  }, [
    volume,
    dispatch,
    buttonClickSound,
    timerMode,
    pomodoroCount,
    shortCount,
    longCount,
    navigate,
  ]);

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

  const buttonSoundClickHandler = useCallback(() => {
    buttonClickSound();
    dispatch(setButtonSoundState(!buttonSoundState));
  }, [buttonSoundState, dispatch, buttonClickSound]);

  const alarmClickHandler = useCallback(
    (selectedSound) => {
      buttonClickSound();
      dispatch(setAlarmSound(selectedSound));

      if (selectedSound === "No Sound") {
        dispatch(setAlarmState(false));
        stop("alarm");
        stop("Bell");
        stop("Digital");
        stop("Kitchen");
      } else {
        dispatch(setAlarmState(true));
        stop("alarm");
        stop("Bell");
        stop("Digital");
        stop("Kitchen");
        if (typeof setVolume === "function") {
          setVolume(selectedSound, volume);
        }
        play(selectedSound, { volume }).catch(() => {});
      }
    },
    [dispatch, buttonClickSound, play, stop, setVolume, volume]
  );

  const sliderClickHandler = useCallback(
    (e) => {
      const newVolume = Number(e.target.value);
      setLocalVolume(newVolume);
      dispatch(setAlarmVolume(newVolume));

      if (
        alarmSoundState &&
        alarmSoundState !== "No Sound" &&
        typeof setVolume === "function"
      ) {
        setVolume(alarmSoundState, newVolume);
      }

      if (alarmSoundState && alarmSoundState !== "No Sound") {
        if (sliderPreviewTimer.current) {
          clearTimeout(sliderPreviewTimer.current);
        }
        sliderPreviewTimer.current = setTimeout(() => {
          try {
            stop(alarmSoundState);
            stop("alarm");
          } catch {}
          play(alarmSoundState, { volume: newVolume }).catch(() => {});
          sliderPreviewTimer.current = null;
        }, 200);
      }
    },
    [alarmSoundState, dispatch, play, stop, setVolume]
  );

  const defaultSettingsClickHandler = useCallback(() => {
    buttonClickSound();
    const defaultVol = 0.5;
    setLocalVolume(defaultVol);
    dispatch(setDefault());
    dispatch(setAlarmVolume(defaultVol));
    if (
      alarmSoundState &&
      alarmSoundState !== "No Sound" &&
      typeof setVolume === "function"
    ) {
      setVolume(alarmSoundState, defaultVol);
    }
  }, [dispatch, buttonClickSound, alarmSoundState, setVolume]);

  const TimeButtons = ({ buttonTime }) => {
    const timerMap = {
      pomo: { increment: pomoIncrement, decrement: pomoDecrement },
      short: { increment: shortIncrement, decrement: shortDecrement },
      long: { increment: longIncrement, decrement: longDecrement },
    };

    const { increment, decrement } = timerMap[buttonTime] || {};

    const labelMap = {
      pomo: "Pomodoro",
      short: "Short Break",
      long: "Long Break",
    };
    const label = labelMap[buttonTime] || "Timer";

    return (
      <Col className="padding-right">
        <Col>
          <Button
            aria-label={`Increment ${label}`}
            onClick={() => {
              buttonClickSound();
              if (increment) dispatch(increment());
              dispatch(setCurrentTimeFromMode());
            }}
            variant="custom"
            className="time-buttons increment-btn"
          >
            <FaPlus className="time-change" aria-hidden="true" />
          </Button>
        </Col>
        <Col>
          <Button
            aria-label={`Decrement ${label}`}
            onClick={() => {
              buttonClickSound();
              if (decrement) dispatch(decrement());
              dispatch(setCurrentTimeFromMode());
            }}
            variant="custom"
            className="time-buttons decrement-btn"
          >
            <FaMinus className="time-change" aria-hidden="true" />
          </Button>
        </Col>
      </Col>
    );
  };

  return (
    <div className="settings-wrapper">
      <Container className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <div className="settings-card">
          <Row className="settings-header">
            <Col xs={12} md={7}>
              <p className="card-text settings-tip">
                Tip: Click back to save your changes
              </p>
            </Col>
            <Col xs={12} md={5} className="text-end">
              <Link to="/">
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

          <div className="settings-divider" />

          {/* Time Settings */}
          <div className="settings-section">
            <h4 className="section-title">Time (minutes)</h4>
            <Row className="time-controls-row">
              <Col xs={12} md={4} className="time-control-col">
                <p className="timer-label">Pomodoro</p>
                <Row className="time-control-inner">
                  <Col xs={6} className="time-display-col">
                    <div className="card-time">
                      <h4 className="time-text">{pomodoroCount}</h4>
                    </div>
                  </Col>
                  <TimeButtons buttonTime="pomo" />
                </Row>
              </Col>
              <Col xs={12} md={4} className="time-control-col">
                <p className="timer-label">Short Break</p>
                <Row className="time-control-inner">
                  <Col xs={6} className="time-display-col">
                    <div className="card-time">
                      <h4 className="time-text">{shortCount}</h4>
                    </div>
                  </Col>
                  <TimeButtons buttonTime="short" />
                </Row>
              </Col>
              <Col xs={12} md={4} className="time-control-col">
                <p className="timer-label">Long Break</p>
                <Row className="time-control-inner">
                  <Col xs={6} className="time-display-col">
                    <div className="card-time">
                      <h4 className="time-text">{longCount}</h4>
                    </div>
                  </Col>
                  <TimeButtons buttonTime="long" />
                </Row>
              </Col>
            </Row>
          </div>

          <div className="settings-divider" />

          {/* Auto-start Toggle */}
          <div className="settings-section">
            <Row className="settings-row">
              <Col xs={12} md={6}>
                <h4 className="section-title">Auto start Breaks?</h4>
              </Col>
              <Col xs={12} md={6} className="toggle-col">
                <input
                  type="checkbox"
                  id="toggle-autostart"
                  checked={autoStartState}
                  onChange={autostartClickHandler}
                  aria-label="Auto start breaks"
                  className="settings-checkbox"
                />
                <label htmlFor="toggle-autostart" className="toggle-label">
                  {autoStartState ? "Yes" : "No"}
                </label>
              </Col>
            </Row>
          </div>

          <div className="settings-divider" />

          {/* Button Sounds Toggle */}
          <div className="settings-section">
            <Row className="settings-row">
              <Col xs={12} md={6}>
                <h4 className="section-title">Button sounds?</h4>
              </Col>
              <Col xs={12} md={6} className="toggle-col">
                <input
                  type="checkbox"
                  id="toggle-buttonsound"
                  checked={buttonSoundState}
                  onChange={buttonSoundClickHandler}
                  aria-label="Button sounds"
                  className="settings-checkbox"
                />
                <label htmlFor="toggle-buttonsound" className="toggle-label">
                  {buttonSoundState ? "Yes" : "No"}
                </label>
              </Col>
            </Row>
          </div>

          <div className="settings-divider" />

          {/* Alarm Sound Dropdown */}
          <div className="settings-section">
            <Row className="settings-row">
              <Col xs={12} md={6}>
                <h4 className="section-title">Alarm Sounds</h4>
              </Col>
              <Col xs={12} md={6} className="dropdown-col">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="custom-sounds"
                    id="dropdown-basic"
                    className="alarm-dropdown"
                  >
                    {alarmSoundState}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => alarmClickHandler("Bell")}>
                      Bell
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => alarmClickHandler("Digital")}>
                      Digital
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => alarmClickHandler("Kitchen")}>
                      Kitchen
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => alarmClickHandler("No Sound")}
                    >
                      No Sound
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </div>

          <div className="settings-divider" />

          {/* Alarm Volume Slider */}
          <div className="settings-section">
            <Row className="settings-row volume-row">
              <Col xs={12} md={4}>
                <h4 className="section-title">Alarm Volume</h4>
              </Col>
              <Col xs={12} md={5} className="slider-col">
                <Slider
                  value={volume}
                  onChange={sliderClickHandler}
                  onClick={sliderClickHandler}
                  aria-label="Alarm Volume"
                />
              </Col>
              <Col xs={12} md={3} className="volume-display-col">
                <h2 className="volume-text">
                  {Math.round((volume || 0) * 100)}
                </h2>
              </Col>
            </Row>
          </div>

          <div className="settings-divider" />

          {/* Restore Defaults Button */}
          <div className="settings-section">
            <Row>
              <Col className="text-center">
                <Button
                  onClick={defaultSettingsClickHandler}
                  variant="outline-light"
                  className="default-settings"
                >
                  Restore Defaults
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Settings;
