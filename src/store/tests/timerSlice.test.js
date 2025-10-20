import reducer, {
  setTotalSeconds,
  setSecondsLeft,
  startTimer,
  pauseTimer,
  stopTimer,
  setEndTimestamp,
  tick,
  triggerAlarm,
  resetTimerForMode,
} from "../timerSlice";

describe("timerSlice", () => {
  const initialState = {
    running: false,
    totalSeconds: 1500,
    secondsLeft: 1500,
    endTimestamp: null,
    alarmTriggered: false,
  };

  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it("should handle setTotalSeconds", () => {
    const actual = reducer(initialState, setTotalSeconds(300));
    expect(actual.totalSeconds).toBe(300);
  });

  it("should handle setSecondsLeft", () => {
    const actual = reducer(initialState, setSecondsLeft(600));
    expect(actual.secondsLeft).toBe(600);
  });

  it("should handle startTimer", () => {
    const actual = reducer(initialState, startTimer());
    expect(actual.running).toBe(true);
    expect(actual.alarmTriggered).toBe(false);
  });

  it("should handle pauseTimer", () => {
    const state = { ...initialState, running: true, endTimestamp: 1000 };
    const actual = reducer(state, pauseTimer());
    expect(actual.running).toBe(false);
    expect(actual.endTimestamp).toBeNull();
  });

  it("should handle stopTimer", () => {
    const state = {
      running: true,
      totalSeconds: 300,
      secondsLeft: 150,
      endTimestamp: 1000,
      alarmTriggered: true,
    };
    const actual = reducer(state, stopTimer());
    expect(actual).toEqual({
      running: false,
      totalSeconds: 300,
      secondsLeft: 300,
      endTimestamp: null,
      alarmTriggered: false,
    });
  });

  it("should handle setEndTimestamp", () => {
    const actual = reducer(initialState, setEndTimestamp(5000));
    expect(actual.endTimestamp).toBe(5000);
  });

  it("should handle tick when timer is running", () => {
    const now = 10000;
    const state = {
      ...initialState,
      running: true,
      endTimestamp: now + 5000, // Should have 5 seconds left
    };
    const actual = reducer(state, tick({ now }));
    expect(actual.secondsLeft).toBe(5);
  });

  it("should handle tick when timer completes", () => {
    const now = 10000;
    const state = {
      ...initialState,
      running: true,
      endTimestamp: now - 1000, // Already past end time
    };
    const actual = reducer(state, tick({ now }));
    expect(actual.running).toBe(false);
    expect(actual.endTimestamp).toBeNull();
    expect(actual.alarmTriggered).toBe(true);
  });

  it("should handle triggerAlarm", () => {
    const state = { ...initialState, running: true };
    const actual = reducer(state, triggerAlarm());
    expect(actual.alarmTriggered).toBe(true);
    expect(actual.running).toBe(false);
  });

  it("should handle resetTimerForMode", () => {
    const state = {
      running: true,
      totalSeconds: 300,
      secondsLeft: 150,
      endTimestamp: 1000,
      alarmTriggered: true,
    };
    const actual = reducer(state, resetTimerForMode({ totalSeconds: 600 }));
    expect(actual).toEqual({
      running: false,
      totalSeconds: 600,
      secondsLeft: 600,
      endTimestamp: null,
      alarmTriggered: false,
    });
  });
});
