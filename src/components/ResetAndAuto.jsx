import React from "react";
import { FaRedo } from "react-icons/fa";
import "./ResetAndAuto.css";

function ResetAndAuto({
  autoStartState,
  onToggleAutoStart,
  onReset,
  playBtnSound,
}) {
  const handleResetClick = () => {
    playBtnSound();
    onReset();
  };

  const handleAutoStartChange = (e) => {
    onToggleAutoStart(e.target.checked);
  };

  return (
    <>
      <div className="reset-container">
        <button
          type="button"
          className="control-btn reset-btn"
          onClick={handleResetClick}
          aria-label="Reset Timer"
          data-testid="reset-btn"
        >
          <FaRedo aria-hidden="true" focusable="false" /> Reset Timer
        </button>
      </div>

      <div className="autobreak-container">
        <label
          className="autobreak-toggle"
          htmlFor="auto-start-breaks-checkbox"
        >
          <input
            id="auto-start-breaks-checkbox"
            type="checkbox"
            data-testid="auto-start-breaks-timer"
            checked={autoStartState}
            onChange={handleAutoStartChange}
            aria-checked={autoStartState}
          />
          <span>Auto Start Breaks</span>
        </label>
      </div>
    </>
  );
}

export default React.memo(ResetAndAuto);
