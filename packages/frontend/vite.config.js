import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    allowedHosts: [process.env.FRONTEND_ADDRESS ?? 'localhost'],
    host: true, // = 0.0.0.0
    port: 3001,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'html'],
      all: true,
      include: ['**/*.{ts,vue}'],
      exclude: ['dist/*', 'tests/*', '__fixtures__/.*\.ts(?:x)?$'],
    },
  },
});
