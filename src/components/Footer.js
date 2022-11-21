import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className={classes.container}>
          <h1 className={classes.footer_text}>
            Copyright{" "}
            <a href="mailto://joshlehman.dev@gmail.com">Josh Lehman</a>
          </h1>
        </div>
      </footer>
    </>
  );
};

export default Footer;
