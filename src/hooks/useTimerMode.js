import { useSelector, useDispatch } from "react-redux";
import { setTimerModeAndReset } from "../store/settingsThunks";
import { selectTimerMode } from "../store/selectors/settingsSelectors";

/**
 * Custom hook for managing timer mode state and transitions.
 *
 * @returns {Object} Timer mode state and helper functions
 * @returns {number} return.currentMode - Current timer mode (1-3)
 * @returns {Function} return.switchMode - Function to switch timer mode
 * @returns {Function} return.getModeName - Function to get mode name
 */
export const useTimerMode = () => {
  const dispatch = useDispatch();
  const currentMode = useSelector(selectTimerMode);

  /**
   * Switch to a specific timer mode
   * @param {number} mode - Timer mode (1 = pomodoro, 2 = short, 3 = long)
   * @param {boolean} autoStart - Whether to auto-start timer
   */
  const switchMode = (mode, autoStart = false) => {
    dispatch(setTimerModeAndReset(mode, autoStart));
  };

  /**
   * Get human-readable name for current mode
   * @returns {string} Mode name
   */
  const getModeName = () => {
    switch (currentMode) {
      case 1:
        return "Focus";
      case 2:
        return "Short Break";
      case 3:
        return "Long Break";
      default:
        return "Focus";
    }
  };

  return {
    currentMode,
    switchMode,
    getModeName,
  };
};
