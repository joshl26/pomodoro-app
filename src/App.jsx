import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import { useEffect } from "react";

import classes from "./App.module.css";

import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Report from "./components/Report";
import Login from "./components/Login";
import Help from "./components/Help";

function getFaviconEl() {
  return document.getElementById("favicon");
}

function App() {
  const timerMode = useSelector((state) => state.settings.timermode);

  if (Number(timerMode) === 1) {
    const favicon = getFaviconEl();
    favicon.href =
      "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
  }

  if (Number(timerMode) === 2) {
    const favicon = getFaviconEl();
    favicon.href =
      "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/short/favicon.ico";
  }

  if (Number(timerMode) === 3) {
    const favicon = getFaviconEl();
    favicon.href =
      "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/long/favicon.ico";
  }

  useEffect(() => {
    const favicon = getFaviconEl();
    favicon.href =
      "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
  }, []);

  const activeClass =
    `${Number(timerMode) === 1 ? `${classes.pomodoro}` : ``}` +
    `${Number(timerMode) === 2 ? `${classes.short}` : ``}` +
    `${Number(timerMode) === 3 ? `${classes.long}` : ``}`;

  return (
    <div className={activeClass}>
      <div className={classes.spacer_small} />
      <ResponsiveHeader />
      <div className={classes.content}>
        <div className={classes.spacer_small} />
        <Switch>
          <Route path="/pomodor/" exact>
            <Timer />
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
          <Route path="/pomodor/help">
            <Help />
          </Route>
        </Switch>
      </div>
      <div className={classes.spacer_small} />
      <Footer />
    </div>
  );
}

export default App;
