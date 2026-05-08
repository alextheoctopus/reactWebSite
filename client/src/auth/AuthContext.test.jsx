import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "./AuthContext";
import * as AuthAPI from "../api/auth";
import * as ClientAPI from "../api/client";

jest.mock("../api/auth", () => ({
  me: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("../api/client", () => ({
  getToken: jest.fn(),
}));

function Consumer() {
  const { user, isAuth, loading, error, login, register, logout } = useAuth();

  return (
    <div>
      <div data-testid="user-name">{user?.name || ""}</div>
      <div data-testid="is-auth">{String(isAuth)}</div>
      <div data-testid="loading">{String(loading)}</div>
      <div data-testid="error">{error?.message || ""}</div>
      <button onClick={() => login({ login: "alex", password: "123" })}>login</button>
      <button onClick={() => register({ name: "Alex", login: "alex", password: "123" })}>register</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("bootstrap without token finishes unauthenticated", async () => {
    ClientAPI.getToken.mockReturnValue("");

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(AuthAPI.me).not.toHaveBeenCalled();
    expect(screen.getByTestId("is-auth")).toHaveTextContent("false");
    expect(screen.getByTestId("user-name")).toHaveTextContent("");
  });

  test("bootstrap with token loads user", async () => {
    ClientAPI.getToken.mockReturnValue("jwt");
    AuthAPI.me.mockResolvedValue({ id: 1, name: "Alex" });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
      expect(screen.getByTestId("user-name")).toHaveTextContent("Alex");
    });

    expect(screen.getByTestId("is-auth")).toHaveTextContent("true");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual({ id: 1, name: "Alex" });
  });

  test("login updates current user", async () => {
    ClientAPI.getToken.mockReturnValue("");
    AuthAPI.login.mockResolvedValue({ token: "jwt" });
    AuthAPI.me.mockResolvedValue({ id: 1, name: "Alex" });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    fireEvent.click(screen.getByText("login"));

    await waitFor(() => {
      expect(AuthAPI.login).toHaveBeenCalledWith({ login: "alex", password: "123" });
      expect(screen.getByTestId("user-name")).toHaveTextContent("Alex");
      expect(screen.getByTestId("is-auth")).toHaveTextContent("true");
    });
  });

  test("register updates current user", async () => {
    ClientAPI.getToken.mockReturnValue("");
    AuthAPI.register.mockResolvedValue({ token: "jwt" });
    AuthAPI.me.mockResolvedValue({ id: 2, name: "Kate" });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    fireEvent.click(screen.getByText("register"));

    await waitFor(() => {
      expect(AuthAPI.register).toHaveBeenCalledWith({ name: "Alex", login: "alex", password: "123" });
      expect(screen.getByTestId("user-name")).toHaveTextContent("Kate");
      expect(screen.getByTestId("is-auth")).toHaveTextContent("true");
    });
  });

  test("logout clears user state", async () => {
    ClientAPI.getToken.mockReturnValue("jwt");
    AuthAPI.me.mockResolvedValue({ id: 1, name: "Alex" });

    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-name")).toHaveTextContent("Alex");
    });

    fireEvent.click(screen.getByText("logout"));

    expect(AuthAPI.logout).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("user")).toBeNull();
    expect(screen.getByTestId("user-name")).toHaveTextContent("");
    expect(screen.getByTestId("is-auth")).toHaveTextContent("false");
  });
});
