const trimTrailingSlash = (value) =>
  typeof value === "string" ? value.replace(/\/+$/, "") : value;

const resolveBaseUrl = () => {
  const fromEnv = trimTrailingSlash(import.meta.env?.VITE_API_BASE_URL);
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    const host = hostname || "localhost";
    // Default Spring Boot dev port; adjust via env when hosting elsewhere.
    return `${protocol}//${host}:8080`;
  }

  return "http://localhost:8080";
};

export const API_BASE_URL = resolveBaseUrl();

export const buildApiUrl = (path = "") => {
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalisedPath}`;
};

// Frontend base URL for sharing and redirects
export const FRONTEND_BASE_URL = "https://uoa-dcml.github.io/se310-plateful";

export const buildFrontendUrl = (path = "") => {
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return `${FRONTEND_BASE_URL}${normalisedPath}`;
};
