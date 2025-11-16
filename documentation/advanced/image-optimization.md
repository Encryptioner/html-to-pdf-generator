# Image Optimization (v5.1.0)

> Enhanced image processing with DPI control, print-quality optimization, and transparent image handling.

## Overview

Phase 4 introduces advanced image optimization features for print-quality PDFs. Control DPI, image format, background colors, and more to ensure your PDFs look professional whether viewed on screen or printed.

## Key Features

- **DPI Control** - 72 DPI (web), 150 DPI (print), 300 DPI (high-quality print)
- **Format Selection** - Choose JPEG, PNG, or WebP output
- **Transparent Background Handling** - Configure background color for transparent images
- **Interpolation Control** - Enable/disable image smoothing to prevent blur
- **Print Optimization** - Dedicated mode for print-quality output
- **Transparency Detection** - Automatically detect transparent pixels
- **DPI Utilities** - Helper functions for DPI calculations

## Basic Usage

### Enhanced Image Optimization

```typescript
import { optimizeImage } from '@encryptioner/html-to-pdf-generator';

const imgElement = document.querySelector('img');

const optimizedSrc = await optimizeImage(imgElement, {
  dpi: 300,                       // Print quality DPI
  format: 'jpeg',                 // Output format
  backgroundColor: '#ffffff',     // Background for transparent images
  optimizeForPrint: true,         // Enable print optimizations
  interpolate: true,              // High-quality scaling
  quality: 0.92                   // JPEG quality
});

// Use optimized image
imgElement.src = optimizedSrc;
```

### DPI Utilities

```typescript
import {
  getRecommendedDPI,
  calculateDPIDimensions,
  hasTransparency
} from '@encryptioner/html-to-pdf-generator';

// Get recommended DPI for use case
const webDPI = getRecommendedDPI('web');                    // Returns 72
const printDPI = getRecommendedDPI('print');                // Returns 150
const highQualityDPI = getRecommendedDPI('high-quality-print'); // Returns 300

// Calculate pixel dimensions for physical size
const letterSize = calculateDPIDimensions(8.5, 11, 300); // Letter size at 300 DPI
// Returns: { width: 2550, height: 3300 }

// Detect transparency
const hasAlpha = await hasTransparency(imgElement);
if (hasAlpha) {
  console.log('Image has transparent pixels');
}
```

## Framework Examples

### React

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'document.pdf',
    imageOptions: {
      dpi: 300,
      format: 'jpeg',
      backgroundColor: '#ffffff',
      optimizeForPrint: true,
      quality: 0.92
    }
  });

  return (
    <div>
      <div ref={targetRef}>
        <h1>Document with High-Quality Images</h1>
        <img src="transparent-logo.png" alt="Logo" />
      </div>
      <button onClick={generatePDF} disabled={isGenerating}>
        Download PDF
      </button>
    </div>
  );
}
```

### Vue 3

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
  filename: 'document.pdf',
  imageOptions: {
    dpi: 300,
    format: 'jpeg',
    backgroundColor: '#ffffff',
    optimizeForPrint: true,
    quality: 0.92
  }
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <h1>Document with High-Quality Images</h1>
      <img src="transparent-logo.png" alt="Logo" />
    </div>
    <button @click="generatePDF" :disabled="isGenerating">
      Download PDF
    </button>
  </div>
</template>
```

### Svelte

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: 'document.pdf',
    imageOptions: {
      dpi: 300,
      format: 'jpeg',
      backgroundColor: '#ffffff',
      optimizeForPrint: true,
      quality: 0.92
    }
  });
</script>

<div bind:this={targetElement}>
  <h1>Document with High-Quality Images</h1>
  <img src="transparent-logo.png" alt="Logo" />
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Download PDF
</button>
```

### Vanilla JavaScript

```typescript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

const generator = new PDFGenerator({
  imageOptions: {
    dpi: 300,
    format: 'jpeg',
    backgroundColor: '#ffffff',
    optimizeForPrint: true,
    quality: 0.92
  }
});

const element = document.getElementById('content');
await generator.generatePDF(element, 'document.pdf');
```

## ImageProcessingOptions Reference

```typescript
interface ImageProcessingOptions {
  // Legacy options (still supported)
  maxWidth?: number;              // Max width in pixels
  maxHeight?: number;             // Max height in pixels
  quality?: number;               // 0.1-1.0 (default: 0.85)
  compress?: boolean;             // Enable compression
  grayscale?: boolean;            // Convert to grayscale

