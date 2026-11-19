import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    // Browser specs run through Playwright; keeping them out of Vitest prevents
    // Playwright's `test()` API from being evaluated in the JSDOM runner.
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: './tests/setup.ts',
    css: true,
    environmentOptions: {
      jsdom: { url: 'http://127.0.0.1:8000' },
    },
  },
})
