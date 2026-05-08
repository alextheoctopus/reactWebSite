import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("react-router-dom", () => {
  const React = require("react");
  return {
    BrowserRouter: ({ children }) => <div>{children}</div>,
    Routes: ({ children }) => <div>{children}</div>,
    Route: ({ element }) => <div>{element}</div>,
    Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
  };
}, { virtual: true });

jest.mock("./auth/AuthContext", () => ({
  AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
}));

jest.mock("./auth/ProtectedRoute", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="protected">{children}</div>,
}));

jest.mock("./components/header/Header", () => () => <div>Header</div>);
jest.mock("./components/auth/Auth", () => () => <div>Auth</div>);
jest.mock("./components/reg/Reg", () => () => <div>Reg</div>);
jest.mock("./pages/BoardPage", () => () => <div>BoardPage</div>);

import App from "./App";

describe("App", () => {
  test("renders app shell and routes", () => {
    render(<App />);
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Auth")).toBeInTheDocument();
    expect(screen.getByText("Reg")).toBeInTheDocument();
    expect(screen.getByText("BoardPage")).toBeInTheDocument();
    expect(screen.getByTestId("protected")).toBeInTheDocument();
    expect(screen.getAllByTestId("navigate").length).toBeGreaterThan(0);
  });
});
