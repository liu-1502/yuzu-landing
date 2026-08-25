import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// path helper

export default defineConfig({
  // GitHub Pages phuc vu o /<repo>/ chu khong phai goc domain. Mac dinh '/' de
  // dev va cac host khac khong bi anh huong.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': new URL('./src', import.meta.url).pathname },
  },
})
