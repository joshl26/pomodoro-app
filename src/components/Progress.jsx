import React from "react";
import "./Progress.css";

const Progress = ({ percent }) => {
  return (
    <div className="progress-container">
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
};

export default Progress;
