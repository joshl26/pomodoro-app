import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";
import chartIcon from "../assets/bar-chart.svg";
import settingsIcon from "../assets/settings.svg";
import loginIcon from "../assets/login.svg";

const logoLink = "#";

const Header = () => {
  return (
    <header className={classes.container}>
      <div className={classes.content}>
        <a href={logoLink} className={classes.logo_link}>
          <img className={classes.logo_image} src={logoImage} />
          <h1 className={classes.logo_text}>Pomofocus Clone</h1>
        </a>
        <ul className={classes.nav}>
          <li className={classes.nav_list}>
            <a href={logoLink}>
              <button>
                <span>
                  <img className={classes.chart_icon} src={chartIcon} />
                </span>
              </button>
            </a>
          </li>
          <li>
            <a href={logoLink}>
              <button>
                <span>
                  <img className={classes.chart_icon} src={settingsIcon} />
                </span>
              </button>
            </a>
          </li>
          <li>
            <a href={logoLink}>
              <button>
                <span>
                  <img className={classes.chart_icon} src={loginIcon} />
                </span>
              </button>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
