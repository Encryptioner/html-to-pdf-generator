# Troubleshooting Guide

Common issues and solutions when using the HTML to PDF Generator.

## Content Issues

### Content Not Showing in PDF

**Problem**: Generated PDF is blank or missing content.

**Solutions**:

1. **Wait for images to load**:
```javascript
// Ensure images are loaded before generating
await new Promise(resolve => {
  if (document.readyState === 'complete') {
    resolve();
  } else {
    window.addEventListener('load', resolve);
  }
});

await generatePDF(element, 'document.pdf');
```

2. **Check element visibility**:
```javascript
// Element must be visible in DOM
const element = document.getElementById('content');
console.log('Visible:', element.offsetHeight > 0);
```

3. **Verify element is in DOM**:
```javascript
const element = document.getElementById('content');
console.log('In DOM:', document.body.contains(element));
```

### Content Cut Off

**Problem**: Content is truncated or cut off in PDF.

**Solutions**:

1. **Use fixed width container**:
```html
<div ref={targetRef} style={{ width: '794px' }}>
  <!-- A4 width at 96 DPI -->
  Content here
</div>
```

2. **Check for overflow hidden**:
```css
/* Avoid overflow: hidden on PDF container */
.pdf-container {
  overflow: visible; /* Not hidden */
}
```

3. **Increase margins if content touches edges**:
```javascript
await generatePDF(element, 'document.pdf', {
  margins: [15, 15, 15, 15], // Increase from default [10,10,10,10]
});
```

### Styles Not Applied

**Problem**: CSS styles don't appear in PDF.

**Solutions**:

1. **Ensure stylesheets are loaded**:
```javascript
// Wait for stylesheets
await Promise.all(
  Array.from(document.styleSheets).map(sheet => {
    try {
      return sheet.cssRules; // Access to trigger load
    } catch (e) {
      return Promise.resolve();
    }
  })
);
```

2. **Inline critical styles**:
```html
<div style="color: red; font-size: 16px;">
  Inline styles always work
</div>
```

3. **Use customCSS option**:
```javascript
await generatePDF(element, 'document.pdf', {
  customCSS: `
    .important { color: red; }
    h1 { font-size: 24px; }
  `
});
```

4. **Check for CORS issues**:
```
// External stylesheets must allow CORS
// Use same-origin stylesheets or enable CORS
```

## Image Issues

### Images Not Appearing

**Problem**: Images missing from PDF.

**Solutions**:

1. **Preload images**:
```javascript
const images = Array.from(document.images);
await Promise.all(
  images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  })
);
```

2. **Use data URLs or same-origin images**:
```html
<!-- ✅ Works -->
<img src="data:image/png;base64,..." />
<img src="/local/image.png" />

<!-- ❌ May fail due to CORS -->
<img src="https://external-site.com/image.png" />
```

3. **Enable CORS on server**:
```javascript
// For external images, ensure server sends:
// Access-Control-Allow-Origin: *
```

### SVG Not Rendering

**Problem**: SVG elements don't appear or look wrong.

**Solutions**:

1. **Enable SVG conversion** (default):
```javascript
await generatePDF(element, 'document.pdf', {
  convertSVG: true, // Convert SVGs to images
});
```

2. **Ensure SVG has explicit dimensions**:
```html
<svg width="200" height="200">
  <!-- Must have width/height -->
</svg>
```

### Background Images Missing

**Problem**: CSS background images don't show.

**Solution**: The library automatically handles background images, but ensure they're accessible:

```css
/* ✅ Works */
.header {
  background-image: url('/images/bg.png');
}

/* ❌ May fail (CORS) */
.header {
  background-image: url('https://external-site.com/bg.png');
}
```

## Quality Issues

### PDF File Too Large

**Problem**: Generated PDF has very large file size.

**Solutions**:

1. **Enable compression**:
```javascript
await generatePDF(element, 'document.pdf', {
  compress: true,
});
```

2. **Reduce image quality**:
```javascript
await generatePDF(element, 'document.pdf', {
  imageQuality: 0.75, // Lower from 0.85
  optimizeImages: true,
  maxImageWidth: 1200,
});
```

3. **Lower scale factor**:
```javascript
await generatePDF(element, 'document.pdf', {
  scale: 1.5, // Lower from 2
});
```

### Blurry or Pixelated Output

**Problem**: PDF looks blurry or pixelated.

**Solutions**:

1. **Increase scale factor**:
```javascript
await generatePDF(element, 'document.pdf', {
  scale: 3, // Higher quality (slower)
});
```

2. **Increase image quality**:
```javascript
await generatePDF(element, 'document.pdf', {
  imageQuality: 0.95, // Higher quality
});
```

3. **Use vector graphics where possible**:
```html
<!-- SVGs scale better than raster images -->
<svg>...</svg>
```

## Performance Issues

### Generation Takes Too Long

**Problem**: PDF generation is very slow.

**Solutions**:

1. **Reduce scale**:
```javascript
await generatePDF(element, 'document.pdf', {
  scale: 1.5, // Faster than 2 or 3
});
```

2. **Optimize images beforehand**:
```javascript
await generatePDF(element, 'document.pdf', {
  optimizeImages: true,
  maxImageWidth: 1200,
});
```

3. **Simplify complex CSS**:
```css
/* Avoid expensive effects */
.element {
  /* ❌ Slow */
  box-shadow: 0 0 100px rgba(0,0,0,0.5);
  filter: blur(10px);

  /* ✅ Fast */
  border: 1px solid #ccc;
}
```

### Browser Freezes During Generation

