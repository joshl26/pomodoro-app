import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders, createTestStore } from "./test-utils";
// import { Provider } from "react-redux";

// A simple test component to verify the store state is accessible
function TestComponent() {
  return (
    <div>
      <span data-testid="settings-state">Settings Loaded</span>
      <span data-testid="timer-state">Timer Loaded</span>
    </div>
  );
}

describe("test-utils", () => {
  test("createTestStore creates a Redux store with default state", () => {
    const store = createTestStore();
    const state = store.getState();

    expect(state).toHaveProperty("settings");
    expect(state).toHaveProperty("timer");

    // Check default initial state keys exist (adjust based on your reducers)
    expect(state.settings).toBeDefined();
    expect(state.timer).toBeDefined();
  });

  test("renderWithProviders renders UI with Redux provider and store", () => {
    const { store } = renderWithProviders(<TestComponent />);

    // Check that the test component rendered
    expect(screen.getByTestId("settings-state")).toHaveTextContent(
      "Settings Loaded"
    );
    expect(screen.getByTestId("timer-state")).toHaveTextContent("Timer Loaded");

    // The store should be accessible and have expected slices
    const state = store.getState();
    expect(state).toHaveProperty("settings");
    expect(state).toHaveProperty("timer");
  });

  test("renderWithProviders accepts preloadedState and applies it", () => {
    const preloadedState = {
      settings: { someSetting: "testValue" },
      timer: { secondsLeft: 123 },
    };

    const { store } = renderWithProviders(<TestComponent />, {
      preloadedState,
    });

    const state = store.getState();
    expect(state.settings.someSetting).toBe("testValue");
    expect(state.timer.secondsLeft).toBe(123);
  });

  test("renderWithProviders accepts a custom store", () => {
    const customStore = createTestStore({
      settings: { customSetting: "custom" },
      timer: { secondsLeft: 999 },
    });

    const { store } = renderWithProviders(<TestComponent />, {
      store: customStore,
    });

    const state = store.getState();
    expect(state.settings.customSetting).toBe("custom");
    expect(state.timer.secondsLeft).toBe(999);
  });
});
