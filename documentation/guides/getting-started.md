# Getting Started

Get up and running with HTML to PDF Generator in just a few minutes!

## Installation

Install the package using your preferred package manager:

```bash
# npm
npm install @encryptioner/html-to-pdf-generator

# pnpm
pnpm add @encryptioner/html-to-pdf-generator

# yarn
yarn add @encryptioner/html-to-pdf-generator
```

## Your First PDF (Vanilla JavaScript)

Let's create your first PDF in 3 simple steps:

### Step 1: Create HTML Content

```html
<!DOCTYPE html>
<html>
<body>
  <div id="content">
    <h1>My First PDF</h1>
    <p>This is a simple document that will be converted to PDF.</p>
    <p>It automatically handles multiple pages!</p>
  </div>

  <button id="download-btn">Download PDF</button>

  <script type="module" src="app.js"></script>
</body>
</html>
```

### Step 2: Generate the PDF

```javascript
// app.js
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

document.getElementById('download-btn').addEventListener('click', async () => {
  const element = document.getElementById('content');

  await generatePDF(element, 'my-first-pdf.pdf', {
    format: 'a4',
    orientation: 'portrait',
  });
});
```

### Step 3: Run and Test

That's it! Click the button and your PDF will download automatically.

## With React

Using React? It's even simpler with our hooks:

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyDocument() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'document.pdf',
    format: 'a4',
  });

  return (
    <div>
      {/* Content to convert */}
      <div ref={targetRef}>
        <h1>My React PDF</h1>
        <p>This content will be converted to PDF!</p>
      </div>

      {/* Download button */}
      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
      </button>
    </div>
  );
}
```

## With Vue 3

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'document.pdf',
  format: 'a4',
});
</script>

<template>
  <div>
    <!-- Content to convert -->
    <div ref="targetRef">
      <h1>My Vue PDF</h1>
      <p>This content will be converted to PDF!</p>
    </div>

    <!-- Download button -->
    <button @click="generatePDF" :disabled="isGenerating">
      {{ isGenerating ? `Generating... ${progress}%` : 'Download PDF' }}
    </button>
  </div>
</template>
```

## With Svelte

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'document.pdf',
    format: 'a4',
  });

  const handleDownload = () => {
    if (targetElement) {
      generatePDF(targetElement);
    }
  };
</script>

<!-- Content to convert -->
<div bind:this={targetElement}>
  <h1>My Svelte PDF</h1>
  <p>This content will be converted to PDF!</p>
</div>

<!-- Download button -->
<button on:click={handleDownload} disabled={$isGenerating}>
  {$isGenerating ? `Generating... ${$progress}%` : 'Download PDF'}
</button>
```

## Understanding the Basics

### How It Works

The library follows a 3-step process:

1. **Render**: Your HTML is rendered in a fixed-width container (794px for A4)
2. **Capture**: The entire content is captured as a high-quality image using html2canvas
3. **Split**: The image is intelligently split into PDF pages at proper boundaries

### Key Concepts

#### Fixed Width Container

PDFs are generated at a fixed width (794px for A4 at 96 DPI) to ensure consistent output across all devices:

```html
<!-- Good: Content will render consistently -->
<div ref={targetRef} style={{ width: '794px' }}>
  Your content here
</div>
```

#### Page Formats

We support standard paper formats:

- **A4**: 210mm × 297mm (default)
- **Letter**: 8.5" × 11"
- **A3**: 297mm × 420mm
- **Legal**: 8.5" × 14"

```javascript
await generatePDF(element, 'document.pdf', {
  format: 'letter', // Change format
  orientation: 'landscape', // or 'portrait'
});
```

#### Margins

Control spacing around your content:

```javascript
await generatePDF(element, 'document.pdf', {
  margins: [20, 15, 20, 15], // [top, right, bottom, left] in mm
});
```

## Common Options

Here are the most commonly used options:

```javascript
await generatePDF(element, 'document.pdf', {
  // Paper settings
  format: 'a4',                    // Paper format
  orientation: 'portrait',         // Page orientation
  margins: [10, 10, 10, 10],      // Margins in mm

  // Quality settings
  scale: 2,                        // Higher = better quality (slower)
  imageQuality: 0.85,             // JPEG quality (0-1)
  compress: true,                  // Compress PDF

  // Features
  showPageNumbers: true,           // Add page numbers
  pageNumberPosition: 'footer',    // 'header' or 'footer'

  // Callbacks
  onProgress: (progress) => {
    console.log(`${progress}%`);
  },
  onComplete: (blob) => {
    console.log('PDF ready!', blob);
  },
  onError: (error) => {
    console.error('Failed:', error);
  },
});
```

## Next Steps

Now that you've created your first PDF, explore more features:

### Essential Guides
- **[Multi-Page Documents](../features/multi-page.md)** - Handle long documents with automatic pagination
- **[Image Optimization](../advanced/image-optimization.md)** - DPI control and print quality
- **[Options Reference](../api/options.md)** - All configuration options
- **[Best Practices](./best-practices.md)** - Optimize performance and quality

### Framework-Specific Guides
- **[React Guide](./react-guide.md)** - Deep dive into React integration
- **[Vue Guide](./vue-guide.md)** - Vue 3 best practices
- **[Svelte Guide](./svelte-guide.md)** - Svelte integration tips
- **[Vanilla JS Guide](./vanilla-guide.md)** - Plain JavaScript/TypeScript
- **[Server-Side Guide](./server-side-guide.md)** - Node.js/Puppeteer backend usage

## Quick Examples

### Generate from HTML String

```javascript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
  <div>
    <h1>Invoice #12345</h1>
    <p>Amount: $1,234.56</p>
  </div>
`;

await generatePDFFromHTML(html, 'invoice.pdf');
```

### Get Blob Instead of Downloading

```javascript
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

const blob = await generatePDFBlob(element, {
  format: 'a4',
});

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');
await fetch('/api/upload', { method: 'POST', body: formData });
```

### Show Progress

```javascript
const { generatePDF, progress } = usePDFGenerator({
  filename: 'document.pdf',
  onProgress: (p) => {
    console.log(`Progress: ${p}%`);
  },
});
```

## Troubleshooting

### Content Not Showing?

Make sure all images and fonts are loaded before generating:

```javascript
// Wait for images to load
await new Promise(resolve => {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.addEventListener('load', resolve);
  }
});

await generatePDF(element, 'document.pdf');
```

### PDF Too Large?

Reduce file size with these options:

```javascript
await generatePDF(element, 'document.pdf', {
  scale: 1.5,              // Lower scale
  imageQuality: 0.75,      // Lower quality
  compress: true,          // Enable compression
  optimizeImages: true,    // Optimize images
});
```

### Styles Not Applied?

Ensure CSS is loaded and applied before generation. For external stylesheets, they must be accessible (not blocked by CORS).

## Need More Help?

- **[Best Practices](./best-practices.md)** - Optimize your PDFs
- **[Troubleshooting Guide](./troubleshooting.md)** - Common issues and solutions
- **[API Reference](../api/options.md)** - Complete options reference

---

**Ready to dive deeper?** Check out our [framework-specific guides](#framework-specific-guides) or explore [image optimization](../advanced/image-optimization.md)!
