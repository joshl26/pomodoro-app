// src/components/Slider.jsx
import React from "react";
import "./Slider.css";

export default function Slider({
  id,
  label,
  value,
  onChange,
  onClick,
  min = 0,
  max = 1,
  step = 0.05,
  showValue = true,
  ...rest
}) {
  // Ensure value is a number to prevent NaN in display or calculations
  const safeValue = typeof value === "number" ? value : Number(value) || 0;

  return (
    <div className="slider-container">
      {label && (
        <label htmlFor={id} className="slider-label">
          {label}
        </label>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={safeValue}
        onChange={onChange}
        onClick={onClick}
        className="input"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={safeValue}
        aria-valuetext={`${(safeValue * 100).toFixed(0)}%`}
        aria-labelledby={id ? `${id}-label` : undefined}
        {...rest} // Forward other props like data-testid, etc.
      />
      {showValue && (
        <output
          htmlFor={id}
          className="slider-value"
          aria-live="polite"
          aria-atomic="true"
        >
          {(safeValue * 100).toFixed(0)}%
        </output>
      )}
    </div>
  );
}