  // NEW in v5.1.0
  dpi?: number;                   // DPI control (72/150/300)
  format?: 'jpeg' | 'png' | 'webp'; // Output format
  backgroundColor?: string;        // Background color (default: '#ffffff')
  interpolate?: boolean;          // Image smoothing (default: true)
  optimizeForPrint?: boolean;     // Print optimization
}
```

## DPI Guidelines

| Use Case | DPI | Description |
|----------|-----|-------------|
| Web/Screen | 72 | Standard web display quality |
| Standard Print | 150 | Good quality for most print jobs |
| High-Quality Print | 300 | Professional print quality |

## Critical Bug Fix

**Problem:** Transparent images (PNG with transparency, SVG with transparent backgrounds) were rendering with black backgrounds when converted to JPEG format.

**Solution:** Canvas is now filled with the specified background color BEFORE drawing the image. This ensures transparent areas are properly filled instead of appearing black.

```typescript
// Fixed in optimizeImage() and imageToDataURL()
if (format === 'jpeg' || backgroundColor !== 'transparent') {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
```

**Impact:** All PDFs with transparent images now render correctly with white (or custom) backgrounds instead of black.

## Best Practices

### For Web PDFs
```typescript
imageOptions: {
  dpi: 72,
  format: 'jpeg',
  quality: 0.85,
  optimizeForPrint: false
}
```

### For Print PDFs
```typescript
imageOptions: {
  dpi: 300,
  format: 'jpeg',
  backgroundColor: '#ffffff',
  optimizeForPrint: true,
  quality: 0.92
}
```

### For Transparent Images
```typescript
imageOptions: {
  format: 'png',  // PNG preserves transparency
  backgroundColor: 'transparent',
  interpolate: true
}
```

### For Photos
```typescript
imageOptions: {
  dpi: 300,
  format: 'jpeg',
  quality: 0.92,
  optimizeForPrint: true
}
```

## Utility Functions

### calculateDPIDimensions()

Calculate pixel dimensions for a given physical size and DPI.

```typescript
function calculateDPIDimensions(
  widthInches: number,
  heightInches: number,
  dpi: number
): { width: number; height: number }
```

**Example:**
```typescript
const a4Size = calculateDPIDimensions(8.27, 11.69, 300);
// Returns: { width: 2481, height: 3507 }
```

### getRecommendedDPI()

Get recommended DPI for a specific use case.

```typescript
function getRecommendedDPI(
  useCase: 'web' | 'print' | 'high-quality-print'
): number
```

**Example:**
```typescript
const dpi = getRecommendedDPI('high-quality-print'); // Returns 300
```

### hasTransparency()

Detect if an image has transparent pixels.

```typescript
async function hasTransparency(
  img: HTMLImageElement
): Promise<boolean>
```

**Example:**
```typescript
const isTransparent = await hasTransparency(imgElement);
if (isTransparent) {
  // Use PNG format to preserve transparency
  imageOptions.format = 'png';
}
```

## Troubleshooting

### Images appear blurry
- Increase DPI to 150 or 300
- Enable `optimizeForPrint: true`
- Increase `quality` to 0.92 or higher

### Transparent images have black backgrounds
- This was fixed in v5.1.0
- Ensure you're using the latest version
- Alternatively, set `format: 'png'` to preserve transparency

### File size too large
- Reduce DPI to 72 or 150
- Use JPEG format: `format: 'jpeg'`
- Reduce quality: `quality: 0.75`
- Enable compression: `compress: true`

### Images look pixelated
- Enable interpolation: `interpolate: true`
- Increase DPI
- Use higher quality source images

## Performance Considerations

Higher DPI and print optimization increase:
- Processing time (2-3x slower at 300 DPI vs 72 DPI)
- Memory usage
- File size

For web PDFs, use 72 DPI. For print PDFs, use 300 DPI.

## Related Documentation

- [Image Handling](../features/images.md) - Core image features
- [Options Reference](../api/options.md) - Complete options documentation
- [Best Practices](../guides/best-practices.md) - Optimization tips

## Support

For issues or questions, please [open an issue](https://github.com/encryptioner/html-to-pdf-generator/issues) on GitHub.
