# HTML to PDF Generator

> A modern, framework-agnostic library for converting HTML to professional multi-page PDFs with smart pagination and rich features.

[![npm version](https://img.shields.io/npm/v/@encryptioner/html-to-pdf-generator.svg)](https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

## Features

### Core Features
✅ Multi-page PDFs with smart pagination
✅ Framework adapters (React, Vue, Svelte, Vanilla JS)
✅ OKLCH color support & Tailwind CSS v4 compatible
✅ Image optimization & SVG conversion
✅ Table pagination with header repetition
✅ Full TypeScript support
✅ Progress tracking & callbacks

### Phase 1 Features
✅ Text & image watermarks
✅ Dynamic headers/footers with templates
✅ PDF metadata (title, author, keywords, etc.)
✅ Print media CSS emulation
✅ Batch PDF generation with auto-scaling

### Phase 2 Features
✅ Template system (variables, loops, conditionals)
✅ Custom font handling & web-safe fallbacks
✅ Auto-generated Table of Contents
✅ PDF bookmarks/outline support

### Phase 3 Features
✅ PDF security & encryption configuration
✅ Async processing with webhooks
✅ Real-time preview component (React)
✅ URL to PDF conversion

### Phase 4 Features (v5.1.0) ⭐ NEW
✅ Enhanced DPI control (72/150/300 DPI)
✅ Print-quality image optimization
✅ Transparent image background handling
✅ Image format selection (JPEG/PNG/WebP)
✅ Searchable text support (built-in)

## Quick Start

### Installation

```bash
npm install @encryptioner/html-to-pdf-generator
```

### Basic Usage

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

### With React

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'document.pdf',
  });

  return (
    <>
      <div ref={targetRef}>
        <h1>Content to convert</h1>
      </div>
      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `${progress}%` : 'Download PDF'}
      </button>
    </>
  );
}
```

### With Vue 3

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef"><h1>Content to convert</h1></div>
    <button @click="generatePDF" :disabled="isGenerating">
      {{ isGenerating ? `${progress}%` : 'Download PDF' }}
    </button>
  </div>
</template>
```

