import { useDispatch } from "react-redux";
import {
  timerMode,
  setCurrentTime,
  setSecondsLeft,
  setTotalSeconds,
} from "../store/settingsSlice";
import { Row, Col, Container } from "react-bootstrap";
import "./SecondaryButtons.css";

const SecondaryButtons = ({
  autoBreakState,
  timerEnabled,
  pomoTime,
  timeMode,
  shortTime,
  longTime,
  updateExpiryTimestamp,
}) => {
  const dispatch = useDispatch();

  function handleClick(event) {
    if ((autoBreakState === false) & (timerEnabled === false)) {
      dispatch(timerMode(Number(event.target.id)));
      dispatch(setCurrentTime());
      dispatch(setSecondsLeft(event.target.value * 60));
      dispatch(setTotalSeconds(event.target.value * 60));
      updateExpiryTimestamp(event.target.value);
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
                Number(timeMode) === 1
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
                Number(timeMode) === 2
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
                Number(timeMode) === 3 ? `btn-background-long` : `btn-secondary`
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
