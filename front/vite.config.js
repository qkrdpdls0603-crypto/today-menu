import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // .env 파일이 있으면 그 값을 쓰고, 없으면 아래 기본값을 사용
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(
        env.VITE_API_URL || 'http://localhost:5000'
      ),
      'import.meta.env.VITE_NAVER_CLIENT_ID': JSON.stringify(
        env.VITE_NAVER_CLIENT_ID || 'hrIvICTUf7cyWx7Tz6kb'
      ),
    },
    server: {
      port: 5173,
      proxy: {
        // 모든 /api 시작 요청만 백엔드로 토스
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
