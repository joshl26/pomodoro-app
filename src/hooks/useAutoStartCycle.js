// src/hooks/useAutoStartCycle.js

import { useSelector, useDispatch } from "react-redux";
import { advanceCycle, retreatCycle } from "../store/settingsThunks";
import {
  selectCounter,
  selectCycle,
  selectIsAutoStart,
} from "../store/selectors/settingsSelectors";

/**
 * Custom hook for managing auto-start cycle transitions.
 *
 * @returns {Object} Auto-start cycle state and helper functions
 * @returns {boolean} return.isAutoStart - Whether auto-start is enabled
 * @returns {Function} return.advance - Function to advance to next cycle
 * @returns {Function} return.retreat - Function to go back to previous cycle
 */
export const useAutoStartCycle = () => {
  const dispatch = useDispatch();
  const isAutoStart = useSelector(selectIsAutoStart);
  const counter = useSelector(selectCounter);
  const cycle = useSelector(selectCycle);

  /**
   * Advance to the next cycle mode
   * @param {boolean} autoStart - Whether to auto-start the next timer
   */
  const advance = (autoStart = true) => {
    if (isAutoStart) {
      dispatch(advanceCycle(autoStart));
    }
  };

  /**
   * Retreat to the previous cycle mode
   * @param {boolean} autoStart - Whether to auto-start the previous timer
   */
  const retreat = (autoStart = true) => {
    if (isAutoStart) {
      dispatch(retreatCycle(autoStart));
    }
  };

  /**
   * Get the current mode from the cycle
   * @returns {number} Current mode (1-3)
   */
  const getCurrentMode = () => {
    return cycle[counter];
  };

  /**
   * Get the next mode in the cycle
   * @returns {number} Next mode (1-3)
   */
  const getNextMode = () => {
    const nextIndex = (counter + 1) % cycle.length;
    return cycle[nextIndex];
  };

  /**
   * Get the previous mode in the cycle
   * @returns {number} Previous mode (1-3)
   */
  const getPreviousMode = () => {
    const prevIndex = (counter - 1 + cycle.length) % cycle.length;
    return cycle[prevIndex];
  };

  return {
    isAutoStart,
    advance,
    retreat,
    getCurrentMode,
    getNextMode,
    getPreviousMode,
  };
};
