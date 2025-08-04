import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/Brettspiel/', // 👈 Fügen Sie diese Zeile hinzu
  plugins: [react()],
})