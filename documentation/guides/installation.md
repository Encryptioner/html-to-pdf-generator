# Installation Guide

## Package Manager Installation

Install using your preferred package manager:

### npm

```bash
npm install @encryptioner/html-to-pdf-generator
```

### pnpm (Recommended)

```bash
pnpm add @encryptioner/html-to-pdf-generator
```

### Yarn

```bash
yarn add @encryptioner/html-to-pdf-generator
```

## Framework-Specific Installation

### Vanilla JavaScript/TypeScript

No additional dependencies required:

```bash
npm install @encryptioner/html-to-pdf-generator
```

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';
```

### React

```bash
npm install @encryptioner/html-to-pdf-generator
```

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';
```

The library supports React 18 and 19.

### Vue 3

```bash
npm install @encryptioner/html-to-pdf-generator
```

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';
</script>
```

Requires Vue 3.0 or higher.

### Svelte

```bash
npm install @encryptioner/html-to-pdf-generator
```

```svelte
<script>
import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';
</script>
```

Supports Svelte 4 and 5.

## Dependencies

The library bundles its core dependencies:

- **jsPDF** (^2.5.2) - Bundled
- **html2canvas-pro** (^1.5.8) - Bundled with OKLCH support

No peer dependencies required for vanilla JavaScript usage.

### Optional Peer Dependencies

For framework adapters:

```json
{
  "react": "^18.0.0 || ^19.0.0",      // For React adapter
  "react-dom": "^18.0.0 || ^19.0.0",  // For React adapter
  "vue": "^3.0.0",                     // For Vue adapter
  "svelte": "^4.0.0 || ^5.0.0"        // For Svelte adapter
}
```

## Verification

Verify installation:

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

console.log('Package installed successfully!');
```

## TypeScript Setup

The package includes TypeScript definitions out of the box.

### tsconfig.json

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",  // or "node16"
    "types": ["@encryptioner/html-to-pdf-generator"]
  }
}
```

## Build Tool Configuration

### Vite

No additional configuration needed:

```javascript
// vite.config.js
export default {
  // Works out of the box
};
```

### Webpack

No additional configuration needed:

```javascript
// webpack.config.js
module.exports = {
  // Works out of the box
};
```

### Next.js

For Next.js App Router:

```javascript
// next.config.js
module.exports = {
  // Mark as client-side only if needed
};
```

Then in your component:

```tsx
'use client';

import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';
```

### Nuxt 3

For Nuxt 3:

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';
</script>
```

## CDN Usage (Browser)

For quick prototyping, use via CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { generatePDF } from 'https://cdn.jsdelivr.net/npm/@encryptioner/html-to-pdf-generator/+esm';

    window.generatePDF = generatePDF;
  </script>
</head>
<body>
  <div id="content">
    <h1>Hello PDF</h1>
  </div>
  <button onclick="generatePDF(document.getElementById('content'), 'doc.pdf')">
    Download
  </button>
</body>
</html>
```

## Troubleshooting Installation

### Module Not Found

If you see "Module not found" errors:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

If TypeScript doesn't recognize types:

```bash
# Restart TypeScript server
# VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Peer Dependency Warnings

If you see peer dependency warnings for frameworks you're not using, you can safely ignore them. The library only requires peer dependencies for the specific adapter you're using.


### Check Current Version

```bash
npm list @encryptioner/html-to-pdf-generator
```

## Next Steps

- **[Getting Started](./getting-started.md)** - Create your first PDF
- **[React Guide](./react-guide.md)** - React integration
- **[Vue Guide](./vue-guide.md)** - Vue integration
- **[Svelte Guide](./svelte-guide.md)** - Svelte integration

---

[← Back to Documentation](../index.md)
