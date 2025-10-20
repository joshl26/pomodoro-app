import { store } from "../store";
import {
  startTimerWithSeconds,
  resumeTimer,
  pauseTimerThunk,
  resetTimerForModeThunk,
} from "../timerThunks";
import { resetTimerForMode, stopTimer } from "../timerSlice";

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

    store.dispatch(startTimerWithSeconds(seconds));

    const state = store.getState().timer;
    expect(state.endTimestamp).toBe(now + seconds * 1000);
    expect(state.running).toBe(true);
  });

  it("resumeTimer computes endTimestamp from secondsLeft and starts", () => {
    // set secondsLeft via resetTimerForMode action directly
    store.dispatch(resetTimerForMode({ totalSeconds: 600 }));

    const now = 10000;
    jest.spyOn(Date, "now").mockImplementation(() => now);

    store.dispatch(resumeTimer());

    const state = store.getState().timer;
    expect(state.endTimestamp).toBe(now + 600 * 1000);
    expect(state.running).toBe(true);
  });

  it("pauseTimerThunk ticks and pauses the timer", () => {
    const now = 10000;
    jest.spyOn(Date, "now").mockImplementation(() => now);

    // start a 600s timer
    store.dispatch(startTimerWithSeconds(600));

    // advance time by 1000ms -> 1 second elapsed
    jest.spyOn(Date, "now").mockImplementation(() => now + 1000);

    store.dispatch(pauseTimerThunk());

    const state = store.getState().timer;
    expect(state.running).toBe(false);
    // secondsLeft should have decreased by ~1 (we use ceil in tick)
    expect(state.secondsLeft).toBeGreaterThanOrEqual(599);
    expect(state.secondsLeft).toBeLessThanOrEqual(600);
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
