import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, '.', '')
  const backendTarget =
    environment.BACKEND_PROXY_TARGET || 'http://localhost:8081'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          rewrite: (path) => (path === '/api/login' ? '/login' : path),
        },
        '^/oauth2/authorization': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
