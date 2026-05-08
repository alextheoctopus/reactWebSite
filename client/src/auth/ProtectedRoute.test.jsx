import React from "react";
import { render, screen } from "@testing-library/react";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./AuthContext";

jest.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}), { virtual: true });

jest.mock("./AuthContext", () => ({
  useAuth: jest.fn(),
}));

describe("ProtectedRoute", () => {
  test("returns null while loading", () => {
    useAuth.mockReturnValue({ isAuth: false, loading: true });
    const { container } = render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(container).toBeEmptyDOMElement();
  });

  test("renders children for authenticated user", () => {
    useAuth.mockReturnValue({ isAuth: true, loading: false });
    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
  });

  test("redirects guest to login", () => {
    useAuth.mockReturnValue({ isAuth: false, loading: false });
    render(
      <ProtectedRoute>
        <div>secret</div>
      </ProtectedRoute>
    );
    expect(screen.getByTestId("navigate")).toHaveTextContent("/login");
  });
});
