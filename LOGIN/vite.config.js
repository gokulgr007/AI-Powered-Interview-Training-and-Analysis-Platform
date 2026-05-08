import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    proxy: {
      // 1. Your existing main backend (Port 5000)
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
      // 2. NEW: Piston Code Execution Server (Port 2000)
      '/piston': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        // This removes '/piston' from the URL before sending it to Docker
        rewrite: (path) => path.replace(/^\/piston/, ''),
      },
    },
  },
  resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
      dedupe: ["react", "react-dom"],
    },
})