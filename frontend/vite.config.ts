import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
  UnoCSS(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:3000'
      }
    },
    host: '0.0.0.0'
  }
})
