import classes from "./Settings.module.css";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useState, useEffect } from "react";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";
import ToggleButton from "react-bootstrap/esm/ToggleButton";

const Settings = () => {
  const [autoBreak, setAutoBreak] = useState(false);
  const [autoStart, setAutoStart] = useState(false);

  const autoBreakButtonHandler = (event) => {
    setAutoBreak(event.currentTarget.checked);
  };

  const autoStartButtonHandler = (event) => {
    setAutoStart(event.currentTarget.checked);
  };

  return (
    <Container className={classes.container}>
      <div className={classes.card}>
        <Row>
          <Col>
            <h4 className={classes.card_text}>SETTINGS</h4>
          </Col>
          <Col className={classes.align_right}>
            <Link to="/pomodor">CLOSE</Link>
          </Col>
        </Row>
        <div className={classes.divider}></div>
        <div className={classes.spacer_small}></div>
        <h4 className={classes.card_text}>Time (minutes)</h4>
        <Row>
          <Col className={classes.card_text}>
            <p className={classes.card_text && classes.align_center}>
              Pomodoro
            </p>
            <div className={classes.card_time}>
              <h4 className={classes.time_text}>25:00</h4>
            </div>
          </Col>
          <Col className={classes.card_text}>
            <p className={classes.card_text && classes.align_center}>
              Short Break
            </p>
            <div className={classes.card_time}>
              <h4 className={classes.time_text}>5:00</h4>
            </div>
          </Col>
          <Col className={classes.card_text}>
            <p className={classes.card_text && classes.align_center}>
              Long Break
            </p>
            <div className={classes.card_time}>
              <h4 className={classes.time_text}>15:00</h4>
            </div>
          </Col>
          <div className={classes.spacer}></div>
        </Row>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Auto start Breaks?</h4>
        <ButtonGroup className="mb-2">
          <ToggleButton
            id="toggle-check"
            type="checkbox"
            variant="outline-secondary"
            checked={autoBreak}
            value="1"
            onChange={autoBreakButtonHandler}
          >
            {!autoBreak && "No"}
            {autoBreak && "Yes"}
          </ToggleButton>
        </ButtonGroup>
        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Auto start Pomodoros?</h4>
        <ButtonGroup className="mb-2">
          <ToggleButton
            id="toggle-check2"
            type="checkbox"
            variant="outline-secondary"
            checked={autoStart}
            value="1"
            onChange={autoStartButtonHandler}
          >
            {!autoStart && "No"}
            {autoStart && "Yes"}
          </ToggleButton>
        </ButtonGroup>

        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>
        <h4 className={classes.card_text}>Long Break interval?</h4>
        <div className={classes.spacer_small}></div>

        <div className={classes.divider}></div>
        <div className={classes.spacer}></div>

        <Row>
          <Col className={classes.align_right}>
            <Button variant="outline-secondary" className={classes.btn_save}>
              Save
            </Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default Settings;
