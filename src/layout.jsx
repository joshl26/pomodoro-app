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

  // Update favicon based on timer mode
  useEffect(() => {
    const favicon = getFaviconEl();
    if (!favicon) return;

    let faviconUrl;
    switch (Number(timerMode)) {
      case 1: // Pomodoro
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
        break;
      case 2: // Short break
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/short/favicon.ico";
        break;
      case 3: // Long break
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/long/favicon.ico";
        break;
      default:
        faviconUrl =
          "https://raw.githubusercontent.com/joshl26/pomodoro-app/master/src/assets/favicons/pomo/favicon.ico";
    }

    favicon.href = faviconUrl;
  }, [timerMode]);

  // Set initial favicon
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
    <div className={activeClass}>
      <div className="spacer_small" />
      <ResponsiveHeader />
      <div className="spacer_small"></div>
      <Container>
        <Progress percent={percentComplete} />
      </Container>
      <div className="spacer_small"></div>
      <Container className="content">
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
      </Container>
      <div className="spacer_small" />
      <Footer />
    </div>
  );
}

export default App;
