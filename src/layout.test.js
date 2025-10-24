import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./utilities/test-utils/renderWithProviders"; // Adjust path if needed
import App from "./layout";

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

  it("renders with correct active class and progress percent", () => {
    renderWithProviders(<App />, { preloadedState: initialState, route: "/" });

    const rootDiv = screen.getByTestId("app-root");
    expect(rootDiv).toHaveClass("pomodoro");

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
  });

  it("updates favicon href based on timerMode", () => {
    const mockFavicon = { href: "" };
    const getElementByIdSpy = jest
      .spyOn(document, "getElementById")
      .mockReturnValue(mockFavicon);

    renderWithProviders(<App />, { preloadedState: initialState, route: "/" });

    expect(getElementByIdSpy).toHaveBeenCalledWith("favicon");
    expect(mockFavicon.href).toContain("/favicons/pomo");

    getElementByIdSpy.mockRestore();
  });

  it("renders Timer component on / route and sets correct page title", async () => {
    renderWithProviders(<App />, { preloadedState: initialState, route: "/" });

    expect(screen.getByTestId("timer")).toBeInTheDocument();

    await waitFor(() => {
      expect(document.title).toBe("Pomodoro Timer - Boost Your Productivity");
    });
  });

  it("renders Settings component on /settings route and sets correct page title", async () => {
    renderWithProviders(<App />, {
      preloadedState: initialState,
      route: "/settings",
    });

    await waitFor(() => {
      expect(screen.getByTestId("settings")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.title).toBe("Settings - Customize Your Pomodoro Timer");
    });
  });

  it("renders Report component on /report route and sets correct page title", async () => {
    renderWithProviders(<App />, {
      preloadedState: initialState,
      route: "/report",
    });

    await waitFor(async () => {
      await waitFor(() => {
        expect(screen.getByTestId("report")).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(document.title).toBe("Report - View Your Pomodoro Sessions");
      });
    });
  });

  it("renders Login component on /login route and sets correct page title", async () => {
    renderWithProviders(<App />, {
      preloadedState: initialState,
      route: "/login",
    });

    await waitFor(() => {
      expect(screen.getByTestId("login")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.title).toBe("Login - Access Your Pomodoro Account");
    });
  });

  it("renders Help component on /help route and sets correct page title", async () => {
    renderWithProviders(<App />, {
      preloadedState: initialState,
      route: "/help",
    });

    await waitFor(() => {
      expect(screen.getByTestId("help")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(document.title).toBe("Help - Pomodoro Timer Support and FAQs");
    });
  });

  it("applies correct class for short break mode", () => {
    const shortBreakState = {
      ...initialState,
      settings: {
        ...initialState.settings,
        current: {
          ...initialState.settings.current,
          timermode: 2, // short break mode
        },
        progress: { percent: 10 },
      },
    };

    renderWithProviders(<App />, {
      preloadedState: shortBreakState,
      route: "/",
    });

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
          timermode: 3, // long break mode
        },
        progress: { percent: 90 },
      },
    };

    renderWithProviders(<App />, {
      preloadedState: longBreakState,
      route: "/",
    });

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

    renderWithProviders(<App />, { preloadedState: progressState, route: "/" });

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "75");
  });
});
