# HTML to PDF Generator - Documentation

> A modern, framework-agnostic library for converting HTML to professional multi-page PDFs with smart pagination and rich features.

## 📚 Documentation Navigation

### Getting Started
- **[Quick Start Guide](./guides/getting-started.md)** - Install and create your first PDF in 5 minutes
- **[Installation](./guides/installation.md)** - Detailed installation instructions for different environments

### Framework Guides
- **[React Guide](./guides/react-guide.md)** - Using with React applications
- **[Vue Guide](./guides/vue-guide.md)** - Using with Vue 3 applications
- **[Svelte Guide](./guides/svelte-guide.md)** - Using with Svelte applications
- **[Vanilla JavaScript Guide](./guides/vanilla-guide.md)** - Using with plain JavaScript/TypeScript
- **[Server-Side Guide](./guides/server-side-guide.md)** - Using with Node.js and Puppeteer

### Core Features
- **[Multi-Page Generation](./advanced/multi-page.md)** - Automatic page splitting and pagination
- **[Image Optimization](./advanced/image-optimization.md)** - DPI control and print quality
- **[Table Support](./features/tables.md)** - Smart table pagination with header repetition
- **[Page Breaks](./features/page-breaks.md)** - Control page splitting behavior
- **[Color Management](./features/colors.md)** - OKLCH & Tailwind CSS support

### Advanced Features
- **[Watermarks](./advanced/watermarks.md)** - Add text & image watermarks
- **[Headers & Footers](./advanced/headers-footers.md)** - Dynamic header/footer templates
- **[Metadata](./advanced/metadata.md)** - Set document properties
- **[Batch Generation](./advanced/batch-generation.md)** - Combine multiple content items
- **[Templates](./advanced/templates.md)** - Variables, loops, and conditionals
- **[Fonts](./advanced/fonts.md)** - Custom font embedding
- **[Table of Contents](./advanced/table-of-contents.md)** - Auto-generate TOC
- **[Bookmarks](./advanced/bookmarks.md)** - PDF navigation structure
- **[Security & Encryption](./advanced/security.md)** - Password protection & permissions
- **[Async Processing](./advanced/async-processing.md)** - Background generation with webhooks
- **[Preview Component](./advanced/preview.md)** - Real-time PDF preview (React)
- **[URL to PDF](./advanced/url-to-pdf.md)** - Convert web pages to PDF

### API Reference
- **[Options Reference](./api/options.md)** - Complete options documentation

### Examples
- **[Code Examples](./examples/code-examples.md)** - Copy-paste ready code samples
- **[Production Examples](./examples/production-examples.md)** - Real-world use cases

### Resources
- **[Best Practices](./guides/best-practices.md)** - Optimize performance and quality
- **[Troubleshooting](./guides/troubleshooting.md)** - Common issues and solutions

---

## Quick Links

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
      <div ref={targetRef}>{/* Your content */}</div>
      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `${progress}%` : 'Download PDF'}
      </button>
    </>
  );
}
```

---

## Key Features at a Glance

✅ **Multi-page support** with smart pagination
✅ **Framework adapters** for React, Vue, Svelte
✅ **OKLCH color support** and Tailwind CSS compatibility
✅ **Image optimization** with SVG conversion
✅ **Table pagination** with header repetition
✅ **Watermarks** (text and image)
✅ **Headers/Footers** with dynamic variables
✅ **Template system** with loops and conditionals
✅ **Full TypeScript support**
✅ **Progress tracking**
✅ **Batch generation**

---

## Documentation Structure

```
documentation/
├── index.md (you are here)
│
├── guides/
│   ├── getting-started.md       # Quick start tutorial
│   ├── installation.md          # Installation guide
│   ├── react-guide.md          # React integration
│   ├── vue-guide.md            # Vue integration
│   ├── svelte-guide.md         # Svelte integration
│   ├── vanilla-guide.md        # Vanilla JS integration
│   ├── server-side-guide.md    # Node.js/Puppeteer usage
│   ├── best-practices.md       # Optimization tips
│   └── troubleshooting.md      # Common issues
│
├── features/
│   └── multi-page.md           # Page splitting
│
├── advanced/
│   └── image-optimization.md   # DPI control & print quality
│
├── api/
│   └── options.md              # All options
│
└── examples/
    ├── code-examples.md        # Code samples
    └── production-examples.md  # Real-world examples
```

---

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Encryptioner/html-to-pdf-generator/discussions)
- **Email**: mir.ankur.ruet13@gmail.com

## Contributing

We welcome contributions! Please open an issue or pull request on [GitHub](https://github.com/Encryptioner/html-to-pdf-generator).

## License

MIT License - see [LICENSE.md](../LICENSE.md) for details.

---

**Ready to get started?** → [Quick Start Guide](./guides/getting-started.md)
