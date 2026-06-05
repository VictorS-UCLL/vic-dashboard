import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The browser always calls the same-origin path /grafana-api/* with no token.
// In dev, this proxy forwards to Grafana and injects the Bearer token here
// (server-side) — mirroring what nginx does in production. The token therefore
// never reaches the client bundle.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/grafana-api': {
          target: 'https://grafana.vic420.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/grafana-api/, ''),
          headers: {
            Authorization: `Bearer ${env.GRAFANA_TOKEN}`,
          },
        },
      },
    },
  }
})
