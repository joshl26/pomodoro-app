// src/components/Slider.jsx
import React from "react";
import "./Slider.css";

export default function Slider({ value, onChange, onClick, ...rest }) {
  // Ensure value is a number to prevent NaN in display or calculations
  const safeValue = typeof value === "number" ? value : Number(value) || 0;

  return (
    <div className="slider-container">
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={safeValue}
        onChange={onChange}
        onClick={onClick}
        className="input"
        {...rest} // Forward aria-label, data-testid, etc.
      />
    </div>
  );
}
