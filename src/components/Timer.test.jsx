import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Timer from "./Timer";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, { setDefault } from "../store/settingsSlice";

jest.mock("react-use-audio-player", () => ({
  useGlobalAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    load: jest.fn(),
  }),
}));

// Helper to create a fresh store for each test
function createTestStore() {
  const store = configureStore({
    reducer: { settings: settingsReducer },
  });
  store.dispatch(setDefault()); // reset to initial state
  return store;
}

describe("Timer component", () => {
  let store;

  beforeEach(() => {
    store = createTestStore();
  });

  test("renders start button initially", () => {
    render(
      <Provider store={store}>
        <Timer />
      </Provider>
    );
    const startButton = screen.getByTestId("start-btn");
    expect(startButton).toBeInTheDocument();
  });

  test("starts and pauses timer correctly", async () => {
    render(
      <Provider store={store}>
        <Timer />
      </Provider>
    );

    const startButton = screen.getByTestId("start-btn");
    fireEvent.click(startButton);

    const pauseButton = await screen.findByTestId("pause-btn");
    expect(pauseButton).toBeInTheDocument();

    fireEvent.click(pauseButton);

    const startOrResumeButton =
      await screen.findByTestId(/start-btn|resume-btn/);
    expect(startOrResumeButton).toBeInTheDocument();
  });

  test("forward and backward buttons work", async () => {
    render(
      <Provider store={store}>
        <Timer />
      </Provider>
    );

    // Start timer to show nav buttons
    const startButton = screen.getByTestId("start-btn");
    fireEvent.click(startButton);

    const forwardButton = await screen.findByTestId("next-cycle-btn");
    const backwardButton = await screen.findByTestId("previous-cycle-btn");

    expect(forwardButton).toBeInTheDocument();
    expect(backwardButton).toBeInTheDocument();

    fireEvent.click(forwardButton);
    fireEvent.click(backwardButton);
  });

  test("auto-start toggle works", () => {
    render(
      <Provider store={store}>
        <Timer />
      </Provider>
    );

    const autoStartCheckbox = screen.getByTestId("auto-start-breaks-timer");
    expect(autoStartCheckbox).toBeInTheDocument();

    fireEvent.click(autoStartCheckbox);
    expect(autoStartCheckbox).toBeChecked();

    fireEvent.click(autoStartCheckbox);
    expect(autoStartCheckbox).not.toBeChecked();
  });
});
