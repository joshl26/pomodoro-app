import React, { useEffect, useMemo, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom"; // v6 change: Switch → Routes
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

// Lazy load heavy components (Phase 4.2: Code Splitting)
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

/**
 * Loading fallback component for lazy-loaded routes
 * Shows a centered loading message while chunks are being fetched
 */
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
    aria-label="Loading content"
  >
    <div>Loading...</div>
  </div>
);

// Favicon paths for different timer modes
const FAVICON_PATHS = {
  1: "/favicons/pomo/favicon.ico",
  2: "/favicons/short/favicon.ico",
  3: "/favicons/long/favicon.ico",
};

/**
 * Gets the favicon link element from the document
 * @returns {HTMLLinkElement | null}
 */
function getFaviconEl() {
  return document.getElementById("favicon");
}

/**
 * Main application layout component
 * Handles routing, favicon updates, and global layout structure
 */
function App() {
  // Use memoized selectors for better performance (Phase 6: Optimization)
  const timerMode = useSelector(selectTimerMode);
  const progress = useSelector(selectProgress);

  // Memoize percent calculation to avoid recalculation on every render
  const percentComplete = useMemo(() => {
    return progress.percent || 0;
  }, [progress.percent]);

  // Memoize active class to avoid recalculation (Phase 6: Avoid recalculation)
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

  // Update favicon based on timer mode
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
          {/* React Router v6: Routes replaces Switch, element prop replaces children */}
          <Routes>
            {/* Home route - no need for 'exact' in v6, it's exact by default */}
            <Route
              path="/"
              element={
                <div data-testid="timer">
                  <Timer />
                </div>
              }
            />
            <Route
              path="/settings"
              element={
                <div data-testid="settings">
                  <Settings />
                </div>
              }
            />
            <Route
              path="/report"
              element={
                <div data-testid="report">
                  <Report />
                </div>
              }
            />
            <Route
              path="/login"
              element={
                <div data-testid="login">
                  <Login />
                </div>
              }
            />
            <Route
              path="/help"
              element={
                <div data-testid="help">
                  <Help />
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Container>
      <div className="spacer_small" />
      <Footer />
    </div>
  );
}

export default App;
