import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";

const logoLink = "/";

const Header = () => {
  return (
    <header className={classes.container}>
      <div className={classes.content}>
        <a href={logoLink} className={classes.logo_link}>
          <img className={classes.logo_image} src={logoImage} />
          <h1 className={classes.logo_text}>Pomofocus Clone</h1>
        </a>
        <ul className={classes.nav}></ul>
      </div>
    </header>
  );
};

export default Header;
