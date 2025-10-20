import { configureStore } from "@reduxjs/toolkit";
import settingsReducer, {
  initialState as settingsInitial,
} from "./settingsSlice";
import timerReducer from "./timerSlice";

// Migration helper for settings only
const migrateSettings = (settings) => {
  // Add migration code here if your settings shape changed across versions.
  // For now, if nothing or missing version, return defaults.
  if (!settings || !settings.version) {
    return { ...settingsInitial };
  }
  return settings;
};

// Load only the settings slice from localStorage and migrate it.
// We intentionally do NOT persist or preload the runtime `timer` slice.
const loadState = () => {
  try {
    const serialized = localStorage.getItem("pomobreakState");
    if (!serialized) return undefined;

    const parsed = JSON.parse(serialized);

    // If the saved object contains the full store shape, extract settings,
    // otherwise assume the saved object is the settings slice itself.
    const savedSettings = parsed?.settings ?? parsed;
    return { settings: migrateSettings(savedSettings) };
  } catch (err) {
    console.warn("Failed to load settings from localStorage:", err);
    return undefined;
  }
};

// Save only the settings slice to localStorage.
const saveState = (fullState) => {
  try {
    const toSave = fullState?.settings ?? fullState;
    const serialized = JSON.stringify(toSave);
    localStorage.setItem("pomobreakState", serialized);
  } catch (err) {
    console.warn("Failed to save settings to localStorage:", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    timer: timerReducer, // Register the runtime timer reducer
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // keep your existing ignored actions
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Persist settings on state changes (only settings slice gets saved)
store.subscribe(() => {
  // Save only the settings slice to localStorage so runtime timer isn't persisted
  saveState({ settings: store.getState().settings });
});

export default store;
