import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Help from "./Help";

describe("Help component", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<Help />);
  });

  it("renders main headings and sections", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: /help/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /what is the pomodoro technique\?/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /how to use this pomodoro timer app/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /benefits of using the pomodoro technique/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /common mistakes to avoid/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: /tips for success/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: /frequently asked questions/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the Pomodoro Technique image with alt text", () => {
    const image = screen.getByRole("img", {
      name: /diagram illustrating the pomodoro technique workflow/i,
    });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src");
  });

  it("toggles FAQ answers on question click", () => {
    const question = screen.getByRole("button", {
      name: /can i customize the timer durations\?/i,
    });
    expect(question).toHaveAttribute("aria-expanded", "false");

    // Initially answer should not be visible
    expect(
      screen.queryByText(/yes! visit the settings page/i)
    ).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(/yes! visit the settings page/i)
    ).toBeInTheDocument();

    // Click again to close
    fireEvent.click(question);
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText(/yes! visit the settings page/i)
    ).not.toBeInTheDocument();
  });

  it("toggles FAQ answers on Enter and Space key press", () => {
    const question = screen.getByRole("button", {
      name: /can i customize the timer durations\?/i,
    });

    // Press Enter to open
    fireEvent.keyDown(question, { key: "Enter", code: "Enter" });
    expect(question).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByText(/yes! visit the settings page/i)
    ).toBeInTheDocument();

    // Press Space to close
    fireEvent.keyDown(question, { key: " ", code: "Space" });
    expect(question).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.queryByText(/yes! visit the settings page/i)
    ).not.toBeInTheDocument();
  });
});
