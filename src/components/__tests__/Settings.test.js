import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { MemoryRouter } from "react-router-dom";
import Settings from "../Settings";
import * as settingsSlice from "../../store/settingsSlice";

const mockStore = configureStore([]);

const renderWithProviders = (ui, { store }) => {
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  );
};

describe("Settings component", () => {
  let store;
  let dispatchMock;

  beforeEach(() => {
    store = mockStore({
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
    });

    dispatchMock = jest.fn();
    store.dispatch = dispatchMock;
  });

  it("renders with initial state", () => {
    renderWithProviders(<Settings />, { store });
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByLabelText("Auto start breaks")).not.toBeChecked();
    expect(screen.getByLabelText("Button sounds")).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: /No Sound/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Alarm Volume")).toHaveValue("0.5" || "0.5");
  });

  it("toggles button sounds checkbox and dispatches action", () => {
    renderWithProviders(<Settings />, { store });
    const toggle = screen.getByLabelText("Button sounds");
    fireEvent.click(toggle);
    expect(dispatchMock).toHaveBeenCalledWith(
      settingsSlice.setButtonSoundState(true)
    );
  });

  it("changes alarm sound from dropdown and dispatches actions", async () => {
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

    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        settingsSlice.setAlarmState(true)
      );
    });
  });

  it("back button dispatches volume and total seconds, navigates home", () => {
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

  it("restore defaults button resets settings", () => {
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
});
