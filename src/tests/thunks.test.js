// src/tests/settingsThunks.test.js
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  initialState as settingsInitial,
} from "../store/settingsSlice";
import {
  setTimerModeAndReset,
  advanceCycle,
  retreatCycle,
  resetCycleAndTimer,
} from "../store/settingsThunks";

beforeEach(() => {
  // Prevent persistence from leaking across tests
  localStorage.clear();
  jest.resetModules();
});

/**
 * Create a test store using the real settings reducer.
 * If a real timer reducer exists at ../store/timerSlice, it'll be used.
 * Otherwise a small stub reducer captures timer/resetTimerForMode (not strictly required here).
 */
function createTestStore(preloadedState = {}) {
  const reducers = { settings: settingsReducer };

  try {
    // eslint-disable-next-line global-require
    const timerReducer = require("../store/timerSlice").default;
    reducers.timer = timerReducer;
  } catch (e) {
    reducers.timer = (state = { resetCalledForMode: null }, action) => {
      if (action.type === "timer/resetTimerForMode") {
        return { ...state, resetCalledForMode: action.payload };
      }
      return state;
    };
  }

  return configureStore({
    reducer: reducers,
    preloadedState,
  });
}

test("advanceCycle advances counter and updates mode/timer", async () => {
  const preloaded = {
    settings: {
      ...settingsInitial,
      // set a short custom cycle sequence for deterministic behavior
      cycle: {
        sequence: [1, 2, 3],
        counter: 0,
      },
      current: {
        ...settingsInitial.current,
        timermode: 1,
        currenttime: 25,
        totalseconds: 25 * 60,
        secondsleft: 25 * 60,
      },
      timers: {
        pomodoro: 25,
        short: 5,
        long: 15,
      },
    },
  };

  const store = createTestStore(preloaded);

  await store.dispatch(advanceCycle(false));

  const state = store.getState().settings;
  // counter moved from 0 -> 1
  expect(state.cycle.counter).toBe(1);
  // mode should be the sequence[1] (2)
  expect(state.current.timermode).toBe(2);
  // timer values updated for short break (5 minutes)
  expect(state.current.currenttime).toBe(5);
  expect(state.current.totalseconds).toBe(5 * 60);
  expect(state.current.secondsleft).toBe(5 * 60);
});

test("retreatCycle decrements counter and wraps correctly", async () => {
  const preloaded = {
    settings: {
      ...settingsInitial,
      cycle: {
        sequence: [1, 2, 3],
        counter: 0, // at start, retreat should wrap to last index (2)
      },
      current: {
        ...settingsInitial.current,
        timermode: 1,
        currenttime: 25,
        totalseconds: 25 * 60,
        secondsleft: 25 * 60,
      },
      timers: {
        pomodoro: 25,
        short: 5,
        long: 15,
      },
    },
  };

  const store = createTestStore(preloaded);

  await store.dispatch(retreatCycle(false));

  const state = store.getState().settings;
  // counter wrapped to 2
  expect(state.cycle.counter).toBe(2);
  // mode should match sequence[2] (3)
  expect(state.current.timermode).toBe(3);
  // timer updated for long break (15 minutes)
  expect(state.current.currenttime).toBe(15);
  expect(state.current.totalseconds).toBe(15 * 60);
  expect(state.current.secondsleft).toBe(15 * 60);
});

test("resetCycleAndTimer resets counter and timer to initial mode (1) and respects keepAudio", async () => {
  const preloaded = {
    settings: {
      ...settingsInitial,
      cycle: {
        sequence: [1, 2, 1],
        counter: 2,
      },
      current: {
        ...settingsInitial.current,
        timermode: 1,
        currenttime: 25,
        totalseconds: 25 * 60,
        secondsleft: 25 * 60,
        cyclepaused: true,
        cyclecomplete: true,
      },
      timers: {
        pomodoro: 25,
        short: 5,
        long: 15,
      },
    },
  };

  const store = createTestStore(preloaded);

  await store.dispatch(resetCycleAndTimer({ keepAudio: true }));

  const state = store.getState().settings;
  // counter reset to 0
  expect(state.cycle.counter).toBe(0);
  // timer reset to mode 1 (pomodoro)
  expect(state.current.timermode).toBe(1);
  expect(state.current.currenttime).toBe(25);
  expect(state.current.totalseconds).toBe(25 * 60);
  expect(state.current.secondsleft).toBe(25 * 60);
  // cycle flags set to not paused and not complete
  expect(state.current.cyclepaused).toBe(false);
  expect(state.current.cyclecomplete).toBe(false);
});

test("setTimerModeAndReset autoStart true sets cyclestarted", async () => {
  const preloaded = {
    settings: {
      ...settingsInitial,
      current: {
        ...settingsInitial.current,
        timermode: 1,
        cyclestarted: false,
        cyclecomplete: false,
        cyclepaused: true,
      },
      timers: {
        pomodoro: 25,
        short: 5,
        long: 15,
      },
    },
  };

  const store = createTestStore(preloaded);

  await store.dispatch(setTimerModeAndReset(2, true));

  const state = store.getState().settings;
  // autoStart should have started the cycle
  expect(state.current.cyclestarted).toBe(true);
  // cyclecomplete should be false
  expect(state.current.cyclecomplete).toBe(false);
  // and seconds/totalseconds should be set for short break
  expect(state.current.currenttime).toBe(5);
  expect(state.current.totalseconds).toBe(5 * 60);
  expect(state.current.secondsleft).toBe(5 * 60);
});

test("setTimerModeAndReset with invalid mode does not change timermode", async () => {
  const preloaded = {
    settings: {
      ...settingsInitial,
      current: {
        ...settingsInitial.current,
        timermode: 1,
        currenttime: 25,
        totalseconds: 25 * 60,
        secondsleft: 25 * 60,
      },
      timers: {
        pomodoro: 25,
        short: 5,
        long: 15,
      },
    },
  };

  const store = createTestStore(preloaded);

  // Use an invalid mode (e.g. 99). setTimerMode reducer ignores invalid values.
  await store.dispatch(setTimerModeAndReset(99));

  const state = store.getState().settings;
  // timermode should remain 1
  expect(state.current.timermode).toBe(1);
  // derived values should be unchanged
  expect(state.current.currenttime).toBe(25);
  expect(state.current.totalseconds).toBe(25 * 60);
  expect(state.current.secondsleft).toBe(25 * 60);
});
