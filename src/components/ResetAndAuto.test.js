// src/components/__tests__/ResetAndAuto.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ResetAndAuto from "./ResetAndAuto";

describe("ResetAndAuto", () => {
  const onToggleAutoStart = jest.fn();
  const onReset = jest.fn();
  const playBtnSound = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders reset button and auto start checkbox", () => {
    render(
      <ResetAndAuto
        autoStartState={true}
        onToggleAutoStart={onToggleAutoStart}
        onReset={onReset}
        playBtnSound={playBtnSound}
      />
    );

    expect(screen.getByTestId("reset-btn")).toBeInTheDocument();
    expect(screen.getByTestId("auto-start-breaks-timer")).toBeInTheDocument();
    expect(screen.getByTestId("auto-start-breaks-timer")).toBeChecked();
  });

  test("calls onReset and playBtnSound when reset button clicked", () => {
    render(
      <ResetAndAuto
        autoStartState={false}
        onToggleAutoStart={onToggleAutoStart}
        onReset={onReset}
        playBtnSound={playBtnSound}
      />
    );

    fireEvent.click(screen.getByTestId("reset-btn"));
    expect(playBtnSound).toHaveBeenCalledTimes(1);
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  test("calls onToggleAutoStart when checkbox toggled", () => {
    render(
      <ResetAndAuto
        autoStartState={false}
        onToggleAutoStart={onToggleAutoStart}
        onReset={onReset}
        playBtnSound={playBtnSound}
      />
    );

    const checkbox = screen.getByTestId("auto-start-breaks-timer");
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(onToggleAutoStart).toHaveBeenCalledWith(true);
  });
});
