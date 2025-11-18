# Batch PDF newPage Parameter - Vite Demo

This is a working browser demo using Vite to bundle the library and its dependencies.

## Setup

1. **Install dependencies:**
   ```bash
   cd examples/vite-demo
   npm install
   # or
   pnpm install
   ```

2. **Run the dev server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. **Open in browser:**
   Open the URL shown in terminal (usually `http://localhost:5173`)

## Features

This demo demonstrates the `newPage` parameter fix for batch PDF generation:

- **Test 1:** `newPage: true` - Forces each item on separate pages (FIXES THE ISSUE)
- **Test 2:** `newPage: false` - Allows items to share pages if they fit
- **Test 3:** `newPage: undefined` - Default behavior (page break after each item)

## Why Vite?

The built library uses ES modules with bare imports (like `import jsPDF from 'jspdf'`), which require a bundler to work in browsers. Vite handles this bundling automatically during development.

## Production Build

To create a production build:

```bash
npm run build
npm run preview
```

This creates optimized, bundled files in the `dist/` folder.

## Alternative: Use in Your Project

Instead of running this demo, you can integrate the library into your existing project:

### With Vite/Webpack/Rollup

```typescript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  { content: domA, pageCount: 1, newPage: true },
  { content: domB, pageCount: 1, newPage: true },
];

await generateBatchPDF(items, 'output.pdf');
```

### With React

```tsx
import { useBatchPDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { generateBatchPDF, isGenerating } = useBatchPDFGenerator();

  const handleGenerate = async () => {
    const items = [
      { content: domA, pageCount: 1, newPage: true },
      { content: domB, pageCount: 1, newPage: true },
    ];
    await generateBatchPDF(items, 'output.pdf');
  };

  return <button onClick={handleGenerate}>Generate PDF</button>;
}
```

### With Vue

```vue
<script setup>
import { useBatchPDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { generateBatchPDF, isGenerating } = useBatchPDFGenerator();

const handleGenerate = async () => {
  const items = [
    { content: domA, pageCount: 1, newPage: true },
    { content: domB, pageCount: 1, newPage: true },
  ];
  await generateBatchPDF(items, 'output.pdf');
};
</script>
```

## See Also

- [Main README](../../README.md)
- [Batch Generation Guide](../../documentation/advanced/batch-generation.md)
- [Test Script](../test-batch-newpage.cjs) - Node.js test without browser
