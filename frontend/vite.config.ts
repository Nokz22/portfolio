import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Target modern browsers — no IE polyfill bloat
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor — always loaded
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Page transitions + spring interactions
          'vendor-motion': ['framer-motion'],
          // Scroll animations — lazy loaded by ScrollReveal component
          'vendor-scroll': ['gsap', 'lenis'],
          // i18n — lazy loaded per locale
          'vendor-i18n': ['react-i18next', 'i18next', 'i18next-browser-languagedetector'],
        },
      },
    },
  },

  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        // PROXY_TARGET set to http://backend:8080 in Docker; fallback for local dev
        target: process.env['PROXY_TARGET'] ?? 'http://localhost:8090',
        changeOrigin: true,
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
    coverage: {
      reporter: ['text', 'lcov'],
    },
  },
})
