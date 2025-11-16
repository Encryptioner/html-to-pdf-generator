# Best Practices

Optimize your PDF generation for quality, performance, and reliability.

## Content Preparation

### Use Fixed Width Containers

Always use a fixed width that matches your target paper size to ensure consistent output across all devices.

```html
<!-- ✅ Good: Fixed width -->
<div ref={targetRef} style="width: 794px;"> <!-- A4 at 96 DPI -->
  Content here
</div>

<!-- ❌ Bad: Responsive width -->
<div ref={targetRef} style="width: 100%;">
  Content here
</div>
```

**Recommended widths:**
- A4: `794px` (210mm at 96 DPI)
- Letter: `816px` (8.5" at 96 DPI)
- A3: `1123px` (297mm at 96 DPI)

### Structure Your Content Properly

Use semantic HTML and proper nesting:

```html
<!-- ✅ Good: Proper structure -->
<div ref={targetRef}>
  <header>
    <h1>Document Title</h1>
  </header>
  <main>
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
  </main>
  <footer>
    Footer content
  </footer>
</div>

<!-- ❌ Bad: Flat structure -->
<div ref={targetRef}>
  <h1>Title</h1>
  Content...
  Footer
</div>
```

### Use Inline or Internal Styles

External stylesheets may have CORS issues. Prefer inline or internal styles:

```html
<!-- ✅ Good: Inline styles -->
<div style="color: #333; font-size: 16px;">Content</div>

<!-- ✅ Good: Internal styles -->
<style>
  .content { color: #333; font-size: 16px; }
</style>
<div class="content">Content</div>

<!-- ⚠️ May fail: External stylesheet -->
<link rel="stylesheet" href="https://example.com/styles.css">
```

## Quality Optimization

### Choose Appropriate Scale

Balance quality and performance:

```javascript
// Fast, lower quality (development/drafts)
scale: 1

// Balanced (recommended for most cases)
scale: 2

// High quality (final documents)
scale: 3

// Maximum quality (print-ready)
scale: 4
```

### Optimize Image Quality

```javascript
await generatePDF(element, 'document.pdf', {
  // For documents with lots of images
  imageQuality: 0.85,     // Good balance
  optimizeImages: true,   // Enable optimization
  maxImageWidth: 1200,    // Limit image size

  // For simple documents (text-heavy)
  imageQuality: 0.75,     // Lower quality acceptable
  compress: true,         // Enable compression
});
```

### Set Appropriate Margins

```javascript
// Standard documents
margins: [10, 10, 10, 10]  // 10mm all around

// Formal documents
margins: [20, 15, 20, 15]  // More whitespace

// Binding allowance
margins: [20, 10, 20, 20]  // Extra left margin for binding

// Maximum content
margins: [5, 5, 5, 5]      // Minimal margins
```

## Performance Optimization

### Reduce Generation Time

```javascript
await generatePDF(element, 'document.pdf', {
  scale: 1.5,              // Lower scale
  imageQuality: 0.75,     // Reduce quality slightly
  compress: true,          // Enable compression
  optimizeImages: true,    // Optimize images
});
```

### Reduce File Size

```javascript
await generatePDF(element, 'document.pdf', {
  compress: true,          // Enable PDF compression
  imageQuality: 0.75,     // Lower image quality
  optimizeImages: true,    // Compress images
  maxImageWidth: 1000,    // Limit image dimensions
});
```

### Handle Large Documents

For documents with 20+ pages:

```javascript
await generatePDF(element, 'large-doc.pdf', {
  scale: 1.5,             // Lower scale for speed
  compress: true,         // Essential for large files
  onProgress: (p) => {
    updateProgressBar(p); // Keep user informed
  },
});
```

Or use batch generation:

```javascript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  { content: section1, pageCount: 5 },
  { content: section2, pageCount: 3 },
  { content: section3, pageCount: 4 },
];

await generateBatchPDF(items, 'complete-document.pdf');
```

## Error Handling

### Always Check Elements Exist

```javascript
// ✅ Good: Check element exists
const element = document.getElementById('content');
if (!element) {
  console.error('Content element not found');
  return;
}

try {
  await generatePDF(element, 'document.pdf');
} catch (error) {
  console.error('PDF generation failed:', error);
  showErrorMessage('Failed to generate PDF');
}
```

### Use Error Callbacks

```javascript
await generatePDF(element, 'document.pdf', {
  onError: (error) => {
    // Log error
    console.error('Generation error:', error);

    // Show user-friendly message
    toast.error('Unable to generate PDF. Please try again.');

    // Track error (optional)
    analytics.track('pdf_generation_error', {
      error: error.message,
    });
  },
});
```

### Handle Network Errors

```javascript
try {
  await generatePDF(element, 'document.pdf');
} catch (error) {
  if (error.message.includes('CORS')) {
    showError('Some images could not be loaded due to security restrictions.');
  } else if (error.message.includes('NetworkError')) {
    showError('Network error. Please check your connection.');
  } else {
    showError('An unexpected error occurred.');
  }
}
```

## User Experience

### Show Progress Indicators

```javascript
await generatePDF(element, 'document.pdf', {
  onProgress: (progress) => {
    // Update progress bar
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `Generating... ${progress}%`;
  },
  onComplete: (blob) => {
    // Hide progress, show success
    progressBar.style.display = 'none';
    showSuccess('PDF downloaded successfully!');
  },
});
```

### Disable Buttons During Generation

```javascript
// React example
const { generatePDF, isGenerating } = usePDFGenerator({
  filename: 'document.pdf',
});

return (
  <button onClick={generatePDF} disabled={isGenerating}>
    {isGenerating ? 'Generating...' : 'Download PDF'}
  </button>
);
```

```javascript
// Vanilla JS example
const button = document.getElementById('download-btn');

button.addEventListener('click', async () => {
  button.disabled = true;
  button.textContent = 'Generating...';

  try {
    await generatePDF(element, 'document.pdf');
  } finally {
    button.disabled = false;
    button.textContent = 'Download PDF';
  }
});
```

### Provide Feedback

```javascript
await generatePDF(element, 'document.pdf', {
  onProgress: (p) => console.log(`Progress: ${p}%`),
  onComplete: (blob) => {
    // Show success message
    toast.success('PDF downloaded successfully!');

    // Provide file info
    console.log(`Generated ${blob.size} bytes`);
  },
  onError: (error) => {
    // Show error message
    toast.error('Failed to generate PDF');

    // Offer solution
    if (error.message.includes('memory')) {
      toast.info('Try reducing image quality or content size');
    }
  },
});
```

## Images

### Preload Images

```javascript
async function preloadImages() {
  const images = Array.from(document.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );
}

// Then generate PDF
await preloadImages();
await generatePDF(element, 'document.pdf');
```

### Use Appropriate Image Formats

```html
<!-- ✅ Good: Optimized formats -->
<img src="logo.png" alt="Logo" />        <!-- PNG for logos -->
<img src="photo.jpg" alt="Photo" />      <!-- JPEG for photos -->
<img src="icon.svg" alt="Icon" />        <!-- SVG for icons -->

<!-- ❌ Bad: Unoptimized -->
<img src="huge-photo.png" alt="Photo" /> <!-- Large PNG -->
```

### Optimize Image Sizes

```javascript
await generatePDF(element, 'document.pdf', {
  optimizeImages: true,    // Enable optimization
  maxImageWidth: 1200,     // Limit width
  imageQuality: 0.85,      // Good quality
});
```

## Tables

### Use Proper Table Structure

```html
<!-- ✅ Good: Proper structure -->
<table>
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>

<!-- ❌ Bad: No thead -->
<table>
  <tr>
    <td><strong>Column 1</strong></td>
    <td><strong>Column 2</strong></td>
  </tr>
  <tr>
    <td>Data 1</td>
    <td>Data 2</td>
  </tr>
</table>
```

### Enable Table Features

```javascript
await generatePDF(element, 'document.pdf', {
  repeatTableHeaders: true,   // Repeat headers on each page
  avoidTableRowSplit: true,   // Keep rows together
});
```

### Style Tables for PDF

```css
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

/* Zebra striping */
tr:nth-child(even) {
  background-color: #fafafa;
}
```

## Page Breaks

### Use CSS Page Break Properties

```css
/* Avoid breaking inside elements */
.avoid-break {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* Force break before */
.new-page {
  page-break-before: always;
  break-before: page;
}

/* Force break after */
.section-end {
  page-break-after: always;
  break-after: page;
}
```

### Enable Page Break Handling

```javascript
await generatePDF(element, 'document.pdf', {
  respectCSSPageBreaks: true,       // Honor CSS page breaks
  preventOrphanedHeadings: true,    // Keep headings with content
});
```

## Fonts

### Use Web-Safe Fonts

```css
/* ✅ Good: Web-safe fonts */
body {
  font-family: Arial, Helvetica, sans-serif;
}

h1 {
  font-family: Georgia, 'Times New Roman', serif;
}

/* ⚠️ May fail: Custom fonts */
body {
  font-family: 'Custom Font', sans-serif;
}
```

### Load Custom Fonts Properly

```javascript
// Wait for fonts to load
await document.fonts.ready;

// Then generate PDF
await generatePDF(element, 'document.pdf');
```

## Testing

### Test with Different Content Sizes

Always test with:

1. **Short content** (< 1 page)
2. **Medium content** (2-5 pages)
3. **Long content** (10+ pages)
4. **Edge cases** (empty, very long paragraphs, many images)

### Test on Different Browsers

```javascript
// Check browser compatibility
const browser = navigator.userAgent;
console.log('Generating PDF on:', browser);

// Adjust settings if needed
const scale = browser.includes('Safari') ? 1.5 : 2;

await generatePDF(element, 'document.pdf', { scale });
```

### Test Error Scenarios

1. Element not found
2. Network errors (images)
3. Out of memory (very large documents)
4. CORS errors

## Security

### Sanitize User Input

```javascript
// ✅ Good: Sanitize HTML
import DOMPurify from 'dompurify';

const userHTML = DOMPurify.sanitize(untrustedHTML);
element.innerHTML = userHTML;

await generatePDF(element, 'document.pdf');
```

### Validate File Names

```javascript
import { sanitizeFilename } from '@encryptioner/html-to-pdf-generator';

// ✅ Good: Sanitize filename
const userFilename = sanitizeFilename(userInput, 'pdf');
await generatePDF(element, userFilename);

// ❌ Bad: Use user input directly
await generatePDF(element, `${userInput}.pdf`);
```

## Production Checklist

Before deploying to production:

- [ ] Test with realistic content sizes
- [ ] Test on target browsers
- [ ] Implement error handling
- [ ] Show progress indicators
- [ ] Optimize images
- [ ] Use appropriate quality settings
- [ ] Handle CORS issues
- [ ] Sanitize user input
- [ ] Test offline/network errors
- [ ] Monitor file sizes
- [ ] Set up error tracking
- [ ] Document known limitations

## Common Pitfalls to Avoid

### ❌ Don't: Generate without checking element

```javascript
// Bad
await generatePDF(document.getElementById('content'), 'doc.pdf');
```

### ✅ Do: Check element exists

```javascript
// Good
const element = document.getElementById('content');
if (!element) return;
await generatePDF(element, 'doc.pdf');
```

### ❌ Don't: Use responsive widths

```html
<!-- Bad -->
<div style="width: 100%">Content</div>
```

### ✅ Do: Use fixed widths

```html
<!-- Good -->
<div style="width: 794px">Content</div>
```

### ❌ Don't: Ignore errors

```javascript
// Bad
await generatePDF(element, 'doc.pdf');
```

### ✅ Do: Handle errors

```javascript
// Good
try {
  await generatePDF(element, 'doc.pdf', {
    onError: (err) => console.error(err),
  });
} catch (error) {
  showError('Failed to generate PDF');
}
```

### ❌ Don't: Generate without loading check

```javascript
// Bad - images may not be loaded
await generatePDF(element, 'doc.pdf');
```

### ✅ Do: Wait for content to load

```javascript
// Good
await preloadImages();
await generatePDF(element, 'doc.pdf');
```

## Next Steps

- **[Performance Guide](./performance.md)** - Detailed performance optimization
- **[Troubleshooting](./troubleshooting.md)** - Common issues and solutions
- **[Examples](../examples/code-examples.md)** - Real-world examples

---

[← Back to Documentation](../index.md)
