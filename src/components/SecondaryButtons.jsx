import { useDispatch } from "react-redux";
import {
  setTimerMode,
  setCurrentTime,
  setSecondsLeft,
  setTotalSeconds,
  setCyclePaused,
} from "../store/settingsSlice";
import { Row, Col } from "react-bootstrap";
import TimerStepSound from "../assets/sounds/step-sound.mp3";
import "./SecondaryButtons.css";
import { useAudioPlayer } from "react-use-audio-player";

const SecondaryButtons = ({
  autoStartState,
  isRunning,
  pomoTimeState,
  timerModeState,
  shortTimeState,
  longTimeState,
  updateExpiryTimestamp,
  alarmVolume,
  buttonSoundState,
}) => {
  const dispatch = useDispatch();

  const {
    // play: playAudio,
    // pause: pauseAudio,
    // stop: stopAudio,
    // playing: isPlaying,
    load: loadAudio,
  } = useAudioPlayer();

  function handleClick(event) {
    // Normalize target access
    const target = event.currentTarget || event.target;
    const modeId = Number(target.id);
    const value = Number(target.value);

    if (timerModeState !== modeId && !isRunning) {
      if (buttonSoundState) {
        loadAudio(TimerStepSound, {
          autoplay: true,
          initialVolume: alarmVolume,
        });
      }

      if (autoStartState === false && isRunning === false) {
        dispatch(setCyclePaused(false));
        dispatch(setTimerMode(modeId));
        dispatch(setCurrentTime());
        dispatch(setSecondsLeft(value * 60));
        dispatch(setTotalSeconds(value * 60));
        updateExpiryTimestamp(value);
      }
    }
  }

  return (
    <div className="container">
      <Row className="secondary-btn-row">
        <Col sm={4} md={4}>
          <button
            value={pomoTimeState}
            id={1}
            name={"Pomodoro"}
            className={
              Number(timerModeState) === 1
                ? `btn-background-pomodoro`
                : `btn-secondary`
            }
            onClick={handleClick}
          >
            Pomodoro
          </button>
        </Col>
        <Col sm={4} md={4}>
          <button
            value={shortTimeState}
            id={2}
            name={"Short Break"}
            className={
              Number(timerModeState) === 2
                ? `btn-background-short`
                : `btn-secondary`
            }
            onClick={handleClick}
          >
            Short Break
          </button>
        </Col>
        <Col sm={4} md={4}>
          <button
            value={longTimeState}
            id={3}
            name={"Long Break"}
            className={
              Number(timerModeState) === 3
                ? `btn-background-long`
                : `btn-secondary`
            }
            onClick={handleClick}
          >
            Long Break
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default SecondaryButtons;
