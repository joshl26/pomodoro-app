import React, { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Report from "./components/Report";
import Login from "./components/Login";
import Help from "./components/Help";
import Progress from "./components/Progress";
import "./layout.css";

function getFaviconEl() {
  return document.getElementById("favicon");
}

function App() {
  const secondsLeftState = useSelector((state) => state.settings.secondsleft);
  const totalSecondsState = useSelector((state) => state.settings.totalseconds);
  const timerMode = useSelector((state) => state.settings.timermode);

  const percentComplete =
    totalSecondsState > 0
      ? ((totalSecondsState - secondsLeftState) / totalSecondsState) * 100
      : 0;

  useEffect(() => {
    const favicon = getFaviconEl();
    if (!favicon) return;

    let faviconUrl;
    switch (Number(timerMode)) {
      case 1:
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
        break;
      case 2:
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/short/favicon.ico";
        break;
      case 3:
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/long/favicon.ico";
        break;
      default:
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
    }

    favicon.href = faviconUrl;
  }, [timerMode]);

  useEffect(() => {
    const favicon = getFaviconEl();
    if (favicon) {
      favicon.href =
        "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
    }
  }, []);

  const activeClass =
    Number(timerMode) === 1
      ? "pomodoro"
      : Number(timerMode) === 2
        ? "short"
        : Number(timerMode) === 3
          ? "long"
          : "pomodoro";

  return (
    <div data-testid="app-root" className={activeClass}>
      <div className="spacer_small" />
      <ResponsiveHeader />
      <div className="spacer_small" />
      <Container>
        <Progress percent={percentComplete} />
      </Container>
      <div className="spacer_small" />
      <Container className="content">
        <Switch>
          <Route path="/pomodor/" exact>
            <div data-testid="timer">
              <Timer />
            </div>
          </Route>
          <Route path="/pomodor/settings">
            <div data-testid="settings">
              <Settings />
            </div>
          </Route>
          <Route path="/pomodor/report">
            <div data-testid="report">
              <Report />
            </div>
          </Route>
          <Route path="/pomodor/login">
            <div data-testid="login">
              <Login />
            </div>
          </Route>
          <Route path="/pomodor/help">
            <div data-testid="help">
              <Help />
            </div>
          </Route>
        </Switch>
      </Container>
      <div className="spacer_small" />
      <Footer />
    </div>
  );
}

export default App;
