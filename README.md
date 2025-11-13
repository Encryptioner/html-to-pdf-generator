# PDF Generator Library

A modern, reusable library for generating multi-page PDFs from HTML content with proper pagination, styling, and document-like formatting.

## Features

### Core Features
- **Multi-page support**: Automatically splits content across multiple pages
- **Smart pagination**: Respects element boundaries and prevents awkward cuts
- **HTML String Support**: Generate PDFs from HTML strings or DOM elements
- **OKLCH Color Support**: Comprehensive OKLCH to RGB conversion for modern CSS
- **Tailwind CSS v4 Compatible**: Full support for Tailwind's OKLCH colors
- **Framework Adapters**: Works with React, Vue, Svelte, or vanilla JS
- **Progress tracking**: Real-time progress updates during generation
- **Type-safe**: Full TypeScript support
- **External CSS**: Automatically loads and processes external stylesheets

### OKLCH Color Support (v4.1.1)
- **Native OKLCH color support** via html2canvas-pro
- Full compatibility with modern CSS color functions
- Supports all OKLCH formats: `oklch(L C H)`, `oklch(L C H / alpha)`, percentages, angle units
- Compatible with Tailwind CSS v4 and other modern frameworks
- Zero configuration required - works automatically
- Includes comprehensive OKLCH to RGB fallback conversion (v4.1.0)

### Phase 1 Features (v4.0.0)
- **Watermarks**: Text and image watermarks with opacity and positioning
- **Header/Footer Templates**: Dynamic templates with variables ({{pageNumber}}, {{totalPages}}, etc.)
- **PDF Metadata**: Document title, author, keywords, and more
- **Print Media CSS**: Apply @media print styles automatically
- **Batch PDF Generation**: Combine multiple content items with auto-scaling

