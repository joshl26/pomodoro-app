import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Settings from "../Settings";
import * as settingsSlice from "../../store/settingsSlice";

const mockStore = configureStore([]);

// Mock useAudioManager hook
const mockPlay = jest.fn(() => Promise.resolve());
const mockStop = jest.fn();
const mockLoad = jest.fn();
const mockPlayButtonSound = jest.fn();
const mockSetVolume = jest.fn();

jest.mock("../../hooks/useAudioManager", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    play: mockPlay,
    stop: mockStop,
    load: mockLoad,
    playButtonSound: mockPlayButtonSound,
    setVolume: mockSetVolume,
  })),
}));

const renderWithProviders = (ui, { store }) => {
  return render(
    <Provider store={store}>
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {ui}
      </MemoryRouter>
    </Provider>
  );
};

describe("Settings component", () => {
  let store;
  let dispatchMock;

  const defaultState = {
    settings: {
      timers: { pomodoro: 25, short: 5, long: 15 },
      autostart: false,
      timermode: 1,
      alarm: {
        volume: 0.5,
        buttonSound: false,
        enabled: false,
        sound: "No Sound",
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    store = mockStore(defaultState);
    dispatchMock = jest.fn();
    store.dispatch = dispatchMock;
  });

  describe("Initial Rendering", () => {
    it("renders with initial state", () => {
      renderWithProviders(<Settings />, { store });

      expect(screen.getByText("Settings")).toBeInTheDocument();
      expect(screen.getByLabelText("Auto start breaks")).not.toBeChecked();
      expect(screen.getByLabelText("Button sounds")).not.toBeChecked();
      expect(
        screen.getByRole("button", { name: /No Sound/i })
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Alarm Volume")).toHaveValue("0.5");
    });

    it("displays timer values correctly", () => {
      renderWithProviders(<Settings />, { store });

      expect(screen.getByText("25")).toBeInTheDocument(); // pomodoro
      expect(screen.getByText("5")).toBeInTheDocument(); // short
      expect(screen.getByText("15")).toBeInTheDocument(); // long
    });

    it("loads alarm sound on mount when sound is set", async () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Bell",
          },
        },
      });

      renderWithProviders(<Settings />, { store });

      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith("Bell");
      });

      expect(mockSetVolume).toHaveBeenCalledWith("Bell", 0.5);
    });

    it("loads button sound on mount when enabled", async () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: true,
            enabled: false,
            sound: "No Sound",
          },
        },
      });

      renderWithProviders(<Settings />, { store });

      await waitFor(() => {
        expect(mockLoad).toHaveBeenCalledWith("button");
      });
    });
  });

  describe("Timer Controls", () => {
    it("increments pomodoro timer and updates current time", () => {
      renderWithProviders(<Settings />, { store });
      const incrementBtn = screen.getByLabelText("Increment Pomodoro");

      fireEvent.click(incrementBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.pomoIncrement());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setCurrentTimeFromMode()
      );
    });

    it("decrements pomodoro timer and updates current time", () => {
      renderWithProviders(<Settings />, { store });
      const decrementBtn = screen.getByLabelText("Decrement Pomodoro");

      fireEvent.click(decrementBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.pomoDecrement());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setCurrentTimeFromMode()
      );
    });

    it("increments short break timer", () => {
      renderWithProviders(<Settings />, { store });
      const incrementBtn = screen.getByLabelText("Increment Short Break");

      fireEvent.click(incrementBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.shortIncrement());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setCurrentTimeFromMode()
      );
    });

    it("decrements short break timer", () => {
      renderWithProviders(<Settings />, { store });
      const decrementBtn = screen.getByLabelText("Decrement Short Break");

      fireEvent.click(decrementBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.shortDecrement());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setCurrentTimeFromMode()
      );
    });

    it("increments long break timer", () => {
      renderWithProviders(<Settings />, { store });
      const incrementBtn = screen.getByLabelText("Increment Long Break");

      fireEvent.click(incrementBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.longIncrement());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setCurrentTimeFromMode()
      );
    });

    it("decrements long break timer", () => {
      renderWithProviders(<Settings />, { store });
      const decrementBtn = screen.getByLabelText("Decrement Long Break");

      fireEvent.click(decrementBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.longDecrement());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setCurrentTimeFromMode()
      );
    });
  });

  describe("Autostart Toggle", () => {
    it("enables autostart when toggled on", () => {
      renderWithProviders(<Settings />, { store });
      const toggle = screen.getByLabelText("Auto start breaks");

      fireEvent.click(toggle);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.setCounter(1));
      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.setTimerMode(1));
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAutoStart(true)
      );
    });

    it("disables autostart when toggled off", () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          autostart: true,
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const toggle = screen.getByLabelText("Auto start breaks");

      fireEvent.click(toggle);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.setCounter(0));
      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.setTimerMode(1));
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAutoStart(false)
      );
    });
  });

  describe("Button Sound Toggle", () => {
    it("toggles button sounds on and dispatches action", () => {
      renderWithProviders(<Settings />, { store });
      const toggle = screen.getByLabelText("Button sounds");

      fireEvent.click(toggle);

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setButtonSoundState(true)
      );
    });

    it("toggles button sounds off", () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            ...defaultState.settings.alarm,
            buttonSound: true,
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const toggle = screen.getByLabelText("Button sounds");

      fireEvent.click(toggle);

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setButtonSoundState(false)
      );
    });

    it("plays button sound when enabled and button clicked", () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            ...defaultState.settings.alarm,
            buttonSound: true,
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const incrementBtn = screen.getByLabelText("Increment Pomodoro");

      fireEvent.click(incrementBtn);

      expect(mockPlayButtonSound).toHaveBeenCalled();
    });

    it("does not play button sound when disabled", () => {
      renderWithProviders(<Settings />, { store });
      const incrementBtn = screen.getByLabelText("Increment Pomodoro");

      fireEvent.click(incrementBtn);

      expect(mockPlayButtonSound).not.toHaveBeenCalled();
    });
  });

  describe("Alarm Sound Dropdown", () => {
    it("changes alarm sound to Bell and dispatches actions", async () => {
      renderWithProviders(<Settings />, { store });

      const dropdownToggle = screen.getByRole("button", { name: /No Sound/i });
      fireEvent.click(dropdownToggle);

      const bellOption = await screen.findByRole("button", { name: "Bell" });
      fireEvent.click(bellOption);

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          settingsSlice.setAlarmSound("Bell")
        );
      });

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmState(true)
      );
    });

    it("sets volume and plays preview for Bell alarm", async () => {
      renderWithProviders(<Settings />, { store });

      const dropdownToggle = screen.getByRole("button", { name: /No Sound/i });
      fireEvent.click(dropdownToggle);

      const bellOption = await screen.findByRole("button", { name: "Bell" });
      fireEvent.click(bellOption);

      await waitFor(() => {
        expect(mockSetVolume).toHaveBeenCalledWith("Bell", 0.5);
      });

      expect(mockPlay).toHaveBeenCalledWith("Bell", { volume: 0.5 });
    });

    it("changes alarm sound to Digital", async () => {
      renderWithProviders(<Settings />, { store });

      const dropdownToggle = screen.getByRole("button", { name: /No Sound/i });
      fireEvent.click(dropdownToggle);

      const digitalOption = await screen.findByRole("button", {
        name: "Digital",
      });
      fireEvent.click(digitalOption);

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          settingsSlice.setAlarmSound("Digital")
        );
      });

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmState(true)
      );
    });

    it("changes alarm sound to Kitchen", async () => {
      renderWithProviders(<Settings />, { store });

      const dropdownToggle = screen.getByRole("button", { name: /No Sound/i });
      fireEvent.click(dropdownToggle);

      const kitchenOption = await screen.findByRole("button", {
        name: "Kitchen",
      });
      fireEvent.click(kitchenOption);

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          settingsSlice.setAlarmSound("Kitchen")
        );
      });

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmState(true)
      );
    });

    it("changes alarm to 'No Sound' and dispatches setAlarmState false", async () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Bell",
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const dropdownToggle = screen.getByRole("button", { name: /Bell/i });
      fireEvent.click(dropdownToggle);

      const noSoundOption = await screen.findByRole("button", {
        name: "No Sound",
      });
      fireEvent.click(noSoundOption);

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          settingsSlice.setAlarmSound("No Sound")
        );
      });

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmState(false)
      );
    });

    it("stops all sounds when changing to 'No Sound'", async () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Bell",
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const dropdownToggle = screen.getByRole("button", { name: /Bell/i });
      fireEvent.click(dropdownToggle);

      const noSoundOption = await screen.findByRole("button", {
        name: "No Sound",
      });
      fireEvent.click(noSoundOption);

      await waitFor(() => {
        expect(mockStop).toHaveBeenCalledWith("alarm");
      });

      expect(mockStop).toHaveBeenCalledWith("Bell");
      expect(mockStop).toHaveBeenCalledWith("Digital");
      expect(mockStop).toHaveBeenCalledWith("Kitchen");
    });

    it("handles play error gracefully", async () => {
      mockPlay.mockRejectedValueOnce(new Error("Play failed"));

      renderWithProviders(<Settings />, { store });
      const dropdownToggle = screen.getByRole("button", { name: /No Sound/i });
      fireEvent.click(dropdownToggle);

      const bellOption = await screen.findByRole("button", { name: "Bell" });
      fireEvent.click(bellOption);

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          settingsSlice.setAlarmSound("Bell")
        );
      });
    });
  });

  describe("Alarm Volume Slider", () => {
    it("changes alarm volume via slider", async () => {
      renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      fireEvent.change(slider, { target: { value: "0.75" } });

      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          settingsSlice.setAlarmVolume(0.75)
        );
      });
    });

    it("updates volume display when slider changes", () => {
      renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      fireEvent.change(slider, { target: { value: "0.8" } });

      expect(screen.getByText("80")).toBeInTheDocument();
    });

    it("plays preview sound when slider changes with valid alarm sound", async () => {
      jest.useFakeTimers();

      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Bell",
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      fireEvent.change(slider, { target: { value: "0.8" } });

      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockStop).toHaveBeenCalledWith("Bell");
      });

      expect(mockPlay).toHaveBeenCalledWith("Bell", { volume: 0.8 });

      jest.useRealTimers();
    });

    it("does not play preview when alarm sound is 'No Sound'", async () => {
      jest.useFakeTimers();

      renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      mockPlay.mockClear();
      fireEvent.change(slider, { target: { value: "0.7" } });

      jest.advanceTimersByTime(200);

      expect(mockPlay).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    it("debounces multiple slider changes", async () => {
      jest.useFakeTimers();

      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Bell",
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      mockPlay.mockClear();
      fireEvent.change(slider, { target: { value: "0.6" } });
      jest.advanceTimersByTime(100);

      fireEvent.change(slider, { target: { value: "0.7" } });
      jest.advanceTimersByTime(100);

      fireEvent.change(slider, { target: { value: "0.8" } });
      jest.advanceTimersByTime(200);

      await waitFor(() => {
        expect(mockPlay).toHaveBeenCalledTimes(1);
      });

      expect(mockPlay).toHaveBeenCalledWith("Bell", { volume: 0.8 });

      jest.useRealTimers();
    });

    it("sets volume for alarm sound when slider changes", async () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Digital",
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      fireEvent.change(slider, { target: { value: "0.65" } });

      await waitFor(() => {
        expect(mockSetVolume).toHaveBeenCalledWith("Digital", 0.65);
      });
    });
  });

  describe("Back Button", () => {
    it("dispatches volume and total seconds for pomodoro mode", () => {
      renderWithProviders(<Settings />, { store });
      const backBtn = screen.getByRole("button", { name: /Back/i });

      fireEvent.click(backBtn);

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmVolume(0.5)
      );
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setTotalSeconds(1500)
      );
    });

    it("calculates total seconds for short break mode", () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          timermode: 2,
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const backBtn = screen.getByRole("button", { name: /Back/i });

      fireEvent.click(backBtn);

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setTotalSeconds(300)
      );
    });

    it("calculates total seconds for long break mode", () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          timermode: 3,
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const backBtn = screen.getByRole("button", { name: /Back/i });

      fireEvent.click(backBtn);

      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setTotalSeconds(900)
      );
    });
  });

  describe("Restore Defaults", () => {
    it("resets all settings to defaults", () => {
      renderWithProviders(<Settings />, { store });
      const restoreBtn = screen.getByRole("button", {
        name: /Restore Defaults/i,
      });

      fireEvent.click(restoreBtn);

      expect(dispatchMock).toHaveBeenCalledWith(settingsSlice.setDefault());
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmVolume(0.5)
      );
    });

    it("updates volume and setVolume when alarm sound is set", () => {
      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.8,
            buttonSound: true,
            enabled: true,
            sound: "Bell",
          },
        },
      });
      store.dispatch = dispatchMock;

      renderWithProviders(<Settings />, { store });
      const restoreBtn = screen.getByRole("button", {
        name: /Restore Defaults/i,
      });

      fireEvent.click(restoreBtn);

      expect(mockSetVolume).toHaveBeenCalledWith("Bell", 0.5);
    });
  });

  describe("Component Lifecycle", () => {
    it("cleans up and stops alarm sound on unmount", () => {
      const { unmount } = renderWithProviders(<Settings />, { store });

      unmount();

      expect(mockStop).toHaveBeenCalledWith("alarm");
    });

    it("stops all alarm types on unmount", () => {
      const { unmount } = renderWithProviders(<Settings />, { store });

      unmount();

      expect(mockStop).toHaveBeenCalledWith("Bell");
      expect(mockStop).toHaveBeenCalledWith("Digital");
      expect(mockStop).toHaveBeenCalledWith("Kitchen");
    });

    it("stops button sound on unmount", () => {
      const { unmount } = renderWithProviders(<Settings />, { store });

      unmount();

      expect(mockStop).toHaveBeenCalledWith("button");
    });

    it("clears slider preview timer on unmount", () => {
      jest.useFakeTimers();

      store = mockStore({
        settings: {
          ...defaultState.settings,
          alarm: {
            volume: 0.5,
            buttonSound: false,
            enabled: true,
            sound: "Bell",
          },
        },
      });

      const { unmount } = renderWithProviders(<Settings />, { store });
      const slider = screen.getByLabelText("Alarm Volume");

      fireEvent.change(slider, { target: { value: "0.8" } });

      unmount();

      jest.advanceTimersByTime(200);

      expect(mockPlay).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  // Uncomment and adjust these edge case tests if needed
  // describe("Edge Cases", () => {
  //   ...
  // });
});
