// import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";
// import chartIcon from "../assets/bar-chart.svg";
// import settingsIcon from "../assets/settings.svg";
// import loginIcon from "../assets/login.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./ResponsiveHeader.module.css";
import { Link } from "react-router-dom";

const ResponsiveHeader = () => {
  return (
    <header>
      <Navbar
        className={classes.nav_bar}
        sticky="top"
        collapseOnSelect
        expand="lg"
        bg=""
        variant="dark"
      >
        <Container>
          <Link className={classes.link} to="/pomodor/">
            <div className={classes.align_left}>
              <img
                alt="Pomofocus App Icon"
                className={classes.logo_image}
                src={logoImage}
              />
              <h1 className={classes.logo_text}>PomoBreak</h1>
            </div>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav defaultActiveKey="/">
              <Nav.Link id="home_nav" as={Link} eventKey="/" to="/">
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
        </Container>
      </Navbar>
    </header>
  );
};

export default ResponsiveHeader;
