import React from "react";
import { fireEvent, screen, waitFor, act } from "@testing-library/react";
import { renderWithProviders } from "../../utilities/test-utils/renderWithProviders";
import Timer from "../Timer";

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
});
