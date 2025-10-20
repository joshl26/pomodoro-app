import { store } from "../../store/store";
import {
  startTimerWithSeconds,
  resumeTimer,
  pauseTimerThunk,
  resetTimerForModeThunk,
} from "../../store/timerThunks";
import { resetTimerForMode, stopTimer } from "../../store/timerSlice";

let originalConsoleWarn;

beforeAll(() => {
  originalConsoleWarn = console.warn;
  console.warn = (msg, ...args) => {
    if (
      typeof msg === "string" &&
      msg.includes("ImmutableStateInvariantMiddleware")
    ) {
      return;
    }
    originalConsoleWarn(msg, ...args);
  };
});

afterAll(() => {
  console.warn = originalConsoleWarn;
});

describe("timerThunks (integration with real store)", () => {
  beforeEach(() => {
    // return timer slice to a clean state
    store.dispatch(stopTimer());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("startTimerWithSeconds sets endTimestamp and running", () => {
    const seconds = 300;
    const now = 10000;
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const endTimestamp = store.dispatch(startTimerWithSeconds(seconds));

    const state = store.getState().timer;
    expect(state.endTimestamp).toBe(now + seconds * 1000);
    expect(state.running).toBe(true);
    expect(endTimestamp).toBe(now + seconds * 1000);
  });

  it("resumeTimer computes endTimestamp from secondsLeft and starts", () => {
    // set secondsLeft via resetTimerForMode action directly
    store.dispatch(resetTimerForMode({ totalSeconds: 600 }));

    const now = 10000;
    jest.spyOn(Date, "now").mockImplementation(() => now);

    const endTimestamp = store.dispatch(resumeTimer());

    const state = store.getState().timer;
    expect(state.endTimestamp).toBe(now + 600 * 1000);
    expect(state.running).toBe(true);
    expect(endTimestamp).toBe(now + 600 * 1000);
  });

  it("pauseTimerThunk ticks and pauses the timer", () => {
    const now = 10000;
    const oneSecondLater = now + 1000;

    const nowMock = jest.spyOn(Date, "now");
    nowMock.mockImplementationOnce(() => now); // start time
    store.dispatch(startTimerWithSeconds(600));

    nowMock.mockImplementationOnce(() => oneSecondLater); // after 1 second
    store.dispatch(pauseTimerThunk());

    const state = store.getState().timer;
    expect(state.running).toBe(false);
    expect(state.secondsLeft).toBeGreaterThanOrEqual(599);
    expect(state.secondsLeft).toBeLessThanOrEqual(600);

    nowMock.mockRestore();
  });

  it("resetTimerForModeThunk sets totalSeconds/secondsLeft and stops", () => {
    const totalSeconds = 600;
    store.dispatch(resetTimerForModeThunk(totalSeconds));

    const state = store.getState().timer;
    expect(state.totalSeconds).toBe(totalSeconds);
    expect(state.secondsLeft).toBe(totalSeconds);
    expect(state.running).toBe(false);
    expect(state.endTimestamp).toBeNull();
    expect(state.alarmTriggered).toBe(false);
  });
});
