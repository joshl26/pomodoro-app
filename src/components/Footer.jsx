import "./Footer.css";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <h1 className="footer-text">
            Copyright
            <a className="footer-link" href="http://joshlehman.ca">
              {" "}
              Josh Lehman
            </a>
          </h1>
        </div>
      </footer>
    </>
  );
};

export default Footer;
