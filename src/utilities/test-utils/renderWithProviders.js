// src/test-utils/renderWithProviders.js
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import settingsReducer from "../../store/settingsSlice";
import timerReducer from "../../store/timerSlice";

export function createTestStore(preloadedState = {}) {
  const defaultSettingsState = settingsReducer(undefined, { type: "@@INIT" });
  const defaultTimerState = timerReducer(undefined, { type: "@@INIT" });

  return configureStore({
    reducer: {
      settings: settingsReducer,
      timer: timerReducer,
    },
    preloadedState: {
      settings: defaultSettingsState,
      timer: defaultTimerState,
      ...preloadedState,
    },
  });
}

/**
 * Render component with redux provider and convenience return values
 * options:
 *   preloadedState: custom store state
 */
export function renderWithProviders(ui, { preloadedState } = {}) {
  const store = createTestStore(preloadedState);
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
