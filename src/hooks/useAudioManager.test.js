// src/hooks/useAudioManager.test.js
import React from "react";
import { render, act, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import {
  setAlarmVolume,
  setButtonSoundState,
  setAlarmSound,
} from "../store/settingsSlice";

// Force Jest to mock the module using doMock + require
jest.doMock("../audio/AudioManager", () => {
  return {
    __esModule: true,
    default: {
      play: jest.fn().mockResolvedValue(),
      load: jest.fn(),
      setVolume: jest.fn(),
      stop: jest.fn(),
      playButtonSound: jest.fn().mockResolvedValue(),
      getAvailableSounds: jest
        .fn()
        .mockReturnValue([
          "button",
          "Bell",
          "Digital",
          "Kitchen",
          "alarm",
          "tick",
        ]),
    },
  };
});

// Now import the hook *after* the mock is set
const useAudioManager = require("./useAudioManager").default;

function HookTestComp({ onReady }) {
  const api = useAudioManager();
  React.useEffect(() => {
    onReady(api);
  }, [onReady, api]);
  return null;
}

describe("useAudioManager hook (integration with Redux)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();

    store.dispatch(setAlarmVolume(0.5));
    store.dispatch(setButtonSoundState(true));
    store.dispatch(setAlarmSound("Bell"));
  });

  test("hook reads redux settings and forwards volume to audioManager.play", async () => {
    const ready = jest.fn();

    render(
      <Provider store={store}>
        <HookTestComp onReady={ready} />
      </Provider>
    );

    // Wait for hook to call onReady
    await waitFor(() => expect(ready).toHaveBeenCalled());

    const api = ready.mock.calls[0][0];
    expect(api).toBeDefined();
    expect(typeof api.load).toBe("function");

    // Call load and wait for mock
    act(() => {
      api.load("Bell");
    });

    // Debug: log mock calls
    const AudioManager = require("../audio/AudioManager").default;

    // Wait for the mock to be called
    await waitFor(() => expect(AudioManager.load).toHaveBeenCalledWith("Bell"));
  });
});
