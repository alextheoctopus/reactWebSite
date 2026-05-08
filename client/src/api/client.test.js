import { apiRequest, getToken, setToken } from "./client";

describe("api client", () => {
  const OLD_ENV = process.env.REACT_APP_API_URL;

  beforeEach(() => {
    process.env.REACT_APP_API_URL = "http://localhost:8080";
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env.REACT_APP_API_URL = OLD_ENV;
    jest.resetAllMocks();
  });

  test("getToken reads jwt from localStorage", () => {
    localStorage.setItem("jwt", "abc");
    expect(getToken()).toBe("abc");
  });

  test("setToken stores jwt", () => {
    setToken("abc");
    expect(localStorage.getItem("jwt")).toBe("abc");
  });

  test("setToken removes jwt when token is empty", () => {
    localStorage.setItem("jwt", "abc");
    setToken("");
    expect(localStorage.getItem("jwt")).toBeNull();
  });

  test("apiRequest sends json body and auth header", async () => {
    localStorage.setItem("jwt", "abc");

    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => ({ ok: true }),
    });

    const data = await apiRequest("/x", {
      method: "POST",
      body: { a: 1 },
    });

    expect(data).toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/x",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ a: 1 }),
        headers: expect.objectContaining({
          Authorization: "Bearer abc",
          "Content-Type": "application/json",
        }),
      })
    );
  });

  test("apiRequest sends request without body and token", async () => {
    fetch.mockResolvedValue({
      ok: true,
      headers: { get: () => "text/plain" },
      text: async () => "ok",
    });

    const data = await apiRequest("/health");

    expect(data).toBe("ok");
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/health",
      expect.objectContaining({
        method: "GET",
        body: undefined,
        headers: {},
      })
    );
  });

  test("apiRequest throws error with backend message", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => "application/json" },
      json: async () => ({ message: "Bad request" }),
    });

    await expect(apiRequest("/x")).rejects.toMatchObject({
      message: "Bad request",
      status: 400,
      data: { message: "Bad request" },
    });
  });

  test("apiRequest throws fallback error for non-json response", async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => "text/plain" },
      text: async () => "oops",
    });

    await expect(apiRequest("/x")).rejects.toMatchObject({
      message: "HTTP 500",
      status: 500,
      data: "oops",
    });
  });
});