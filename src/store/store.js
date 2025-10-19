import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, { initialState } from "./settingsSlice";

// Migration function
const migrateState = (state) => {
  // Handle version migrations here if needed
  if (!state || !state.version) {
    return { ...initialState };
  }
  return state;
};

// Load state from localStorage with migration
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("pomobreakState");
    if (serializedState === null) {
      return undefined;
    }
    const state = JSON.parse(serializedState);
    return migrateState(state);
  } catch (err) {
    console.warn("Failed to load state from localStorage:", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("pomobreakState", serializedState);
  } catch (err) {
    console.warn("Failed to save state to localStorage:", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Save state on store changes
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
