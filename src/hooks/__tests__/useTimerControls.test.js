import { renderHook, act } from "@testing-library/react";
import { useTimerControls } from "../useTimerControls";
import * as reactRedux from "react-redux";
import * as settingsSlice from "../../store/settingsSlice";
import * as settingsSelectors from "../../store/selectors/settingsSelectors";

jest.mock("react-redux");
jest.mock("../../store/settingsSlice");
jest.mock("../../store/selectors/settingsSelectors");

describe("useTimerControls hook", () => {
  const dispatchMock = jest.fn();
  const startTimerMock = jest.fn();
  const pauseTimerMock = jest.fn();
  const resumeTimerMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    reactRedux.useDispatch.mockReturnValue(dispatchMock);
    settingsSelectors.selectCyclePaused.mockReturnValue(false);
    reactRedux.useSelector.mockImplementation((selector) => {
      if (selector === settingsSelectors.selectCyclePaused) return false;
      return undefined;
    });
  });

  it("returns isPaused from selector", () => {
    settingsSelectors.selectCyclePaused.mockReturnValue(true);
    reactRedux.useSelector.mockImplementation((selector) => {
      if (selector === settingsSelectors.selectCyclePaused) return true;
      return undefined;
    });

    const { result } = renderHook(() =>
      useTimerControls(startTimerMock, pauseTimerMock, resumeTimerMock)
    );

    expect(result.current.isPaused).toBe(true);
  });

  it("handleStart calls startTimer callback", () => {
    const { result } = renderHook(() =>
      useTimerControls(startTimerMock, pauseTimerMock, resumeTimerMock)
    );

    act(() => {
      result.current.handleStart();
    });

    expect(startTimerMock).toHaveBeenCalled();
  });

  it("handlePause calls pauseTimer and dispatches setCyclePaused(true)", () => {
    settingsSlice.setCyclePaused.mockReturnValue({ type: "SET_PAUSED_TRUE" });

    const { result } = renderHook(() =>
      useTimerControls(startTimerMock, pauseTimerMock, resumeTimerMock)
    );

    act(() => {
      result.current.handlePause();
    });

    expect(pauseTimerMock).toHaveBeenCalled();
    expect(settingsSlice.setCyclePaused).toHaveBeenCalledWith(true);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_PAUSED_TRUE" });
  });

  it("handleResume calls resumeTimer and dispatches setCyclePaused(false)", () => {
    settingsSlice.setCyclePaused.mockReturnValue({ type: "SET_PAUSED_FALSE" });

    const { result } = renderHook(() =>
      useTimerControls(startTimerMock, pauseTimerMock, resumeTimerMock)
    );

    act(() => {
      result.current.handleResume();
    });

    expect(resumeTimerMock).toHaveBeenCalled();
    expect(settingsSlice.setCyclePaused).toHaveBeenCalledWith(false);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "SET_PAUSED_FALSE" });
  });
});
