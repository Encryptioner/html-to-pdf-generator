/**
 * Build configuration for PDF Generator library
 *
 * This configuration creates separate bundles for:
 * - Core library (framework-agnostic)
 * - Node.js adapter (server-side with Puppeteer)
 * - React adapter
 * - Vue adapter
 * - Svelte adapter
 */

import { defineConfig } from 'tsup';

export default defineConfig([
  // Core bundle (framework-agnostic)
  {
    entry: {
      index: 'src/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: ['jspdf', 'html2canvas-pro'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },

  // Node.js adapter (server-side with Puppeteer)
  {
    entry: {
      node: 'src/adapters/node/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['puppeteer', 'jspdf', 'html2canvas-pro'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
    platform: 'node',
  },

  // React adapter
  {
    entry: {
      react: 'src/adapters/react/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['react', 'react-dom', 'jspdf', 'html2canvas-pro'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },

  // Vue adapter
  {
    entry: {
      vue: 'src/adapters/vue/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['vue', 'jspdf', 'html2canvas-pro'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },

  // Svelte adapter
  {
    entry: {
      svelte: 'src/adapters/svelte/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['svelte', 'svelte/store', 'jspdf', 'html2canvas-pro'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },
]);
