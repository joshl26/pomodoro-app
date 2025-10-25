import React from "react";
import { FaRedo } from "react-icons/fa";

function ResetAndAuto({
  autoStartState,
  onToggleAutoStart,
  onReset,
  playBtnSound,
  resetBtnTestId = "reset-btn",
  autoStartToggleTestId = "auto-start-breaks-timer",
}) {
  const handleResetClick = () => {
    playBtnSound();
    onReset();
  };

  const handleToggleChange = (e) => {
    playBtnSound();
    onToggleAutoStart(e.target.checked);
  };

  return (
    <>
      <div className="reset-container">
        <button
          className="control-btn reset-btn"
          onClick={handleResetClick}
          aria-label="Reset Timer"
          data-testid={resetBtnTestId}
          type="button"
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
            checked={autoStartState}
            onChange={handleToggleChange}
            data-testid={autoStartToggleTestId}
            aria-checked={autoStartState}
          />
          <span>Auto Start Breaks</span>
        </label>
      </div>
    </>
  );
}

export default React.memo(ResetAndAuto);
