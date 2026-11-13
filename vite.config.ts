import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // On Netlify and local preview, base is '/'. For GitHub Pages, VITE_BASE, GITHUB_PAGES, or GITHUB_ACTIONS is used.
  base: process.env.VITE_BASE || (process.env.GITHUB_PAGES || process.env.GITHUB_ACTIONS ? '/Nikunj_Essence/' : '/'),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'ui-vendor': ['react', 'react-dom', 'framer-motion', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
