import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Auth from "./Auth";

const mockNavigate = jest.fn();
const mockLogin = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children, to, className }) => <a href={to} className={className}>{children}</a>,
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("../../auth/AuthContext", () => ({
  useAuth: () => ({ login: mockLogin }),
}));

describe("Auth component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("successful login navigates to board", async () => {
    mockLogin.mockResolvedValue(undefined);
    render(<Auth />);
    fireEvent.change(screen.getByPlaceholderText("Login"), { target: { value: "alex" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({ login: "alex", password: "123" });
      expect(mockNavigate).toHaveBeenCalledWith("/board");
    });
  });

  test("failed login shows error", async () => {
    mockLogin.mockRejectedValue(new Error("Bad credentials"));
    render(<Auth />);
    fireEvent.change(screen.getByPlaceholderText("Login"), { target: { value: "alex" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "123" } });
    fireEvent.click(screen.getByText("Sign in"));

    expect(await screen.findByText("Bad credentials")).toBeInTheDocument();
  });
});
