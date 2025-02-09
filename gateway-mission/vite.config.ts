import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/gateway-mission-frontend',
  server: {
    open: '/gateway-mission-frontend',
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://192.168.1.20:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "GatewayMission",
        short_name: "GM",
        start_url: "/gateway-mission-frontend/",
        scope: "/gateway-mission-frontend/",
        display: "standalone",
        background_color: "#fdfdfd",
        theme_color: "#db4938",
        orientation: "portrait-primary",
        icons: [
          {
            "src": "/gateway-mission-frontend/logo192.png",
            "type": "image/png",
            "sizes": "192x192"
          },
          {
            "src": "/gateway-mission-frontend/logo512.jpg",
            "type": "image/png",
            "sizes": "512x512"
          }
        ],
        screenshots: [
          {
            "src": "/gateway-mission-frontend/mobile.jpg",
            "sizes": "1080x1920",
            "type": "image/png",
            "form_factor": "narrow"
          },
          {
            "src": "/gateway-mission-frontend/wide.jpg",
            "sizes": "1920x1080",
            "type": "image/png",
            "form_factor": "wide"
          }
        ],
        categories: ["productivity", "notes", "utilities"]
      }
    })
  ]
})
