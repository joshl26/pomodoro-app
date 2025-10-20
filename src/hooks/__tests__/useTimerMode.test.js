import { renderHook, act } from "@testing-library/react";
import { useTimerMode } from "../useTimerMode";
import { setTimerModeAndReset } from "../../store/settingsThunks";
import { useSelector, useDispatch } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock("../../store/settingsThunks", () => ({
  setTimerModeAndReset: jest.fn(),
}));

describe("useTimerMode hook", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
  });

  it("returns currentMode from useSelector", () => {
    useSelector.mockReturnValue(2); // short break mode

    const { result } = renderHook(() => useTimerMode());

    expect(result.current.currentMode).toBe(2);
  });

  it("switchMode dispatches setTimerModeAndReset with correct arguments", () => {
    useSelector.mockReturnValue(1); // pomodoro mode

    const { result } = renderHook(() => useTimerMode());

    act(() => {
      result.current.switchMode(3, true);
    });

    expect(setTimerModeAndReset).toHaveBeenCalledWith(3, true);
    expect(dispatchMock).toHaveBeenCalledWith(setTimerModeAndReset(3, true));
  });

  it("getModeName returns correct mode name for each mode", () => {
    const modeNames = {
      1: "Focus",
      2: "Short Break",
      3: "Long Break",
      999: "Focus", // default case
    };

    for (const [mode, name] of Object.entries(modeNames)) {
      useSelector.mockReturnValue(Number(mode));
      const { result, rerender } = renderHook(() => useTimerMode());
      expect(result.current.getModeName()).toBe(name);
      rerender();
    }
  });
});
