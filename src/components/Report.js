import { Container, Row } from "react-bootstrap";
import classes from "./Report.module.css";

const Report = () => {
  return (
    <Container className={classes.align_center}>
      <Row>
        <h1>REPORTS</h1>
      </Row>
      <br />
      <br />
      <br />
      <br />
      <br />

      <Row>
        <h1>Development in progress</h1>
        <h3>Feature to be included in future release</h3>
      </Row>
    </Container>
  );
};

export default Report;
