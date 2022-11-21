import classes from "./App.module.css";
import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";

import { useState } from "react";

function App() {
  const [active, setActive] = useState("1");

  const setActiveHandler = (props) => {
    setActive(props);
    // console.log("Top level" + props);
  };

  const setCountdownHandler = (props) => {
    // console.log(props);
  };

  return (
    <div
      className={
        `${active === "1" ? `${classes.pomodoro}` : ``}` +
        `${active === "2" ? `${classes.short}` : ``}` +
        `${active === "3" ? `${classes.long}` : ``}`
      }
    >
      <ResponsiveHeader />
      <div className={classes.content}>
        <div className={classes.spacer} />
        <Timer
          activeChange={setActiveHandler}
          countdownChange={setCountdownHandler}
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;
