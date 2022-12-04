import classes from "./SecondaryButtons.module.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { useSelector, useDispatch } from "react-redux";

import { timerMode } from "../store/settingsSlice";

const SecondaryButtons = ({ timeChange, valueChange }) => {
  const pomoTime = useSelector((state) => state.settings.pomodoro);
  const shortTime = useSelector((state) => state.settings.short);
  const longTime = useSelector((state) => state.settings.long);
  const timeMode = useSelector((state) => state.settings.timermode);

  const dispatch = useDispatch();

  function handleClick(props) {
    timeChange(props.target.name);
    valueChange(props.target.value);
    // activeChange(props.target.id);

    dispatch(timerMode(props.target.id));
  }

  return (
    <div className={classes.container}>
      <Container>
        <Row>
          <Col sm={3}>
            <button
              value={`${pomoTime}:00`}
              id={1}
              name={"Pomodoro"} //using name attribute to hold timer value
              className={
                timeMode === 1
                  ? `${classes.btn_background_pomodoro}`
                  : `${classes.btn_secondary}`
              }
              onClick={handleClick}
            >
              Pomodoro
            </button>
          </Col>
          <Col>
            <div className={classes.button_spacer}></div>
          </Col>
          <Col sm={3}>
            <button
              value={`${shortTime}:00`}
              id={2}
              name={"Short Break"} //using name attribute to hold timer value
              className={
                timeMode === 2
                  ? `${classes.btn_background_short}`
                  : `${classes.btn_secondary}`
              }
              onClick={handleClick}
            >
              Short Break
            </button>
          </Col>
          <Col>
            <div className={classes.button_spacer} />
          </Col>
          <Col sm={3}>
            <button
              value={`${longTime}:00`}
              id={3}
              name={"Long Break"}
              className={
                timeMode === 3
                  ? `${classes.btn_background_long}`
                  : `${classes.btn_secondary}`
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
