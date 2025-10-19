import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";
import Settings from "./components/Settings";
import Report from "./components/Report";
import Login from "./components/Login";
import Help from "./components/Help";
import Progress from "./components/Progress";
import "./App.css";

function getFaviconEl() {
  return document.getElementById("favicon");
}

function App() {
  const secondsLeftState = useSelector((state) => state.settings.secondsleft);
  const totalSecondsState = useSelector((state) => state.settings.totalseconds);

  const percentComplete =
    ((totalSecondsState - secondsLeftState) / totalSecondsState) * 100;

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
    `${Number(timerMode) === 1 ? `pomodoro` : ``}` +
    `${Number(timerMode) === 2 ? `short` : ``}` +
    `${Number(timerMode) === 3 ? `long` : ``}`;

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
