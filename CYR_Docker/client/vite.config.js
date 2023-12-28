import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    // port: 5000, //Eliminar para trabajar en el puerto 5173 y usar para integrarlo en el servidor
    proxy: {
      '/api': 'http://localhost:5000', // Cambiar la dirección a tu servidor backend
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  plugins: [react()],
})