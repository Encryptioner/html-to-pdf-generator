# PDF Generator Library

A modern, reusable library for generating multi-page PDFs from HTML content with proper pagination, styling, and document-like formatting.

## Features

### Core Features
- **Multi-page support**: Automatically splits content across multiple pages
- **Smart pagination**: Respects element boundaries and prevents awkward cuts
- **Color handling**: Automatic OKLCH to RGB conversion for Tailwind CSS v4
- **React hooks**: Easy integration with React components
- **Progress tracking**: Real-time progress updates during generation
- **Type-safe**: Full TypeScript support
- **NPM-ready**: Structured for easy extraction as a standalone package

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
