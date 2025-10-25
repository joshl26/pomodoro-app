import React, { useEffect, useMemo, lazy, Suspense, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import Timer from "./components/Timer";
import ResponsiveHeader from "./components/ResponsiveHeader";
import Footer from "./components/Footer";
import Progress from "./components/Progress";
import {
  selectTimerMode,
  selectProgress,
  selectSecondsLeftRaw,
  selectTotalSecondsRaw,
} from "./store/selectors/settingsSelectors";
import { mainSiteSchema } from "./utilities/mainSiteSchema";
import "./layout.css";

const Settings = lazy(() => import("./components/Settings"));
const Report = lazy(() => import("./components/Report"));
const Login = lazy(() => import("./components/Login"));
const Help = lazy(() => import("./components/Help"));

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

const FAVICON_PATHS = {
  1: "/pomodor/favicons/pomo/favicon.ico",
  2: "/pomodor/favicons/short/favicon.ico",
  3: "/pomodor/favicons/long/favicon.ico",
};

function getFaviconEl() {
  return document.getElementById("favicon");
}

const faqJsonLd = {
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I customize the timer durations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Visit the Settings page to adjust Pomodoro, short break, and long break lengths.",
      },
    },
    {
      "@type": "Question",
      name: "What does auto-break do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Auto-break automatically switches between work and break timers so you don't have to manually start each session.",
      },
    },
    {
      "@type": "Question",
      name: "Can I disable sounds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can toggle alarm and button sounds in the Settings page.",
      },
    },
    {
      "@type": "Question",
      name: "Is my progress saved?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Your settings and timer states are saved locally in your browser, so they persist between sessions.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this app on mobile devices?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! The app is fully responsive and works well on phones and tablets.",
      },
    },
    {
      "@type": "Question",
      name: "What if I get interrupted during a Pomodoro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can pause or reset the timer. Try to minimize interruptions for best results.",
      },
    },
  ],
};

