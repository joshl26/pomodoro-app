/* eslint-disable import/first */
// src/hooks/__tests__/useAudioManager.test.js
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, { initialState } from "../../store/settingsSlice";
import {
  setAlarmVolume,
  setButtonSoundState,
  setAlarmSound,
} from "../../store/settingsSlice";

// Mock AudioManager - this MUST come before any imports that use it
jest.mock("../../audio/AudioManager");

// Import hook and the mocked audioManager AFTER jest.mock
import { useAudioManager } from "../useAudioManager";
import audioManager from "../../audio/AudioManager";

// Configure the mocked methods
audioManager.play = jest.fn().mockResolvedValue();
audioManager.load = jest.fn().mockReturnValue({});
audioManager.setVolume = jest.fn();
audioManager.stop = jest.fn();
audioManager.mute = jest.fn();
audioManager.unmute = jest.fn();
audioManager.isMuted = jest.fn().mockReturnValue(false);
audioManager.getAvailableSounds = jest
  .fn()
  .mockReturnValue(["button", "Bell", "Digital", "Kitchen", "alarm", "tick"]);

// Helper to create a test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      settings: settingsReducer,
    },
    preloadedState: {
      settings: {
        ...initialState,
        ...preloadedState,
      },
    },
  });
};

// Wrapper component for renderHook
const createWrapper = (store) => {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

describe("useAudioManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset default mock implementations
    audioManager.play.mockResolvedValue();
    audioManager.load.mockReturnValue({});
    audioManager.isMuted.mockReturnValue(false);
  });

  describe("play method", () => {
    test("calls audioManager.play with correct sound name", async () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Bell");

      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: 0.5,
      });
    });

    test("uses volume from Redux store when no explicit volume provided", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0.7 },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Digital");

      expect(audioManager.play).toHaveBeenCalledWith("Digital", {
        volume: 0.7,
      });
    });

    test("prefers explicit volume option over Redux volume", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0.5 },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Bell", { volume: 0.9 });

      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: 0.9,
      });
    });

    test("passes additional options to audioManager.play", async () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Kitchen", { loop: true, volume: 0.3 });

      expect(audioManager.play).toHaveBeenCalledWith("Kitchen", {
        loop: true,
        volume: 0.3,
      });
    });

    test("handles audioManager.play throwing error", async () => {
      audioManager.play.mockRejectedValueOnce(new Error("Play failed"));
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await expect(result.current.play("Bell")).rejects.toThrow("Play failed");
    });

    test("uses undefined volume when alarm settings are missing", async () => {
      const store = createTestStore({
        alarm: null,
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Bell");

      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: undefined,
      });
    });

    test("play handles invalid sound name gracefully", async () => {
      audioManager.play.mockRejectedValueOnce(new Error("Invalid sound"));
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await expect(result.current.play("UnknownSound")).rejects.toThrow(
        "Invalid sound"
      );
    });
  });

  describe("stop method", () => {
    test("calls audioManager.stop with sound name", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      result.current.stop("Bell");

      expect(audioManager.stop).toHaveBeenCalledWith("Bell");
    });

    test("handles audioManager.stop throwing error gracefully", () => {
      audioManager.stop.mockImplementationOnce(() => {
        throw new Error("Stop failed");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const returnValue = result.current.stop("Bell");

      expect(returnValue).toBeNull();
      expect(audioManager.stop).toHaveBeenCalledWith("Bell");
    });
  });

  describe("load method", () => {
    test("calls audioManager.load with sound name", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      result.current.load("Digital");

      expect(audioManager.load).toHaveBeenCalledWith("Digital");
    });

    test("returns result from audioManager.load", () => {
      const mockAudioElement = { play: jest.fn() };
      audioManager.load.mockReturnValueOnce(mockAudioElement);
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const returnValue = result.current.load("Kitchen");

      expect(returnValue).toBe(mockAudioElement);
    });

    test("handles audioManager.load throwing error gracefully", () => {
      audioManager.load.mockImplementationOnce(() => {
        throw new Error("Load failed");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const returnValue = result.current.load("Bell");

      expect(returnValue).toBeNull();
    });
  });

  describe("playButtonSound method", () => {
    test("plays button sound with volume from Redux", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0.6, buttonSound: true },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).toHaveBeenCalledWith("button", {
        volume: 0.6,
      });
    });

    test("does not play when buttonSound is false", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, buttonSound: false },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).not.toHaveBeenCalled();
    });

    test("plays when buttonSound is undefined", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, buttonSound: undefined },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).toHaveBeenCalledWith("button", {
        volume: 0.5,
      });
    });

    test("plays when buttonSound is true", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, buttonSound: true },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).toHaveBeenCalledWith("button", {
        volume: 0.5,
      });
    });

    test("handles audioManager.play throwing error gracefully", async () => {
      audioManager.play.mockRejectedValueOnce(new Error("Play failed"));
      const store = createTestStore({
        alarm: { ...initialState.alarm, buttonSound: true },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      // Should not throw, just resolve
      await expect(result.current.playButtonSound()).resolves.toBeUndefined();
    });

    test("uses undefined volume when alarm volume is not a number", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: "invalid", buttonSound: true },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).toHaveBeenCalledWith("button", {
        volume: undefined,
      });
    });

    test("playButtonSound does not play if volume is 0 and buttonSound is false", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0, buttonSound: false },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).not.toHaveBeenCalled();
    });
  });

  describe("setVolume method", () => {
    test("calls audioManager.setVolume with sound name and volume", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      result.current.setVolume("Bell", 0.8);

      expect(audioManager.setVolume).toHaveBeenCalledWith("Bell", 0.8);
    });

    test("handles audioManager.setVolume throwing error gracefully", () => {
      audioManager.setVolume.mockImplementationOnce(() => {
        throw new Error("Set volume failed");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const returnValue = result.current.setVolume("Bell", 0.8);

      expect(returnValue).toBeNull();
    });

    test("setVolume handles invalid volume values gracefully", () => {
      audioManager.setVolume.mockImplementationOnce(() => {
        throw new Error("Invalid volume");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const returnValue = result.current.setVolume("Bell", -1);
      expect(returnValue).toBeNull();
    });
  });

  describe("mute/unmute/isMuted methods", () => {
    test("mute calls audioManager.mute", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      result.current.mute();

      expect(audioManager.mute).toHaveBeenCalled();
    });

    test("handles audioManager.mute throwing error gracefully", () => {
      audioManager.mute.mockImplementationOnce(() => {
        throw new Error("Mute failed");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      expect(() => result.current.mute()).not.toThrow();
    });

    test("unmute calls audioManager.unmute", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      result.current.unmute();

      expect(audioManager.unmute).toHaveBeenCalled();
    });

    test("handles audioManager.unmute throwing error gracefully", () => {
      audioManager.unmute.mockImplementationOnce(() => {
        throw new Error("Unmute failed");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      expect(() => result.current.unmute()).not.toThrow();
    });

    test("isMuted calls audioManager.isMuted", () => {
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const muted = result.current.isMuted();

      expect(audioManager.isMuted).toHaveBeenCalled();
      expect(muted).toBe(false);
    });

    test("isMuted returns true when muted", () => {
      audioManager.isMuted.mockReturnValueOnce(true);
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const muted = result.current.isMuted();

      expect(muted).toBe(true);
    });

    test("handles audioManager.isMuted throwing error gracefully", () => {
      audioManager.isMuted.mockImplementationOnce(() => {
        throw new Error("isMuted failed");
      });
      const store = createTestStore();
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      expect(() => result.current.isMuted()).not.toThrow();
    });
  });

  describe("React hooks behavior", () => {
    test("play function updates when alarm volume changes", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0.5 },
      });
      const { result, rerender } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Bell");
      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: 0.5,
      });

      audioManager.play.mockClear();

      // Update volume in store
      store.dispatch(setAlarmVolume(0.9));
      rerender();

      await result.current.play("Bell");
      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: 0.9,
      });
    });

    test("playButtonSound updates when buttonSound setting changes", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, buttonSound: true },
      });
      const { result, rerender } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();
      expect(audioManager.play).toHaveBeenCalled();

      audioManager.play.mockClear();

      // Disable button sound
      store.dispatch(setButtonSoundState(false));
      rerender();

      await result.current.playButtonSound();
      expect(audioManager.play).not.toHaveBeenCalled();
    });

    test("callbacks remain stable when unrelated settings change", () => {
      const store = createTestStore();
      const { result, rerender } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      const stopFn1 = result.current.stop;
      const loadFn1 = result.current.load;
      const muteFn1 = result.current.mute;

      // Change unrelated setting
      store.dispatch(setAlarmSound("Digital"));
      rerender();

      expect(result.current.stop).toBe(stopFn1);
      expect(result.current.load).toBe(loadFn1);
      expect(result.current.mute).toBe(muteFn1);
    });
  });

  describe("edge cases", () => {
    test("handles missing alarmSettings gracefully", async () => {
      const store = createTestStore({
        alarm: undefined,
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await expect(result.current.play("Bell")).resolves.toBeUndefined();
    });

    test("handles selector returning null", async () => {
      const store = createTestStore();
      // Force selector to return null by manipulating state
      store.getState = jest.fn().mockReturnValue({
        settings: { ...initialState, alarm: null },
      });

      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Bell");

      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: undefined,
      });
    });

    test("play with explicit volume 0 should use 0, not fallback", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0.8 },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.play("Bell", { volume: 0 });

      expect(audioManager.play).toHaveBeenCalledWith("Bell", {
        volume: 0,
      });
    });

    test("playButtonSound with volume 0 should pass 0", async () => {
      const store = createTestStore({
        alarm: { ...initialState.alarm, volume: 0, buttonSound: true },
      });
      const { result } = renderHook(() => useAudioManager(), {
        wrapper: createWrapper(store),
      });

      await result.current.playButtonSound();

      expect(audioManager.play).toHaveBeenCalledWith("button", {
        volume: 0,
      });
    });
  });
});
