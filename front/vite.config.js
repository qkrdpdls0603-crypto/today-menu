import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 Tailwind v4용 공식 플러그인 추가
  ],
  server: {
    port: 5173,
    proxy: {
      '/auth':   { target: 'http://localhost:5000', changeOrigin: true },
      '/menu':   { target: 'http://localhost:5000', changeOrigin: true },
      '/party':  { target: 'http://localhost:5000', changeOrigin: true },
      '/mypage': { target: 'http://localhost:5000', changeOrigin: true },
      '/api':    { target: 'http://localhost:5000', changeOrigin: true },
    },
  },
})