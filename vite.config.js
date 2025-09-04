import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Ctrl-Z-Us/', 
  css: {
    postcss: './postcss.config.js',
  },
})

