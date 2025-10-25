import React from "react";

export default function TimeDisplay({ minutes, seconds, ariaLive = "polite" }) {
  const formatTime = (value) => value.toString().padStart(2, "0");

  return (
    <div
      className="time-display"
      aria-live={ariaLive}
      aria-atomic="true"
      role="timer"
    >
      <span className="time-minutes" aria-label="minutes">
        {formatTime(minutes)}
      </span>
      <span className="time-separator">:</span>
      <span className="time-seconds" aria-label="seconds">
        {formatTime(seconds)}
      </span>
    </div>
  );
}
