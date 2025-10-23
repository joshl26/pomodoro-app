import React from "react";
import logoImage from "../images/tomato.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./ResponsiveHeader.css";
import { Link } from "react-router-dom";
import { Col } from "react-bootstrap";

/**
 * Responsive navigation header component
 * Updated for React Router v6 - uses basename="/pomodor" so paths are relative
 */
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
        {/* v6 change: /pomodor/ → / (basename handles prefix) */}
        <Navbar.Brand as={Link} to="/">
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
          {/* v6 change: All routes updated to remove /pomodor prefix */}
          <Nav defaultActiveKey="/">
            <Nav.Link id="home-nav" as={Link} eventKey="/" to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} eventKey="/help" to="/help">
              Help
            </Nav.Link>
            <Nav.Link as={Link} eventKey="/login" to="/login">
              Login
            </Nav.Link>
            <Nav.Link as={Link} eventKey="/report" to="/report">
              Charts
            </Nav.Link>
            <Nav.Link as={Link} eventKey="/settings" to="/settings">
              Settings
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default ResponsiveHeader;
