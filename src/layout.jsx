import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";
import Progress from "./components/Progress";
import {
  selectTimerMode,
  selectProgress,
} from "./store/selectors/settingsSelectors";
import "./layout.css";

//test

// Lazy load heavy components (Phase 6: Code Splitting)
// Use dynamic imports with webpackChunkName for better debugging
const Settings = lazy(
  () => import(/* webpackChunkName: "settings" */ "./components/Settings")
);
const Report = lazy(
  () => import(/* webpackChunkName: "report" */ "./components/Report")
);
const Login = lazy(
  () => import(/* webpackChunkName: "login" */ "./components/Login")
);
const Help = lazy(
  () => import(/* webpackChunkName: "help" */ "./components/Help")
);

// Loading fallback component
const LoadingFallback = () => (
  <div
    className="loading-container"
    style={{
      textAlign: "center",
      padding: "2rem",
      minHeight: "200px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div>Loading...</div>
  </div>
);

const FAVICON_PATHS = {
  1: "/favicons/pomo.ico",
  2: "/favicons/short.ico",
  3: "/favicons/long.ico",
};

function getFaviconEl() {
  return document.getElementById("favicon");
}

function App() {
  // Use memoized selectors instead of direct state access (Phase 6: Optimization)
  const timerMode = useSelector(selectTimerMode);
  const progress = useSelector(selectProgress);

  // Memoize percent calculation
  const percentComplete = useMemo(() => {
    return progress.percent || 0;
  }, [progress.percent]);

  // Memoize active class (Phase 6: Avoid recalculation)
  const activeClass = useMemo(() => {
    switch (timerMode) {
      case 1:
        return "pomodoro";
      case 2:
        return "short";
      case 3:
        return "long";
      default:
        return "pomodoro";
    }
  }, [timerMode]);

  // Combine favicon effects into one (Phase 6: Reduce effect overhead)
  useEffect(() => {
    const favicon = getFaviconEl();
    if (!favicon) return;

    // Use local favicon paths for better performance
    const faviconUrl = FAVICON_PATHS[timerMode] || FAVICON_PATHS[1];
    favicon.href = faviconUrl;
  }, [timerMode]);

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
        <Suspense fallback={<LoadingFallback />}>
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
        </Suspense>
      </Container>
      <div className="spacer_small" />
      <Footer />
    </div>
  );
}

export default App;
