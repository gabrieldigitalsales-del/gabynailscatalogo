import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const localApiProxyTarget = process.env.VITE_LOCAL_API_ORIGIN

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    ...(localApiProxyTarget
      ? {
          proxy: {
            '/api': {
              target: localApiProxyTarget,
              changeOrigin: true,
            },
          },
        }
      : {}),
  },
})
