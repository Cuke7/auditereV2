import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      name: 'Auditere2',
      short_name: 'Auditere2',
      background_color: "#000000",
      theme_color: "#000000",
      icons: [
        {
          src: 'bird.png',
          sizes: '1200x1200',
          type: 'image/png'
        }
      ]
    }
  })]
})
