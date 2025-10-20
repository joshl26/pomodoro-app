import React from "react";
import "./Timer.css";

export default React.memo(function ProgressBar({
  progressPercent,
  currentMode,
}) {
  const bgColor =
    currentMode === 1
      ? "var(--primary-color)"
      : currentMode === 2
        ? "var(--secondary-color)"
        : "var(--tertiary-color)";

  return (
    <div className="progress-container" aria-hidden>
      <div
        className="progress-bar"
        style={{
          width: `${progressPercent}%`,
          backgroundColor: bgColor,
        }}
      />
    </div>
  );
});