**Problem**: Browser becomes unresponsive.

**Solutions**:

1. **Show progress indicator**:
```javascript
await generatePDF(element, 'document.pdf', {
  onProgress: (progress) => {
    updateUI(`Generating... ${progress}%`);
  },
});
```

2. **Split large documents**:
```javascript
// Use batch generation for very large docs
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  { content: section1, pageCount: 5 },
  { content: section2, pageCount: 3 },
];

await generateBatchPDF(items, 'large-doc.pdf');
```

## Framework-Specific Issues

### React: Ref is Null

**Problem**: `targetRef.current` is null.

**Solutions**:

1. **Attach ref correctly**:
```tsx
// ✅ Correct
<div ref={targetRef}>Content</div>

// ❌ Wrong
<div><div ref={targetRef}>Content</div></div>
```

2. **Wait for component to mount**:
```tsx
useEffect(() => {
  console.log('Ref ready:', targetRef.current);
}, []);
```

### React: Hook Dependencies Warning

**Problem**: ESLint warns about missing dependencies.

**Solution**:

```tsx
const { generatePDF } = usePDFGenerator({
  filename: 'document.pdf',
});

// generatePDF is stable, safe to use in useEffect
useEffect(() => {
  // Auto-generate on mount
  generatePDF();
}, [generatePDF]); // Safe to include
```

### Vue: Ref Not Working

**Problem**: `targetRef` not attaching in Vue.

**Solution**:

```vue
<script setup>
const { targetRef, generatePDF } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <!-- Use ref attribute directly -->
  <div ref="targetRef">Content</div>
</template>
```

### Next.js: Document is Not Defined

**Problem**: Error "document is not defined" in Next.js.

**Solution**:

```tsx
'use client'; // Add to top of file

import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

export default function Page() {
  // Now works in client component
}
```

## Color Issues

### OKLCH Colors Not Working

**Problem**: OKLCH colors appear black or incorrect.

**Solution**: The library uses `html2canvas-pro` with native OKLCH support. If issues persist:

```javascript
// Manually convert if needed
import { convertOklchInElement } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
convertOklchInElement(element);
await generatePDF(element, 'document.pdf');
```

### Tailwind Colors Wrong

**Problem**: Tailwind CSS colors don't match.

**Solution**: Ensure Tailwind CSS is loaded before generation:

```javascript
// Wait for Tailwind to initialize
await new Promise(resolve => setTimeout(resolve, 100));
await generatePDF(element, 'document.pdf');
```

## Table Issues

### Table Headers Not Repeating

**Problem**: Headers don't repeat on each page.

**Solutions**:

1. **Enable header repetition** (default):
```javascript
await generatePDF(element, 'document.pdf', {
  repeatTableHeaders: true,
});
```

2. **Use proper table structure**:
```html
<table>
  <thead> <!-- Must use thead -->
    <tr><th>Header</th></tr>
  </thead>
  <tbody>
    <tr><td>Data</td></tr>
  </tbody>
</table>
```

### Table Rows Split Across Pages

**Problem**: Table rows are cut in half between pages.

**Solution**:

```javascript
await generatePDF(element, 'document.pdf', {
  avoidTableRowSplit: true, // Enabled by default
});
```

## Error Messages

### "Failed to execute 'toDataURL'"

**Problem**: CORS error when converting canvas.

**Solutions**:

1. **Use same-origin images**
2. **Enable CORS on image server**
3. **Use data URLs for images**

### "Cannot read property 'scrollHeight' of null"

**Problem**: Element doesn't exist when generating.

**Solution**:

```javascript
const element = document.getElementById('content');
if (!element) {
  console.error('Element not found!');
  return;
}
await generatePDF(element, 'document.pdf');
```

### "Out of memory"

**Problem**: Browser runs out of memory for very large PDFs.

**Solutions**:

1. **Reduce scale**:
```javascript
scale: 1  // Minimum scale
```

2. **Split into smaller PDFs**:
```javascript
// Generate separately and combine
```

3. **Optimize images**:
```javascript
optimizeImages: true,
maxImageWidth: 800,
```

## Getting Help

Still stuck? Here's how to get help:

### 1. Check Examples

See [Examples](../examples/code-examples.md) for working code samples.

### 2. Enable Debug Mode

```javascript
await generatePDF(element, 'document.pdf', {
  onProgress: (p) => console.log(`Progress: ${p}%`),
  onError: (e) => console.error('Error:', e),
  onComplete: (b) => console.log('Success:', b),
});
```

### 3. Create Minimal Reproduction

Isolate the issue:

```html
<!DOCTYPE html>
<html>
<body>
  <div id="content">
    <h1>Test</h1>
  </div>
  <button onclick="test()">Generate</button>

  <script type="module">
    import { generatePDF } from '@encryptioner/html-to-pdf-generator';

    window.test = async () => {
      const el = document.getElementById('content');
      await generatePDF(el, 'test.pdf');
    };
  </script>
</body>
</html>
```

### 4. Report Issue

If you've found a bug:

1. Check [existing issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
2. Create minimal reproduction
3. Open new issue with:
   - Browser and version
   - Code sample
   - Expected vs actual behavior
   - Error messages

## Next Steps

- **[Best Practices](./best-practices.md)** - Optimize your PDFs
- **[Options Reference](../api/options.md)** - Complete options documentation
- **[Code Examples](../examples/code-examples.md)** - Copy-paste ready samples
- **[Getting Started](./getting-started.md)** - Quick start guide

---

[← Back to Documentation](../index.md)
