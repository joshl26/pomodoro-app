import { renderHook, act } from "@testing-library/react";
import { useAutoStartCycle } from "../useAutoStartCycle";
import * as reactRedux from "react-redux";
import * as settingsThunks from "../../store/settingsThunks";
import * as settingsSelectors from "../../store/selectors/settingsSelectors";

jest.mock("react-redux");
jest.mock("../../store/settingsThunks");
jest.mock("../../store/selectors/settingsSelectors");

describe("useAutoStartCycle hook", () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    reactRedux.useDispatch.mockReturnValue(dispatchMock);
  });

  const setupSelectors = ({
    isAutoStart = true,
    counter = 0,
    sequence = [1, 2, 3],
    cycleComplete = false,
  } = {}) => {
    settingsSelectors.selectIsAutoStart.mockReturnValue(isAutoStart);
    settingsSelectors.selectCycleCounter.mockReturnValue(counter);
    settingsSelectors.selectCycleSequence.mockReturnValue(sequence);
    settingsSelectors.selectCycleComplete.mockReturnValue(cycleComplete);

    reactRedux.useSelector.mockImplementation((selector) => {
      if (selector === settingsSelectors.selectIsAutoStart) return isAutoStart;
      if (selector === settingsSelectors.selectCycleCounter) return counter;
      if (selector === settingsSelectors.selectCycleSequence) return sequence;
      if (selector === settingsSelectors.selectCycleComplete)
        return cycleComplete;
      return undefined;
    });
  };

  it("returns correct initial values from selectors", () => {
    setupSelectors({
      isAutoStart: true,
      counter: 1,
      sequence: [1, 2, 3],
      cycleComplete: true,
    });

    const { result } = renderHook(() => useAutoStartCycle());

    expect(result.current.isAutoStart).toBe(true);
    expect(result.current.cycleComplete).toBe(true);
    expect(result.current.getCurrentMode()).toBe(2);
    expect(result.current.getNextMode()).toBe(3);
    expect(result.current.getPreviousMode()).toBe(1);
  });

  it("advance dispatches advanceCycle when isAutoStart is true", () => {
    setupSelectors({ isAutoStart: true });
    settingsThunks.advanceCycle.mockReturnValue({ type: "ADVANCE" });

    const { result } = renderHook(() => useAutoStartCycle());

    act(() => {
      result.current.advance(true);
    });

    expect(settingsThunks.advanceCycle).toHaveBeenCalledWith(true);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "ADVANCE" });
  });

  it("advance does not dispatch when isAutoStart is false", () => {
    setupSelectors({ isAutoStart: false });

    const { result } = renderHook(() => useAutoStartCycle());

    act(() => {
      result.current.advance(true);
    });

    expect(settingsThunks.advanceCycle).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("retreat dispatches retreatCycle when isAutoStart is true", () => {
    setupSelectors({ isAutoStart: true });
    settingsThunks.retreatCycle.mockReturnValue({ type: "RETREAT" });

    const { result } = renderHook(() => useAutoStartCycle());

    act(() => {
      result.current.retreat(false);
    });

    expect(settingsThunks.retreatCycle).toHaveBeenCalledWith(false);
    expect(dispatchMock).toHaveBeenCalledWith({ type: "RETREAT" });
  });

  it("retreat does not dispatch when isAutoStart is false", () => {
    setupSelectors({ isAutoStart: false });

    const { result } = renderHook(() => useAutoStartCycle());

    act(() => {
      result.current.retreat(false);
    });

    expect(settingsThunks.retreatCycle).not.toHaveBeenCalled();
    expect(dispatchMock).not.toHaveBeenCalled();
  });

  it("getNextMode and getPreviousMode wrap around sequence correctly", () => {
    setupSelectors({ counter: 2, sequence: [1, 2, 3] });

    const { result } = renderHook(() => useAutoStartCycle());

    expect(result.current.getCurrentMode()).toBe(3);
    expect(result.current.getNextMode()).toBe(1);
    expect(result.current.getPreviousMode()).toBe(2);
  });
});
