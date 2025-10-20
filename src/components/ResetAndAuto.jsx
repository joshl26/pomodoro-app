import React from "react";
import { FaRedo } from "react-icons/fa";

export default function ResetAndAuto({
  autoStartState,
  onToggleAutoStart,
  onReset,
  playBtnSound,
}) {
  return (
    <>
      <div className="reset-container">
        <button
          className="control-btn reset-btn"
          onClick={() => {
            playBtnSound();
            onReset();
          }}
          data-testid="reset-btn"
        >
          <FaRedo /> Reset Timer
        </button>
      </div>

      <div className="autobreak-container">
        <label className="autobreak-toggle">
          <input
            type="checkbox"
            data-testid="auto-start-breaks-timer"
            checked={autoStartState}
            onChange={(e) => onToggleAutoStart(e.target.checked)}
          />
          <span>Auto Start Breaks</span>
        </label>
      </div>
    </>
  );
}
