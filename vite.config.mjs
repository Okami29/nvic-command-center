import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5180,
    proxy: {
      '/api': 'http://localhost:5181',
      '/uploads': 'http://localhost:5181'
    }
  },
  build: { outDir: 'dist' }
})
