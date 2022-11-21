// import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";
import chartIcon from "../assets/bar-chart.svg";
import settingsIcon from "../assets/settings.svg";
import loginIcon from "../assets/login.svg";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import classes from "./ResponsiveHeader.module.css";

const linkSettings = "/settings";
const linkReport = "/report";
const linkLogin = "/login";

const Header = () => {
  return (
    <Navbar
      className={classes.nav_bar}
      sticky="top"
      collapseOnSelect
      expand="lg"
      bg=""
      variant="dark"
    >
      <Container>
        <Navbar.Brand href="/">
          <img
            alt="Pomofocus App Icon"
            className={classes.logo_image}
            src={logoImage}
          />
          <h1 className={classes.logo_text}>Pomofocus Clone</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link href={linkReport}>
              <button>
                <span className={classes.chart_icon}>
                  <img
                    alt="Report Icon"
                    className={classes.chart_icon}
                    src={chartIcon}
                  />
                </span>
              </button>
            </Nav.Link>
            <Nav.Link href={linkSettings}>
              <button>
                <span className={classes.chart_icon}>
                  <img
                    alt="Settings Icon"
                    className={classes.chart_icon}
                    src={settingsIcon}
                  />
                </span>
              </button>
            </Nav.Link>
            <Nav.Link href={linkLogin}>
              <button>
                <span className={classes.chart_icon}>
                  <img
                    alt="Login Icon"
                    className={classes.chart_icon}
                    src={loginIcon}
                  />
                </span>
              </button>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
