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

  describe("keyboard navigation", () => {
    test("arrow keys navigate focus between buttons when running and not paused", () => {
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

      const prevBtn = screen.getByTestId("previous-cycle-btn");
      const pauseBtn = screen.getByTestId("pause-btn");
      const nextBtn = screen.getByTestId("next-cycle-btn");

      // Focus first button
      prevBtn.focus();
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(prevBtn);

      // ArrowRight moves focus to pauseBtn (index 1)
      fireEvent.keyDown(prevBtn, { key: "ArrowRight" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(pauseBtn);

      // ArrowRight moves focus to nextBtn (index 2)
      fireEvent.keyDown(pauseBtn, { key: "ArrowRight" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(nextBtn);

      // ArrowRight cycles back to prevBtn (index 0)
      fireEvent.keyDown(nextBtn, { key: "ArrowRight" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(prevBtn);

      // ArrowLeft cycles back to nextBtn (index 2)
      fireEvent.keyDown(prevBtn, { key: "ArrowLeft" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(nextBtn);

      // ArrowUp cycles to pauseBtn (index 1)
      fireEvent.keyDown(prevBtn, { key: "ArrowUp" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(pauseBtn);

      // ArrowDown cycles to nextBtn (index 2)
      fireEvent.keyDown(pauseBtn, { key: "ArrowDown" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(nextBtn);
    });
    test("arrow keys navigate focus on Start button when not running", () => {
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
      startBtn.focus();
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(startBtn);

      // Arrow keys should not throw or change focus (only one button)
      fireEvent.keyDown(startBtn, { key: "ArrowRight" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(startBtn);

      fireEvent.keyDown(startBtn, { key: "ArrowLeft" });
      // eslint-disable-next-line testing-library/no-node-access
      expect(document.activeElement).toBe(startBtn);
    });
  });
});
