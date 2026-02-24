const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export function getToken() {
  return localStorage.getItem("jwt") || "";
}

export function setToken(token) {
  if (!token) localStorage.removeItem("jwt");
  else localStorage.setItem("jwt", token);
}

export async function apiRequest(path, { method = "GET", body } = {}) {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const err = new Error((data && data.message) || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}