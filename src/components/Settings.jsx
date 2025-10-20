// src/components/Settings.jsx
import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Dropdown,
  ToggleButton,
  Button,
} from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
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
 * Settings Component (patched to use the new useAudioManager hook)
 * - preloads sounds (load)
 * - stops previous previews before playing
 * - updates loaded instance volume with setVolume
 * - debounces slider-driven previews
 * - cleans up timers and stops on unmount
 */
const Settings = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // Hook (default export) exposes: play, stop, load, playButtonSound, setVolume, ...
  const { play, stop, playButtonSound, load, setVolume } = useAudioManager();

  const {
    pomodoro: pomodoroCount,
    short: shortCount,
    long: longCount,
    autostart: autoStartState,
    alarmvolume: alarmVolumeState,
    timermode: timerMode,
    alarmsound: alarmSoundState,
    buttonsound: buttonSoundState,
  } = useSelector((state) => state.settings);

  // Ensure volume is always a number
  const [volume, setLocalVolume] = useState(
    typeof alarmVolumeState === "number" ? alarmVolumeState : 0
  );
  const sliderPreviewTimer = useRef(null);

  useEffect(() => {
    setLocalVolume(typeof alarmVolumeState === "number" ? alarmVolumeState : 0);
  }, [alarmVolumeState]);

  // Preload the selected alarm sound when it changes (unless it's "No Sound")
  useEffect(() => {
    if (!load) return;
    if (alarmSoundState && alarmSoundState !== "No Sound") {
      const inst = load(alarmSoundState);
      // ensure the preloaded instance has the stored volume
      if (inst && typeof setVolume === "function") {
        setVolume(alarmSoundState, volume);
      }
    }
  }, [alarmSoundState, load, setVolume, volume]);

  // Preload button sound when button sounds are enabled
  useEffect(() => {
    if (!load) return;
    if (buttonSoundState) {
      load("button");
    }
  }, [buttonSoundState, load]);

  // cleanup on unmount: clear timer and stop any playing sounds
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

  // Play button click sound via audio manager — stop previous button sound first
  const buttonClickSound = useCallback(() => {
    if (!buttonSoundState) return;
    try {
      stop("button");
    } catch {}
    // playButtonSound will respect settings internally
    playButtonSound();
  }, [buttonSoundState, playButtonSound, stop]);

  // Back: persist volume and total seconds, navigate home
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
    history.push("/pomodor/");
  }, [
    volume,
    dispatch,
    buttonClickSound,
    timerMode,
    pomodoroCount,
    shortCount,
    longCount,
    history,
  ]);

  // Auto-start toggle
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

  // Button sound toggle
  const buttonSoundClickHandler = useCallback(() => {
    buttonClickSound();
    dispatch(setButtonSoundState(!buttonSoundState));
  }, [buttonSoundState, dispatch, buttonClickSound]);

  // Alarm selection handler (previews selection). Stop previous preview before playing new.
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
        // stop previous previews
        stop("alarm");
        stop("Bell");
        stop("Digital");
        stop("Kitchen");
        // set instance volume if available then play preview
        if (typeof setVolume === "function") {
          setVolume(selectedSound, volume);
        }
        play(selectedSound, { volume }).catch(() => {});
      }
    },
    [dispatch, buttonClickSound, play, stop, setVolume, volume]
  );

  // Volume slider change: update local state, persist, update live instance volume, debounced preview
  const sliderClickHandler = useCallback(
    (e) => {
      const newVolume = Number(e.target.value);
      setLocalVolume(newVolume);
      dispatch(setAlarmVolume(newVolume));

      // update loaded instance volume without replaying if possible
      if (
        alarmSoundState &&
        alarmSoundState !== "No Sound" &&
        typeof setVolume === "function"
      ) {
        setVolume(alarmSoundState, newVolume);
      }

      // debounced preview (200ms)
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

  // Restore defaults
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

  // Time adjustment buttons (increment/decrement)
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
              if (increment) dispatch(increment());
              dispatch(setCurrentTimeFromMode());
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
              if (decrement) dispatch(decrement());
              dispatch(setCurrentTimeFromMode());
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
