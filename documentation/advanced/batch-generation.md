# Batch PDF Generation Guide

Generate a single PDF from multiple HTML content items with automatic page breaks and per-item tracking.

## Overview

The batch PDF feature allows you to combine multiple HTML elements or strings into a single PDF document. Each content item is rendered sequentially with automatic page breaks, making it ideal for multi-section reports, combined documents, or aggregated content.

**Key Features:**
- Combine multiple HTML elements/strings into one PDF
- Control page breaks with `newPage` parameter (force new page, allow sharing, or auto)
- Progress tracking across all items
- Per-item metadata in results (page ranges, titles)
- Support for both HTML elements and HTML string content
- Works with all framework adapters (vanilla, React, Vue, Svelte)

**Current Limitation:**
- Requires browser environment (uses html2canvas and DOM APIs)
- Not yet supported in Node.js/server-side without headless browser

## Browser/Client-Side Usage

### Vanilla JavaScript/TypeScript

```typescript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  {
    content: document.getElementById('intro'),
    pageCount: 2,
    title: 'Introduction'
  },
  {
    content: '<div><h1>Chapter 2</h1><p>Content here...</p></div>',
    pageCount: 3,
    title: 'Main Content'
  },
  {
    content: document.getElementById('summary'),
    pageCount: 1,
    title: 'Summary'
  },
];

const result = await generateBatchPDF(items, 'report.pdf', {
  format: 'a4',
  showPageNumbers: true,
  onProgress: (progress) => console.log(`${progress}%`),
});

console.log(`Generated ${result.totalPages} pages in ${result.generationTime}ms`);
console.log('Item breakdown:', result.items);
```

**Result Structure:**

```typescript
{
  blob: Blob,                    // The generated PDF blob
  totalPages: 6,                 // Total number of pages
  fileSize: 245678,              // Size in bytes
  generationTime: 1823,          // Time taken in milliseconds
  items: [
    {
      title: 'Introduction',
      startPage: 1,
      endPage: 2,
      pageCount: 2,
      scaleFactor: 1.0
    },
    {
      title: 'Main Content',
      startPage: 3,
      endPage: 5,
      pageCount: 3,
      scaleFactor: 1.0
    },
    {
      title: 'Summary',
      startPage: 6,
      endPage: 6,
      pageCount: 1,
      scaleFactor: 1.0
    }
  ]
}
```

### React Hook

```tsx
import { useBatchPDFGenerator } from '@encryptioner/html-to-pdf-generator/react';
import { useRef } from 'react';

function MultiSectionReport() {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const { generateBatchPDF, isGenerating, progress, result, error } = useBatchPDFGenerator({
    filename: 'multi-section-report.pdf',
    format: 'a4',
    showPageNumbers: true,
  });

  const handleDownload = async () => {
    const items = [
      { content: section1Ref.current, pageCount: 2, title: 'Section 1' },
      { content: section2Ref.current, pageCount: 3, title: 'Section 2' },
      { content: section3Ref.current, pageCount: 1, title: 'Section 3' },
    ];

    await generateBatchPDF(items);
  };

  return (
    <div>
      <div ref={section1Ref}>
        <h1>Introduction</h1>
        <p>Section 1 content...</p>
      </div>

      <div ref={section2Ref}>
        <h1>Main Content</h1>
        <p>Section 2 content...</p>
      </div>

      <div ref={section3Ref}>
        <h1>Summary</h1>
        <p>Section 3 content...</p>
      </div>

      <button onClick={handleDownload} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Download Report'}
      </button>

      {result && (
        <div>
          Generated {result.totalPages} pages in {result.generationTime}ms
        </div>
      )}

      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

### Vue 3 Composable

```vue
<script setup>
import { ref } from 'vue';
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const section1Ref = ref(null);
const section2Ref = ref(null);
const section3Ref = ref(null);

const { generateBlob, isGenerating, progress, error } = usePDFGenerator({
  format: 'a4',
  showPageNumbers: true,
});

