import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Reg from "./Reg";

const mockNavigate = jest.fn();
const mockRegister = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children, to, className }) => <a href={to} className={className}>{children}</a>,
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("../../auth/AuthContext", () => ({
  useAuth: () => ({ register: mockRegister }),
}));

describe("Reg component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successful register navigates to board", async () => {
    mockRegister.mockResolvedValue(undefined);
    render(<Reg />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Alex" } });
    fireEvent.change(screen.getByPlaceholderText("Login"), { target: { value: "alex" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({ name: "Alex", login: "alex", password: "123" });
      expect(mockNavigate).toHaveBeenCalledWith("/board");
    });
  });

  test("failed register shows error", async () => {
    mockRegister.mockRejectedValue(new Error("Registration error"));
    render(<Reg />);
    fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Alex" } });
    fireEvent.change(screen.getByPlaceholderText("Login"), { target: { value: "alex" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.click(screen.getByText("Register"));

    expect(await screen.findByText("Registration error")).toBeInTheDocument();
  });
});
