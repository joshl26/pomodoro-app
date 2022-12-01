import classes from "./Settings.module.css";
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Link } from "react-router-dom";

const Settings = () => {
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
        <h4 className={classes.card_text}>Time (minutes) </h4>

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
        </Row>
      </div>
    </Container>
  );
};

export default Settings;