const generateBatchPDF = async () => {
  // For Vue, you would need to generate each section separately and combine
  // or use the vanilla generateBatchPDF function
  const { generateBatchPDF: batchGen } = await import('@encryptioner/html-to-pdf-generator');

  const items = [
    { content: section1Ref.value, pageCount: 2, title: 'Section 1' },
    { content: section2Ref.value, pageCount: 3, title: 'Section 2' },
    { content: section3Ref.value, pageCount: 1, title: 'Section 3' },
  ];

  const result = await batchGen(items, 'report.pdf', {
    format: 'a4',
    showPageNumbers: true,
  });

  console.log(result);
};
</script>

<template>
  <div>
    <div ref="section1Ref">
      <h1>Section 1</h1>
      <p>Content...</p>
    </div>

    <div ref="section2Ref">
      <h1>Section 2</h1>
      <p>Content...</p>
    </div>

    <div ref="section3Ref">
      <h1>Section 3</h1>
      <p>Content...</p>
    </div>

    <button @click="generateBatchPDF" :disabled="isGenerating">
      {{ isGenerating ? `Generating... ${progress}%` : 'Download PDF' }}
    </button>

    <div v-if="error">Error: {{ error.message }}</div>
  </div>
</template>
```

### Svelte Store

```svelte
<script>
  import { pdfGenerator } from '@encryptioner/html-to-pdf-generator/svelte';
  import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

  let section1;
  let section2;
  let section3;

  const pdf = pdfGenerator({
    format: 'a4',
    showPageNumbers: true,
  });

  const handleDownload = async () => {
    const items = [
      { content: section1, pageCount: 2, title: 'Section 1' },
      { content: section2, pageCount: 3, title: 'Section 2' },
      { content: section3, pageCount: 1, title: 'Section 3' },
    ];

    const result = await generateBatchPDF(items, 'report.pdf', {
      format: 'a4',
      showPageNumbers: true,
    });

    console.log(result);
  };
</script>

