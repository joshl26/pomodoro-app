import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./utilities/test-utils/renderWithProviders";
import App from "./layout";

beforeAll(() => {
  window.scrollTo = jest.fn();
});

const MockSettings = () => <div data-testid="settings">Mocked Settings</div>;
jest.mock("./components/Settings", () => MockSettings);

describe("App layout", () => {
  const initialState = {
    settings: {
      secondsleft: 30,
      totalseconds: 60,
      current: {
        timermode: 1,
        secondsleft: 30,
        currenttime: null,
        totalseconds: 60,
        autostart: false,
        cyclepaused: false,
        cyclecomplete: false,
        cyclestarted: false,
      },
      timers: { pomodoro: 25, short: 5, long: 15 },
      cycle: {
        sequence: [1, 2, 1, 2, 1, 2, 1, 2, 3],
        counter: 0,
      },
      alarm: {
        volume: 0.5,
        buttonSound: false,
        enabled: false,
        sound: "No Sound",
      },
      progress: { percent: 50 },
    },
  };

  const renderApp = (route, state = initialState) =>
    renderWithProviders(<App />, { preloadedState: state, route });

  afterEach(() => {
    // Clean up Helmet side effects to avoid test pollution
    document.head
      // eslint-disable-next-line testing-library/no-node-access
      .querySelectorAll('link[rel="canonical"]')
      .forEach((el) => el.remove());
    // eslint-disable-next-line testing-library/no-node-access
    document.head.querySelectorAll("title").forEach((el) => el.remove());
    // eslint-disable-next-line testing-library/no-node-access
    document.head.querySelectorAll("meta").forEach((el) => el.remove());
    document.head
      // eslint-disable-next-line testing-library/no-node-access
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((el) => el.remove());
  });

  it("renders with correct active class and progress percent", () => {
    renderApp("/");

    const rootDiv = screen.getByTestId("app-root");
    expect(rootDiv).toHaveClass("pomodoro");

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
  });

  it("updates favicon href based on timerMode", () => {
    const mockFavicon = { href: "" };
    jest.spyOn(document, "getElementById").mockReturnValue(mockFavicon);

    // Render with timerMode 1
    const { unmount } = renderApp("/");

    expect(mockFavicon.href).toContain("/pomodor/favicons/pomo/favicon.ico");

    unmount();

    // Render with timerMode 2
    renderApp("/", {
      ...initialState,
      settings: {
        ...initialState.settings,
        current: { ...initialState.settings.current, timermode: 2 },
      },
    });

    expect(mockFavicon.href).toContain("/pomodor/favicons/short/favicon.ico");

    jest.restoreAllMocks();
  });

  it("sets default favicon for invalid timerMode", () => {
    const mockFavicon = { href: "" };
    jest.spyOn(document, "getElementById").mockReturnValue(mockFavicon);

    const invalidTimerModeState = {
      ...initialState,
      settings: {
        ...initialState.settings,
        current: { ...initialState.settings.current, timermode: 999 },
      },
    };

    renderApp("/", invalidTimerModeState);

    expect(mockFavicon.href).toContain("/pomodor/favicons/pomo/favicon.ico");

    jest.restoreAllMocks();
  });

  it("renders Timer component on / route and sets correct page title", async () => {
    renderApp("/");

    expect(screen.getByTestId("timer")).toBeInTheDocument();

    await waitFor(() => {
      expect(document.title).toBe("Pomodoro Timer - Boost Your Productivity");
    });
  });

  it("renders Settings component on /settings route and sets correct page title", async () => {
    renderApp("/settings");

    await waitFor(() => {
      expect(screen.getByText("Mocked Settings")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(document.title).toBe("Settings - Customize Your Pomodoro Timer");
    });
  });

  it("renders Report component on /report route and sets correct page title", async () => {
    renderApp("/report");

    await waitFor(() => {
      expect(screen.getByTestId("report")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(document.title).toBe("Report - View Your Pomodoro Sessions");
    });
  });

  it("renders Login component on /login route and sets correct page title", async () => {
    renderApp("/login");

    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(document.title).toBe("Login - Access Your Pomodoro Account");
    });
  });

  it("renders Help component on /help route and sets correct page title", async () => {
    renderApp("/help");

    await waitFor(() => {
      expect(screen.getByTestId("help")).toBeInTheDocument();
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(document.title).toBe("Help - Pomodoro Timer Support and FAQs");
    });
  });

  it("renders 404 page on unknown route", async () => {
    renderApp("/unknown");

    expect(screen.getByText(/404 - Page Not Found/i)).toBeInTheDocument();
    expect(document.title).toBe("404 - Page Not Found");

    // Wait for canonical links to appear
    await waitFor(() => {
      // eslint-disable-next-line testing-library/no-node-access
      const canonicalLinks = document.querySelectorAll('link[rel="canonical"]');
      expect(canonicalLinks.length).toBeGreaterThan(0);

      const has404Canonical = Array.from(canonicalLinks).some((link) =>
        link.getAttribute("href").includes("/404")
      );
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(has404Canonical).toBe(true);
    });
  });

  it("applies correct class for short break mode", () => {
    const shortBreakState = {
      ...initialState,
      settings: {
        ...initialState.settings,
        current: {
          ...initialState.settings.current,
          timermode: 2,
        },
        progress: { percent: 10 },
      },
    };

    renderApp("/", shortBreakState);

    const rootDiv = screen.getByTestId("app-root");
    expect(rootDiv).toHaveClass("short");
  });

  it("applies correct class for long break mode", () => {
    const longBreakState = {
      ...initialState,
      settings: {
        ...initialState.settings,
        current: {
          ...initialState.settings.current,
          timermode: 3,
        },
        progress: { percent: 90 },
      },
    };

    renderApp("/", longBreakState);

    const rootDiv = screen.getByTestId("app-root");
    expect(rootDiv).toHaveClass("long");
  });

  it("calculates progress percentage correctly", () => {
    const progressState = {
      ...initialState,
      settings: {
        ...initialState.settings,
        secondsleft: 15,
        current: {
          ...initialState.settings.current,
          secondsleft: 15,
          currenttime: 1,
        },
        progress: { percent: 75 },
      },
    };

    renderApp("/", progressState);

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "75");
  });

  it("renders skip to main content link with correct attributes", () => {
    renderApp("/");

    const skipLink = screen.getByRole("link", {
      name: /skip to main content/i,
    });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(skipLink).toHaveAttribute("tabindex", "0");
  });

  it("moves focus to main content on route change", () => {
    renderApp("/");

    expect(screen.getByRole("main")).toHaveFocus();
  });

  it("updates route announcer text on route change", async () => {
    const announcer = document.createElement("div");
    announcer.id = "route-announcer";
    document.body.appendChild(announcer);

    const { unmount } = renderApp("/");

    expect(announcer.textContent).toContain("Pomodoro Timer");

    unmount();

    renderApp("/settings");

    await waitFor(() => {
      expect(announcer.textContent).toContain("Settings");
    });

    document.body.removeChild(announcer);
  });
});