function SEO({ title, description, jsonLd, canonicalUrl }) {
  return (
    <Helmet key={title}>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {/* Example og:image */}
      <meta property="og:image" content={`${canonicalUrl || ""}og-image.png`} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content={`${canonicalUrl || ""}og-image.png`}
      />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

const BASE_URL = "https://joshlehman.ca/pomodor";

function generateCombinedSchema(siteUrl, includeFAQ = false) {
  const pomodoroNodes = [
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#pomodoro-app`,
      name: "Pomodoro Timer",
      url: siteUrl,
      description: "A productivity timer based on the Pomodoro technique.",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "All",
    },
  ];

  const baseGraph = [...mainSiteSchema["@graph"], ...pomodoroNodes];

  if (!includeFAQ) {
    return {
      "@context": "https://schema.org",
      "@graph": baseGraph,
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [...baseGraph, faqJsonLd],
  };
}

// 404 Not Found Page Component
function NotFound() {
  return (
    <Container
      className="not-found-container"
      style={{ padding: "2rem", textAlign: "center" }}
    >
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </Container>
  );
}

function App() {
  const timerMode = useSelector(selectTimerMode);
  const progress = useSelector(selectProgress);
  const totalSecondsRaw = useSelector(selectTotalSecondsRaw);
  const secondsLeftRaw = useSelector(selectSecondsLeftRaw);
  const location = useLocation();
  const mainContentRef = useRef(null);

  // Calculate progress from timer state, fallback to progress state
  const percentComplete = useMemo(() => {
    // First priority: use progress.percent if available (for tests and manual setting)
    if (progress?.percent !== undefined && progress?.percent !== null) {
      return Number(progress.percent);
    }

    // Second priority: calculate from raw timer values
    const total = Number(totalSecondsRaw);
    const remaining = Number(secondsLeftRaw);

    if (total > 0 && Number.isFinite(total) && Number.isFinite(remaining)) {
      const elapsed = Math.max(0, total - remaining);
      return Math.round(Math.min(100, Math.max(0, (elapsed / total) * 100)));
    }

    return 0;
  }, [progress, totalSecondsRaw, secondsLeftRaw]);

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

  // Announce route changes to screen readers and set document title
  useEffect(() => {
    const routeTitles = {
      "/": "Pomodoro Timer - Boost Your Productivity",
      "/settings": "Settings - Customize Your Pomodoro Timer",
      "/help": "Help - Pomodoro Timer Support and FAQs",
      "/report": "Report - View Your Pomodoro Sessions",
      "/login": "Login - Access Your Pomodoro Account",
      "/404": "404 - Page Not Found",
    };

    // Default to 404 title if path not recognized
    const title = routeTitles[location.pathname] || "404 - Page Not Found";
    document.title = title;

    // Announce to screen readers
    const announcer = document.getElementById("route-announcer");
    if (announcer) {
      announcer.textContent = `Navigated to ${title}`;
    }

    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const favicon = getFaviconEl();
    if (!favicon) return;
    const faviconUrl = FAVICON_PATHS[timerMode] || FAVICON_PATHS[1];
    favicon.href = faviconUrl;
  }, [timerMode]);

  // Accessibility: Move focus to main content on route change
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [location.pathname]);

  const combinedJsonLd = useMemo(
    () => generateCombinedSchema(BASE_URL, location.pathname === "/help"),
    [location.pathname]
  );

  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link" tabIndex={0}>
        Skip to main content
      </a>

      <div data-testid="app-root" className={activeClass}>
        <header role="banner">
          <ResponsiveHeader />
        </header>

        <main
          id="main-content"
          tabIndex={-1}
          ref={mainContentRef}
          role="main"
          aria-live="polite"
        >
          <Container>
            <Progress percent={percentComplete} />
          </Container>
          <Container className="content">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <SEO
                        title="Pomodoro Timer - Boost Your Productivity"
                        description="Use our Pomodoro Timer to manage your work sessions and breaks effectively."
                        canonicalUrl={`${BASE_URL}/`}
                        jsonLd={combinedJsonLd}
                      />
                      <div data-testid="timer">
                        <Timer />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <>
                      <SEO
                        title="Settings - Customize Your Pomodoro Timer"
                        description="Adjust your Pomodoro timer settings to fit your workflow."
                        canonicalUrl={`${BASE_URL}/settings`}
                        jsonLd={{
                          "@context": "https://schema.org",
                          "@type": "WebPage",
                          name: "Settings",
                          url: `${BASE_URL}/settings`,
                          description:
                            "Settings page for customizing the Pomodoro timer.",
                        }}
                      />
                      <div data-testid="settings">
                        <Settings />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <>
                      <SEO
                        title="Report - View Your Pomodoro Sessions"
                        description="Check detailed reports of your Pomodoro timer sessions and productivity."
                        canonicalUrl={`${BASE_URL}/report`}
                        jsonLd={{
                          "@context": "https://schema.org",
                          "@type": "WebPage",
                          name: "Report",
                          url: `${BASE_URL}/report`,
                          description:
                            "Detailed reports of Pomodoro timer sessions and productivity.",
                        }}
                      />
                      <div data-testid="report">
                        <Report />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <>
                      <SEO
                        title="Login - Access Your Pomodoro Account"
                        description="Login to your Pomodoro timer account to sync your sessions and settings."
                        canonicalUrl={`${BASE_URL}/login`}
                        jsonLd={{
                          "@context": "https://schema.org",
                          "@type": "WebPage",
                          name: "Login",
                          url: `${BASE_URL}/login`,
                          description:
                            "Login page for Pomodoro timer account access.",
                        }}
                      />
                      <div data-testid="login">
                        <Login />
                      </div>
                    </>
                  }
                />
                <Route
                  path="/help"
                  element={
                    <>
                      <SEO
                        title="Help - Pomodoro Timer Support and FAQs"
                        description="Find help, FAQs, and support for using the Pomodoro timer app."
                        canonicalUrl={`${BASE_URL}/help`}
                        jsonLd={combinedJsonLd}
                      />
                      <div data-testid="help">
                        <Help />
                      </div>
                    </>
                  }
                />
                {/* Catch-all route for 404 */}
                <Route
                  path="*"
                  element={
                    <>
                      <SEO
                        title="404 - Page Not Found"
                        description="The page you are looking for does not exist."
                        canonicalUrl={`${BASE_URL}/404`}
                        jsonLd={{
                          "@context": "https://schema.org",
                          "@type": "WebPage",
                          name: "404 Not Found",
                          url: `${BASE_URL}/404`,
                          description: "Page not found.",
                        }}
                      />
                      <NotFound />
                    </>
                  }
                />
              </Routes>
            </Suspense>
          </Container>
        </main>

        <footer role="contentinfo">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default App;
