// src/components/Settings.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import Settings from "./Settings";
import settingsReducer from "../store/settingsSlice";
import useAudioManager from "../hooks/useAudioManager";

// Mock the useAudioManager hook
jest.mock("../hooks/useAudioManager", () => {
  return jest.fn();
});

// Create a test store with the correct initial state structure
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        // Make sure these match your actual initial state structure
        pomodoro: 25,
        short: 5,
        long: 15,
        autostart: false,
        alarmvolume: 0.5,
        timermode: 1,
        alarmsound: "Bell",
        buttonsound: true,
        // Add any other required fields here
        ...preloadedState.settings,
      },
    },
  });
};

describe("Settings component (preload + debounce preview)", () => {
  let store;
  let mockLoad;
  let mockSetVolume;
  let mockPlay;
  let mockStop;
  let mockPlayButtonSound;

  beforeEach(() => {
    // Create fresh store for each test
    store = createTestStore();

    // Reset mocks
    mockLoad = jest.fn(() => ({})); // Return an object to avoid undefined issues
    mockSetVolume = jest.fn();
    mockPlay = jest.fn(() => Promise.resolve()); // Return a resolved promise
    mockStop = jest.fn();
    mockPlayButtonSound = jest.fn();

    useAudioManager.mockReturnValue({
      load: mockLoad,
      setVolume: mockSetVolume,
      play: mockPlay,
      stop: mockStop,
      playButtonSound: mockPlayButtonSound,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test("preloads selected alarm sound and sets its volume on mount", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>
    );

    // Check that the default alarm sound is loaded
    expect(mockLoad).toHaveBeenCalledWith("Bell");
    // Check that the volume is set to 0.5 (from initial state)
    expect(mockSetVolume).toHaveBeenCalledWith("Bell", 0.5);
  });

  test("slider change updates instance volume and triggers debounced preview", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>
    );

    // Get the alarm volume slider by role and label
    const slider = screen.getByRole("slider", { name: /alarm volume/i });

    // Change the slider value
    fireEvent.change(slider, { target: { value: "0.8" } });

    // Check immediate setVolume call
    expect(mockSetVolume).toHaveBeenCalledWith("Bell", 0.8);

    // Advance timers to pass debounce threshold (200ms in Settings)
    jest.advanceTimersByTime(250);

    // Check that play was called with the new volume
    expect(mockPlay).toHaveBeenCalledWith("Bell", { volume: 0.8 });
  });

  test("handles slider changes properly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Settings />
        </MemoryRouter>
      </Provider>
    );

    // Get the alarm volume slider
    const slider = screen.getByRole("slider", { name: /alarm volume/i });

    // Verify initial state
    expect(slider).toBeInTheDocument();
    expect(parseFloat(slider.value)).toBe(0.5);

    // Change the slider value
    fireEvent.change(slider, { target: { value: "0.6" } });

    // Check that the value was updated
    expect(parseFloat(slider.value)).toBe(0.6);
  });
});
