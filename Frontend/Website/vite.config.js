import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
 
// ⚠️  UPDATE THIS every time you restart ngrok
const NGROK_URL = 'https://ganglionate-unconvincedly-perla.ngrok-free.dev'
 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/stt':    { target: NGROK_URL, changeOrigin: true, secure: false },
      '/chat':   { target: NGROK_URL, changeOrigin: true, secure: false },
      '/tts':    { target: NGROK_URL, changeOrigin: true, secure: false },
      '/health': { target: NGROK_URL, changeOrigin: true, secure: false },
    },
  },
})
 