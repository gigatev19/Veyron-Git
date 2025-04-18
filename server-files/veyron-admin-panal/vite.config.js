import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',     // wichtig, damit der CEF‑Loader die Pfade korrekt findet
  plugins: [vue()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
