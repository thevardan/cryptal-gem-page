import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      external: ['app.min.js']
    },
    copyPublicDir: true
  },
  server: {
    port: 3000,
    open: true
  },
  publicDir: 'public',
  assetsInclude: ['**/*.js']
})