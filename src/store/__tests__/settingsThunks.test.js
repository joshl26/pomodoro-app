// __tests__/settingsThunks.test.js
import { store } from "../store";
import {
  setTimerModeAndReset,
  advanceCycle,
  retreatCycle,
  resetCycleAndTimer,
} from "../settingsThunks";
import { setDefault as setSettingsDefault } from "../settingsSlice";
import { stopTimer, resetTimerForMode } from "../timerSlice";

describe("settingsThunks (integration with real store)", () => {
  beforeEach(() => {
    // Reset both slices to initial state before each test
    store.dispatch(setSettingsDefault());
    // stop timer and reset it to match default pomodoro (1500s)
    store.dispatch(stopTimer());
    store.dispatch(resetTimerForMode(1500)); // or resetTimerForMode({ totalSeconds: 1500 })
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("setTimerModeAndReset sets settings and timer for pomodoro mode", () => {
    const mode = 1;
    store.dispatch(setTimerModeAndReset(mode));

    const settingsState = store.getState().settings;
    const timerState = store.getState().timer;

    expect(settingsState.current.timermode).toBe(mode);
    expect(settingsState.current.totalseconds).toBe(1500);
    expect(settingsState.current.secondsleft).toBe(1500);

    expect(timerState.totalSeconds).toBe(1500);
    expect(timerState.secondsLeft).toBe(1500);

    expect(settingsState.current.cyclepaused).toBe(false);
    expect(settingsState.current.cyclecomplete).toBe(false);
  });

  it("setTimerModeAndReset with autoStart marks cycle started", () => {
    const mode = 1;
    const autoStart = true;
    store.dispatch(setTimerModeAndReset(mode, autoStart));

    const settingsState = store.getState().settings;
    const timerState = store.getState().timer;

    expect(settingsState.current.timermode).toBe(mode);
    expect(settingsState.current.cyclestarted).toBe(true);

    // timer slice should be reset to same seconds (but not necessarily running)
    expect(timerState.totalSeconds).toBe(1500);
    expect(timerState.secondsLeft).toBe(1500);
  });

  it("advanceCycle advances counter and updates timer to short break", () => {
    store.dispatch(advanceCycle(false));

    const settingsState = store.getState().settings;
    const timerState = store.getState().timer;

    expect(settingsState.cycle.counter).toBe(1);
    expect(settingsState.current.timermode).toBe(2);
    expect(settingsState.current.totalseconds).toBe(300);
    expect(settingsState.current.secondsleft).toBe(300);

    expect(timerState.totalSeconds).toBe(300);
    expect(timerState.secondsLeft).toBe(300);
    expect(settingsState.current.cyclepaused).toBe(false);
    expect(settingsState.current.cyclecomplete).toBe(false);
  });

  it("retreatCycle goes back in cycle and updates timer", () => {
    // advance once then retreat
    store.dispatch(advanceCycle(false));
    store.dispatch(retreatCycle(false));

    const settingsState = store.getState().settings;
    const timerState = store.getState().timer;

    expect(settingsState.cycle.counter).toBe(0);
    expect(settingsState.current.timermode).toBe(1);
    expect(settingsState.current.totalseconds).toBe(1500);
    expect(settingsState.current.secondsleft).toBe(1500);

    expect(timerState.totalSeconds).toBe(1500);
    expect(timerState.secondsLeft).toBe(1500);
  });

  it("resetCycleAndTimer resets cycle and timer to defaults", () => {
    // alter state
    store.dispatch(advanceCycle(false));
    store.dispatch(advanceCycle(false));

    // reset
    store.dispatch(resetCycleAndTimer());

    const settingsState = store.getState().settings;
    const timerState = store.getState().timer;

    expect(settingsState.current.timermode).toBe(1);
    expect(settingsState.current.totalseconds).toBe(1500);
    expect(settingsState.current.secondsleft).toBe(1500);

    expect(timerState.totalSeconds).toBe(1500);
    expect(timerState.secondsLeft).toBe(1500);

    expect(settingsState.cycle.counter).toBe(0);
    expect(settingsState.current.cyclepaused).toBe(false);
    expect(settingsState.current.cyclecomplete).toBe(false);
  });
});
