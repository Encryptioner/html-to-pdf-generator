# Image Handling

Complete guide to image handling in HTML to PDF generation, including SVG conversion, optimization, and print quality control.

## Overview

The PDF generator provides comprehensive image handling capabilities:
- **SVG to Image Conversion** - Automatic conversion of SVG elements to PNG
- **Image Optimization** - Compress and resize images for optimal PDF size
- **Background Images** - Proper CSS background-image support
- **Image Preloading** - Ensures all images load before PDF generation
- **Data URL Support** - Works with inline data URLs and external images
- **Quality Control** - Configurable JPEG quality and compression

## Basic Usage

### Enable Image Optimization

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  optimizeImages: true,
  maxImageWidth: 2000,
  imageQuality: 0.85,
  convertSVG: true,
});
```

## Configuration Options

### optimizeImages

Enable automatic image optimization.

```typescript
optimizeImages: true  // Enable optimization (default: true)
```

When enabled:
- Images are compressed to reduce file size
- Large images are resized to maxImageWidth
- JPEG quality is adjusted based on imageQuality setting

### maxImageWidth

Maximum image width in pixels.

```typescript
maxImageWidth: 2000  // Max width in pixels (default: 2000)
```

Images wider than this will be proportionally resized while maintaining aspect ratio.

### imageQuality

JPEG compression quality (0-1).

```typescript
imageQuality: 0.85  // 85% quality (default: 0.85)
```

- `1.0` = Maximum quality, larger file size
- `0.85` = High quality, balanced file size (recommended)
- `0.7` = Medium quality, smaller file size
- `0.5` = Lower quality, much smaller file size

### convertSVG

Enable automatic SVG to image conversion.

```typescript
convertSVG: true  // Convert SVG elements (default: true)
```

SVG elements are converted to PNG images before PDF generation to ensure proper rendering.

## SVG Handling

### Inline SVG Elements

SVG elements in your HTML are automatically detected and converted:

```html
<div id="content">
  <h1>My Chart</h1>
  <svg width="400" height="300">
    <circle cx="50" cy="50" r="40" fill="blue" />
    <rect x="100" y="10" width="200" height="100" fill="red" />
  </svg>
</div>
```

```typescript
await generatePDF(element, 'chart.pdf', {
  convertSVG: true,  // Automatically converts the SVG
});
```

### SVG from Libraries

Works seamlessly with chart libraries like Chart.js, D3.js, and others:

```typescript
// Chart.js example
const chart = new Chart(ctx, {
  type: 'bar',
  data: chartData,
});

// Wait for chart to render
await new Promise(resolve => setTimeout(resolve, 100));

// Generate PDF with chart
await generatePDF(containerElement, 'chart-report.pdf', {
  convertSVG: true,
});
```

## Background Images

CSS background images are automatically extracted and processed:

```html
<div style="background-image: url('banner.jpg'); height: 200px;">
  <h1>Header with Background</h1>
</div>
```

```typescript
await generatePDF(element, 'document.pdf', {
  optimizeImages: true,  // Also optimizes background images
});
```

## Data URLs

Support for inline data URLs:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." alt="Inline Image" />
```

Data URLs are processed and optimized just like external images.

## Image Preloading

All images are preloaded before PDF generation to ensure they render properly:

```typescript
// Automatic preloading
await generatePDF(element, 'document.pdf');
// Images are loaded before PDF generation starts
```

**Manual Preloading (if needed):**

```typescript
// Ensure images are loaded
const images = element.querySelectorAll('img');
await Promise.all(
  Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = resolve;
    });
  })
);

// Now generate PDF
await generatePDF(element, 'document.pdf');
```

## Advanced Image Processing

### Custom Image Processing Options

```typescript
interface ImageProcessingOptions {
  compress?: boolean;           // Enable compression
  quality?: number;             // JPEG quality (0-1)
  maxWidth?: number;            // Maximum width
  maxHeight?: number;           // Maximum height
  grayscale?: boolean;          // Convert to grayscale
  format?: 'jpeg' | 'png';      // Output format
}

await generatePDF(element, 'document.pdf', {
  optimizeImages: true,
  imageQuality: 0.8,
  maxImageWidth: 1600,
});
```

### Grayscale Conversion

Convert all images to grayscale for print-friendly documents:

```typescript
await generatePDF(element, 'document.pdf', {
  optimizeImages: true,
  // Note: Grayscale requires custom image processing
  customCSS: 'img { filter: grayscale(100%); }',
});
```

## Performance Optimization

### Balance Quality and File Size

```typescript
// High quality (larger files)
await generatePDF(element, 'high-quality.pdf', {
  imageQuality: 0.95,
  maxImageWidth: 3000,
});

// Balanced (recommended)
await generatePDF(element, 'balanced.pdf', {
  imageQuality: 0.85,
  maxImageWidth: 2000,
});

// Optimized for size
await generatePDF(element, 'optimized.pdf', {
  imageQuality: 0.7,
  maxImageWidth: 1200,
  compress: true,
});
```

