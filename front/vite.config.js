import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
=======
  build: {
    rollupOptions: {
      external: ['axios'],
      output: {
        globals: {
          axios: 'axios'
        }
      }
    }
  },
  optimizeDeps: {
    include: ['axios']
>>>>>>> 1957813db2d6f67ff782bd411628f94d8d164ced
  }
})
