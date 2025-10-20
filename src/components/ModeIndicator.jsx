import React from "react";

function ModeIndicator({ currentModeName }) {
  return <div className="mode-indicator">{currentModeName}</div>;
}

export default React.memo(ModeIndicator);
