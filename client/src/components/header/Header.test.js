import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./Header";
import { useAuth } from "../../auth/AuthContext";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
}), { virtual: true });

jest.mock("../../auth/AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders auth buttons for guest", () => {
    useAuth.mockReturnValue({ isAuth: false, user: null, logout: jest.fn() });
    render(<Header />);
    expect(screen.getByText("Зарегистрироваться")).toBeInTheDocument();
    expect(screen.getByText("Войти")).toBeInTheDocument();
  });

  test("renders user name and logs out", () => {
    const logout = jest.fn();
    useAuth.mockReturnValue({ isAuth: true, user: { name: "Alex" }, logout });
    render(<Header />);
    expect(screen.getByText("Alex")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Выйти"));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