### Phase 2 Features (v4.0.0)
- **Template Variables**: Process templates with {{variables}}, {{#each}} loops, {{#if}} conditionals
- **Font Handling**: Web-safe font replacement and custom font embedding
- **Table of Contents**: Auto-generate TOC from headings with page numbers
- **Bookmarks/Outline**: Create PDF outline for easy navigation

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

## Phase 1 & 2 Features

### Watermarks (Phase 1)

Add text or image watermarks to your PDFs:

```typescript
await generatePDF(element, 'document.pdf', {
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal', // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    fontSize: 48,
    color: '#cccccc',
    rotation: 45,
    allPages: true
  }
});

// Or use image watermark
await generatePDF(element, 'document.pdf', {
  watermark: {
    image: 'data:image/png;base64,...',
    opacity: 0.3,
    position: 'center',
    allPages: true
  }
});
```

### Header/Footer Templates (Phase 1)

Add dynamic headers and footers with variables:

```typescript
await generatePDF(element, 'document.pdf', {
  headerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}} | {{date}}',
    height: 20,
    firstPage: false // Skip on first page
  },
  footerTemplate: {
    template: '{{title}} - Confidential',
    height: 20,
    firstPage: true
  },
  metadata: {
    title: 'My Document' // Used in {{title}} variable
  }
});
```

**Supported variables:**
- `{{pageNumber}}` - Current page number
- `{{totalPages}}` - Total page count
- `{{date}}` - Formatted date
- `{{title}}` - Document title from metadata

### PDF Metadata (Phase 1)

Set document properties:

```typescript
await generatePDF(element, 'document.pdf', {
  metadata: {
    title: 'Annual Report 2025',
    author: 'John Doe',
    subject: 'Financial Report',
    keywords: ['finance', 'report', '2025'],
    creator: 'My Application',
    creationDate: new Date()
  }
});
```

### Print Media CSS (Phase 1)

Apply @media print styles:

```typescript
await generatePDF(element, 'document.pdf', {
  emulateMediaType: 'print' // Applies @media print styles
});
```

### Batch PDF Generation (Phase 1)

Generate a single PDF from multiple content items with auto-scaling:

```typescript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  {
    content: document.getElementById('report-section-1'),
    pageCount: 2 // Will be scaled to fit exactly 2 pages
  },
  {
    content: '<div><h1>Section 2</h1><p>Content...</p></div>',
    pageCount: 1 // Will be scaled to fit exactly 1 page
  }
];

const result = await generateBatchPDF(items, 'complete-report.pdf', {
  format: 'a4',
  showPageNumbers: true
});

console.log(`Generated ${result.pageCount} pages`);
console.log(`Total size: ${result.fileSize} bytes`);
```

### Template Variables (Phase 2)

Process HTML templates with variables, loops, and conditionals:

```typescript
import { processTemplateWithContext } from '@encryptioner/html-to-pdf-generator';

const template = `
  <div>
    <h1>{{title}}</h1>
    <p>Dear {{name}},</p>

    {{#each items}}
      <div>
        <h3>{{name}}</h3>
        <p>Price: {{price}}</p>
      </div>
    {{/each}}

    {{#if showFooter}}
      <footer>Thank you for your business!</footer>
    {{/if}}
  </div>
`;

const html = processTemplateWithContext(template, {
  title: 'Invoice',
  name: 'John Doe',
  items: [
    { name: 'Item 1', price: '$10.00' },
    { name: 'Item 2', price: '$25.00' }
  ],
  showFooter: true
}, {
  enableLoops: true,
  enableConditionals: true
});

await generatePDFFromHTML(html, 'invoice.pdf');
```

### Font Handling (Phase 2)

Use custom fonts or convert to web-safe fonts:

```typescript
await generatePDF(element, 'document.pdf', {
  fontOptions: {
    fonts: [
      {
        family: 'Roboto',
        src: '/fonts/Roboto-Regular.ttf',
        weight: 400,
        style: 'normal'
      }
    ],
    embedFonts: true,
    fallbackFont: 'Arial',
    useWebSafeFonts: true
  }
});
```

### Table of Contents (Phase 2)

Auto-generate a table of contents from headings:

```typescript
await generatePDF(element, 'document.pdf', {
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    levels: [1, 2, 3], // h1, h2, h3
    position: 'start', // or 'end'
    includePageNumbers: true,
    indentPerLevel: 10,
    enableLinks: true
  }
});
```

### Bookmarks/Outline (Phase 2)

Add PDF bookmarks for easy navigation:

```typescript
await generatePDF(element, 'document.pdf', {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2, 3], // h1, h2, h3
    openByDefault: true,
    // Or use custom bookmarks
    custom: [
      { title: 'Chapter 1', page: 1, level: 1 },
      { title: 'Section 1.1', page: 3, level: 2 }
    ]
  }
});
```

## Advanced Usage

### OKLCH Color Support

The library uses `html2canvas-pro` which natively supports OKLCH colors! Additionally, comprehensive OKLCH to RGB conversion is included as a fallback. This happens transparently - no configuration needed!

**Supported OKLCH Formats:**
```css
/* Basic format */
color: oklch(0.5 0.2 180);

/* With alpha channel */
background: oklch(0.6 0.15 270 / 0.5);

/* With percentages */
border-color: oklch(50% 20% 180deg);

/* With different angle units */
color: oklch(0.7 0.1 3.14rad);     /* radians */
color: oklch(0.7 0.1 200grad);     /* gradians */
color: oklch(0.7 0.1 0.5turn);     /* turns */
```

**Manual Conversion (if needed):**
```typescript
import {
  oklchToRgb,
  convertOklchToRgbInCSS,
  convertOklchInElement,
} from '@encryptioner/html-to-pdf-generator';

// Convert single OKLCH color
const rgb = oklchToRgb('oklch(0.5 0.2 180)');
console.log(rgb); // "rgb(0, 128, 128)"

// Convert all OKLCH in CSS text
const css = 'color: oklch(0.5 0.2 180); background: oklch(0.6 0.15 270 / 0.5);';
const converted = convertOklchToRgbInCSS(css);
console.log(converted);
// "color: rgb(0, 128, 128); background: rgba(128, 153, 230, 0.5);"

// Convert element's inline styles
const element = document.getElementById('my-element');
convertOklchInElement(element);
```

**Tailwind CSS v4 Compatibility:**
The library fully supports Tailwind CSS v4's OKLCH colors. Your Tailwind styles will automatically work in PDFs:

```html
<!-- These work automatically in PDFs -->
<div class="bg-blue-500 text-white">
  <p class="text-red-600">Error message</p>
  <button class="bg-green-600 hover:bg-green-700">Submit</button>
</div>
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

1. **Complex CSS**: Some advanced CSS features may not render perfectly
2. **SVG Elements**: May require special handling
3. **Web Fonts**: Ensure fonts are loaded before generation
4. **Interactive Elements**: Only visual representation is captured

## Future Enhancements

- [ ] Custom headers and footers with HTML
- [ ] Table of contents generation
- [ ] Watermark support
- [ ] Encrypted PDFs
- [ ] Digital signatures
- [ ] Better SVG support
- [ ] Font embedding
- [ ] Parallel page generation

## Converting to NPM Package

To convert this library into a standalone NPM package:

1. Copy the `pdf-generator` folder to a new project
2. Create `package.json`:

```json
{
  "name": "@yourorg/pdf-generator",
  "version": "1.0.0",
  "description": "Modern multi-page PDF generator from HTML",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",
    "jspdf": "^3.0.0",
    "html2canvas": "^1.4.0"
  }
}
```

3. Build and publish to NPM

## License

MIT

## Contributing

Contributions welcome! Please follow the existing code style and add tests for new features.

## Author

Mir Mursalin Ankur
- Website: https://encryptioner.github.io/
- LinkedIn: https://www.linkedin.com/in/mir-mursalin-ankur
- GitHub: https://github.com/Encryptioner
- Email: mir.ankur.ruet13@gmail.com