### With Svelte

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<div bind:this={targetElement}><h1>Content to convert</h1></div>
<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  {$isGenerating ? `${$progress}%` : 'Download PDF'}
</button>
```

## Documentation

**📚 [Complete Documentation](./documentation/index.md)**

### Getting Started
- **[Installation Guide](./documentation/guides/installation.md)** - Detailed installation instructions
- **[Quick Start Guide](./documentation/guides/getting-started.md)** - Get up and running in 5 minutes
- **[React Guide](./documentation/guides/react-guide.md)** - React integration
- **[Vue Guide](./documentation/guides/vue-guide.md)** - Vue 3 integration
- **[Svelte Guide](./documentation/guides/svelte-guide.md)** - Svelte integration
- **[Vanilla JS Guide](./documentation/guides/vanilla-guide.md)** - Plain JavaScript/TypeScript

### Core Features
- **[Multi-Page Generation](./documentation/features/multi-page.md)** - Automatic page splitting
- **[Image Handling](./documentation/features/images.md)** - SVG conversion & optimization
- **[Table Support](./documentation/features/tables.md)** - Smart table pagination
- **[Page Breaks](./documentation/features/page-breaks.md)** - Control page splitting
- **[Color Management](./documentation/features/colors.md)** - OKLCH & Tailwind support

### Advanced Features
- **[Watermarks](./documentation/advanced/watermarks.md)** - Text & image watermarks
- **[Headers & Footers](./documentation/advanced/headers-footers.md)** - Dynamic templates
- **[Metadata](./documentation/advanced/metadata.md)** - Document properties
- **[Batch Generation](./documentation/advanced/batch-generation.md)** - Multiple content items
- **[Templates](./documentation/advanced/templates.md)** - Variables, loops, conditionals
- **[Fonts](./documentation/advanced/fonts.md)** - Custom font handling
- **[Table of Contents](./documentation/advanced/table-of-contents.md)** - Auto-generate TOC
- **[Bookmarks](./documentation/advanced/bookmarks.md)** - PDF navigation
- **[Security & Encryption](./documentation/advanced/security.md)** - Password protection & permissions
- **[Async Processing](./documentation/advanced/async-processing.md)** - Background generation with webhooks
- **[Preview Component](./documentation/advanced/preview.md)** - Real-time PDF preview (React)
- **[URL to PDF](./documentation/advanced/url-to-pdf.md)** - Convert web pages to PDF
- **[Image Optimization](./documentation/advanced/image-optimization.md)** ⭐ NEW - DPI control & print quality

### API Reference
- **[Options Reference](./documentation/api/options.md)** - All configuration options
- **[PDFGenerator Class](./documentation/api/pdf-generator.md)** - Core API
- **[React Hooks](./documentation/api/react-hooks.md)** - React API reference
- **[Vue Composables](./documentation/api/vue-composables.md)** - Vue API reference
- **[Svelte Stores](./documentation/api/svelte-stores.md)** - Svelte API reference
- **[Utilities](./documentation/api/utilities.md)** - Helper functions

### Help & Resources
- **[Best Practices](./documentation/guides/best-practices.md)** - Optimization tips
- **[Troubleshooting](./documentation/guides/troubleshooting.md)** - Common issues & solutions
- **[Examples](./documentation/examples/code-examples.md)** - Code samples
- **[Use Cases](./documentation/examples/use-cases.md)** - Real-world examples

## Key Features

### Multi-Page PDFs
Automatically splits long content across multiple pages with smart pagination that respects element boundaries.

### Framework Support
First-class support for React, Vue 3, Svelte, and vanilla JavaScript/TypeScript with dedicated adapters.

### OKLCH Color Support
Native support for OKLCH colors via html2canvas-pro, fully compatible with Tailwind CSS v4.

### Image Handling ⭐ Enhanced in v5.1.0
- SVG to image conversion
- Image optimization & compression
- DPI control (72/150/300) for print quality
- Format selection (JPEG/PNG/WebP)
- Transparent image background handling
- Background image support
- Automatic preloading

### Table Features
- Header repetition on each page
- Row split prevention
- Automatic borders
- Zebra striping

### Advanced Capabilities
- Watermarks (text & image)
- Dynamic headers/footers
- PDF metadata
- Batch generation
- Template variables with loops & conditionals
- Custom fonts
- Table of contents
- PDF bookmarks

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance

- **1 page**: ~500ms
- **5 pages**: ~2s
- **10 pages**: ~4s
- **20+ pages**: ~8-15s

## Examples

### Generate from HTML String

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
  <div>
    <h1>Invoice #12345</h1>
    <p>Amount: $1,234.56</p>
  </div>
`;

await generatePDFFromHTML(html, 'invoice.pdf');
```

### With Watermark

```typescript
await generatePDF(element, 'document.pdf', {
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal',
  },
});
```

### With Headers & Page Numbers

```typescript
await generatePDF(element, 'document.pdf', {
  showPageNumbers: true,
  headerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}}',
    height: 20,
  },
  metadata: {
    title: 'Annual Report 2025',
    author: 'John Doe',
  },
});
```

## Development

This project uses **pnpm** as the package manager.

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Watch mode
pnpm run dev

# Run tests
pnpm test

# Type check
pnpm run typecheck

# Lint
pnpm run lint
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT © [Mir Mursalin Ankur](https://encryptioner.github.io/)

## Author

**Mir Mursalin Ankur**
- Website: [encryptioner.github.io](https://encryptioner.github.io/)
- LinkedIn: [mir-mursalin-ankur](https://www.linkedin.com/in/mir-mursalin-ankur)
- GitHub: [@Encryptioner](https://github.com/Encryptioner)
- Email: mir.ankur.ruet13@gmail.com

## Support

- **Documentation**: [./documentation/index.md](./documentation/index.md)
- **Issues**: [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Encryptioner/html-to-pdf-generator/discussions)

---

**Ready to get started?** → [Quick Start Guide](./documentation/guides/getting-started.md)
