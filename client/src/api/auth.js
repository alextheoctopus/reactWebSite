import { apiRequest, setToken } from "./client";

export async function login({ login, password }) {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { login, password },
  });

  if (!data?.token) throw new Error("Backend did not return token");
  setToken(data.token);
  return data;
}

export async function register({ name, login, password }) {
  const data = await apiRequest("/api/auth/register", {
    method: "POST",
    body: { name, login, password },
  });

  if (!data?.token) throw new Error("Backend did not return token");
  setToken(data.token);
  return data;
}

export async function me() {
  return apiRequest("/api/auth/me");
}

export function logout() {
  setToken("");
}