/**
 * Build configuration for PDF Generator library
 *
 * This configuration creates separate bundles for:
 * - Core library (framework-agnostic)
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
    external: ['jspdf', 'html2canvas'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },

  // React adapter
  {
    entry: {
      react: 'src/adapters/react/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['react', 'react-dom', 'jspdf', 'html2canvas'],
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
    external: ['vue', 'jspdf', 'html2canvas'],
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
    external: ['svelte', 'svelte/store', 'jspdf', 'html2canvas'],
    treeshake: true,
    splitting: false,
    sourcemap: true,
    minify: false,
    outDir: 'dist',
  },
]);
