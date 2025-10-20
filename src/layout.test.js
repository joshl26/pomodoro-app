import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import App from "./layout";

const mockStore = configureStore([]);

describe("App layout", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      settings: {
        secondsleft: 30,
        totalseconds: 60,
        timermode: 1,
        timers: { pomodoro: 25, short: 5, long: 15 },
        autostart: false,
        alarm: {
          volume: 0.5,
          buttonSound: false,
          enabled: false,
          sound: "No Sound",
        },
      },
    });
  });

  it("renders with correct active class and progress percent", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    const rootDiv = screen.getByTestId("app-root");
    expect(rootDiv).toHaveClass("pomodoro");

    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  it("updates favicon href based on timerMode", () => {
    const mockFavicon = { href: "" };
    const getElementByIdSpy = jest
      .spyOn(document, "getElementById")
      .mockReturnValue(mockFavicon);

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(getElementByIdSpy).toHaveBeenCalledWith("favicon");
    expect(mockFavicon.href).toContain("pomo/favicon.ico");

    getElementByIdSpy.mockRestore();
  });

  it("renders Timer component on /pomodor/ route", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("timer")).toBeInTheDocument();
  });

  it("renders Settings component on /pomodor/settings route", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/settings"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("settings")).toBeInTheDocument();
  });

  it("renders Report component on /pomodor/report route", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/report"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("report")).toBeInTheDocument();
  });

  it("renders Login component on /pomodor/login route", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/login"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("login")).toBeInTheDocument();
  });

  it("renders Help component on /pomodor/help route", () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/pomodor/help"]}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId("help")).toBeInTheDocument();
  });
});
