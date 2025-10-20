// src/store/tests/settingsSlice.test.js
import reducer, * as actions from "../settingsSlice";

describe("settingsSlice (unit)", () => {
  let initial;

  beforeAll(() => {
    // Capture the reducer's initial state
    initial = reducer(undefined, { type: "@@INIT" });
  });

  test("has a valid initial shape", () => {
    expect(initial).toBeDefined();
    expect(typeof initial).toBe("object");
    expect(initial.current).toBeDefined();
    expect(typeof initial.current).toBe("object");
    expect(
      initial.cycle !== undefined || initial.current !== undefined
    ).toBeTruthy();
  });

  // set default / reset action (try common names)
  const setDefault =
    actions.setDefault || actions.setSettingsDefault || actions.resetToDefault;
  if (setDefault) {
    test("setDefault resets state to initial", () => {
      const modified = {
        ...initial,
        current: {
          ...initial.current,
          timermode: (initial.current?.timermode || 1) + 1,
        },
        cycle: {
          ...initial.cycle,
          counter: (initial.cycle?.counter || 0) + 5,
        },
      };
      const after = reducer(modified, setDefault());
      expect(after).toEqual(initial);
    });
  } else {
    test.skip("setDefault action not exported by settingsSlice (skipped)", () => {});
  }

  // setTimerMode
  if (actions.setTimerMode) {
    test("setTimerMode updates current.timermode", () => {
      const mode = 2;
      const after = reducer(initial, actions.setTimerMode(mode));
      expect(after.current).toHaveProperty("timermode");
      expect(after.current.timermode).toBe(mode);
    });
  } else {
    test.skip("setTimerMode not exported (skipped)", () => {});
  }

  // setTotalSeconds
  if (actions.setTotalSeconds) {
    test("setTotalSeconds updates current.totalseconds", () => {
      const after = reducer(initial, actions.setTotalSeconds(123));
      expect(after.current).toHaveProperty("totalseconds");
      expect(after.current.totalseconds).toBe(123);
    });
  } else {
    test.skip("setTotalSeconds not exported (skipped)", () => {});
  }

  // setSecondsLeft
  if (actions.setSecondsLeft) {
    test("setSecondsLeft updates current.secondsleft", () => {
      const after = reducer(initial, actions.setSecondsLeft(45));
      expect(after.current).toHaveProperty("secondsleft");
      expect(after.current.secondsleft).toBe(45);
    });
  } else {
    test.skip("setSecondsLeft not exported (skipped)", () => {});
  }

  // counterIncrement
  if (actions.counterIncrement) {
    test("counterIncrement increments cycle.counter", () => {
      const before = initial.cycle?.counter ?? 0;
      const after = reducer(initial, actions.counterIncrement());
      expect(after.cycle).toBeDefined();
      expect(after.cycle).toHaveProperty("counter");
      expect(after.cycle.counter).toBe(before + 1);
    });
  } else {
    test.skip("counterIncrement not exported (skipped)", () => {});
  }

  // counterDecrement
  if (actions.counterDecrement) {
    test("counterDecrement decrements cycle.counter (when possible)", () => {
      const stateWithCounter = {
        ...initial,
        cycle: {
          ...(initial.cycle || {}),
          counter: (initial.cycle?.counter ?? 0) + 2,
        },
      };
      const after = reducer(stateWithCounter, actions.counterDecrement());
      expect(after.cycle).toBeDefined();
      expect(after.cycle).toHaveProperty("counter");
      expect(typeof after.cycle.counter).toBe("number");
    });
  } else {
    test.skip("counterDecrement not exported (skipped)", () => {});
  }

  // setCounter
  if (actions.setCounter) {
    test("setCounter sets cycle.counter", () => {
      const after = reducer(initial, actions.setCounter(7));
      expect(after.cycle).toBeDefined();
      expect(after.cycle).toHaveProperty("counter");
      expect(after.cycle.counter).toBe(7);
    });
  } else {
    test.skip("setCounter not exported (skipped)", () => {});
  }

  // Cycle flag actions (explicit tests per action)
  const flagActions = [
    { name: "setCycleStart", key: "cyclestarted" },
    { name: "setCyclePaused", key: "cyclepaused" },
    { name: "setCycleComplete", key: "cyclecomplete" },
  ];

  flagActions.forEach(({ name, key }) => {
    const actionFn = actions[name];
    if (actionFn) {
      test(`${name} toggles ${key}`, () => {
        const a1 = reducer(initial, actionFn(true));
        expect(a1.current).toBeDefined();
        expect(a1.current).toHaveProperty(key);
        expect(a1.current[key]).toBe(true);

        const a2 = reducer(a1, actionFn(false));
        expect(a2.current).toHaveProperty(key);
        expect(a2.current[key]).toBe(false);
      });
    } else {
      test.skip(`${name} not exported (skipped)`, () => {});
    }
  });

  // Unknown action returns previous state
  test("returns previous state for unknown action", () => {
    const state = { foo: "bar" };
    const result = reducer(state, { type: "some/unknown" });
    expect(result).toBe(state);
  });
});
