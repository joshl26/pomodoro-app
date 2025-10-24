import React from "react";
import logoImage from "../images/tomato.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation } from "react-router-dom";
import { Col } from "react-bootstrap";
import "./ResponsiveHeader.css";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/help", label: "Help" },
  { to: "/login", label: "Login" },
  { to: "/report", label: "Charts" },
  { to: "/settings", label: "Settings" },
];

/**
 * Responsive navigation header component
 * Updated for React Router v6 - uses basename="/pomodor" so paths are relative
 */
const ResponsiveHeader = () => {
  const location = useLocation();

  return (
    <Container>
      <Navbar
        className="nav-bar"
        sticky="top"
        collapseOnSelect
        expand="lg"
        bg=""
        variant="dark"
        role="navigation"
        aria-label="Primary navigation"
      >
        <Navbar.Brand as={Link} to="/" tabIndex={0} aria-label="PomoBreak Home">
          <Col>
            <div className="align-left">
              <img
                alt="PomoBreak logo - tomato icon"
                className="logo-image"
                src={logoImage}
                width={40}
                height={40}
              />
              <h1 className="logo-text">PomoBreak</h1>
            </div>
          </Col>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="responsive-navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        />
        <Navbar.Collapse
          className="responsive-navbar-nav"
          id="responsive-navbar-nav"
        >
          <Nav className="me-auto" role="menubar" aria-label="Main menu">
            {navLinks.map(({ to, label }) => (
              <Nav.Link
                as={Link}
                to={to}
                key={to}
                eventKey={to}
                aria-current={location.pathname === to ? "page" : undefined}
                role="menuitem"
                tabIndex={0}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
};

export default ResponsiveHeader;
