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

### Core Features
- **[Multi-Page Generation](./features/multi-page.md)** - Automatic page splitting and pagination
- **[Image Handling](./features/images.md)** - SVG conversion, optimization, and background images
- **[Table Support](./features/tables.md)** - Smart table pagination with header repetition
- **[Page Breaks](./features/page-breaks.md)** - Control where pages split
- **[Color Management](./features/colors.md)** - OKLCH support and Tailwind CSS compatibility

### Advanced Features
- **[Watermarks](./advanced/watermarks.md)** - Add text or image watermarks
- **[Headers & Footers](./advanced/headers-footers.md)** - Dynamic templates with variables
- **[Metadata](./advanced/metadata.md)** - Set document properties
- **[Batch Generation](./advanced/batch-generation.md)** - Combine multiple content items
- **[Template Variables](./advanced/templates.md)** - Process templates with loops and conditionals
- **[Font Handling](./advanced/fonts.md)** - Custom fonts and web-safe replacements
- **[Table of Contents](./advanced/table-of-contents.md)** - Auto-generate TOC from headings
- **[Bookmarks](./advanced/bookmarks.md)** - PDF outline for navigation
- **[Security & Encryption](./advanced/security.md)** - Password protection and permissions
- **[Async Processing](./advanced/async-processing.md)** - Background generation with webhooks
- **[Preview Component](./advanced/preview.md)** - Real-time PDF preview (React)
- **[URL to PDF](./advanced/url-to-pdf.md)** - Convert web pages to PDF
- **[Image Optimization](./advanced/image-optimization.md)** - DPI control and print quality

### API Reference
- **[PDFGenerator Class](./api/pdf-generator.md)** - Core PDF generator API
- **[Options Reference](./api/options.md)** - Complete options documentation
- **[React Hooks API](./api/react-hooks.md)** - React hooks reference
- **[Vue Composables API](./api/vue-composables.md)** - Vue composables reference
- **[Svelte Stores API](./api/svelte-stores.md)** - Svelte stores reference
- **[Utility Functions](./api/utilities.md)** - Helper functions and utilities

### Examples
- **[Common Use Cases](./examples/use-cases.md)** - Real-world examples (invoices, reports, catalogs)
- **[Code Examples](./examples/code-examples.md)** - Copy-paste ready code samples
- **[Live Demos](./examples/demos.md)** - Interactive examples

### Best Practices & Troubleshooting
- **[Best Practices](./guides/best-practices.md)** - Optimize performance and quality
- **[Troubleshooting](./guides/troubleshooting.md)** - Common issues and solutions
- **[Performance Guide](./guides/performance.md)** - Optimize generation speed and file size
- **[Migration Guide](./guides/migration.md)** - Upgrading from older versions

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
│   ├── best-practices.md       # Optimization tips
│   ├── troubleshooting.md      # Common issues
│   ├── performance.md          # Performance optimization
│   └── migration.md            # Version migration
│
├── features/
│   ├── multi-page.md           # Page splitting
│   ├── images.md               # Image handling
│   ├── tables.md               # Table support
│   ├── page-breaks.md          # Page break control
│   └── colors.md               # Color management
│
├── advanced/
│   ├── watermarks.md           # Watermark feature
│   ├── headers-footers.md      # Header/footer templates
│   ├── metadata.md             # Document metadata
│   ├── batch-generation.md     # Batch processing
│   ├── templates.md            # Template system
│   ├── fonts.md                # Font handling
│   ├── table-of-contents.md   # TOC generation
│   └── bookmarks.md            # PDF bookmarks
│
├── api/
│   ├── pdf-generator.md        # PDFGenerator class
│   ├── options.md              # All options
│   ├── react-hooks.md          # React API
│   ├── vue-composables.md      # Vue API
│   ├── svelte-stores.md        # Svelte API
│   └── utilities.md            # Helper functions
│
└── examples/
    ├── use-cases.md            # Real-world examples
    ├── code-examples.md        # Code samples
    └── demos.md                # Live demos
```

---

## Need Help?

- **Issues**: [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Encryptioner/html-to-pdf-generator/discussions)
- **Email**: mir.ankur.ruet13@gmail.com

## Contributing

We welcome contributions! See our [Contributing Guide](../CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

**Ready to get started?** → [Quick Start Guide](./guides/getting-started.md)
