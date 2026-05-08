import { login, logout, me, register } from "./auth";
import { apiRequest, setToken } from "./client";

jest.mock("./client", () => ({
  apiRequest: jest.fn(),
  setToken: jest.fn(),
}));

describe("auth api", () => {
  beforeEach(() => {
    apiRequest.mockReset();
    setToken.mockReset();
  });

  test("login sends credentials, stores token and returns payload", async () => {
    apiRequest.mockResolvedValue({ token: "jwt-token", user: { login: "alex" } });

    const result = await login({ login: "alex", password: "123" });

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/login", {
      method: "POST",
      body: { login: "alex", password: "123" },
    });
    expect(setToken).toHaveBeenCalledWith("jwt-token");
    expect(result).toEqual({ token: "jwt-token", user: { login: "alex" } });
  });

  test("login throws when backend does not return token", async () => {
    apiRequest.mockResolvedValue({ user: { login: "alex" } });

    await expect(login({ login: "alex", password: "123" })).rejects.toThrow(
      "Backend did not return token"
    );
    expect(setToken).not.toHaveBeenCalled();
  });

  test("register sends payload and stores token", async () => {
    apiRequest.mockResolvedValue({ token: "new-token", user: { name: "Alex" } });

    const result = await register({ name: "Alex", login: "alex", password: "456" });

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      body: { name: "Alex", login: "alex", password: "456" },
    });
    expect(setToken).toHaveBeenCalledWith("new-token");
    expect(result.user.name).toBe("Alex");
  });

  test("me requests current user", async () => {
    apiRequest.mockResolvedValue({ id: 1, login: "alex" });

    const result = await me();

    expect(apiRequest).toHaveBeenCalledWith("/api/auth/me");
    expect(result).toEqual({ id: 1, login: "alex" });
  });

  test("logout clears token", () => {
    logout();
    expect(setToken).toHaveBeenCalledWith("");
  });
});
