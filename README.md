# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Authentication

Password sign-in posts to `/api/login` and expects a JWT in the response. The
JWT is stored in local storage and sent as a Bearer token on API requests.

In development, the Google sign-in URL defaults to
`/oauth2/authorization/google`, which Vite proxies to the backend configured
by `BACKEND_PROXY_TARGET` in `.env.development`. App URLs are centralized in
`src/config/urls.js`, and environment values are read in
`src/config/appConfig.js`.

The backend must finish the Google OAuth callback, issue the app's JWT, then
redirect the browser to the React app's `/oauth2/callback` route with that JWT
as a `token` query parameter or URL fragment. The frontend stores it using the
same auth-token key as password sign-in and navigates to `/`. Google's
authorized redirect URI should point to the backend OAuth callback, not the
React app. Passing a JWT in a URL is suitable only for local demos; use a
short-lived, single-use code or secure cookie in production.

`.env.development` and `.env.production` provide environment-specific defaults.
For deployment, update the production URL values or provide deployment
environment variables, and configure the web server to proxy `/api` and
`/oauth2/authorization` to the backend.

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
