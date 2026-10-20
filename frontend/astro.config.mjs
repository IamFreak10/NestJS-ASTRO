import { defineConfig } from 'astro/config';

// 🚀 Ultra-Lightweight, Zero-Framework Production Optimization
export default defineConfig({
  compressHTML: true,
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      cssMinify: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          compact: true,
        },
      },
    },
    esbuild: {
      legalComments: 'none',
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,
    },
  },
});
