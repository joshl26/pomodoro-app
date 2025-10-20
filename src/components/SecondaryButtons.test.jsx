// src/components/SecondaryButtons.test.jsx
import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import { TEST_IDS } from "../../testIds";
import SecondaryButtons from "./SecondaryButtons";

// Mock audio player used by component (prevent real audio)
jest.mock("react-use-audio-player", () => ({
  useGlobalAudioPlayer: () => ({
    load: jest.fn(),
    play: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
  }),
}));

describe("SecondaryButtons component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders duration controls and shows initial values", () => {
    renderWithProviders(<SecondaryButtons />);

    expect(screen.getByTestId(TEST_IDS.POMO_VALUE).textContent).toMatch(
      /\d+\smin/i
    );
    expect(screen.getByTestId(TEST_IDS.SHORT_VALUE).textContent).toMatch(
      /\d+\smin/i
    );
    expect(screen.getByTestId(TEST_IDS.LONG_VALUE).textContent).toMatch(
      /\d+\smin/i
    );
  });

  test("increment and decrement adjust the displayed focus time", () => {
    renderWithProviders(<SecondaryButtons />);

    const valueNode = screen.getByTestId(TEST_IDS.POMO_VALUE);
    const initial = parseInt(valueNode.textContent, 10);

    const incBtn = screen.getByTestId(TEST_IDS.POMO_INCREMENT);
    const decBtn = screen.getByTestId(TEST_IDS.POMO_DECREMENT);

    fireEvent.click(incBtn);

    const afterInc = parseInt(
      screen.getByTestId(TEST_IDS.POMO_VALUE).textContent,
      10
    );
    expect(afterInc).toBe(initial + 1);

    fireEvent.click(decBtn);

    const afterDec = parseInt(
      screen.getByTestId(TEST_IDS.POMO_VALUE).textContent,
      10
    );
    expect(afterDec).toBe(initial);
  });

  test("auto-start checkbox toggles and updates UI", () => {
    renderWithProviders(<SecondaryButtons />);

    const checkbox = screen.getByTestId(TEST_IDS.AUTO_START_TOGGLE);
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("alarm enable toggle, sound selection and volume input update the UI", () => {
    renderWithProviders(<SecondaryButtons />);

    // Alarm enable checkbox: UI reflects checked state
    const alarmCheckbox = screen.getByTestId(TEST_IDS.ALARM_ENABLE_TOGGLE);
    fireEvent.click(alarmCheckbox);
    expect(alarmCheckbox).toBeChecked();

    // Alarm sound select — selecting a sound should change the select's value
    const select = screen.getByTestId(TEST_IDS.ALARM_SOUND_SELECT);
    fireEvent.change(select, { target: { value: "Bell" } });
    expect(select.value).toBe("Bell");

    // Selecting a sound should also leave the alarm enabled in the UI
    expect(alarmCheckbox).toBeChecked();

    // Volume slider — value is reflected on the control (string)
    const volumeSlider = screen.getByTestId(TEST_IDS.ALARM_VOLUME_SLIDER);
    fireEvent.change(volumeSlider, { target: { value: "0.7" } });
    expect(volumeSlider.value).toBe("0.7");
  });

  test("button sound toggle and Reset All Settings revert changes (uses store defaults)", () => {
    // Render and get the store so we can read authoritative defaults
    const { store } = renderWithProviders(<SecondaryButtons />);

    // Record canonical defaults from the store (single source of truth)
    const initialStoreState = store.getState();
    const defaultPomoFromStore = initialStoreState.settings?.timers?.pomodoro;
    const defaultButtonSoundFromStore =
      initialStoreState.settings?.alarm?.buttonSound ?? false;

    // Sanity: the DOM should reflect the store default initially
    expect(
      parseInt(screen.getByTestId(TEST_IDS.POMO_VALUE).textContent, 10)
    ).toBe(defaultPomoFromStore);
    expect(screen.getByTestId(TEST_IDS.BUTTON_SOUND_TOGGLE).checked).toBe(
      defaultButtonSoundFromStore
    );

    // Toggle button sound — should change UI and store
    const btnSoundCheckbox = screen.getByTestId(TEST_IDS.BUTTON_SOUND_TOGGLE);
    fireEvent.click(btnSoundCheckbox);
    expect(btnSoundCheckbox.checked).toBe(!defaultButtonSoundFromStore);
    expect(store.getState().settings.alarm?.buttonSound).toBe(
      !defaultButtonSoundFromStore
    );

    // Store the initial pomodoro value before making changes
    const initialPomoValue = defaultPomoFromStore;

    // Make a visible change (increment pomo) so we can assert reset reverted it
    fireEvent.click(screen.getByTestId(TEST_IDS.POMO_INCREMENT));
    const incrementedValue = initialPomoValue + 1;
    expect(
      parseInt(screen.getByTestId(TEST_IDS.POMO_VALUE).textContent, 10)
    ).toBe(incrementedValue);
    expect(store.getState().settings.timers.pomodoro).toBe(incrementedValue);

    // Click Reset
    const resetBtn = screen.getByTestId(TEST_IDS.RESET_ALL_BTN);
    fireEvent.click(resetBtn);

    // After reset: store and UI should match the original defaults we recorded
    expect(store.getState().settings.timers.pomodoro).toBe(initialPomoValue);
    expect(
      parseInt(screen.getByTestId(TEST_IDS.POMO_VALUE).textContent, 10)
    ).toBe(initialPomoValue);

    expect(store.getState().settings.alarm?.buttonSound).toBe(
      defaultButtonSoundFromStore
    );
    expect(screen.getByTestId(TEST_IDS.BUTTON_SOUND_TOGGLE).checked).toBe(
      defaultButtonSoundFromStore
    );
  });
});
