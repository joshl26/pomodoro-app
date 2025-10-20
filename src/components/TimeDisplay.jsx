import React from "react";

export default function TimeDisplay({ minutes, seconds }) {
  const formatTime = (value) => value.toString().padStart(2, "0");

  return (
    <div className="time-display" aria-live="polite" aria-atomic="true">
      <span className="time-minutes">{formatTime(minutes)}</span>
      <span className="time-separator">:</span>
      <span className="time-seconds">{formatTime(seconds)}</span>
    </div>
  );
}
