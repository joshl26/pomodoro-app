import React, { useRef } from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from "react-icons/fa";
import "./TimerControls.css";

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
  const buttonsRef = useRef([]);

  // Handler wrapper to play sound and call action
  const handleClick = (action) => () => {
    action();
    playBtnSound();
  };

  // Keyboard navigation handler for arrow keys
  const onKeyDown = (e) => {
    const { key } = e;
    const currentIndex = buttonsRef.current.findIndex(
      (btn) => btn === document.activeElement
    );
    if (currentIndex === -1) return;

    let nextIndex = null;
    if (key === "ArrowRight" || key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % buttonsRef.current.length;
      e.preventDefault();
    } else if (key === "ArrowLeft" || key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + buttonsRef.current.length) %
        buttonsRef.current.length;
      e.preventDefault();
    }

    if (nextIndex !== null) {
      buttonsRef.current[nextIndex].focus();
    }
  };

  if (!running && !cyclePaused) {
    return (
      <button
        className="control-btn start-btn"
        onClick={handleClick(onStart)}
        data-testid="start-btn"
        aria-label="Start timer"
        type="button"
        ref={(el) => (buttonsRef.current[0] = el)}
        onKeyDown={onKeyDown}
      >
        <FaPlay aria-hidden="true" /> Start
      </button>
    );
  }

  return (
    <div
      className="running-controls"
      role="group"
      aria-label="Timer controls"
      onKeyDown={onKeyDown}
    >
      <button
        className="control-btn nav-btn"
        onClick={handleClick(onBackward)}
        aria-label="Previous cycle"
        data-testid="previous-cycle-btn"
        type="button"
        ref={(el) => (buttonsRef.current[0] = el)}
      >
        <FaStepBackward aria-hidden="true" />
      </button>

      {cyclePaused ? (
        <button
          className="control-btn pause-btn"
          onClick={handleClick(onResume)}
          aria-label="Resume timer"
          data-testid="resume-btn"
          type="button"
          ref={(el) => (buttonsRef.current[1] = el)}
        >
          <FaPlay aria-hidden="true" /> Resume
        </button>
      ) : (
        <button
          className="control-btn pause-btn"
          onClick={handleClick(onPause)}
          aria-label="Pause timer"
          data-testid="pause-btn"
          type="button"
          ref={(el) => (buttonsRef.current[1] = el)}
        >
          <FaPause aria-hidden="true" /> Pause
        </button>
      )}

      <button
        className="control-btn nav-btn"
        onClick={handleClick(onForward)}
        aria-label="Next cycle"
        data-testid="next-cycle-btn"
        type="button"
        ref={(el) => (buttonsRef.current[2] = el)}
      >
        <FaStepForward aria-hidden="true" />
      </button>
    </div>
  );
}

export default React.memo(TimerControls);
