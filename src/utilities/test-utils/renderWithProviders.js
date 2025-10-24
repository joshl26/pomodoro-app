// src/test-utils/renderWithProviders.js
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
 * Render component with redux, router, and helmet providers.
 * options:
 *   preloadedState: custom store state
 *   route: initial route for MemoryRouter (default "/")
 */
export function renderWithProviders(ui, { preloadedState, route = "/" } = {}) {
  const store = createTestStore(preloadedState);
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <HelmetProvider>
          <MemoryRouter
            initialEntries={[route]}
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            {children}
          </MemoryRouter>
        </HelmetProvider>
      </Provider>
    );
  }
  return {
    ...render(ui, { wrapper: Wrapper }),
    store,
  };
}
