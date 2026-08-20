import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permite que se acceda desde fuera del contenedor
    allowedHosts: ['catalogo.eepsa.com.mx'],
    port: 80,
    hmr: {
      clientPort: 443,
    },
    watch: {
      usePolling: true, // Obligatorio para que Windows y Docker se comuniquen en tiempo real
    },
    proxy: {
      '/api': {
        target: 'http://backend:3001',
        changeOrigin: true,
      },
      '/catalogo-media': {
        target: 'http://backend:3001',
        changeOrigin: true,
      }
    }
  }
})
