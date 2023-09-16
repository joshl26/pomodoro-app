// import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";
// import chartIcon from "../assets/bar-chart.svg";
// import settingsIcon from "../assets/settings.svg";
// import loginIcon from "../assets/login.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./ResponsiveHeader.css";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const ResponsiveHeader = () => {
  return (
    <header>
      <Navbar
        className="nav-bar"
        sticky="top"
        collapseOnSelect
        expand="lg"
        bg=""
        variant="dark"
      >
        <Container className="header-container">
          <Row className="header-row">
            <Col md={3}>
              <Link className="link" to="/pomodor/">
                <div className="align-left">
                  <img
                    alt="Pomofocus App Icon"
                    className="logo-image"
                    src={logoImage}
                  />
                  <h1 className="logo-text">PomoBreak</h1>
                </div>
              </Link>
            </Col>
            <Col></Col>
            <Col>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto"></Nav>
                <Nav defaultActiveKey="/pomodor/">
                  <Nav.Link
                    id="home-nav"
                    as={Link}
                    eventKey="/pomodor/"
                    to="/pomodor/"
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    eventKey="/pomodor/help"
                    to="/pomodor/help"
                  >
                    Help
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    eventKey="/pomodor/login"
                    to="/pomodor/login"
                  >
                    Login
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    eventKey="/pomodor/report"
                    to="/pomodor/report"
                  >
                    Charts
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    eventKey="/pomodor/settings"
                    to="/pomodor/settings"
                  >
                    Settings
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Col>
          </Row>
        </Container>
      </Navbar>
    </header>
  );
};

export default ResponsiveHeader;
