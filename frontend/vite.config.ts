import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    fs: {
      // Allow serving files from rust-core/pkg
      allow: ['..'],
    },
  },
  optimizeDeps: {
    exclude: ['bio_prior_core'],
  },
  build: {
    target: 'esnext',
  },
});
