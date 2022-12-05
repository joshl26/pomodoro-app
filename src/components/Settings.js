import "./Settings.css";
import classes from "./Settings.module.css";

import { Container } from "react-bootstrap";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ToggleButton from "react-bootstrap/esm/ToggleButton";

import { useSelector, useDispatch } from "react-redux";
import {
  pomoIncrement,
  pomoDecrement,
  shortIncrement,
  shortDecrement,
  longIncrement,
  longDecrement,
  autoBreak,
  setCurrentTime,
  setDefault,
} from "../store/settingsSlice";

const Settings = () => {
  const pomodoroCount = useSelector((state) => state.settings.pomodoro);
  const shortCount = useSelector((state) => state.settings.short);
  const longCount = useSelector((state) => state.settings.long);
  const autoBreakBool = useSelector((state) => state.settings.autobreak);
  const dispatch = useDispatch();

  return (
    <Container className={classes.container}>
      <div className={classes.card}>
        <Row>
          <Col>
            <h4 className={classes.card_text}>SETTINGS</h4>
          </Col>
          <Col className={classes.align_right}>
            <Link
              onClick={() => {
                dispatch(setCurrentTime());
              }}
              to="/pomodor"
            >
              <Button variant="outline-secondary" className={classes.btn_save}>
                Save
              </Button>
            </Link>
          </Col>
        </Row>
        <div className={classes.spacer_small}></div>

        <div className={classes.divider}></div>
        <div className={classes.spacer_small}></div>
        <h4 className={classes.card_text}>Time (minutes)</h4>
        <Row>
          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Pomodoro</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{pomodoroCount}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button
                    onClick={() => dispatch(pomoIncrement())}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={() => dispatch(pomoDecrement())}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>-</h4>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>
          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Short Break</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{shortCount}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button
                    onClick={() => dispatch(shortIncrement())}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={() => dispatch(shortDecrement())}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>-</h4>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col md={4} className={classes.card_text}>
            <p className={classes.timer_text}>Long Break</p>
            <Row>
              <Col className={classes.padding_left}>
                <div className={classes.card_time}>
                  <h4 className={classes.time_text}>{longCount}:00</h4>
                </div>
              </Col>
              <Col className={classes.padding_right}>
                <Row>
                  <Button
                    onClick={() => dispatch(longIncrement())}
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>+</h4>
                  </Button>
                </Row>
                <Row>
                  <Button
                    onClick={() => dispatch(longDecrement())}
                    value="negative"
                    variant="custom"
                  >
                    <h4 className={classes.text_increment}>-</h4>
                  </Button>
                </Row>
              </Col>
            </Row>
          </Col>

          <div className={classes.spacer}></div>
        </Row>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Auto start Breaks?</h4>
        <ButtonGroup className="mb-2">
          <ToggleButton
            className="btn_break"
            id="toggle-check"
            type="checkbox"
            variant="outline-secondary"
            checked={autoBreakBool}
            value="1"
            onChange={() => dispatch(autoBreak())}
          >
            {!autoBreakBool && "No"}
            {autoBreakBool && "Yes"}
          </ToggleButton>
        </ButtonGroup>
        {/* <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Auto start Pomodoros?</h4>
        <ButtonGroup className="mb-2">
          <ToggleButton
            className="btn_break"
            id="toggle-check2"
            type="checkbox"
            variant="outline-secondary"
            checked={autoPomoBool}
            value="1"
            onChange={() => dispatch(autoPomo())}
          >
            {!autoPomoBool && "No"}
            {autoPomoBool && "Yes"}
          </ToggleButton>
        </ButtonGroup> */}

        <div className={classes.spacer_small}></div>

        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>

        <Row>
          <Col className={classes.align_center}>
            <Button
              onClick={() => {
                dispatch(setDefault());
              }}
              variant="outline-secondary"
              className="btn_save"
            >
              Defaults
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Settings;
