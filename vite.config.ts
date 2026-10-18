import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// For GitHub Pages, set BASE_PATH=/repository-name/ when building.
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [tailwindcss()],
})
