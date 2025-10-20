// src/components/__tests__/TimerControls.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TimerControls } from "./TimerControls";

describe("TimerControls", () => {
  const playBtnSound = jest.fn();
  const onStart = jest.fn();
  const onPause = jest.fn();
  const onResume = jest.fn();
  const onForward = jest.fn();
  const onBackward = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders Start button when not running and not paused", () => {
    render(
      <TimerControls
        running={false}
        cyclePaused={false}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onForward={onForward}
        onBackward={onBackward}
        playBtnSound={playBtnSound}
      />
    );

    const startBtn = screen.getByTestId("start-btn");
    expect(startBtn).toBeInTheDocument();

    fireEvent.click(startBtn);
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(playBtnSound).toHaveBeenCalledTimes(1);
  });

  test("renders Pause button when running and not paused", () => {
    render(
      <TimerControls
        running={true}
        cyclePaused={false}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onForward={onForward}
        onBackward={onBackward}
        playBtnSound={playBtnSound}
      />
    );

    const pauseBtn = screen.getByTestId("pause-btn");
    expect(pauseBtn).toBeInTheDocument();

    fireEvent.click(pauseBtn);
    expect(onPause).toHaveBeenCalledTimes(1);
    expect(playBtnSound).toHaveBeenCalledTimes(1);
  });

  test("renders Resume button when paused", () => {
    render(
      <TimerControls
        running={true}
        cyclePaused={true}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onForward={onForward}
        onBackward={onBackward}
        playBtnSound={playBtnSound}
      />
    );

    const resumeBtn = screen.getByTestId("resume-btn");
    expect(resumeBtn).toBeInTheDocument();

    fireEvent.click(resumeBtn);
    expect(onResume).toHaveBeenCalledTimes(1);
    expect(playBtnSound).toHaveBeenCalledTimes(1);
  });

  test("calls onForward and onBackward handlers", () => {
    render(
      <TimerControls
        running={true}
        cyclePaused={false}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onForward={onForward}
        onBackward={onBackward}
        playBtnSound={playBtnSound}
      />
    );

    fireEvent.click(screen.getByTestId("next-cycle-btn"));
    expect(onForward).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId("previous-cycle-btn"));
    expect(onBackward).toHaveBeenCalledTimes(1);
  });
});
