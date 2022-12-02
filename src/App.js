import classes from "./App.module.css";
import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";

import { Route, Switch, Redirect } from "react-router-dom";

import { useState } from "react";
import Settings from "./components/Settings";
import Report from "./components/Report";
import Login from "./components/Login";

import { Counter } from "./features/counter/Counter";

function App() {
  const [active, setActive] = useState("1");

  const setActiveHandler = (props) => {
    setActive(props);
    // console.log("Top level" + props);
  };

  const setCountdownHandler = (props) => {
    // console.log(props);
  };

  const activeClass =
    `${active === "1" ? `${classes.pomodoro}` : ``}` +
    `${active === "2" ? `${classes.short}` : ``}` +
    `${active === "3" ? `${classes.long}` : ``}`;

  return (
    <div className={activeClass}>
      <div className={classes.spacer_small} />
      <ResponsiveHeader />
      <Counter />
      <div className={classes.content}>
        <div className={classes.spacer_small} />
        <Switch>
          <Route path="/pomodor" exact>
            <Timer
              activeChange={setActiveHandler}
              countdownChange={setCountdownHandler}
            />
          </Route>
          <Route path="/pomodor/settings">
            <Settings />
          </Route>
          <Route path="/pomodor/report">
            <Report />
          </Route>
          <Route path="/pomodor/login">
            <Login />
          </Route>
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

export default App;
