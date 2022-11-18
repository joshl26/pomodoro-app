import React from "react";
import classes from "./CountDownTimer.module.css";

const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <p>{value}</p>
    </div>
  );
};

export default DateTimeDisplay;
