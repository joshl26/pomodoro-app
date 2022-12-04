// import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";
import chartIcon from "../assets/bar-chart.svg";
import settingsIcon from "../assets/settings.svg";
import loginIcon from "../assets/login.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./ResponsiveHeader.module.css";
import { Link } from "react-router-dom";
import Row from "react-bootstrap";
import Col from "react-bootstrap";

const linkSettings = "/settings";
const linkReport = "/report";
const linkLogin = "/login";

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
            <Nav className="me-auto"></Nav>
            <Nav>
              <Nav.Link>
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
              </Nav.Link>
              <Nav.Link>
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
              </Nav.Link>
              <Nav.Link>
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
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default ResponsiveHeader;
