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
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5300,
    strictPort: true,
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'https://vps.axorawebsolutions.com',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
      '/health': {
        target: 'https://vps.axorawebsolutions.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
