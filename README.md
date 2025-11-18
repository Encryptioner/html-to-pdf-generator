# HTML to PDF Generator

A modern, framework-agnostic library for converting HTML content to professional multi-page PDFs with smart pagination and rich features.

[![npm version](https://badge.fury.io/js/@encryptioner%2Fhtml-to-pdf-generator.svg)](https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**📦 NPM Package:** https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator

---

## 📚 Documentation

**Complete documentation is available in the [documentation](./documentation/) folder:**

- **[📖 Full Documentation Index](./documentation/index.md)** - Complete guide and API reference
- **[🚀 Quick Start Guide](./documentation/guides/getting-started.md)** - Get started in 5 minutes
- **[⚙️ Installation Guide](./documentation/guides/installation.md)** - Detailed installation instructions
- **[🎨 API Reference](./documentation/api/options.md)** - All options and configurations

### Framework Guides
- [React Integration](./documentation/guides/react-guide.md)
- [Vue 3 Integration](./documentation/guides/vue-guide.md)
- [Svelte Integration](./documentation/guides/svelte-guide.md)
- [Vanilla JS/TS](./documentation/guides/vanilla-guide.md)
- [Server-Side (Node.js)](./documentation/guides/server-side-guide.md)

### Feature Documentation
- [Multi-Page Generation](./documentation/features/multi-page.md)
- [Image Handling](./documentation/features/images.md)
- [Table Support](./documentation/features/tables.md)
- [Page Breaks](./documentation/features/page-breaks.md)
- [Color Management](./documentation/features/colors.md)
- [Watermarks](./documentation/advanced/watermarks.md)
- [Headers & Footers](./documentation/advanced/headers-footers.md)
- [Metadata](./documentation/advanced/metadata.md)
- [Batch Generation](./documentation/advanced/batch-generation.md)

---

## ✨ Features

### Core Features
- ✅ **Multi-page support** with smart pagination
- ✅ **Framework adapters** for React, Vue, Svelte, and vanilla JS
- ✅ **OKLCH color support** with automatic Tailwind CSS compatibility
- ✅ **Image optimization** with SVG conversion and DPI control
- ✅ **Table pagination** with automatic header repetition
- ✅ **Smart page breaks** with orphan prevention
- ✅ **HTML string support** for generating PDFs from HTML markup
- ✅ **TypeScript support** with full type definitions
- ✅ **Progress tracking** with real-time callbacks

### Advanced Features
- ✅ **Watermarks** - Add text or image watermarks with opacity control
- ✅ **Headers/Footers** - Dynamic templates with variables ({{pageNumber}}, {{totalPages}}, {{date}}, {{title}})
- ✅ **PDF Metadata** - Set title, author, subject, keywords, and creation date
- ✅ **Batch generation** - Combine multiple HTML sections into one PDF
- ✅ **Media type emulation** - Apply @media print styles automatically
- ✅ **External CSS** - Automatic loading and processing of stylesheets
- ✅ **Background images** - Proper handling of CSS background images
- ✅ **Custom CSS injection** - Add custom styles before rendering

---

## 📦 Installation

```bash
npm install @encryptioner/html-to-pdf-generator
```

```bash
pnpm add @encryptioner/html-to-pdf-generator
```

```bash
yarn add @encryptioner/html-to-pdf-generator
```

---

## 🚀 Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('my-content');
await generatePDF(element, 'my-document.pdf', {
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10], // [top, right, bottom, left] in mm
  showPageNumbers: true,
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.1,
    position: 'diagonal'
  }
});
```

### From HTML String

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .header { color: #333; font-size: 24px; }
    </style>
  </head>
  <body>
    <h1 class="header">My Document</h1>
    <p>This is a paragraph with some content.</p>
  </body>
</html>
`;

await generatePDFFromHTML(html, 'document.pdf', {
  format: 'a4',
  metadata: {
    title: 'My Document',
    author: 'John Doe'
  }
});
```

### React

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'my-document.pdf',
    format: 'a4',
    showPageNumbers: true,
  });

  return (
    <div>
      <div ref={targetRef}>
        <h1>Content to convert to PDF</h1>
        <p>This will be in your PDF document</p>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
      </button>
    </div>
  );
}
```

### Vue 3

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'my-document.pdf',
  format: 'a4',
  showPageNumbers: true,
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <h1>Content to convert to PDF</h1>
      <p>This will be in your PDF document</p>
    </div>

    <button @click="generatePDF" :disabled="isGenerating">
      {{ isGenerating ? `Generating... ${progress}%` : 'Download PDF' }}
    </button>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'my-document.pdf',
    format: 'a4',
    showPageNumbers: true,
  });

  const handleDownload = () => {
    if (targetElement) {
      generatePDF(targetElement);
    }
  };
</script>

<div bind:this={targetElement}>
  <h1>Content to convert to PDF</h1>
  <p>This will be in your PDF document</p>
</div>

<button on:click={handleDownload} disabled={$isGenerating}>
  {$isGenerating ? `Generating... ${$progress}%` : 'Download PDF'}
