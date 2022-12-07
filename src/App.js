import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import classes from "./App.module.css";

import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Report from "./components/Report";
import Login from "./components/Login";
import Help from "./components/Help";

function App() {
  const timerMode = useSelector((state) => state.settings.timermode);

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
          <Route path="/pomodor" exact>
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
