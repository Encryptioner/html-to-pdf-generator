# Multi-Page PDF Generation

Learn how to create professional multi-page PDFs with smart pagination.

## Overview

The library automatically splits long content across multiple pages using a "GoFullPage" approach:

1. **Render**: Content flows naturally in unlimited height
2. **Capture**: Entire content captured in single high-quality canvas
3. **Split**: Canvas sliced at exact page boundaries

## Basic Multi-Page PDF

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('long-content');
await generatePDF(element, 'multi-page.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

The library handles all pagination automatically - no manual page breaks needed!

## Smart Pagination

### Automatic Content Splitting

Content is split intelligently at page boundaries:

```html
<div id="content">
  <h1>Chapter 1</h1>
  <p>Long content here...</p>

  <h1>Chapter 2</h1>
  <p>More content...</p>

  <!-- Automatically splits across pages -->
</div>
```

### Page Dimensions

Different formats have different dimensions:

| Format | Width × Height | Use Case |
|--------|---------------|----------|
| **A4** | 210mm × 297mm | Standard documents |
| **Letter** | 8.5" × 11" | US documents |
| **A3** | 297mm × 420mm | Large documents |
| **Legal** | 8.5" × 14" | Legal documents |

```javascript
await generatePDF(element, 'document.pdf', {
  format: 'letter',  // Choose format
  orientation: 'landscape',  // or 'portrait'
});
```

## Controlling Margins

Margins affect usable page space:

```javascript
await generatePDF(element, 'document.pdf', {
  margins: [20, 15, 20, 15],  // [top, right, bottom, left] in mm
});
```

### Margin Examples

```javascript
// Default margins (balanced)
margins: [10, 10, 10, 10]

// Extra top margin for binding
margins: [25, 15, 15, 15]

// Narrow margins (more content per page)
margins: [5, 5, 5, 5]

// Wide margins (more whitespace)
margins: [20, 20, 20, 20]
```

## Page Numbers

Add automatic page numbers to your PDFs:

```javascript
await generatePDF(element, 'document.pdf', {
  showPageNumbers: true,
  pageNumberPosition: 'footer',  // or 'header'
});
```

## Orientation

### Portrait (Default)

Best for most documents:

```javascript
await generatePDF(element, 'document.pdf', {
  orientation: 'portrait',
});
```

### Landscape

Better for wide content like charts:

```javascript
await generatePDF(element, 'document.pdf', {
  orientation: 'landscape',
});
```

## Fixed Width Container

All PDFs use 794px width (A4 at 96 DPI) for consistent output:

```html
<!-- Recommended: Match PDF width -->
<div ref={targetRef} style={{ width: '794px' }}>
  Your content
</div>
```

This ensures identical output on all devices (mobile, tablet, desktop, 4K).

## Progress Tracking

Monitor generation progress for long documents:

```javascript
await generatePDF(element, 'long-document.pdf', {
  onProgress: (progress) => {
    console.log(`Generating: ${progress}%`);
    updateProgressBar(progress);
  },
});
```

### With React

```tsx
const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'document.pdf',
});

return (
  <div>
    {isGenerating && (
      <div>
        <progress value={progress} max="100" />
        <span>{progress}%</span>
      </div>
    )}
    <button onClick={generatePDF}>Download</button>
  </div>
);
```

## Getting Generation Result

Get metadata about the generated PDF:

```javascript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

const generator = new PDFGenerator();
const result = await generator.generatePDF(element, 'document.pdf');

console.log(`Pages: ${result.pageCount}`);
console.log(`Size: ${result.fileSize} bytes`);
console.log(`Time: ${result.generationTime}ms`);
```

## Best Practices

### 1. Use Appropriate Page Size

```javascript
// For standard documents
format: 'a4'

// For US-based documents
format: 'letter'

// For posters or large prints
format: 'a3'
```

### 2. Set Reasonable Margins

```javascript
// Documents with lots of content
margins: [10, 10, 10, 10]

// Formal documents needing breathing room
margins: [20, 15, 20, 15]
```

### 3. Add Page Numbers for Multi-Page

```javascript
// Always add page numbers for documents > 2 pages
showPageNumbers: true,
pageNumberPosition: 'footer',
```

### 4. Test with Different Content Lengths

Always test your PDF generation with:
- Short content (< 1 page)
- Medium content (2-5 pages)
- Long content (10+ pages)

## Examples

### Simple Multi-Page Document

```javascript
const content = document.getElementById('article');
await generatePDF(content, 'article.pdf', {
  format: 'a4',
  margins: [15, 15, 15, 15],
  showPageNumbers: true,
});
```

### Long Report with Progress

```javascript
const report = document.getElementById('annual-report');
await generatePDF(report, 'annual-report.pdf', {
  format: 'letter',
  showPageNumbers: true,
  pageNumberPosition: 'footer',
  onProgress: (p) => updateProgress(p),
  onComplete: (blob) => console.log(`Generated ${blob.size} bytes`),
});
```

### Landscape Document

```javascript
const chart = document.getElementById('wide-chart');
await generatePDF(chart, 'chart.pdf', {
  format: 'a4',
  orientation: 'landscape',
  margins: [10, 10, 10, 10],
});
```

## Advanced Topics

For more control over multi-page PDFs:
- **[Options Reference](../api/options.md)** - All available options for pagination control
- **[Best Practices](../guides/best-practices.md)** - Optimize performance and quality
- **[Image Optimization](../advanced/image-optimization.md)** - DPI control and print quality

## Performance Tips

### For Long Documents (10+ pages)

```javascript
await generatePDF(element, 'long-doc.pdf', {
  scale: 1.5,          // Lower scale for faster generation
  compress: true,      // Enable compression
  imageQuality: 0.8,   // Reduce quality slightly
});
```

### Estimated Generation Times

- **1 page**: ~500ms
- **5 pages**: ~2s
- **10 pages**: ~4s
- **20+ pages**: ~8-15s

Times vary based on content complexity, images, and device performance.

## Next Steps

- **[Image Optimization](../advanced/image-optimization.md)** - DPI control and print quality
- **[Options Reference](../api/options.md)** - Complete options documentation
- **[Code Examples](../examples/code-examples.md)** - Copy-paste ready samples
- **[Best Practices](../guides/best-practices.md)** - Optimization tips

---

[← Back to Documentation](../index.md)
