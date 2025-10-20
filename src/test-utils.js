// src/test-utils.js
import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import settingsReducer from "./store/settingsSlice";
import timerReducer from "./store/timerSlice";

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
 * renderWithProviders(ui, { preloadedState, store, ...renderOptions })
 * - returns { store, ...renderResult }
 */
export function renderWithProviders(
  ui,
  { preloadedState = undefined, store = undefined, ...renderOptions } = {}
) {
  const usedStore = store ?? createTestStore(preloadedState);

  function Wrapper({ children }) {
    return <Provider store={usedStore}>{children}</Provider>;
  }

  return {
    store: usedStore,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
