# PDF Generator Library

A modern, reusable library for generating multi-page PDFs from HTML content with proper pagination, styling, and document-like formatting.

## Features

### Core Features
- **Multi-page support**: Automatically splits content across multiple pages
- **Smart pagination**: Respects element boundaries and prevents awkward cuts
- **HTML String Support**: Generate PDFs from HTML strings or DOM elements
- **Tailwind CSS Compatible**: Automatic OKLCH to RGB conversion for Tailwind CSS
- **Framework Adapters**: Works with React, Vue, Svelte, or vanilla JS
- **Progress tracking**: Real-time progress updates during generation
- **Type-safe**: Full TypeScript support
- **External CSS**: Automatically loads and processes external stylesheets

### Advanced Image Support
- **SVG to Image Conversion**: Automatically converts SVG elements to images
- **Image Optimization**: Compress and resize images for optimal PDF size
- **Background Images**: Proper handling of CSS background images
- **Image Preloading**: Ensures all images are loaded before PDF generation
- **Data URL Support**: Works with data URLs and external images
- **Quality Control**: Configurable JPEG quality and compression

### Advanced Table Handling
- **Header Repetition**: Table headers automatically repeat on each page
- **Row Splitting Prevention**: Keeps table rows together across pages
- **Auto-borders**: Enforce borders for better PDF visibility
- **Column Width Fixing**: Consistent column widths across pages
- **Text Wrapping**: Smart text wrapping in table cells
- **Zebra Striping**: Optional alternating row colors
- **Table Splitting**: Intelligently split large tables across pages

### Smart Page Breaks
- **CSS Page Break Support**: Respects `page-break-before/after/inside` properties
- **Orphaned Heading Prevention**: Keeps headings with their content
- **Element Avoidance**: Configurable elements that shouldn't be split
- **Custom Break Points**: Define where pages should break
- **Widow/Orphan Control**: Prevents lonely lines at page boundaries

### 📖 Comprehensive Documentation

**Core Features:**
- [Multi-Page Generation](./documentation/features/multi-page.md)
- [Image Handling](./documentation/features/images.md)
- [Table Support](./documentation/features/tables.md)
- [Page Breaks](./documentation/features/page-breaks.md)
- [Color Management](./documentation/features/colors.md)

**Advanced Features:**
- [Watermarks](./documentation/advanced/watermarks.md)
- [Headers & Footers](./documentation/advanced/headers-footers.md)
- [Metadata](./documentation/advanced/metadata.md)
- [Batch Generation](./documentation/advanced/batch-generation.md)
- [Templates](./documentation/advanced/templates.md)
- [Fonts](./documentation/advanced/fonts.md)
- [Table of Contents](./documentation/advanced/table-of-contents.md)
- [Bookmarks](./documentation/advanced/bookmarks.md)
- [Security & Encryption](./documentation/advanced/security.md)
- [Async Processing](./documentation/advanced/async-processing.md)
- [Preview Component](./documentation/advanced/preview.md)
- [URL to PDF](./documentation/advanced/url-to-pdf.md)

**[📚 Full Documentation Index](./documentation/index.md)**

## Installation

```bash
npm install @encryptioner/html-to-pdf-generator
# or
pnpm add @encryptioner/html-to-pdf-generator
# or
yarn add @encryptioner/html-to-pdf-generator
```

## Quick Start

### Vanilla JavaScript/TypeScript

**From DOM Element:**
```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('my-content');
await generatePDF(element, 'my-document.pdf', {
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10], // [top, right, bottom, left] in mm
  showPageNumbers: true,
  compress: true,
  imageQuality: 0.85,
  onProgress: (progress) => console.log(`${progress}%`),
});
```

**From HTML String:**
```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

// Full HTML document
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
    <div class="header">My Document</div>
    <p>This is a paragraph with some content.</p>
  </body>
</html>
`;

await generatePDFFromHTML(html, 'document.pdf', {
  format: 'a4',
  showPageNumbers: true,
});

// Or HTML fragment
const fragment = `
<div>
  <h1>Hello World</h1>
  <p>Simple HTML fragment</p>
</div>
`;

await generatePDFFromHTML(fragment, 'fragment.pdf');
```

**With Tailwind CSS:**
```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const htmlWithTailwind = `
<!DOCTYPE html>
<html>
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div class="p-8 bg-gray-100">
      <h1 class="text-3xl font-bold text-blue-600">Styled Document</h1>
      <p class="mt-4 text-gray-700">Content with Tailwind classes</p>
    </div>
  </body>
</html>
`;

await generatePDFFromHTML(htmlWithTailwind, 'tailwind-doc.pdf');
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

## MCP Server (Model Context Protocol)

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

- **`generate_pdf`** - Generate PDF from HTML with full feature support (watermarks, headers/footers, metadata)
- **`generate_batch_pdf`** - Combine multiple HTML sections into one PDF with auto-scaling
- **`generate_pdf_from_url`** - Convert web pages to PDF (CORS-aware)

