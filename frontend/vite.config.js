import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

const __dirname = path.dirname(fileURLToPath(import.meta.url))


const workboxRuntimeCaching = [
  // Assets statiques : JS compilé, CSS, polices  :  CacheFirst 30 jours
  //     Ces fichiers ont un hash dans leur nom généré par Vite,
  //     donc tant que le hash ne change pas, le fichier est identique.
  {
    urlPattern: ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets-v1',
      expiration: {
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        maxEntries: 100,
      },
      cacheableResponse: { statuses: [0, 200] },
    },
  },

  //   API étudiant : StaleWhileRevalidate
  //     On affiche les données en cache IMMÉDIATEMENT (pas d'écran vide)
  //     puis on rafraîchit silencieusement pour la prochaine visite.
  {
    urlPattern: /\/api\/v1\/student\/(notes|emploi-temps|profil|moyennes)/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'student-api-v1',
      expiration: {
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours max en cache
        maxEntries: 50,
      },
      cacheableResponse: { statuses: [0, 200] },
    },
  },

  //  Résultats IA (résumés, quiz) : CacheFirst
  //  Ces résultats sont immuables une fois générés :
  //  inutile de re-fetcher le même résumé chaque fois.
  {
    urlPattern: /\/api\/v1\/(summary|quiz)\/[\w-]+/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'ai-results-v1',
      expiration: {
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
        maxEntries: 200,
      },
      cacheableResponse: { statuses: [0, 200] },
    },
  },

  // Podcasts audio : CacheFirst et rangeRequests
  // rangeRequests : indispensable pour que le lecteur audio puisse
  // "sauter" dans le fichier (seek) même hors-ligne.
  {
    urlPattern: /\.(?:mp3|wav|ogg|m4a|aac)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'audio-podcasts-v1',
      expiration: {
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 jours
        maxEntries: 50,
      },
      cacheableResponse: { statuses: [0, 200] },
      rangeRequests: true,
    },
  },
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // 'autoUpdate' : le SW se met à jour automatiquement en arrière-plan
      // dès qu'un nouveau build est détecté.
      registerType: 'autoUpdate',

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

      // Configuration Workbox : précache et runtime caching
      workbox: {
        // Fichiers à précacher automatiquement 
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],

        // Règles de cache à l'exécution 
        runtimeCaching: workboxRuntimeCaching,
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