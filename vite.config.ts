import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import egg from './api/egg.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'egg-reader-source',
    configureServer(server) {
      server.middlewares.use('/api/egg', egg)
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/egg', egg)
    },
  }],
})
