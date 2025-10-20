// src/components/Timer.test.jsx
import React from "react";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timer from "../Timer";
import { renderWithProviders } from "../../utilities/test-utils/test-utils";

// --- Safe top-level mocks (names prefixed with "mock") ---
const mockSwitchMode = jest.fn();
jest.mock("../../hooks/useTimerMode", () => ({
  useTimerMode: () => ({
    currentMode: 1,
    switchMode: mockSwitchMode,
    getModeName: () => "Pomodoro",
  }),
}));

const mockAdvance = jest.fn();
const mockRetreat = jest.fn();
jest.mock("../../hooks/useAutoStartCycle", () => ({
  useAutoStartCycle: () => ({
    advance: mockAdvance,
    retreat: mockRetreat,
  }),
}));

jest.mock("react-use-audio-player", () => ({
  useGlobalAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    stop: jest.fn(),
    load: jest.fn(),
  }),
}));

describe("Timer component (integration with reducers)", () => {
  // filter out the React-Redux selector memoization warning that appears in tests
  const originalWarn = console.warn;
  beforeAll(() => {
    console.warn = (...args) => {
      try {
        const msg = typeof args[0] === "string" ? args[0] : "";
        if (
          msg.includes(
            "Selector selectAlarmSettings returned a different result"
          )
        ) {
          return;
        }
      } catch {
        // ignore parsing errors and fall through
      }
      originalWarn(...args);
    };
  });

  afterAll(() => {
    console.warn = originalWarn;
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  test("renders start button initially", () => {
    renderWithProviders(<Timer />);
    expect(screen.getByTestId("start-btn")).toBeInTheDocument();
  });

  test("clicking start dispatches an action (start thunk)", async () => {
    const { store } = renderWithProviders(<Timer />);
    const user = userEvent.setup();

    await user.click(screen.getByTestId("start-btn"));

    // Wait for the thunk to update the runtime state (running true)
    await waitFor(() => {
      expect(store.getState().timer.running).toBe(true);
    });
  });

  test("when running, pause + nav buttons show and next/prev trigger mode changes", async () => {
    renderWithProviders(<Timer />, {
      preloadedState: {
        timer: {
          running: true,
          totalSeconds: 25 * 60,
          secondsLeft: 25 * 60,
          alarmTriggered: false,
        },
      },
    });

    const user = userEvent.setup();

    expect(await screen.findByTestId("pause-btn")).toBeInTheDocument();

    const nextBtn = screen.getByTestId("next-cycle-btn");
    const prevBtn = screen.getByTestId("previous-cycle-btn");

    await user.click(nextBtn);
    expect(mockSwitchMode).toHaveBeenCalled();

    await user.click(prevBtn);
    expect(mockSwitchMode).toHaveBeenCalledTimes(2);
  });

  test("pause button dispatches when clicked (running -> paused)", async () => {
    const { store } = renderWithProviders(<Timer />, {
      preloadedState: {
        timer: {
          running: true,
          totalSeconds: 25 * 60,
          secondsLeft: 25 * 60 - 10,
          alarmTriggered: false,
        },
      },
    });

    const user = userEvent.setup();

    await user.click(await screen.findByTestId("pause-btn"));

    // Wait for the thunk to update the runtime state (running false)
    await waitFor(() => {
      expect(store.getState().timer.running).toBe(false);
    });
  });

  test("auto-start toggle updates settings in store (integration)", async () => {
    const { store } = renderWithProviders(<Timer />);
    const user = userEvent.setup();

    // Initial state (direct shape used by your slice)
    expect(store.getState().settings.current.autostart).toBe(false);

    // Get the checkbox
    let checkbox = screen.getByTestId("auto-start-breaks-timer");
    expect(checkbox).not.toBeChecked();

    // Toggle ON
    await user.click(checkbox);

    // Wait for the store to update (handle async reducers/thunks)
    await waitFor(() => {
      expect(store.getState().settings.current.autostart).toBe(true);
    });

    // Re-query the checkbox to avoid stale references
    checkbox = screen.getByTestId("auto-start-breaks-timer");
    expect(checkbox).toBeChecked();

    // Toggle OFF
    await user.click(checkbox);

    // Wait for the store to update
    await waitFor(() => {
      expect(store.getState().settings.current.autostart).toBe(false);
    });

    // Re-query the checkbox again
    checkbox = screen.getByTestId("auto-start-breaks-timer");
    expect(checkbox).not.toBeChecked();
  });

  test("starting the timer decrements secondsLeft each second", async () => {
    // use fake timers and configure userEvent to advance them when it performs actions
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const preloadedState = {
      settings: {
        durations: { pomodoro: 1500, shortBreak: 300, longBreak: 900 },
        autostart: false,
      },
    };
    const { store } = renderWithProviders(<Timer />, { preloadedState });

    // Start the timer
    await user.click(screen.getByTestId("start-btn"));

    // Ensure running state becomes true
    await waitFor(() => {
      expect(store.getState().timer.running).toBe(true);
    });

    const before = store.getState().timer.secondsLeft;

    // Advance 1 second of fake time (wrap in act to avoid the "not wrapped in act" warning)
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // allow any queued microtasks to run
    await Promise.resolve();

    // Wait for store update to reflect tick
    await waitFor(() => {
      expect(store.getState().timer.secondsLeft).toBe(before - 1);
    });

    // Clean up fake timers
    jest.useRealTimers();
  });
});
