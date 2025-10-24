import React from "react";

function ModeIndicator({ currentModeName }) {
  return (
    <div
      className="mode-indicator"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      tabIndex={-1}
    >
      {currentModeName}
    </div>
  );
}

export default React.memo(ModeIndicator);
