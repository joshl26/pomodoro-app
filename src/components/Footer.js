import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className={classes.container}>
          <h1 className={classes.footer_text}>
            Copyright{" "}
            <a className={classes.footer_link} href="http://joshlehman.ca">
              Josh Lehman
            </a>
          </h1>
        </div>
      </footer>
    </>
  );
};

export default Footer;