**📖 Full MCP Documentation:** See [mcp/README.md](./mcp/README.md) for complete setup, API reference, and examples.

## Advanced Usage

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

const element = document.getElementById('content');
const result = await generator.generatePDF(element, 'document.pdf');

console.log(`Generated ${result.pageCount} pages in ${result.generationTime}ms`);
console.log(`File size: ${result.fileSize} bytes`);
```

### Generate Blob Instead of Downloading

```typescript
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
const blob = await generatePDFBlob(element, {
  format: 'a4',
  compress: true,
});

// Do something with the blob (e.g., upload to server)
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');
await fetch('/api/upload', { method: 'POST', body: formData });
```

### Custom Color Replacements

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

await generatePDF(element, 'document.pdf', {
  colorReplacements: {
    '--my-brand-color': '#3b82f6',
    '--my-accent-color': '#10b981',
  },
});
```

### With Progress Indicator

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function DocumentViewer() {
  const { targetRef, generatePDF, isGenerating, progress, error } = usePDFGenerator({
    filename: 'report.pdf',
    format: 'a4',
    margins: [20, 20, 20, 20],
    showPageNumbers: true,
  });

  return (
    <div>
      <div ref={targetRef}>
        {/* Your document content */}
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        Download PDF
      </button>

      {isGenerating && (
        <div>
          <div>Generating PDF...</div>
          <progress value={progress} max="100" />
          <span>{progress}%</span>
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

### Batch PDF Generation

Combine multiple HTML elements or strings into a single PDF with control over page breaks:

```typescript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  {
    content: document.getElementById('intro'),
    pageCount: 2,
    title: 'Introduction',
    newPage: true  // Force on new page
  },
  {
    content: document.getElementById('main'),
    pageCount: 5,
    title: 'Main Content',
    newPage: true  // Force on new page
  },
  {
    content: document.getElementById('summary'),
    pageCount: 1,
    title: 'Summary',
    newPage: false  // Can share page with previous content
  },
];

const result = await generateBatchPDF(items, 'report.pdf', {
  format: 'a4',
  showPageNumbers: true,
});

console.log(`Generated ${result.totalPages} pages`);
```

**📖 For detailed documentation, examples, and API reference, see [Batch Generation Guide](./documentation/advanced/batch-generation.md)**

## API Reference

### PDFGenerator Class

#### Constructor

```typescript
new PDFGenerator(options?: Partial<PDFGeneratorOptions>)
```

#### Methods

##### generatePDF()

```typescript
async generatePDF(
  element: HTMLElement,
  filename: string = 'document.pdf'
): Promise<PDFGenerationResult>
```

Generate PDF and download it.

##### generateBlob()

```typescript
async generateBlob(element: HTMLElement): Promise<Blob>
```

Generate PDF blob without downloading.

##### updateOptions()

```typescript
updateOptions(options: Partial<PDFGeneratorOptions>): void
```

Update generator options.

##### getConfig()

```typescript
getConfig(): {
  options: Required<PDFGeneratorOptions>;
  pageConfig: PDFPageConfig;
}
```

Get current configuration.

### Options

#### PDFGeneratorOptions

```typescript
interface PDFGeneratorOptions {
  /** PDF orientation (default: 'portrait') */
  orientation?: 'portrait' | 'landscape';

  /** Paper format (default: 'a4') */
  format?: 'a4' | 'letter' | 'a3' | 'legal';

  /** Page margins in mm [top, right, bottom, left] (default: [10, 10, 10, 10]) */
  margins?: [number, number, number, number];

  /** Enable compression (default: true) */
  compress?: boolean;

  /** Scale factor for html2canvas (default: 2) */
  scale?: number;

  /** JPEG quality (0-1, default: 0.85) */
  imageQuality?: number;

  /** Enable page numbers (default: false) */
  showPageNumbers?: boolean;

  /** Page number position (default: 'footer') */
  pageNumberPosition?: 'header' | 'footer';

  /** Custom CSS to inject before rendering */
  customCSS?: string;

  /** Color replacement map (OKLCH to RGB) */
  colorReplacements?: Record<string, string>;

  /** Callback for progress updates (0-100) */
  onProgress?: (progress: number) => void;

  /** Callback when PDF generation completes */
  onComplete?: (blob: Blob) => void;

  /** Callback for errors */
  onError?: (error: Error) => void;
}
```

### React Hooks

#### usePDFGenerator

```typescript
function usePDFGenerator(
  options?: UsePDFGeneratorOptions
): UsePDFGeneratorReturn
```

Returns:
- `targetRef`: Ref to attach to element
- `generatePDF()`: Generate and download PDF
- `generateBlob()`: Generate blob without downloading
- `isGenerating`: Whether PDF is being generated
- `progress`: Current progress (0-100)
- `error`: Error if generation failed
- `result`: Result from last successful generation
- `reset()`: Reset state

#### usePDFGeneratorManual

```typescript
function usePDFGeneratorManual(
  options?: UsePDFGeneratorOptions
): UsePDFGeneratorManualReturn
```

Similar to `usePDFGenerator` but doesn't use refs. Pass element directly to functions.

## Convenience Functions

### generatePDF()

```typescript
async function generatePDF(
  element: HTMLElement,
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<PDFGenerationResult>
```

### generatePDFBlob()

```typescript
async function generatePDFBlob(
  element: HTMLElement,
  options: Partial<PDFGeneratorOptions> = {}
): Promise<Blob>
```

### generateBatchPDF()

```typescript
async function generateBatchPDF(
  items: PDFContentItem[],
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult>
```

Generate and download a PDF from multiple content items.

**Parameters:**
- `items`: Array of content items, each with:
  - `content`: HTMLElement or HTML string
  - `pageCount`: Target page count (used as layout hint)
  - `title`: Optional title for tracking
  - `newPage`: Optional page break control (`true` = force new page, `false` = allow sharing, `undefined` = default)
- `filename`: Output filename
- `options`: PDF generation options

**Returns:** BatchPDFGenerationResult containing:
- `blob`: The generated PDF blob
- `totalPages`: Total number of pages
- `fileSize`: Size in bytes
- `generationTime`: Time taken in milliseconds
- `items`: Per-item metadata (page ranges, titles, etc.)

### generateBatchPDFBlob()

```typescript
async function generateBatchPDFBlob(
  items: PDFContentItem[],
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult>
```

Generate a batch PDF blob without downloading (useful for server uploads).

### useBatchPDFGenerator()

```typescript
function useBatchPDFGenerator(
  options?: UseBatchPDFGeneratorOptions
): UseBatchPDFGeneratorReturn
```

React hook for batch PDF generation.

**Returns:**
- `generateBatchPDF(items)`: Generate and download PDF from items array
- `generateBatchBlob(items)`: Generate blob without downloading
- `isGenerating`: Whether PDF is being generated
- `progress`: Current progress (0-100)
- `error`: Error if generation failed
- `result`: BatchPDFGenerationResult from last successful generation
- `reset()`: Reset state

## Utilities

### PAPER_FORMATS

Standard paper formats in mm:

```typescript
const PAPER_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  a3: { width: 297, height: 420 },
  legal: { width: 215.9, height: 355.6 },
};
```

### TAILWIND_COLOR_REPLACEMENTS

Pre-defined Tailwind CSS v4 OKLCH to RGB color mappings.

### sanitizeFilename()

```typescript
function sanitizeFilename(name: string, extension: string): string
```

Sanitize filename for safe file system usage.

## Best Practices

### 1. Prepare Your Content

Ensure your HTML content is well-structured and uses fixed widths where possible:

```tsx
<div ref={targetRef} style={{ width: '794px' }}> {/* A4 width at 96 DPI */}
  {/* Your content */}
</div>
```

### 2. Handle Loading States

Always show loading indicators:

```tsx
{isGenerating && (
  <div>
    <Spinner />
    <span>Generating PDF... {progress}%</span>
  </div>
)}
```

### 3. Error Handling

Implement proper error handling:

```tsx
const { error } = usePDFGenerator({
  onError: (err) => {
    console.error('PDF generation failed:', err);
    showToast('Failed to generate PDF. Please try again.');
  },
});
```

### 4. Optimize for Performance

- Use appropriate scale (lower for faster generation)
- Enable compression
- Adjust image quality based on needs

```typescript
const generator = new PDFGenerator({
  scale: 1.5, // Lower scale = faster
  compress: true,
  imageQuality: 0.8, // Lower quality = smaller file
});
```

### 5. Test with Different Content Sizes

Always test with:
- Short content (1 page)
- Medium content (2-5 pages)
- Long content (10+ pages)

## Limitations

**Current Limitations:**
1. **Browser Environment Required** - Core library requires DOM and canvas APIs (use Node adapter with Puppeteer for server-side)
2. **Complex CSS** - Some advanced CSS features may render differently than in browser
3. **Web Fonts** - Ensure fonts are loaded before PDF generation
4. **Interactive Elements** - Only visual representation is captured (no form inputs, videos, etc.)
5. **Large Documents** - Very large documents (50+ pages) may take several seconds to generate

## License

MIT License - see [LICENSE.md](./LICENSE.md) for details

## Contributing

Contributions welcome! Please follow the existing code style and add tests for new features.

## Author

Mir Mursalin Ankur
- Website: https://encryptioner.github.io/
- LinkedIn: https://www.linkedin.com/in/mir-mursalin-ankur
- GitHub: https://github.com/Encryptioner
- Email: mir.ankur.ruet13@gmail.com
