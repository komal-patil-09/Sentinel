import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // IMPORTANT: Replace 'YOUR-REPOSITORY-NAME' with your exact GitHub repo name (e.g. '/sentinel-monitor/')
  // If you are just running it locally, you can delete the 'base' line below.
  base: '/Sentinel/',
})