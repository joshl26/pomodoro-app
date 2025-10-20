import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";

export function TimerControls({
  running,
  cyclePaused,
  onStart,
  onPause,
  onResume,
  onForward,
  onBackward,
  playBtnSound,
}) {
  if (!running && !cyclePaused) {
    return (
      <button
        className="control-btn start-btn"
        onClick={() => {
          onStart();
          playBtnSound();
        }}
        data-testid="start-btn"
      >
        <FaPlay /> Start
      </button>
    );
  }

  return (
    <div className="running-controls">
      <button
        className="control-btn nav-btn"
        onClick={onBackward}
        aria-label="Previous cycle"
        data-testid="previous-cycle-btn"
      >
        <FaStepBackward />
      </button>

      {cyclePaused ? (
        <button
          className="control-btn pause-btn"
          onClick={() => {
            onResume();
            playBtnSound();
          }}
          aria-label="Resume timer"
          data-testid="resume-btn"
        >
          <FaPlay /> Resume
        </button>
      ) : (
        <button
          className="control-btn pause-btn"
          onClick={() => {
            onPause();
            playBtnSound();
          }}
          aria-label="Pause timer"
          data-testid="pause-btn"
        >
          <FaPause /> Pause
        </button>
      )}

      <button
        className="control-btn nav-btn"
        onClick={onForward}
        aria-label="Next cycle"
        data-testid="next-cycle-btn"
      >
        <FaStepForward />
      </button>
    </div>
  );
}
