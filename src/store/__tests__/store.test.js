// src/store/__tests__/store.test.js

describe("store.js module", () => {
  let mockLocalStorage;
  let consoleWarnSpy;

  beforeAll(() => {
    // Setup console.warn spy once
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation();
  });

  afterAll(() => {
    consoleWarnSpy.mockRestore();
  });

  beforeEach(() => {
    // Clear all module cache and mocks
    jest.resetModules();
    jest.clearAllMocks();
    consoleWarnSpy.mockClear();

    // Create fresh localStorage mock for each test
    let storage = {};
    mockLocalStorage = {
      getItem: jest.fn((key) => storage[key] || null),
      setItem: jest.fn((key, value) => {
        storage[key] = String(value);
      }),
      removeItem: jest.fn((key) => {
        delete storage[key];
      }),
      clear: jest.fn(() => {
        storage = {};
      }),
    };

    // Replace global localStorage
    Object.defineProperty(global, "localStorage", {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });
  });

  describe("loadState function", () => {
    it("should initialize with default state when localStorage is empty", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { store } = require("../store");
      const { initialState } = require("../settingsSlice");

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("pomobreakState");
      expect(store.getState().settings).toEqual(initialState);
    });

    it("should load saved settings from localStorage", () => {
      const { initialState } = require("../settingsSlice");
      const savedSettings = {
        ...initialState,
        alarm: { ...initialState.alarm, volume: 0.8 },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedSettings));

      const { store } = require("../store");

      expect(store.getState().settings.alarm.volume).toBe(0.8);
    });

    it("should migrate settings when version is missing", () => {
      const oldSettings = {
        timers: { pomodoro: 25, short: 5, long: 15 },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(oldSettings));

      const { store } = require("../store");
      const { initialState } = require("../settingsSlice");

      expect(store.getState().settings).toEqual(initialState);
    });

    it("should handle invalid JSON gracefully", () => {
      mockLocalStorage.getItem.mockReturnValue("invalid{json");

      const { store } = require("../store");
      const { initialState } = require("../settingsSlice");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to load settings from localStorage:",
        expect.any(Error)
      );
      expect(store.getState().settings).toEqual(initialState);
    });

    it("should handle localStorage.getItem throwing error", () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      // eslint-disable-next-line no-unused-vars
      const { store } = require("../store");

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to load settings from localStorage:",
        expect.any(Error)
      );
    });

    it("should extract settings from full store shape", () => {
      const { initialState } = require("../settingsSlice");
      const fullStoreShape = {
        settings: {
          ...initialState,
          alarm: { ...initialState.alarm, volume: 0.9 },
        },
        timer: { running: true },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(fullStoreShape));

      const { store } = require("../store");

      expect(store.getState().settings.alarm.volume).toBe(0.9);
    });

    it("should handle null parsed data", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(null));

      const { store } = require("../store");
      const { initialState } = require("../settingsSlice");

      expect(store.getState().settings).toEqual(initialState);
    });
  });

  describe("saveState function", () => {
    it("should save settings to localStorage on state change", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { store } = require("../store");
      const { setAlarmVolume } = require("../settingsSlice");

      mockLocalStorage.setItem.mockClear();

      store.dispatch(setAlarmVolume(0.75));

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "pomobreakState",
        expect.stringContaining('"volume":0.75')
      );
    });

    it("should only save settings slice not timer slice", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { store } = require("../store");
      const { pomoIncrement } = require("../settingsSlice");

      mockLocalStorage.setItem.mockClear();

      store.dispatch(pomoIncrement());

      expect(mockLocalStorage.setItem).toHaveBeenCalled();

      const savedData = mockLocalStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);

      expect(parsed).toHaveProperty("timers");
      expect(parsed).not.toHaveProperty("timer");
      expect(parsed).not.toHaveProperty("running");
    });

    it("should handle localStorage.setItem throwing error", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { store } = require("../store");
      const { setAlarmVolume } = require("../settingsSlice");

      mockLocalStorage.setItem.mockClear();
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

      store.dispatch(setAlarmVolume(0.6));

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Failed to save settings to localStorage:",
        expect.any(Error)
      );
    });

    it("should persist multiple state changes", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { store } = require("../store");
      const { setAlarmVolume, pomoIncrement } = require("../settingsSlice");

      mockLocalStorage.setItem.mockClear();

      store.dispatch(setAlarmVolume(0.3));
      store.dispatch(pomoIncrement());

      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);

      const lastSave = mockLocalStorage.setItem.mock.calls[1][1];
      const parsed = JSON.parse(lastSave);

      expect(parsed.alarm.volume).toBe(0.3);
      expect(parsed.timers.pomodoro).toBe(26);
    });
  });

  describe("store configuration", () => {
    it("should have settings and timer reducers", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { store } = require("../store");
      const state = store.getState();

      expect(state).toHaveProperty("settings");
      expect(state).toHaveProperty("timer");
    });

    it("should not preload timer slice from localStorage", () => {
      const { initialState } = require("../settingsSlice");
      const fullStoreShape = {
        settings: initialState,
        timer: { running: true, secondsLeft: 999 },
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(fullStoreShape));

      const { store } = require("../store");
      const state = store.getState();

      expect(state.timer.running).toBe(false);
      expect(state.timer.secondsLeft).toBe(1500);
    });
  });
});
