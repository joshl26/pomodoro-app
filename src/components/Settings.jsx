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

  // // Announce page load to screen readers
  // useEffect(() => {
  //   document.title = "Settings - PomoBreak Timer";
  //   const announcer = document.getElementById("route-announcer");
  //   if (announcer) {
  //     announcer.textContent = "Settings page loaded";
  //   }
  // }, []);

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
            className="time-buttons"
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
            className="time-buttons"
          >
            <FaMinus className="time-change" aria-hidden="true" />
          </Button>
        </Col>
      </Col>
    );
  };

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
            <input
              type="checkbox"
              id="toggle-autostart"
              checked={autoStartState}
              onChange={autostartClickHandler}
              aria-label="Auto start breaks"
            />
            <label htmlFor="toggle-autostart" className="toggle-label">
              {autoStartState ? "Yes" : "No"}
            </label>
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
            <input
              type="checkbox"
              id="toggle-buttonsound"
              checked={buttonSoundState}
              onChange={buttonSoundClickHandler}
              aria-label="Button sounds"
            />
            <label htmlFor="toggle-buttonsound" className="toggle-label">
              {buttonSoundState ? "Yes" : "No"}
            </label>
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
                <Dropdown.Item onClick={() => alarmClickHandler("Bell")}>
                  Bell
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alarmClickHandler("Digital")}>
                  Digital
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alarmClickHandler("Kitchen")}>
                  Kitchen
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alarmClickHandler("No Sound")}>
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
              value={volume}
              onChange={sliderClickHandler}
              onClick={sliderClickHandler}
              aria-label="Alarm Volume"
            />
          </Col>
          <Col xs={12} md={4}>
            <h2>{Math.round((volume || 0) * 100)}</h2>
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
