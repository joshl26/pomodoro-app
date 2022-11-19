import classes from "./App.module.css";
import Header from "./components/Header";
import Timer from "./components/Timer";

import { useState } from "react";

function App() {
  const [active, setActive] = useState("1");

  const setActiveHandler = (props) => {
    setActive(props);
    console.log("Top level" + props);
  };

  const setCountdownHandler = (props) => {
    console.log(props);
  };

  return (
    <div
      className={
        `${active === "1" ? `${classes.pomodoro}` : `${""}`}` +
        `${active === "2" ? `${classes.short}` : `${""}`}` +
        `${active === "3" ? `${classes.long}` : `${""}`}`
      }
    >
      <Header />
      <div className={classes.content}>
        <div className={classes.spacer} />
        <Timer
          activeChange={setActiveHandler}
          countdownChange={setCountdownHandler}
        />
      </div>
      <h1 className={classes.message}>BEST VIEWED ON LARGER SCREEN</h1>
      <h1 className={classes.message}>RESPONSIVE STYLING TODO</h1>
    </div>
  );
}

export default App;
