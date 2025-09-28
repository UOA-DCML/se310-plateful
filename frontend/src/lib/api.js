// src/lib/api.js
const BASE_URL = "http://localhost:8080";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  const text = await res.text();
  let json;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg =
      json?.message ||
      (json?.errors && Object.values(json.errors)[0]) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

export const api = {
  signup: ({ email, password }) =>
    request("/auth/signup", { method: "POST", body: { email, password } }),

  login: ({ email, password }) =>
    request("/auth/login", { method: "POST", body: { email, password } }),

  me: () => request("/auth/me"),
  logout: () => request("/auth/logout", { method: "POST" }),
};