</button>
```

---

## 🔧 Advanced Usage

### Watermarks

```typescript
await generatePDF(element, 'document.pdf', {
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.1,
    position: 'diagonal', // 'center' | 'diagonal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    fontSize: 48,
    color: '#999999',
    rotation: 45
  }
});
```

### Headers & Footers

```typescript
await generatePDF(element, 'document.pdf', {
  metadata: {
    title: 'Annual Report 2024'
  },
  headerTemplate: {
    template: '<div style="text-align: center;">{{title}} - {{date}}</div>',
    height: 15,
    css: 'font-size: 11px; border-bottom: 1px solid #ccc;'
  },
  footerTemplate: {
    template: '<div style="text-align: center;">Page {{pageNumber}} of {{totalPages}}</div>',
    height: 12
  }
});
```

**Available template variables:**
- `{{pageNumber}}` - Current page number
- `{{totalPages}}` - Total number of pages
- `{{date}}` - Current date
- `{{title}}` - Document title from metadata

### Batch Generation

```typescript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  {
    content: document.getElementById('section-1'),
    pageCount: 2,
    title: 'Introduction',
    newPage: true // Start on a new page
  },
  {
    content: document.getElementById('section-2'),
    pageCount: 3,
    title: 'Content',
    newPage: true
  }
];

const result = await generateBatchPDF(items, 'combined.pdf', {
  showPageNumbers: true
});

console.log(`Generated ${result.totalPages} pages`);
```

### Using the PDFGenerator Class

```typescript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

const generator = new PDFGenerator({
  format: 'a4',
  orientation: 'portrait',
  margins: [15, 15, 15, 15],
  showPageNumbers: true,
  pageNumberPosition: 'footer',
  compress: true,
  onProgress: (progress) => {
    console.log(`Generating PDF: ${progress}%`);
  },
  onComplete: (blob) => {
    console.log(`PDF generated! Size: ${blob.size} bytes`);
  },
  onError: (error) => {
    console.error('PDF generation failed:', error);
  },
});

// Generate PDF
await generator.generatePDF(element, 'document.pdf');

// Or get blob without downloading
const blob = await generator.generateBlob(element);
```

---

## 🖥️ MCP Server (Model Context Protocol)

The package includes an **MCP server** for server-side PDF generation, enabling Claude Desktop and other MCP clients to generate PDFs.

### Quick Setup for Claude Desktop

1. **Build the package:**
   ```bash
   pnpm install && pnpm run build
   ```

2. **Add to Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
   ```json
   {
     "mcpServers": {
       "html-to-pdf": {
         "command": "node",
         "args": ["/absolute/path/to/html-to-pdf-generator/mcp/dist/index.js"]
       }
     }
   }
   ```

3. **Restart Claude Desktop** and use PDF generation in your conversations:
   ```
   You: Generate a PDF invoice with these items and save to /tmp/invoice.pdf
   Claude: [Uses generate_pdf tool to create PDF]
   ```

### MCP Tools Available

- **`generate_pdf`** - Generate PDF from HTML with full feature support
- **`generate_batch_pdf`** - Combine multiple HTML sections into one PDF
- **`generate_pdf_from_url`** - Convert web pages to PDF (CORS-aware)

**📖 Full MCP Documentation:** See [mcp/README.md](./mcp/README.md) for complete setup, API reference, and examples.

---

## 📖 API Options

### PDFGeneratorOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `format` | `'a4' \| 'letter' \| 'a3' \| 'legal'` | `'a4'` | Paper format |
| `orientation` | `'portrait' \| 'landscape'` | `'portrait'` | Page orientation |
| `margins` | `[number, number, number, number]` | `[10, 10, 10, 10]` | Margins [top, right, bottom, left] in mm |
| `compress` | `boolean` | `true` | Enable PDF compression |
| `scale` | `number` | `2` | HTML2Canvas scale factor (1-4) |
| `imageQuality` | `number` | `0.85` | JPEG quality (0-1) |
| `showPageNumbers` | `boolean` | `false` | Show page numbers |
| `pageNumberPosition` | `'header' \| 'footer'` | `'footer'` | Page number position |
| `customCSS` | `string` | `''` | Custom CSS to inject |
| `watermark` | `WatermarkOptions` | `undefined` | Watermark configuration |
| `headerTemplate` | `HeaderFooterTemplate` | `undefined` | Header template |
| `footerTemplate` | `HeaderFooterTemplate` | `undefined` | Footer template |
| `metadata` | `PDFMetadata` | `undefined` | PDF metadata |
| `emulateMediaType` | `'screen' \| 'print'` | `'screen'` | Media type to emulate |
| `onProgress` | `(progress: number) => void` | - | Progress callback (0-100) |
| `onComplete` | `(blob: Blob) => void` | - | Completion callback |
| `onError` | `(error: Error) => void` | - | Error callback |

**Full API documentation:** [documentation/api/options.md](./documentation/api/options.md)

---

## 🔍 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Modern mobile browsers

**Note:** Requires browser support for html2canvas and jsPDF.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

---

## 🐛 Issues & Support

- **Issues**: [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Encryptioner/html-to-pdf-generator/discussions)
- **Email**: mir.ankur.ruet13@gmail.com

---

## 🙏 Acknowledgments

Built with:
- [jsPDF](https://github.com/parallax/jsPDF) - PDF generation
- [html2canvas-pro](https://github.com/niklasvh/html2canvas) - HTML to canvas rendering
- [pdf-lib](https://github.com/Hopding/pdf-lib) - PDF merging

---

## 📊 Package Stats

- **Bundle Size**: ~400KB (minified)
- **Dependencies**: 3 core dependencies
- **TypeScript**: Full type definitions included
- **Tree-shakeable**: ESM and CJS builds
- **Framework Support**: React, Vue, Svelte, Vanilla JS
- **Server-Side**: Node.js with Puppeteer

---

**Ready to get started?** → [Quick Start Guide](./documentation/guides/getting-started.md)
