import { useDispatch } from "react-redux";
import {
  setTimerMode,
  setCurrentTime,
  setSecondsLeft,
  setTotalSeconds,
  setCyclePaused,
} from "../store/settingsSlice";
import { Row, Col, Container } from "react-bootstrap";
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
    play: playAudio,
    pause: pauseAudio,
    stop: stopAudio,
    playing: isPlaying,
    load: loadAudio,
  } = useAudioPlayer();

  function handleClick(event) {
    if (timerModeState !== Number(event.target.id) && !isRunning) {
      if (buttonSoundState) {
        loadAudio(TimerStepSound, {
          autoplay: true,
          initialVolume: alarmVolume,
        });
      }

      console.log(event.target);

      if (autoStartState === false && isRunning === false) {
        dispatch(setCyclePaused(false));
        dispatch(setTimerMode(Number(event.target.id)));
        dispatch(setCurrentTime());
        dispatch(setSecondsLeft(event.target.value * 60));
        dispatch(setTotalSeconds(event.target.value * 60));
        updateExpiryTimestamp(event.target.value);
      }
    }
  }

  return (
    <div className="container">
      <Container>
        <Row>
          <Col sm={4}>
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
          <Col sm={4}>
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
          <Col sm={4}>
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
      </Container>
    </div>
  );
};

export default SecondaryButtons;
