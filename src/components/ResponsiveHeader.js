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
        {/* <Container>
          <Navbar.Brand>
            <Link className={classes.link} to="/pomodor">
              <div className={classes.align_left}>
                <img
                  alt="Pomofocus App Icon"
                  className={classes.logo_image}
                  src={logoImage}
                />
                <h1 className={classes.logo_text}>Pomofocus Clone</h1>
              </div>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <Link to="/pomodor/report">
                <button className={classes.button}>
                  <span className={classes.chart_icon}>
                    <img
                      alt="Report Icon"
                      className={classes.chart_icon}
                      src={chartIcon}
                    />
                  </span>
                </button>
              </Link>
              <h4>Report</h4>
              <Link to="/pomodor/settings">
                <button className={classes.button}>
                  <span className={classes.chart_icon}>
                    <img
                      alt="Settings Icon"
                      className={classes.chart_icon}
                      src={settingsIcon}
                    />
                  </span>
                </button>
              </Link>
              <h4>Settings</h4>
              <Link to="/pomodor/login">
                <button className={classes.button}>
                  <span className={classes.chart_icon}>
                    <img
                      alt="Login Icon"
                      className={classes.chart_icon}
                      src={loginIcon}
                    />
                  </span>
                </button>
              </Link>
              <h4>Login</h4>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar
        className={classes.nav_bar}
        collapseOnSelect
        expand="lg"
        bg=""
        variant="dark"
      > */}
        <Container>
          <Link className={classes.link} to="/pomodor/">
            <div className={classes.align_left}>
              <img
                alt="Pomofocus App Icon"
                className={classes.logo_image}
                src={logoImage}
              />
              <h1 className={classes.logo_text}>Pomodoro Timer</h1>
            </div>
          </Link>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto"></Nav>
            <Nav defaultActiveKey="/pomodor/">
              <Nav.Link as={Link} eventKey="/pomodor/" to="/pomodor/">
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                eventKey="/pomodor/login/"
                to="/pomodor/login/"
              >
                Login
              </Nav.Link>
              <Nav.Link
                as={Link}
                eventKey="/pomodor/report/"
                to="/pomodor/report/"
              >
                Charts
              </Nav.Link>
              <Nav.Link
                as={Link}
                eventKey="/pomodor/settings/"
                to="/pomodor/settings/"
              >
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
