import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const LOGIN_URL = `${API_BASE_URL}/login`;
const TOKEN_STORAGE_KEY = "react-product-app-auth-token";
const LEGACY_USERNAME_KEY = "react-product-app-basic-auth-username";
const LEGACY_PASSWORD_KEY = "react-product-app-basic-auth-password";

function isLoginRequest(config) {
  return config?.url === LOGIN_URL;
}

function clearLegacyCredentials() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(LEGACY_USERNAME_KEY);
    window.sessionStorage.removeItem(LEGACY_PASSWORD_KEY);
  }
}

export function getAuthToken() {
  return typeof window === "undefined"
    ? null
    : window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setAuthToken(token) {
  const normalizedToken = token.trim().replace(/^Bearer\s+/i, "");
  if (!normalizedToken) {
    throw new TypeError("The login API returned an empty token.");
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
  clearLegacyCredentials();
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    clearLegacyCredentials();
  }
}

export function hasAuthToken() {
  return Boolean(getAuthToken());
}

export async function login(username, password) {
  const { data } = await axios.post(LOGIN_URL, { username, password });
  const tokenValue =
    typeof data === "string"
      ? data
      : data?.token ??
        data?.jwt ??
        data?.jwtToken ??
        data?.accessToken ??
        data?.access_token;
  const token = typeof tokenValue === "string" ? tokenValue.trim() : "";

  if (!token) {
    throw new Error("The login API response did not contain a JWT token.");
  }

  return token.replace(/^Bearer\s+/i, "");
}

axios.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && !isLoginRequest(config)) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoginRequest(error.config)) {
      clearAuthToken();
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  },
);
