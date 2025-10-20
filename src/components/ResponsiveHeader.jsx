import React from "react";
import logoImage from "../assets/tomato.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./ResponsiveHeader.css";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";

const ResponsiveHeader = () => {
  return (
    <Container>
      <Navbar
        className="nav-bar"
        sticky="top"
        collapseOnSelect
        expand="lg"
        bg=""
        variant="dark"
      >
        <Navbar.Brand as={Link} to="/pomodor/">
          <Col>
            <div className="align-left">
              <img
                alt="Pomofocus App Icon"
                className="logo-image"
                src={logoImage}
              />
              <h1 className="logo-text">PomoBreak</h1>
            </div>
          </Col>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse
          className="responsive-navbar-nav"
          id="responsive-navbar-nav"
        >
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
            <Nav.Link as={Link} eventKey="/pomodor/help" to="/pomodor/help">
              Help
            </Nav.Link>
            <Nav.Link as={Link} eventKey="/pomodor/login" to="/pomodor/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} eventKey="/pomodor/report" to="/pomodor/report">
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
      </Navbar>
    </Container>
  );
};

export default ResponsiveHeader;
