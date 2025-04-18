import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',            // wichtig für relative Pfade in CEF
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
