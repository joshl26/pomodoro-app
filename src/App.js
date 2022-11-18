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
        <Timer activeChange={setActiveHandler} />
      </div>
    </div>
  );
}

export default App;
