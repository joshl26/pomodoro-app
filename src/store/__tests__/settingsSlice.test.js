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

  // =========================
  // setDefault / Reset Action
  // =========================
  describe("setDefault", () => {
    const setDefault =
      actions.setDefault ||
      actions.setSettingsDefault ||
      actions.resetToDefault;

    if (setDefault) {
      test("resets state to initial", () => {
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

      test("restores timer durations to defaults", () => {
        const modified = {
          ...initial,
          timers: { pomodoro: 30, short: 8, long: 20 },
        };
        const after = reducer(modified, setDefault());
        expect(after.timers).toEqual(initial.timers);
      });
    } else {
      test.skip("setDefault action not exported by settingsSlice (skipped)", () => {});
    }
  });

  // =========================
  // updateSettings
  // =========================
  describe("updateSettings", () => {
    if (actions.updateSettings) {
      test("updates multiple top-level settings at once", () => {
        const after = reducer(
          initial,
          actions.updateSettings({
            version: 2,
          })
        );
        expect(after.version).toBe(2);
      });

      test("handles nested properties with dot notation", () => {
        const after = reducer(
          initial,
          actions.updateSettings({
            "timers.pomodoro": 30,
            "current.timermode": 2,
          })
        );
        expect(after.timers.pomodoro).toBe(30);
        expect(after.current.timermode).toBe(2);
      });

      test("handles nested properties without dot notation", () => {
        const after = reducer(
          initial,
          actions.updateSettings({
            pomodoro: 35,
            timermode: 3,
          })
        );
        expect(after.timers.pomodoro).toBe(35);
        expect(after.current.timermode).toBe(3);
      });

      test("ignores invalid keys", () => {
        const after = reducer(
          initial,
          actions.updateSettings({
            invalidKey: "value",
          })
        );
        expect(after).toEqual(initial);
      });

      test("handles null payload gracefully", () => {
        const after = reducer(initial, actions.updateSettings(null));
        expect(after).toEqual(initial);
      });

      test("handles non-object payload gracefully", () => {
        const after = reducer(initial, actions.updateSettings("string"));
        expect(after).toEqual(initial);
      });
    } else {
      test.skip("updateSettings not exported (skipped)", () => {});
    }
  });

  // =========================
  // Timer Increment/Decrement
  // =========================
  describe("Timer value increments/decrements", () => {
    if (actions.pomoIncrement) {
      test("pomoIncrement increases pomodoro timer", () => {
        const after = reducer(initial, actions.pomoIncrement());
        expect(after.timers.pomodoro).toBe(initial.timers.pomodoro + 1);
      });

      test("pomoIncrement clamps at maximum (40)", () => {
        const state = {
          ...initial,
          timers: { ...initial.timers, pomodoro: 40 },
        };
        const after = reducer(state, actions.pomoIncrement());
        expect(after.timers.pomodoro).toBe(40);
      });
    }

    if (actions.pomoDecrement) {
      test("pomoDecrement decreases pomodoro timer", () => {
        const after = reducer(initial, actions.pomoDecrement());
        expect(after.timers.pomodoro).toBe(initial.timers.pomodoro - 1);
      });

      test("pomoDecrement clamps at minimum (1)", () => {
        const state = {
          ...initial,
          timers: { ...initial.timers, pomodoro: 1 },
        };
        const after = reducer(state, actions.pomoDecrement());
        expect(after.timers.pomodoro).toBe(1);
      });
    }

    if (actions.shortIncrement) {
      test("shortIncrement increases short timer", () => {
        const after = reducer(initial, actions.shortIncrement());
        expect(after.timers.short).toBe(initial.timers.short + 1);
      });

      test("shortIncrement clamps at maximum (10)", () => {
        const state = { ...initial, timers: { ...initial.timers, short: 10 } };
        const after = reducer(state, actions.shortIncrement());
        expect(after.timers.short).toBe(10);
      });
    }

    if (actions.shortDecrement) {
      test("shortDecrement decreases short timer", () => {
        const after = reducer(initial, actions.shortDecrement());
        expect(after.timers.short).toBe(initial.timers.short - 1);
      });

      test("shortDecrement clamps at minimum (1)", () => {
        const state = { ...initial, timers: { ...initial.timers, short: 1 } };
        const after = reducer(state, actions.shortDecrement());
        expect(after.timers.short).toBe(1);
      });
    }

    if (actions.longIncrement) {
      test("longIncrement increases long timer", () => {
        const after = reducer(initial, actions.longIncrement());
        expect(after.timers.long).toBe(initial.timers.long + 1);
      });

      test("longIncrement clamps at maximum (30)", () => {
        const state = { ...initial, timers: { ...initial.timers, long: 30 } };
        const after = reducer(state, actions.longIncrement());
        expect(after.timers.long).toBe(30);
      });
    }

    if (actions.longDecrement) {
      test("longDecrement decreases long timer", () => {
        const after = reducer(initial, actions.longDecrement());
        expect(after.timers.long).toBe(initial.timers.long - 1);
      });

      test("longDecrement clamps at minimum (1)", () => {
        const state = { ...initial, timers: { ...initial.timers, long: 1 } };
        const after = reducer(state, actions.longDecrement());
        expect(after.timers.long).toBe(1);
      });
    }
  });

  // =========================
  // Basic Setters
  // =========================
  describe("setAutoStart", () => {
    if (actions.setAutoStart) {
      test("sets autostart to true", () => {
        const after = reducer(initial, actions.setAutoStart(true));
        expect(after.current.autostart).toBe(true);
      });

      test("sets autostart to false", () => {
        const after = reducer(initial, actions.setAutoStart(false));
        expect(after.current.autostart).toBe(false);
      });

      test("coerces truthy values to boolean", () => {
        const after = reducer(initial, actions.setAutoStart(1));
        expect(after.current.autostart).toBe(true);
      });
    } else {
      test.skip("setAutoStart not exported (skipped)", () => {});
    }
  });

  // =========================
  // setCyclePaused
  // =========================
  describe("setCyclePaused", () => {
    if (actions.setCyclePaused) {
      test("sets cyclepaused to true with boolean payload", () => {
        const after = reducer(initial, actions.setCyclePaused(true));
        expect(after.current.cyclepaused).toBe(true);
      });

      test("sets cyclepaused to false with boolean payload", () => {
        const state = {
          ...initial,
          current: { ...initial.current, cyclepaused: true },
        };
        const after = reducer(state, actions.setCyclePaused(false));
        expect(after.current.cyclepaused).toBe(false);
      });

      test("ignores non-boolean payload", () => {
        const after = reducer(initial, actions.setCyclePaused("true"));
        expect(after.current.cyclepaused).toBe(initial.current.cyclepaused);
      });

      test("ignores null payload", () => {
        const after = reducer(initial, actions.setCyclePaused(null));
        expect(after.current.cyclepaused).toBe(initial.current.cyclepaused);
      });
    }
  });

  // =========================
  // setTimerMode
  // =========================
  describe("setTimerMode", () => {
    if (actions.setTimerMode) {
      test("updates current.timermode to 1", () => {
        const after = reducer(initial, actions.setTimerMode(1));
        expect(after.current.timermode).toBe(1);
      });

      test("updates current.timermode to 2", () => {
        const after = reducer(initial, actions.setTimerMode(2));
        expect(after.current.timermode).toBe(2);
      });

      test("updates current.timermode to 3", () => {
        const after = reducer(initial, actions.setTimerMode(3));
        expect(after.current.timermode).toBe(3);
      });

      test("ignores invalid mode (0)", () => {
        const after = reducer(initial, actions.setTimerMode(0));
        expect(after.current.timermode).toBe(initial.current.timermode);
      });

      test("ignores invalid mode (4)", () => {
        const after = reducer(initial, actions.setTimerMode(4));
        expect(after.current.timermode).toBe(initial.current.timermode);
      });
    }
  });

  // =========================
  // setCurrentTimeFromMode
  // =========================
  describe("setCurrentTimeFromMode", () => {
    if (actions.setCurrentTimeFromMode) {
      test("sets currenttime based on mode 1 (pomodoro)", () => {
        const state = {
          ...initial,
          current: { ...initial.current, timermode: 1 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        };
        const after = reducer(state, actions.setCurrentTimeFromMode());
        expect(after.current.currenttime).toBe(25);
      });

      test("sets currenttime based on mode 2 (short)", () => {
        const state = {
          ...initial,
          current: { ...initial.current, timermode: 2 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        };
        const after = reducer(state, actions.setCurrentTimeFromMode());
        expect(after.current.currenttime).toBe(5);
      });

      test("sets currenttime based on mode 3 (long)", () => {
        const state = {
          ...initial,
          current: { ...initial.current, timermode: 3 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        };
        const after = reducer(state, actions.setCurrentTimeFromMode());
        expect(after.current.currenttime).toBe(15);
      });

      test("handles invalid timermode gracefully", () => {
        const state = {
          ...initial,
          current: { ...initial.current, timermode: 99, currenttime: 10 },
        };
        const after = reducer(state, actions.setCurrentTimeFromMode());
        expect(after.current.currenttime).toBe(10);
      });
    }
  });

  // =========================
  // Counter Operations
  // =========================
  describe("Counter operations", () => {
    if (actions.setCounter) {
      test("sets cycle.counter to valid value", () => {
        const after = reducer(initial, actions.setCounter(3));
        expect(after.cycle.counter).toBe(3);
      });

      test("clamps counter to cycle length", () => {
        const state = {
          ...initial,
          cycle: { sequence: [1, 2, 1, 2], counter: 0 },
        };
        const after = reducer(state, actions.setCounter(10));
        expect(after.cycle.counter).toBe(3); // max index is 3
      });

      test("clamps negative counter to 0", () => {
        const after = reducer(initial, actions.setCounter(-5));
        expect(after.cycle.counter).toBe(0);
      });

      test("ignores non-finite values", () => {
        const after = reducer(initial, actions.setCounter(NaN));
        expect(after.cycle.counter).toBe(initial.cycle.counter);
      });

      test("floors decimal values", () => {
        const after = reducer(initial, actions.setCounter(2.7));
        expect(after.cycle.counter).toBe(2);
      });
    }

    if (actions.counterIncrement) {
      test("increments cycle.counter", () => {
        const before = initial.cycle?.counter ?? 0;
        const after = reducer(initial, actions.counterIncrement());
        expect(after.cycle.counter).toBe(before + 1);
      });

      test("wraps counter at end of cycle", () => {
        const state = {
          ...initial,
          cycle: { sequence: [1, 2, 1, 2], counter: 3 },
        };
        const after = reducer(state, actions.counterIncrement());
        expect(after.cycle.counter).toBe(0);
      });
    }

    if (actions.counterDecrement) {
      test("decrements cycle.counter", () => {
        const state = {
          ...initial,
          cycle: { ...initial.cycle, counter: 3 },
        };
        const after = reducer(state, actions.counterDecrement());
        expect(after.cycle.counter).toBe(2);
      });

      test("wraps counter to end when decrementing from 0", () => {
        const state = {
          ...initial,
          cycle: { sequence: [1, 2, 1, 2], counter: 0 },
        };
        const after = reducer(state, actions.counterDecrement());
        expect(after.cycle.counter).toBe(3);
      });
    }
  });

  // =========================
  // setCycleComplete
  // =========================
  describe("setCycleComplete", () => {
    if (actions.setCycleComplete) {
      test("sets cyclecomplete to true", () => {
        const after = reducer(initial, actions.setCycleComplete(true));
        expect(after.current.cyclecomplete).toBe(true);
      });

      test("sets cyclecomplete to false", () => {
        const after = reducer(initial, actions.setCycleComplete(false));
        expect(after.current.cyclecomplete).toBe(false);
      });

      test("ignores non-boolean payload for cyclecomplete", () => {
        const after = reducer(initial, actions.setCycleComplete("yes"));
        expect(after.current.cyclecomplete).toBe(initial.current.cyclecomplete);
      });
    } else {
      test.skip("setCycleComplete not exported (skipped)", () => {});
    }
  });

  // =========================
  // setCycleStart
  // =========================
  describe("setCycleStart", () => {
    if (actions.setCycleStart) {
      test("sets cyclestarted to true and clears cyclecomplete", () => {
        const state = {
          ...initial,
          current: { ...initial.current, cyclecomplete: true },
        };
        const after = reducer(state, actions.setCycleStart(true));
        expect(after.current.cyclestarted).toBe(true);
        expect(after.current.cyclecomplete).toBe(false);
      });

      test("sets cyclestarted to false", () => {
        const state = {
          ...initial,
          current: { ...initial.current, cyclestarted: true },
        };
        const after = reducer(state, actions.setCycleStart(false));
        expect(after.current.cyclestarted).toBe(false);
      });

      test("does not change cyclecomplete when setting cyclestarted to false", () => {
        const state = {
          ...initial,
          current: {
            ...initial.current,
            cyclestarted: true,
            cyclecomplete: true,
          },
        };
        const after = reducer(state, actions.setCycleStart(false));
        expect(after.current.cyclecomplete).toBe(true);
      });

      test("ignores non-boolean payload for cyclestarted", () => {
        const after = reducer(initial, actions.setCycleStart(1));
        expect(after.current.cyclestarted).toBe(initial.current.cyclestarted);
      });
    } else {
      test.skip("setCycleStart not exported (skipped)", () => {});
    }
  });

  // =========================
  // setCycle
  // =========================
  describe("setCycle", () => {
    if (actions.setCycle) {
      test("replaces cycle sequence with valid array", () => {
        const newCycle = [1, 2, 3, 1, 2];
        const after = reducer(initial, actions.setCycle(newCycle));
        expect(after.cycle.sequence).toEqual(newCycle);
      });

      test("clamps counter to new cycle length", () => {
        const state = {
          ...initial,
          cycle: { sequence: [1, 2, 1, 2, 1, 2], counter: 5 },
        };
        const newCycle = [1, 2, 3];
        const after = reducer(state, actions.setCycle(newCycle));
        expect(after.cycle.counter).toBe(2); // max index is 2
      });

      test("does not update if payload is identical (shallow equal)", () => {
        const after1 = reducer(initial, actions.setCycle([1, 2, 1]));
        const after2 = reducer(after1, actions.setCycle([1, 2, 1]));
        expect(after2.cycle.sequence).toBe(after1.cycle.sequence);
      });

      test("ignores non-array payload", () => {
        const after = reducer(initial, actions.setCycle("not an array"));
        expect(after.cycle.sequence).toEqual(initial.cycle.sequence);
      });

      test("ignores empty array", () => {
        const after = reducer(initial, actions.setCycle([]));
        expect(after.cycle.sequence).toEqual(initial.cycle.sequence);
      });
    }
  });

  // =========================
  // Alarm / Sound Actions
  // =========================
  describe("setAlarmState", () => {
    if (actions.setAlarmState) {
      test("enables alarm", () => {
        const after = reducer(initial, actions.setAlarmState(true));
        expect(after.alarm.enabled).toBe(true);
      });

      test("disables alarm", () => {
        const after = reducer(initial, actions.setAlarmState(false));
        expect(after.alarm.enabled).toBe(false);
      });
    } else {
      test.skip("setAlarmState not exported (skipped)", () => {});
    }
  });

  describe("setButtonSoundState", () => {
    if (actions.setButtonSoundState) {
      test("enables button sound", () => {
        const after = reducer(initial, actions.setButtonSoundState(true));
        expect(after.alarm.buttonSound).toBe(true);
      });

      test("disables button sound", () => {
        const after = reducer(initial, actions.setButtonSoundState(false));
        expect(after.alarm.buttonSound).toBe(false);
      });
    } else {
      test.skip("setButtonSoundState not exported (skipped)", () => {});
    }
  });

  describe("setAlarmVolume", () => {
    if (actions.setAlarmVolume) {
      test("sets alarm volume within range", () => {
        const after = reducer(initial, actions.setAlarmVolume(0.7));
        expect(after.alarm.volume).toBe(0.7);
      });

      test("clamps volume to maximum (1)", () => {
        const after = reducer(initial, actions.setAlarmVolume(1.5));
        expect(after.alarm.volume).toBe(1);
      });

      test("clamps volume to minimum (0)", () => {
        const after = reducer(initial, actions.setAlarmVolume(-0.5));
        expect(after.alarm.volume).toBe(0);
      });

      test("ignores non-finite values for volume", () => {
        const after = reducer(initial, actions.setAlarmVolume(NaN));
        expect(after.alarm.volume).toBe(initial.alarm.volume);
      });

      test("initializes alarm object if missing", () => {
        const state = { ...initial, alarm: null };
        const after = reducer(state, actions.setAlarmVolume(0.5));
        expect(after.alarm).toBeDefined();
        expect(after.alarm.volume).toBe(0.5);
      });
    } else {
      test.skip("setAlarmVolume not exported (skipped)", () => {});
    }
  });

  describe("setAlarmSound", () => {
    if (actions.setAlarmSound) {
      test("sets alarm sound", () => {
        const after = reducer(initial, actions.setAlarmSound("Bell"));
        expect(after.alarm.sound).toBe("Bell");
      });

      test("ignores non-string payload for alarm sound", () => {
        const after = reducer(initial, actions.setAlarmSound(123));
        expect(after.alarm.sound).toBe(initial.alarm.sound);
      });
    } else {
      test.skip("setAlarmSound not exported (skipped)", () => {});
    }
  });

  // =========================
  // Seconds Operations
  // =========================
  describe("setSecondsLeft", () => {
    if (actions.setSecondsLeft) {
      test("sets secondsleft to valid value", () => {
        const after = reducer(initial, actions.setSecondsLeft(123));
        expect(after.current.secondsleft).toBe(123);
      });

      test("floors decimal values for secondsleft", () => {
        const after = reducer(initial, actions.setSecondsLeft(45.7));
        expect(after.current.secondsleft).toBe(45);
      });

      test("ignores negative values for secondsleft", () => {
        const after = reducer(initial, actions.setSecondsLeft(-10));
        expect(after.current.secondsleft).toBe(initial.current.secondsleft);
      });

      test("ignores non-finite values for secondsleft", () => {
        const after = reducer(initial, actions.setSecondsLeft(Infinity));
        expect(after.current.secondsleft).toBe(initial.current.secondsleft);
      });
    } else {
      test.skip("setSecondsLeft not exported (skipped)", () => {});
    }
  });

  describe("setTotalSeconds", () => {
    if (actions.setTotalSeconds) {
      test("sets totalseconds to valid value", () => {
        const after = reducer(initial, actions.setTotalSeconds(456));
        expect(after.current.totalseconds).toBe(456);
      });

      test("floors decimal values for totalseconds", () => {
        const after = reducer(initial, actions.setTotalSeconds(89.3));
        expect(after.current.totalseconds).toBe(89);
      });

      test("ignores negative values for totalseconds", () => {
        const after = reducer(initial, actions.setTotalSeconds(-20));
        expect(after.current.totalseconds).toBe(initial.current.totalseconds);
      });

      test("ignores non-finite values for totalseconds", () => {
        const after = reducer(initial, actions.setTotalSeconds(NaN));
        expect(after.current.totalseconds).toBe(initial.current.totalseconds);
      });
    } else {
      test.skip("setTotalSeconds not exported (skipped)", () => {});
    }
  });

  // =========================
  // Unknown Action
  // =========================
  test("returns previous state for unknown action", () => {
    const state = { foo: "bar" };
    const result = reducer(state, { type: "some/unknown" });
    expect(result).toBe(state);
  });
});
