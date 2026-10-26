import { defineConfig } from 'astro/config';

// 🚀 Ultra-Lightweight, Zero-Framework Production Optimization
export default defineConfig({
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
});
