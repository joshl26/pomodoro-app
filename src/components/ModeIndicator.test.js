// src/components/__tests__/ModeIndicator.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import ModeIndicator from "./ModeIndicator";

test("renders current mode name", () => {
  render(<ModeIndicator currentModeName="Pomodoro" />);
  expect(screen.getByText("Pomodoro")).toBeInTheDocument();
});
