import { useSelector, useDispatch } from "react-redux";
import { timerMode, setCurrentTime } from "../store/settingsSlice";
import { Row, Col, Container } from "react-bootstrap";
import "./SecondaryButtons.css";

const SecondaryButtons = () => {
  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const timeMode = useSelector((state) => state.settings.timermode);
  const autoBreak = useSelector((state) => state.settings.autobreak);
  const timerEnabled = useSelector((state) => state.settings.timerenabled);

  const dispatch = useDispatch();

  function handleClick(props) {
    if ((autoBreak === false) & (timerEnabled === false)) {
      dispatch(timerMode(Number(props.target.id)));
      dispatch(setCurrentTime());
    }
  }

  return (
    <div className="container">
      <Container>
        <Row>
          <Col sm={4}>
            <button
              value={`${pomoTime}:00`}
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
              value={`${shortTime}:00`}
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
              value={`${longTime}:00`}
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
