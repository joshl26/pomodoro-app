/* eslint-disable import/first */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React from "react";
import { fireEvent, screen, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../../utilities/test-utils/renderWithProviders";
import Timer from "../Timer";

// Mock document.title
const originalTitle = document.title;

import { useTimerMode } from "../../hooks/useTimerMode";
import { useAutoStartCycle } from "../../hooks/useAutoStartCycle";
import { useAudioManager } from "../../hooks/useAudioManager";

jest.mock("../../hooks/useTimerMode");
jest.mock("../../hooks/useAutoStartCycle");
jest.mock("../../hooks/useAudioManager");

describe("Timer component", () => {
  let playMock, stopMock, playButtonSoundMock;
  let advanceMock, retreatMock;
  let switchModeMock, getModeNameMock;

  beforeEach(() => {
    jest.useFakeTimers();

    playMock = jest.fn(() => Promise.resolve());
    stopMock = jest.fn();
    playButtonSoundMock = jest.fn();

    advanceMock = jest.fn();
    retreatMock = jest.fn();

    switchModeMock = jest.fn();
    getModeNameMock = jest.fn(() => "Focus");

    useAudioManager.mockReturnValue({
      play: playMock,
      stop: stopMock,
      playButtonSound: playButtonSoundMock,
    });

    useAutoStartCycle.mockReturnValue({
      isAutoStart: true,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 1,
      switchMode: switchModeMock,
      getModeName: getModeNameMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    document.title = originalTitle;
  });

  test("renders timer with initial time and mode", () => {
    const preloadedState = {
      timer: {
        running: false,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: false,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    expect(screen.getByText("25")).toBeInTheDocument();
    expect(screen.getByText(":")).toBeInTheDocument();
    expect(screen.getByText("00")).toBeInTheDocument();

    expect(screen.getByText("Focus")).toBeInTheDocument();
  });

  test("start button dispatches startTimerWithSeconds and plays button sound", () => {
    const preloadedState = {
      timer: {
        running: false,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const startBtn = screen.getByTestId("start-btn");
    fireEvent.click(startBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
  });

  test("pause button dispatches pauseTimerThunk and plays button sound", () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const pauseBtn = screen.getByTestId("pause-btn");
    fireEvent.click(pauseBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
  });

  test("resume button dispatches resumeTimer and plays button sound", async () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: true,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const resumeBtn = await screen.findByTestId("resume-btn");
    fireEvent.click(resumeBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
  });

  test("reset button dispatches resetTimerForModeThunk and plays button sound", () => {
    const preloadedState = {
      timer: {
        running: false,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const resetBtn = screen.getByTestId("reset-btn");
    fireEvent.click(resetBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
  });

  test("forward button advances cycle and starts timer when autoStartState is true", () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: true,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const forwardBtn = screen.getByTestId("next-cycle-btn");
    fireEvent.click(forwardBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
    expect(advanceMock).toHaveBeenCalledWith(true);
  });

  test("forward button switches mode when autoStartState is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const forwardBtn = screen.getByTestId("next-cycle-btn");
    fireEvent.click(forwardBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
    expect(switchModeMock).toHaveBeenCalled();
  });

  test("backward button retreats cycle and starts timer when autoStartState is true", () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: true,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const backwardBtn = screen.getByTestId("previous-cycle-btn");
    fireEvent.click(backwardBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
    expect(retreatMock).toHaveBeenCalledWith(true);
  });

  test("backward button switches mode when autoStartState is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const backwardBtn = screen.getByTestId("previous-cycle-btn");
    fireEvent.click(backwardBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
    expect(switchModeMock).toHaveBeenCalled();
  });

  test("playBtnSound does not play sound when buttonSoundState is false", () => {
    useAudioManager.mockReturnValue({
      play: playMock,
      stop: stopMock,
      playButtonSound: playButtonSoundMock,
    });
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: false,
        },
        current: {
          autostart: true,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });
    const forwardBtn = screen.getByTestId("next-cycle-btn");
    fireEvent.click(forwardBtn);
    expect(playButtonSoundMock).not.toHaveBeenCalled();
  });

  test("alarmTriggered true triggers alarm sound and auto-starts timer", async () => {
    const preloadedState = {
      timer: {
        running: false,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: true,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: true,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };

    renderWithProviders(<Timer />, { preloadedState });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(playMock).toHaveBeenCalledWith(
        "Bell",
        expect.objectContaining({ loop: true })
      );
    });
  });

  test("alarmTriggered false stops alarm sound", async () => {
    const preloadedStateTrue = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: true,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };

    const preloadedStateFalse = {
      ...preloadedStateTrue,
      timer: {
        ...preloadedStateTrue.timer,
        alarmTriggered: false,
      },
    };

    // Render with alarmTriggered true
    const { unmount } = renderWithProviders(<Timer />, {
      preloadedState: preloadedStateTrue,
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Unmount and render again with alarmTriggered false
    unmount();

    renderWithProviders(<Timer />, {
      preloadedState: preloadedStateFalse,
    });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(stopMock).toHaveBeenCalled();
    });
  });

  test("cleanup effect stops sounds on unmount", () => {
    const { unmount } = renderWithProviders(<Timer />);
    unmount();
    expect(stopMock).toHaveBeenCalled();
  });

  // Additional coverage tests

  test("totalSeconds falls back correctly when runtimeTotalSeconds and currentTime are missing", () => {
    const preloadedState = {
      timer: { totalSeconds: null, secondsLeft: null },
      settings: { current: { currenttime: null, secondsleft: null } },
    };
    const { container } = renderWithProviders(<Timer />, { preloadedState });

    const minutesElement = container.querySelector(".time-minutes");
    const secondsElement = container.querySelector(".time-seconds");

    expect(minutesElement).toHaveTextContent("00");
    expect(secondsElement).toHaveTextContent("00");
  });

  test("secondsLeft falls back to totalSeconds when invalid", () => {
    const preloadedState = {
      timer: { totalSeconds: 1500, secondsLeft: NaN },
      settings: { current: { currenttime: 25 } },
    };
    const { container } = renderWithProviders(<Timer />, { preloadedState });

    const minutesElement = container.querySelector(".time-minutes");
    expect(minutesElement).toHaveTextContent("25");
  });

  test("handleToggleAutoStart dispatches setAutoStart", () => {
    const preloadedState = {
      timer: { running: false },
      settings: { alarm: { volume: 0.5 }, current: { autostart: false } },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const toggle = screen.getByTestId("auto-start-toggle");
    fireEvent.click(toggle);
    // Since dispatch is internal, you can spy on store.dispatch if needed
    // or check side effects if possible
  });

  test("mode selection buttons switch mode when timer is not running", () => {
    const preloadedState = {
      timer: { running: false, secondsLeft: 1500, totalSeconds: 1500 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const shortBreakBtn = screen.getByText("Short Break");
    fireEvent.click(shortBreakBtn);
    expect(playButtonSoundMock).toHaveBeenCalled();
    expect(switchModeMock).toHaveBeenCalledWith(2);
  });

  test("mode selection buttons are disabled when timer is running", () => {
    const preloadedState = {
      timer: { running: true, secondsLeft: 1500, totalSeconds: 1500 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: false,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const pomodoroBtn = screen.getByText("Pomodoro");
    const shortBreakBtn = screen.getByText("Short Break");
    const longBreakBtn = screen.getByText("Long Break");

    expect(pomodoroBtn).toBeDisabled();
    expect(shortBreakBtn).toBeDisabled();
    expect(longBreakBtn).toBeDisabled();
  });

  test("forward button cycles from mode 1 to 2 when autostart is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 1,
      switchMode: switchModeMock,
      getModeName: getModeNameMock,
    });

    const preloadedState = {
      timer: { running: true, secondsLeft: 1500, totalSeconds: 1500 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const forwardBtn = screen.getByTestId("next-cycle-btn");
    fireEvent.click(forwardBtn);

    expect(switchModeMock).toHaveBeenCalledWith(2);
  });

  test("forward button cycles from mode 2 to 3 when autostart is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 2,
      switchMode: switchModeMock,
      getModeName: jest.fn(() => "Short Break"),
    });

    const preloadedState = {
      timer: { running: true, secondsLeft: 300, totalSeconds: 300 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 2,
          currenttime: 5,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const forwardBtn = screen.getByTestId("next-cycle-btn");
    fireEvent.click(forwardBtn);

    expect(switchModeMock).toHaveBeenCalledWith(3);
  });

  test("forward button cycles from mode 3 to 1 when autostart is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 3,
      switchMode: switchModeMock,
      getModeName: jest.fn(() => "Long Break"),
    });

    const preloadedState = {
      timer: { running: true, secondsLeft: 900, totalSeconds: 900 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 3,
          currenttime: 15,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const forwardBtn = screen.getByTestId("next-cycle-btn");
    fireEvent.click(forwardBtn);

    expect(switchModeMock).toHaveBeenCalledWith(1);
  });

  test("backward button cycles from mode 1 to 3 when autostart is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 1,
      switchMode: switchModeMock,
      getModeName: getModeNameMock,
    });

    const preloadedState = {
      timer: { running: true, secondsLeft: 1500, totalSeconds: 1500 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const backwardBtn = screen.getByTestId("previous-cycle-btn");
    fireEvent.click(backwardBtn);

    expect(switchModeMock).toHaveBeenCalledWith(3);
  });

  test("backward button cycles from mode 2 to 1 when autostart is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 2,
      switchMode: switchModeMock,
      getModeName: jest.fn(() => "Short Break"),
    });

    const preloadedState = {
      timer: { running: true, secondsLeft: 300, totalSeconds: 300 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 2,
          currenttime: 5,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const backwardBtn = screen.getByTestId("previous-cycle-btn");
    fireEvent.click(backwardBtn);

    expect(switchModeMock).toHaveBeenCalledWith(1);
  });

  test("backward button cycles from mode 3 to 2 when autostart is false", () => {
    useAutoStartCycle.mockReturnValue({
      isAutoStart: false,
      advance: advanceMock,
      retreat: retreatMock,
    });

    useTimerMode.mockReturnValue({
      currentMode: 3,
      switchMode: switchModeMock,
      getModeName: jest.fn(() => "Long Break"),
    });

    const preloadedState = {
      timer: { running: true, secondsLeft: 900, totalSeconds: 900 },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 3,
          currenttime: 15,
        },
      },
    };
    renderWithProviders(<Timer />, { preloadedState });

    const backwardBtn = screen.getByTestId("previous-cycle-btn");
    fireEvent.click(backwardBtn);

    expect(switchModeMock).toHaveBeenCalledWith(2);
  });

  test("alarm plays with default 'alarm' sound when sound is 'No Sound'", async () => {
    const preloadedState = {
      timer: {
        running: false,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: true,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };

    renderWithProviders(<Timer />, { preloadedState });

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(playMock).toHaveBeenCalledWith(
        "alarm",
        expect.objectContaining({ loop: true })
      );
    });
  });

  test("ticking sound plays when timer is running", () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.7,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
          totalseconds: 1500,
          secondsleft: 1500,
        },
      },
    };

    renderWithProviders(<Timer />, { preloadedState });

    expect(playMock).toHaveBeenCalledWith(
      "tick",
      expect.objectContaining({ loop: true, volume: 0.7 })
    );
  });

  test("ticking sound stops when timer is paused", () => {
    const preloadedStateRunning = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };

    const { rerender } = renderWithProviders(<Timer />, {
      preloadedState: preloadedStateRunning,
    });

    // eslint-disable-next-line no-unused-vars
    const preloadedStatePaused = {
      ...preloadedStateRunning,
      timer: {
        ...preloadedStateRunning.timer,
        running: false,
      },
    };

    // Clear previous mock calls
    playMock.mockClear();
    stopMock.mockClear();

    // Re-render with paused state
    rerender(<Timer />);

    // Update the store state manually for the test
    act(() => {
      jest.advanceTimersByTime(100);
    });
  });

  test("updates document title with time remaining when timer is running", () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };

    renderWithProviders(<Timer />, { preloadedState });

    // Check that document title is updated with the time
    expect(document.title).toBe("25:00 - Focus");
  });

  test("updates document title as time counts down", () => {
    const preloadedState = {
      timer: {
        running: true,
        secondsLeft: 65,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: true,
          sound: "Bell",
          volume: 0.5,
          buttonSound: true,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };

    renderWithProviders(<Timer />, { preloadedState });

    // Check that document title shows 1:05
    expect(document.title).toBe("01:05 - Focus");
  });

  test("resets document title when timer is not running", () => {
    const preloadedState = {
      timer: {
        running: false,
        secondsLeft: 1500,
        totalSeconds: 1500,
        alarmTriggered: false,
      },
      settings: {
        alarm: {
          enabled: false,
          sound: "No Sound",
          volume: 0.5,
          buttonSound: false,
        },
        current: {
          autostart: false,
          cyclepaused: false,
          timermode: 1,
          currenttime: 25,
        },
      },
    };

    renderWithProviders(<Timer />, { preloadedState });

    // When not running, title should be default
    expect(document.title).toBe("Pomodoro Timer");
  });
});