<div>
  <div bind:this={section1}>
    <h1>Section 1</h1>
    <p>Content...</p>
  </div>

  <div bind:this={section2}>
    <h1>Section 2</h1>
    <p>Content...</p>
  </div>

  <div bind:this={section3}>
    <h1>Section 3</h1>
    <p>Content...</p>
  </div>

  <button on:click={handleDownload} disabled={$pdf.isGenerating}>
    {$pdf.isGenerating ? `Generating... ${$pdf.progress}%` : 'Download PDF'}
  </button>

  {#if $pdf.error}
    <div>Error: {$pdf.error.message}</div>
  {/if}
</div>
```

## Generate Blob for Upload

Instead of downloading, generate a blob for server upload or other processing:

```typescript
import { generateBatchPDFBlob } from '@encryptioner/html-to-pdf-generator';

const items = [
  { content: element1, pageCount: 2, title: 'Part 1' },
  { content: element2, pageCount: 3, title: 'Part 2' },
];

const result = await generateBatchPDFBlob(items, {
  format: 'a4',
  compress: true,
});

// Upload to server
const formData = new FormData();
formData.append('pdf', result.blob, 'batch-report.pdf');
await fetch('/api/upload', { method: 'POST', body: formData });

// Or create object URL for preview
const url = URL.createObjectURL(result.blob);
window.open(url);
URL.revokeObjectURL(url);
```

## API Reference

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
  - `pageCount`: Target page count (used as layout hint, may not be exact)
  - `title`: Optional title for tracking
  - `newPage`: Optional page break control
    - `true`: Force item to start on a new page (adds page break before)
    - `false`: Allow item to share page with previous content (no forced break)
    - `undefined` (default): Add page break after each item (except last)
- `filename`: Output filename (default: 'document.pdf')
- `options`: PDF generation options (same as single PDF generation)

**Returns:** `BatchPDFGenerationResult`
- `blob`: The generated PDF blob
- `totalPages`: Total number of pages
- `fileSize`: Size in bytes
- `generationTime`: Time taken in milliseconds
- `items`: Array of per-item metadata
  - `title`: Item title (if provided)
  - `startPage`: First page of this item
  - `endPage`: Last page of this item
  - `pageCount`: Number of pages for this item
  - `scaleFactor`: Scale factor applied (currently always 1.0)

### generateBatchPDFBlob()

```typescript
async function generateBatchPDFBlob(
  items: PDFContentItem[],
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult>
```

Generate a batch PDF blob without downloading (useful for server uploads or further processing).

**Parameters:**
- `items`: Array of content items
- `options`: PDF generation options

**Returns:** `BatchPDFGenerationResult` (same as generateBatchPDF)

### useBatchPDFGenerator() (React)

```typescript
function useBatchPDFGenerator(
  options?: UseBatchPDFGeneratorOptions
): UseBatchPDFGeneratorReturn
```

React hook for batch PDF generation with state management.

**Options:**
- `filename`: Default filename
- All standard PDFGeneratorOptions

**Returns:**
- `generateBatchPDF(items)`: Generate and download PDF from items array
- `generateBatchBlob(items)`: Generate blob without downloading
- `isGenerating`: Whether PDF is being generated
- `progress`: Current progress (0-100)
- `error`: Error if generation failed
- `result`: BatchPDFGenerationResult from last successful generation
- `reset()`: Reset state

## Types

```typescript
export interface PDFContentItem {
  content: HTMLElement | string;
  pageCount: number;
  title?: string;
  newPage?: boolean;  // Control page break behavior
}

export interface BatchPDFGenerationResult {
  blob: Blob;
  totalPages: number;
  fileSize: number;
  generationTime: number;
  items: Array<{
    title?: string;
    startPage: number;
    endPage: number;
    pageCount: number;
    scaleFactor: number;
  }>;
}
```

## Controlling Page Breaks with `newPage`

The `newPage` parameter gives you precise control over how content items are distributed across pages.

### Force Each Item on Separate Pages

Use `newPage: true` to ensure each item starts on a new page:

```typescript
const items = [
  {
    content: domA,
    pageCount: 1,
    newPage: true,  // domA starts on page 1
  },
  {
    content: domB,
    pageCount: 1,
    newPage: true,  // domB starts on page 2 (forced new page)
  },
];

await generateBatchPDF(items, 'separate-pages.pdf');
// Result: domA on page 1, domB on page 2 (total 2 pages)
```

### Allow Items to Share Pages

Use `newPage: false` to let items flow naturally onto the same page if they fit:

```typescript
const items = [
  {
    content: domA,
    pageCount: 1,
    newPage: false,  // domA starts normally
  },
  {
    content: domB,
    pageCount: 1,
    newPage: false,  // domB continues on same page if there's room
  },
];

await generateBatchPDF(items, 'shared-page.pdf');
// Result: Both domA and domB on page 1 (if they fit, total 1 page)
```

### Default Behavior

When `newPage` is not specified, each item gets a page break after it (except the last item):

```typescript
const items = [
  {
    content: domA,
    pageCount: 1,
    // newPage not specified - defaults to page break after
  },
  {
    content: domB,
    pageCount: 1,
    // newPage not specified - defaults to page break after
  },
];

await generateBatchPDF(items, 'default.pdf');
// Result: Similar to newPage: true behavior
```

### Mixed Control

You can mix different behaviors in the same document:

```typescript
const items = [
  {
    content: coverPage,
    pageCount: 1,
    newPage: true,  // Cover always starts on page 1
    title: 'Cover',
  },
  {
    content: tableOfContents,
    pageCount: 1,
    newPage: true,  // TOC on its own page
    title: 'Table of Contents',
  },
  {
    content: section1Header,
    pageCount: 1,
    newPage: false,  // Section header can share page
    title: 'Section 1 Header',
  },
  {
    content: section1Content,
    pageCount: 2,
    newPage: false,  // Content flows from header
    title: 'Section 1 Content',
  },
  {
    content: section2,
    pageCount: 3,
    newPage: true,  // Section 2 starts fresh page
    title: 'Section 2',
  },
];

await generateBatchPDF(items, 'mixed-control.pdf');
```

## Common Use Cases

### 1. Multi-Section Reports

Combine multiple report sections into one PDF:

```typescript
const items = [
  { content: executiveSummaryElement, pageCount: 1, title: 'Executive Summary' },
  { content: detailedAnalysisElement, pageCount: 5, title: 'Detailed Analysis' },
  { content: financialDataElement, pageCount: 3, title: 'Financial Data' },
  { content: conclusionElement, pageCount: 1, title: 'Conclusion' },
];

await generateBatchPDF(items, 'quarterly-report.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

### 2. Dynamic Content Aggregation

Generate PDFs from dynamic content:

```typescript
const blogPosts = await fetchBlogPosts();
const items = blogPosts.map(post => ({
  content: `<article><h1>${post.title}</h1><div>${post.content}</div></article>`,
  pageCount: Math.ceil(post.wordCount / 500),
  title: post.title,
}));

await generateBatchPDF(items, 'blog-compilation.pdf');
```

### 3. User-Generated Content

Combine user selections into a PDF:

```typescript
function ExportSelectedItems({ selectedItems }) {
  const handleExport = async () => {
    const items = selectedItems.map(item => ({
      content: document.getElementById(`item-${item.id}`),
      pageCount: 1,
      title: item.name,
    }));

    await generateBatchPDF(items, 'selected-items.pdf', {
      format: 'letter',
      margins: [20, 20, 20, 20],
    });
  };

  return <button onClick={handleExport}>Export Selected as PDF</button>;
}
```

## Important Notes

### Page Count Accuracy

The `pageCount` property is used as a **hint** for layout but may not be exact. The actual number of pages depends on:
- Content size and complexity
- Font sizes and line heights
- Images and their dimensions
- Table structures
- CSS styling

The library renders content naturally and may produce more or fewer pages than specified.

### Browser Environment

Batch PDF generation currently requires a browser environment because it depends on:
- `html2canvas` for rendering HTML to canvas
- DOM APIs (`document.createElement`, `appendChild`, etc.)
- Browser layout engine for HTML rendering

**Server-Side Alternative:**

For server-side PDF generation, consider using:
- **Puppeteer** - Headless Chrome automation
- **Playwright** - Cross-browser automation
- **wkhtmltopdf** - Command-line HTML to PDF converter

Example with Puppeteer:

```typescript
import puppeteer from 'puppeteer';

async function generateServerSidePDF(htmlContent: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  return pdf;
}
```

### Performance Considerations

- **Generation Time**: Batch PDFs take longer than single PDFs (roughly proportional to content size)
- **Memory Usage**: Large batches with many items may consume significant memory
- **Progress Tracking**: Use the `onProgress` callback to show users generation status
- **Chunking**: For very large batches (50+ items), consider breaking into multiple PDFs

### Error Handling

Always wrap batch PDF generation in try-catch:

```typescript
try {
  const result = await generateBatchPDF(items, 'report.pdf', options);
  console.log('Success:', result);
} catch (error) {
  console.error('PDF generation failed:', error);
  // Show error to user
}
```

## Troubleshooting

### Content Not Rendering

**Problem:** Some content items appear blank in the PDF.

**Solution:**
- Ensure elements are mounted to the DOM before generation
- Wait for images to load: add `await new Promise(resolve => setTimeout(resolve, 500))`
- Check that HTML strings are valid and complete

### Page Breaks in Wrong Places

**Problem:** Content is split at awkward positions.

**Solution:**
- Use CSS `page-break-inside: avoid` on elements that should stay together
- Adjust content sizing to better fit page dimensions
- Use `page-break-after: always` to force breaks at specific points

### Large File Sizes

**Problem:** Generated PDF files are too large.

**Solution:**
- Enable compression: `compress: true`
- Reduce image quality: `imageQuality: 0.7`
- Optimize images before adding to HTML
- Use lower scale factor: `scale: 1.5` instead of `2.0`

### Slow Generation

**Problem:** Batch PDF generation takes too long.

**Solution:**
- Reduce scale factor
- Optimize HTML (remove unnecessary DOM elements)
- Compress images beforehand
- Show progress indicator to user
- Consider generating PDFs in smaller batches

## See Also

- [Main README](./README.md) - Quick start and basic usage
- [PRODUCTION_EXAMPLES.md](./PRODUCTION_EXAMPLES.md) - Real-world examples
- [HTML_STRING_EXAMPLES.md](./HTML_STRING_EXAMPLES.md) - Working with HTML strings
- [FEATURES.md](./FEATURES.md) - Complete feature list
