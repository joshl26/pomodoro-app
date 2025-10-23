import * as sel from "./settingsSelectors";

describe("settingsSelectors", () => {
  const baseState = {
    settings: {
      timers: {
        pomodoro: 30,
        short: 10,
        long: 20,
      },
      current: {
        timermode: 2,
        autostart: true,
        secondsleft: 120,
        currenttime: 25,
        totalseconds: 1500,
        cyclepaused: true,
        cyclecomplete: false,
        cyclestarted: true,
      },
      cycle: {
        sequence: [1, 2, 3],
        counter: 1,
      },
      alarm: {
        volume: 0.7,
        buttonSound: true,
        enabled: true,
        sound: "bell",
      },
    },
  };

  describe("Base selectors", () => {
    it("selectSettings returns settings slice or empty object", () => {
      expect(sel.selectSettings(baseState)).toEqual(baseState.settings);
      expect(sel.selectSettings({})).toEqual({});
    });

    it("selectTimers returns timers or empty object", () => {
      expect(sel.selectTimers(baseState)).toEqual(baseState.settings.timers);
      expect(sel.selectTimers({ settings: {} })).toEqual({});
    });

    it("selectPomodoro returns pomodoro or default 25", () => {
      expect(sel.selectPomodoro(baseState)).toBe(30);
      expect(sel.selectPomodoro({ settings: { timers: {} } })).toBe(25);
    });

    it("selectShort returns short or default 5", () => {
      expect(sel.selectShort(baseState)).toBe(10);
      expect(sel.selectShort({ settings: { timers: {} } })).toBe(5);
    });

    it("selectLong returns long or default 15", () => {
      expect(sel.selectLong(baseState)).toBe(20);
      expect(sel.selectLong({ settings: { timers: {} } })).toBe(15);
    });
  });

  describe("Current state selectors", () => {
    it("selectCurrent returns current or empty object", () => {
      expect(sel.selectCurrent(baseState)).toEqual(baseState.settings.current);
      expect(sel.selectCurrent({ settings: {} })).toEqual({});
    });

    it("selectTimerModeRaw returns timermode or 1", () => {
      expect(sel.selectTimerModeRaw(baseState)).toBe(2);
      expect(sel.selectTimerModeRaw({ settings: { current: {} } })).toBe(1);
    });

    it("selectIsAutoStartRaw returns autostart boolean", () => {
      expect(sel.selectIsAutoStartRaw(baseState)).toBe(true);
      expect(sel.selectIsAutoStartRaw({ settings: { current: {} } })).toBe(
        false
      );
    });

    it("selectSecondsLeftRaw returns secondsleft or null", () => {
      expect(sel.selectSecondsLeftRaw(baseState)).toBe(120);
      expect(
        sel.selectSecondsLeftRaw({ settings: { current: {} } })
      ).toBeNull();
    });

    it("selectCurrentTimeRaw returns currenttime or null", () => {
      expect(sel.selectCurrentTimeRaw(baseState)).toBe(25);
      expect(
        sel.selectCurrentTimeRaw({ settings: { current: {} } })
      ).toBeNull();
    });

    it("selectTotalSecondsRaw returns totalseconds or 1500", () => {
      expect(sel.selectTotalSecondsRaw(baseState)).toBe(1500);
      expect(sel.selectTotalSecondsRaw({ settings: { current: {} } })).toBe(
        1500
      );
    });
  });

  describe("Cycle selectors", () => {
    it("selectCycle returns cycle or empty object", () => {
      expect(sel.selectCycle(baseState)).toEqual(baseState.settings.cycle);
      expect(sel.selectCycle({ settings: {} })).toEqual({});
    });

    it("selectCycleSequence returns sequence or default", () => {
      expect(sel.selectCycleSequence(baseState)).toEqual([1, 2, 3]);
      expect(sel.selectCycleSequence({ settings: { cycle: {} } })).toEqual([
        1, 2, 1, 2, 1, 2, 1, 2, 3,
      ]);
    });

    it("selectCycleCounter returns counter or 0", () => {
      expect(sel.selectCycleCounter(baseState)).toBe(1);
      expect(sel.selectCycleCounter({ settings: { cycle: {} } })).toBe(0);
    });

    it("selectCyclePausedRaw returns boolean cyclepaused", () => {
      expect(sel.selectCyclePausedRaw(baseState)).toBe(true);
      expect(sel.selectCyclePausedRaw({ settings: { current: {} } })).toBe(
        false
      );
    });

    it("selectCycleCompleteRaw returns boolean cyclecomplete", () => {
      expect(sel.selectCycleCompleteRaw(baseState)).toBe(false);
      expect(sel.selectCycleCompleteRaw({ settings: { current: {} } })).toBe(
        false
      );
    });

    it("selectCycleStartedRaw returns boolean cyclestarted", () => {
      expect(sel.selectCycleStartedRaw(baseState)).toBe(true);
      expect(sel.selectCycleStartedRaw({ settings: { current: {} } })).toBe(
        false
      );
    });
  });

  describe("Alarm selectors", () => {
    it("selectAlarm returns alarm or default alarm settings", () => {
      expect(sel.selectAlarm(baseState)).toEqual(baseState.settings.alarm);
      expect(sel.selectAlarm({ settings: {} })).toEqual({
        volume: 0.5,
        buttonSound: false,
        enabled: false,
        sound: "No Sound",
      });
    });

    it("selectButtonSoundRaw returns boolean buttonSound", () => {
      expect(sel.selectButtonSoundRaw(baseState)).toBe(true);
      expect(sel.selectButtonSoundRaw({ settings: { alarm: {} } })).toBe(false);
    });

    it("selectAlarmVolumeRaw returns volume or 0.5", () => {
      expect(sel.selectAlarmVolumeRaw(baseState)).toBe(0.7);
      expect(sel.selectAlarmVolumeRaw({ settings: { alarm: {} } })).toBe(0.5);
    });

    it('selectAlarmSoundRaw returns sound or "No Sound"', () => {
      expect(sel.selectAlarmSoundRaw(baseState)).toBe("bell");
      expect(sel.selectAlarmSoundRaw({ settings: { alarm: {} } })).toBe(
        "No Sound"
      );
    });

    it("selectAlarmEnabledRaw returns boolean enabled", () => {
      expect(sel.selectAlarmEnabledRaw(baseState)).toBe(true);
      expect(sel.selectAlarmEnabledRaw({ settings: { alarm: {} } })).toBe(
        false
      );
    });
  });

  describe("Memoized selectors", () => {
    it("selectTimerMode normalizes mode correctly", () => {
      expect(
        sel.selectTimerMode({ settings: { current: { timermode: 2 } } })
      ).toBe(2);
      expect(
        sel.selectTimerMode({ settings: { current: { timermode: 0 } } })
      ).toBe(1);
      expect(
        sel.selectTimerMode({ settings: { current: { timermode: 4 } } })
      ).toBe(1);
      expect(
        sel.selectTimerMode({ settings: { current: { timermode: "2" } } })
      ).toBe(2);
      expect(
        sel.selectTimerMode({ settings: { current: { timermode: NaN } } })
      ).toBe(1);
    });

    it("selectIsAutoStart returns boolean", () => {
      expect(
        sel.selectIsAutoStart({ settings: { current: { autostart: true } } })
      ).toBe(true);
      expect(
        sel.selectIsAutoStart({ settings: { current: { autostart: 0 } } })
      ).toBe(false);
    });

    it("selectAlarmSettings returns default when all defaults", () => {
      expect(sel.selectAlarmSettings({ settings: { alarm: {} } })).toEqual({
        volume: 0.5,
        buttonSound: false,
        enabled: false,
        sound: "No Sound",
      });
    });

    it("selectAlarmSettings returns normalized values", () => {
      const state = {
        settings: {
          alarm: {
            volume: 0.8,
            buttonSound: true,
            enabled: true,
            sound: "ring",
          },
        },
      };
      expect(sel.selectAlarmSettings(state)).toEqual({
        volume: 0.8,
        buttonSound: true,
        enabled: true,
        sound: "ring",
      });
    });

    it("selectCurrentTime returns currentTimeRaw if valid", () => {
      const state = {
        settings: {
          current: {
            currenttime: 10,
            timermode: 1,
            timers: { pomodoro: 25, short: 5, long: 15 },
          },
          timers: { pomodoro: 25, short: 5, long: 15 },
        },
      };
      expect(sel.selectCurrentTime(state)).toBe(10);
    });

    it("selectCurrentTime returns timer based on mode if currentTimeRaw invalid", () => {
      const state = {
        settings: {
          current: { currenttime: null, timermode: 2 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        },
      };
      expect(sel.selectCurrentTime(state)).toBe(5);
    });

    it("selectSecondsLeft returns raw if present", () => {
      const state = {
        settings: {
          current: { secondsleft: 100, currenttime: 5 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        },
      };
      expect(sel.selectSecondsLeft(state)).toBe(100);
    });

    it("selectSecondsLeft derives from currentTime if raw missing", () => {
      const state = {
        settings: {
          current: { secondsleft: null, currenttime: 5 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        },
      };
      expect(sel.selectSecondsLeft(state)).toBe(300);
    });

    it("selectProgress calculates progress correctly", () => {
      const state = {
        settings: {
          current: { currenttime: 5, secondsleft: 150, totalseconds: 300 },
          timers: { pomodoro: 25, short: 5, long: 15 },
        },
      };
      const progress = sel.selectProgress(state);
      expect(progress.totalSeconds).toBe(300);
      expect(progress.secondsLeft).toBe(150);
      expect(progress.elapsedSeconds).toBe(150);
      expect(progress.percent).toBeCloseTo(50);
    });

    it("selectCycleLength returns sequence length", () => {
      const state = {
        settings: {
          cycle: { sequence: [1, 2, 3, 4] },
        },
      };
      expect(sel.selectCycleLength(state)).toBe(4);
    });

    it("selectCurrentModeValue returns correct timer value", () => {
      const baseTimers = { pomodoro: 25, short: 5, long: 15 };

      const statePomodoro = {
        settings: {
          timers: baseTimers,
          current: { timermode: 1 },
        },
      };

      const stateShort = {
        settings: {
          timers: baseTimers,
          current: { timermode: 2 },
        },
      };

      const stateLong = {
        settings: {
          timers: baseTimers,
          current: { timermode: 3 },
        },
      };

      const stateDefault = {
        settings: {
          timers: baseTimers,
          current: { timermode: 999 },
        },
      };

      expect(sel.selectCurrentModeValue(statePomodoro)).toBe(25);
      expect(sel.selectCurrentModeValue(stateShort)).toBe(5);
      expect(sel.selectCurrentModeValue(stateLong)).toBe(15);
      expect(sel.selectCurrentModeValue(stateDefault)).toBe(25);
    });

    it("selectCyclePaused returns boolean", () => {
      expect(
        sel.selectCyclePaused({ settings: { current: { cyclepaused: true } } })
      ).toBe(true);
      expect(
        sel.selectCyclePaused({ settings: { current: { cyclepaused: false } } })
      ).toBe(false);
    });

    it("selectCycleComplete returns boolean", () => {
      expect(
        sel.selectCycleComplete({
          settings: { current: { cyclecomplete: true } },
        })
      ).toBe(true);
      expect(
        sel.selectCycleComplete({
          settings: { current: { cyclecomplete: false } },
        })
      ).toBe(false);
    });

    it("selectCycleStarted returns boolean", () => {
      expect(
        sel.selectCycleStarted({
          settings: { current: { cyclestarted: true } },
        })
      ).toBe(true);
      expect(
        sel.selectCycleStarted({
          settings: { current: { cyclestarted: false } },
        })
      ).toBe(false);
    });

    it("selectAlarmVolume returns volume or default", () => {
      expect(
        sel.selectAlarmVolume({ settings: { alarm: { volume: 0.7 } } })
      ).toBe(0.7);
      expect(sel.selectAlarmVolume({ settings: { alarm: {} } })).toBe(0.5);
    });

    it("selectButtonSound returns boolean or default", () => {
      expect(
        sel.selectButtonSound({ settings: { alarm: { buttonSound: true } } })
      ).toBe(true);
      expect(sel.selectButtonSound({ settings: { alarm: {} } })).toBe(false);
    });

    it("selectAlarmEnabled returns boolean or default", () => {
      expect(
        sel.selectAlarmEnabled({ settings: { alarm: { enabled: true } } })
      ).toBe(true);
      expect(sel.selectAlarmEnabled({ settings: { alarm: {} } })).toBe(false);
    });

    it("selectAlarmSound returns string or default", () => {
      expect(
        sel.selectAlarmSound({ settings: { alarm: { sound: "ring" } } })
      ).toBe("ring");
      expect(sel.selectAlarmSound({ settings: { alarm: {} } })).toBe(
        "No Sound"
      );
    });
  });
});
