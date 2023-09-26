import { useDispatch } from "react-redux";
import {
  setTimerMode,
  setCurrentTime,
  setSecondsLeft,
  setTotalSeconds,
  setCyclePaused,
} from "../store/settingsSlice";
import { Row, Col, Container } from "react-bootstrap";
import { player } from "../utilities/util";
import TimerStepSound from "../assets/sounds/step-sound.mp3";
import "./SecondaryButtons.css";

const SecondaryButtons = ({
  autoStartState,
  isRunning,
  pomoTime,
  timerMode,
  shortTime,
  longTime,
  updateExpiryTimestamp,
}) => {
  const dispatch = useDispatch();

  function handleClick(event) {
    if (timerMode !== Number(event.target.id)) {
      player({
        asset: TimerStepSound,
        volume: 0.5,
        loop: false,
      }).play();
      if ((autoStartState === false) & (isRunning === false)) {
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
              value={pomoTime}
              id={1}
              name={"Pomodoro"}
              className={
                Number(timerMode) === 1
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
              value={shortTime}
              id={2}
              name={"Short Break"}
              className={
                Number(timerMode) === 2
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
              value={longTime}
              id={3}
              name={"Long Break"}
              className={
                Number(timerMode) === 3
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
