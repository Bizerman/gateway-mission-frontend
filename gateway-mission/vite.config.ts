import { defineConfig } from 'vite'
import mkcert from "vite-plugin-mkcert"
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/gateway-mission-frontend',
  server: {
    open: '/gateway-mission-frontend',
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    https:{
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
  },
  plugins: [
    react(),
    mkcert(),
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
