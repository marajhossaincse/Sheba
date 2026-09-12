import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward API calls to the backend through the same origin the browser
    // is talking to. This means the frontend never needs a separate
    // "localhost:4000" address baked in — handy for local dev and essential
    // once this is shared via a tunnel/public URL (see README.md).
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
    // Vite normally only accepts requests addressed to "localhost" as a
    // safety check. A tunnel (see README.md) forwards requests with a
    // public hostname instead, so we disable that check — fine for local
    // dev / demo use, not something to carry into a real deployment.
    allowedHosts: true,
  },
})
