import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";

describe("Login component", () => {
  beforeEach(() => {
    // eslint-disable-next-line testing-library/no-render-in-setup
    render(<Login />);
  });

  it("renders login form with email and password inputs and submit button", () => {
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", () => {
    const submitButton = screen.getByRole("button", { name: /log in/i });
    fireEvent.click(submitButton);

    expect(
      screen.getByText(/please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
  });

  it("shows error message on invalid credentials", () => {
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it("calls alert on successful login", () => {
    const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith("Login successful!");

    alertMock.mockRestore();
  });

  it("clears error message when alert is dismissed", () => {
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /log in/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpass" } });
    fireEvent.click(submitButton);

    const alertCloseButton = screen.getByLabelText(/close/i);
    fireEvent.click(alertCloseButton);

    expect(
      screen.queryByText(/invalid email or password/i)
    ).not.toBeInTheDocument();
  });
});
