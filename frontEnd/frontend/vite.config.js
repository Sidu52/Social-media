import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Allow connections from any IP
    port: 5173 // Check if this port matches
  },
  plugins: [react()],
})
