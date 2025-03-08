import { defineConfig } from 'vite';
import civetPlugin from '@danielx/civet/vite';
import solidPlugin from 'vite-plugin-solid';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: "./",
  plugins: [
    civetPlugin({
      ts: "preserve",
    }),
    solidPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'Gomoku',
        short_name: 'Gomoku',
        start_url: '/gomoku/',
        scope: '/gomoku/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0000ff'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,webm,webp}']
      }
    })
  ],
  build: {
    target: 'esnext',
  },
  server: {
    port: 3000,
  },
});
