/**
 * Utility functions for the Pomodoro application
 *
 * Note: The old player() function has been removed as react-use-audio-player
 * provides superior audio management and is already in use throughout the app.
 */

/**
 * Converts minutes to seconds
 * @param {number} minutes - The number of minutes to convert
 * @returns {number} The equivalent number of seconds
 * @example
 * minutesToSeconds(5) // returns 300
 */
export const minutesToSeconds = (minutes) => minutes * 60;

/**
 * Converts seconds to minutes
 * @param {number} seconds - The number of seconds to convert
 * @returns {number} The equivalent number of minutes
 * @example
 * secondsToMinutes(300) // returns 5
 */
export const secondsToMinutes = (seconds) => Math.floor(seconds / 60);

/**
 * Formats time for display (MM:SS)
 * @param {number} minutes - The number of minutes
 * @param {number} seconds - The number of seconds
 * @returns {string} Formatted time string
 * @example
 * formatTime(5, 30) // returns "5:30"
 */
export const formatTime = (minutes, seconds) => {
  const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${paddedSeconds}`;
};

/**
 * Clamps a value between min and max
 * @param {number} value - The value to clamp
 * @param {number} min - The minimum allowed value
 * @param {number} max - The maximum allowed value
 * @returns {number} The clamped value
 * @example
 * clamp(15, 1, 60) // returns 15
 * clamp(0, 1, 60) // returns 1
 * clamp(100, 1, 60) // returns 60
 */
export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Validates if a value is a valid timer duration (1-60 minutes)
 * @param {number} minutes - The number of minutes to validate
 * @returns {boolean} True if valid duration
 * @example
 * isValidDuration(25) // returns true
 * isValidDuration(0) // returns false
 * isValidDuration(61) // returns false
 */
export const isValidDuration = (minutes) => {
  return Number.isInteger(minutes) && minutes >= 1 && minutes <= 60;
};
