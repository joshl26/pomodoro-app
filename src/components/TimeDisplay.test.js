// src/components/__tests__/TimeDisplay.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import TimeDisplay from "./TimeDisplay";

test("renders zero-padded minutes and seconds", () => {
  render(<TimeDisplay minutes={5} seconds={7} />);
  expect(screen.getByText("05")).toBeInTheDocument();
  expect(screen.getByText("07")).toBeInTheDocument();
});

test("renders double-digit minutes and seconds", () => {
  render(<TimeDisplay minutes={15} seconds={45} />);
  expect(screen.getByText("15")).toBeInTheDocument();
  expect(screen.getByText("45")).toBeInTheDocument();
});
