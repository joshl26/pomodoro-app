import classes from "./Header.module.css";
import logoImage from "../assets/tomato.svg";

const Header = () => {
  return (
    <header className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.logoText}>
          <a>
            <img className={classes.logoImage} src={logoImage} />
            Pomofocus Clone
          </a>
        </h1>
        <p>Header</p>
      </div>
    </header>
  );
};

export default Header;
