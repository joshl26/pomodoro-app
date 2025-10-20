import { useEffect, useCallback, useState } from "react";
import { Container, Row, Col, Dropdown, ToggleButton, Button } from "react-bootstrap";
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
import { useAudioManager } from "../hooks/useAudioManager";
import "./Settings.css";

/**
 * Settings Component
 * Uses custom AudioManager via useAudioManager hook for all audio previews / clicks.
 * Preloads currently selected alarm sound and button sound when relevant settings change
 * to reduce playback latency.
 */
const Settings = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  // include load to preload assets
  const { play, stop, playButtonSound, load } = useAudioManager();

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

  const [volume, setVolume] = useState(alarmVolumeState);

  useEffect(() => {
    setVolume(alarmVolumeState);
  }, [alarmVolumeState]);

  // Preload the selected alarm sound when it changes (unless it's "No Sound")
  useEffect(() => {
    if (!load) return;
    if (alarmSoundState && alarmSoundState !== "No Sound") {
      load(alarmSoundState);
    }
  }, [alarmSoundState, load]);

  // Preload button sound when button sounds are enabled
  useEffect(() => {
    if (!load) return;
    if (buttonSoundState) {
      load("button");
    }
  }, [buttonSoundState, load]);

  // Optional: preload a small set of frequently-used sounds once on mount
  // uncomment if you'd like to warm up all sounds up front
  // useEffect(() => {
  //   if (!load) return;
  //   ["button", "Bell", "Digital", "Kitchen", "tick"].forEach((name) => load(name));
  // }, [load]);

  // Play button click sound via audio manager
  const buttonClickSound = useCallback(() => {
    if (buttonSoundState) {
      playButtonSound();
    }
  }, [buttonSoundState, playButtonSound]);

  // Back: persist volume and total seconds, navigate home
  const backClickHandler = useCallback(() => {
    dispatch(setAlarmVolume(volume));
    buttonClickSound();

    const modeToSecondsMap = {
      1: pomodoroCount * 60,
      2: shortCount * 60,
      3: longCount * 60,
    };

    dispatch(setTotalSeconds(modeToSecondsMap[timerMode] || pomodoroCount * 60));
    history.push("/pomodor/");
  }, [volume, dispatch, buttonClickSound, timerMode, pomodoroCount, shortCount, longCount, history]);

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

  // Alarm selection handler (previews selection)
  const alarmClickHandler = useCallback(
    (selectedSound) => {
      buttonClickSound();
      dispatch(setAlarmSound(selectedSound));

      if (selectedSound === "No Sound") {
        dispatch(setAlarmState(false));
        // stop any alarm preview if playing
        stop("alarm");
        stop("Bell");
        stop("Digital");
        stop("Kitchen");
      } else {
        dispatch(setAlarmState(true));
        // preview the selected sound using the audio manager
        // use current local volume for the preview
        play(selectedSound, { volume });
      }
    },
    [dispatch, buttonClickSound, play, stop, volume]
  );

  // Volume slider change: update local state, persist, preview current alarm sound
  const sliderClickHandler = useCallback(
    (e) => {
      const newVolume = Number(e.target.value);
      setVolume(newVolume);
      dispatch(setAlarmVolume(newVolume));

      // preview currently selected alarm (if any and not "No Sound")
      if (alarmSoundState && alarmSoundState !== "No Sound") {
        play(alarmSoundState, { volume: newVolume });
      }
    },
    [alarmSoundState, dispatch, play]
  );

  // Restore defaults
  const defaultSettingsClickHandler = useCallback(() => {
    buttonClickSound();
    const defaultVol = 0.5;
    setVolume(defaultVol);
    dispatch(setDefault());
    // Ensure the slice volume is also set to our default (slice may or may not set it)
    dispatch(setAlarmVolume(defaultVol));
  }, [dispatch, buttonClickSound]);

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
            <p className="card-text align-right">Tip: Click back to save your changes</p>
          </Col>
          <Col xs={12} className="align-right">
            <Link to="/pomodor/">
              <Button id="back-btn" onClick={backClickHandler} variant="outline-light" className="btn-back">
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
                <Dropdown.Item onClick={() => alarmClickHandler("Bell")}>Bell</Dropdown.Item>
                <Dropdown.Item onClick={() => alarmClickHandler("Digital")}>Digital</Dropdown.Item>
                <Dropdown.Item onClick={() => alarmClickHandler("Kitchen")}>Kitchen</Dropdown.Item>
                <Dropdown.Item onClick={() => alarmClickHandler("No Sound")}>No Sound</Dropdown.Item>
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
            <Slider value={volume} onChange={sliderClickHandler} onClick={sliderClickHandler} />
          </Col>
          <Col xs={12} md={4}>
            <h2>{Math.round(volume * 100)}</h2>
          </Col>
        </Row>

        <div className="divider" />
        <div className="spacer" />

        {/* Restore Defaults Button */}
        <Row>
          <Col className="align-center">
            <Button onClick={defaultSettingsClickHandler} variant="outline-light" className="default-settings">
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