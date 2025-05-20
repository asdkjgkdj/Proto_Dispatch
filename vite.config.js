import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  // 개발 중엔 '/', GitHub Pages에 올릴 땐 repo 이름으로 바꿔 주세요
  base: mode === 'development' ? '/' : '/Proto_Dispatch/',
  plugins: [
    react(),
  ],
}))