### Typical File Sizes

For a 10-page document with 5 images:

| Quality | Max Width | Approx. Size |
|---------|-----------|--------------|
| 0.95    | 3000px    | ~2.5 MB      |
| 0.85    | 2000px    | ~1.2 MB      |
| 0.70    | 1200px    | ~600 KB      |

## Print Quality

### DPI Considerations

The `scale` option affects image rendering quality:

```typescript
// Standard quality (96 DPI equivalent)
await generatePDF(element, 'standard.pdf', {
  scale: 1,
});

// High quality (192 DPI equivalent) - Recommended
await generatePDF(element, 'high-quality.pdf', {
  scale: 2,
});

// Print quality (288 DPI equivalent)
await generatePDF(element, 'print.pdf', {
  scale: 3,
});
```

**Recommendation**: Use `scale: 2` for most cases. It provides excellent print quality without excessive file size.

## Troubleshooting

### Images Not Appearing

**Problem**: Images don't show up in the PDF.

**Solutions**:
1. Ensure images are loaded before generation
2. Check CORS settings for external images
3. Use absolute URLs or data URLs

```typescript
// Wait for images to load
await new Promise(resolve => setTimeout(resolve, 500));
await generatePDF(element, 'document.pdf');
```

### Blurry Images

**Problem**: Images appear blurry in the PDF.

**Solutions**:
1. Increase scale factor
2. Use higher resolution source images
3. Avoid upscaling small images

```typescript
await generatePDF(element, 'document.pdf', {
  scale: 2,  // Or 3 for even better quality
});
```

### Large File Sizes

**Problem**: PDF files are too large.

**Solutions**:
1. Reduce image quality
2. Decrease maxImageWidth
3. Enable compression

```typescript
await generatePDF(element, 'document.pdf', {
  optimizeImages: true,
  imageQuality: 0.75,
  maxImageWidth: 1500,
  compress: true,
});
```

### SVG Not Converting

**Problem**: SVG elements render incorrectly.

**Solutions**:
1. Ensure convertSVG is enabled
2. Check for external dependencies in SVG
3. Inline SVG styles

```typescript
await generatePDF(element, 'document.pdf', {
  convertSVG: true,
});
```

## Best Practices

### 1. Optimize Before Adding

Optimize images before adding to HTML when possible:
- Use appropriate image formats (JPEG for photos, PNG for graphics)
- Resize images to display dimensions
- Compress images with tools like TinyPNG

### 2. Use Responsive Images

Provide appropriately sized images:

```html
<img src="image-large.jpg"
     srcset="image-small.jpg 800w, image-medium.jpg 1200w, image-large.jpg 2000w"
     sizes="(max-width: 800px) 800px, 1200px"
     alt="Responsive Image" />
```

### 3. Lazy Load for Web, Preload for PDF

```typescript
// Web version with lazy loading
<img src="placeholder.jpg" data-src="actual-image.jpg" loading="lazy" />

// Before PDF generation, load all images
const lazyImages = element.querySelectorAll('[data-src]');
lazyImages.forEach(img => {
  img.src = img.dataset.src;
});

await generatePDF(element, 'document.pdf');
```

### 4. Test Different Quality Settings

```typescript
const qualitySettings = [
  { quality: 0.95, label: 'high' },
  { quality: 0.85, label: 'medium' },
  { quality: 0.75, label: 'low' },
];

for (const setting of qualitySettings) {
  await generatePDF(element, `document-${setting.label}.pdf`, {
    imageQuality: setting.quality,
  });
}
```

## Examples

### Photo Gallery PDF

```typescript
const gallery = document.getElementById('photo-gallery');

await generatePDF(gallery, 'photo-gallery.pdf', {
  format: 'a4',
  orientation: 'portrait',
  optimizeImages: true,
  imageQuality: 0.85,
  maxImageWidth: 2000,
  scale: 2,
});
```

### Chart Report

```typescript
// Generate charts
const charts = generateCharts(data);

// Wait for rendering
await new Promise(resolve => setTimeout(resolve, 300));

// Generate PDF
await generatePDF(reportElement, 'chart-report.pdf', {
  convertSVG: true,
  optimizeImages: true,
  scale: 2,
});
```

### Product Catalog

```typescript
const catalog = document.getElementById('product-catalog');

await generatePDF(catalog, 'catalog.pdf', {
  format: 'a4',
  optimizeImages: true,
  imageQuality: 0.8,
  maxImageWidth: 1600,
  compress: true,
  showPageNumbers: true,
});
```

## See Also

- [Image Optimization Advanced Guide](../advanced/image-optimization.md) - In-depth image optimization
- [Multi-Page Generation](../advanced/multi-page.md) - Page splitting and pagination
- [Best Practices](../guides/best-practices.md) - Overall best practices
- [Options Reference](../api/options.md) - Complete options documentation
