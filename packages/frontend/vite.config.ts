/// <reference types="vitest" />
/// <reference types="vite/client" />
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import eslintPlugin from '@nabla/vite-plugin-eslint'

export default defineConfig({
  plugins: [react(), eslintPlugin()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.ts',
  },
  server: {
    port: 7000,
    proxy: {
      '/api': {
        target: 'http://localhost:7001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
