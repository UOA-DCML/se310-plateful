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
// Use window.location.origin in production to get the actual deployed URL
const resolveFrontendBaseUrl = () => {
  // Check if we have a specific env variable set
  const fromEnv = trimTrailingSlash(import.meta.env?.VITE_FRONTEND_BASE_URL);
  if (fromEnv) return fromEnv;

  // In browser, use the actual origin with base path
  if (typeof window !== "undefined") {
    const baseUrl = import.meta.env.BASE_URL || '/';
    // For GitHub Pages deployment, construct the full URL
    if (window.location.origin.includes('github.io')) {
      return `${window.location.origin}${baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '')}`;
    }
    return window.location.origin;
  }

  // Fallback for SSR/build time
  return "https://uoa-dcml.github.io/se310-plateful";
};

export const FRONTEND_BASE_URL = resolveFrontendBaseUrl();

export const buildFrontendUrl = (path = "") => {
  const normalisedPath = path.startsWith("/") ? path : `/${path}`;
  return `${FRONTEND_BASE_URL}${normalisedPath}`;
};
