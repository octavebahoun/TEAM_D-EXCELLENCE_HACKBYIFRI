import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'autoUpdate' : le SW se met à jour automatiquement en arrière-plan
      // dès qu'un nouveau build est détecté.
      registerType: 'autoUpdate',

      // Mode injectManifest : on fournit notre propre SW (src/sw.js) qui gère
      // le push. Workbox injecte le precache manifest dedans à la build.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',

      // Fichiers à pré-mettre en cache au moment du build (precache)
      includeAssets: ['favicon.svg', 'icons/*.png'],

      // Manifeste Web App (rend l'app installable sur mobile/desktop)
      manifest: {
        name: 'AcademiX',
        short_name: 'AcademiX',
        description: 'Plateforme académique intelligente pour étudiants',
        theme_color: '#1e40af',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },

      // Configuration Workbox pour injectManifest
      injectManifest: {
        // Fichiers à précacher automatiquement
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    // allowedHosts: true,

    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:8000',
        ws: true,
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});