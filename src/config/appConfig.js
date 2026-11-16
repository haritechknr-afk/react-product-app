const environment = import.meta.env;

export const appConfig = Object.freeze({
  apiBaseUrl: environment.VITE_API_BASE_URL || "/api",
  googleLoginUrl:
    environment.VITE_GOOGLE_LOGIN_URL || "/oauth2/authorization/google",
  oauthCallbackPath: environment.VITE_OAUTH_CALLBACK_PATH || "/oauth2/callback",
});
