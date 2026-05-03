import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/uploadFile': 'http://localhost:3000',
      '/scanResume': 'http://localhost:3000',
      '/helloText': 'http://localhost:3000',
    },
  },
})
