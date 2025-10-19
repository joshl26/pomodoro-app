// src/hooks/useTimerControls.js

import { useSelector, useDispatch } from "react-redux";
import { setCyclePaused } from "../store/settingsSlice";
import { selectCyclePaused } from "../store/selectors/settingsSelectors";

/**
 * Custom hook for managing timer control state and actions.
 *
 * @returns {Object} Timer control state and helper functions
 * @returns {boolean} return.isRunning - Whether timer is currently running
 * @returns {boolean} return.isPaused - Whether timer is currently paused
 * @returns {Function} return.handleStart - Function to start timer
 * @returns {Function} return.handlePause - Function to pause timer
 * @returns {Function} return.handleResume - Function to resume timer
 */
export const useTimerControls = (startTimer, pauseTimer, resumeTimer) => {
  const dispatch = useDispatch();
  const isPaused = useSelector(selectCyclePaused);

  /**
   * Start the timer
   */
  const handleStart = () => {
    startTimer();
  };

  /**
   * Pause the timer
   */
  const handlePause = () => {
    pauseTimer();
    dispatch(setCyclePaused(true));
  };

  /**
   * Resume the timer
   */
  const handleResume = () => {
    resumeTimer();
    dispatch(setCyclePaused(false));
  };

  return {
    isPaused,
    handleStart,
    handlePause,
    handleResume,
  };
};
