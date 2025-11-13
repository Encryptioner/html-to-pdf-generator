# Image Processing Flow

This document explains how images are processed in the PDF generator.

## Complete Processing Chain

### For DOM Elements

```
User calls: generatePDF(element, 'file.pdf')
    ↓
PDFGenerator.generatePDF(element, filename)
    ↓
prepareElement(element) [core.ts:145]
    ↓
processImagesForPDF(clone, options) [core.ts:190]
    ↓
    ├─→ preloadImages(element) [image-handler.ts:26]
    │   └─→ Waits for all <img> tags to load
    │       └─→ 10 second timeout per image
    │           └─→ Resolves on load/error/timeout
    │
    ├─→ convertSVGsToImages(element) [image-handler.ts:65]
    │   └─→ Finds all <svg> elements
    │       └─→ Converts each to data URL
    │           └─→ Replaces <svg> with <img>
    │
    └─→ optimizeImage(img, options) [if compress enabled]
        └─→ Resizes to maxWidth
            └─→ Optionally converts to grayscale
                └─→ Returns optimized data URL
```

### For HTML Strings

```
User calls: generatePDFFromHTML(htmlString, 'file.pdf')
    ↓
htmlStringToElement(htmlString) [utils.ts:246]
    ↓
loadExternalStyles(element) [utils.ts:296]
    ↓
PDFGenerator.generatePDF(element, filename)
    ↓
[Same flow as DOM elements above]
```

## Function Locations

### Core Functions (Actually Used)

1. **processImagesForPDF** - `src/image-handler.ts:154`
   - Main orchestrator for all image processing
   - Called from: `src/core.ts:190`

2. **preloadImages** - `src/image-handler.ts:26`
   - Ensures all images are loaded before rendering
   - Called from: `processImagesForPDF`
   - Prevents blank images in PDF

3. **convertSVGsToImages** - `src/image-handler.ts:65`
   - Converts SVG elements to raster images
   - Called from: `processImagesForPDF`
   - Required because html2canvas doesn't handle SVG well

4. **optimizeImage** - `src/image-handler.ts:96`
   - Compresses and resizes images
   - Called from: `processImagesForPDF` (if compress enabled)
   - Reduces PDF file size

5. **processBackgroundImages** - `src/image-handler.ts:183`
   - Handles CSS background-image properties
   - Called from: `src/core.ts:197`

### Utility Functions (Exported but not directly used in core)

6. **waitForImagesToLoad** - `src/utils.ts:334`
   - Similar to preloadImages but defined in utils
   - **NOT used** in core.ts (removed unused import)
   - Available as utility export

7. **imageToDataURL** - `src/image-handler.ts` (exported)
   - Converts image to data URL
   - Used internally by image processing functions

8. **isDataURL** - `src/image-handler.ts` (exported)
   - Checks if string is a data URL
   - Used internally by image processing functions

## Why These Functions Are Critical

### 1. preloadImages (ESSENTIAL)

**Problem without it:**
- html2canvas captures DOM at render time
- If images aren't loaded, they appear blank in PDF
- Network delays would cause missing images

**Solution:**
- Waits for all images to complete loading
- 10 second timeout per image
- Resolves gracefully on errors

### 2. convertSVGsToImages (ESSENTIAL)

**Problem without it:**
- html2canvas has poor SVG support
- SVG elements often render as blank or distorted
- Complex SVGs fail completely

**Solution:**
- Converts SVG to data URL
- Replaces <svg> with <img>
- Ensures consistent rendering

### 3. optimizeImage (OPTIONAL)

**Problem without it:**
- Large images increase PDF file size
- High-resolution images slow down generation

**Solution:**
- Resizes to maxWidth
- Compresses as JPEG
- Reduces file size significantly

### 4. processBackgroundImages (IMPORTANT)

**Problem without it:**
- CSS background images might not render
- html2canvas sometimes misses background images

**Solution:**
- Explicitly handles background-image CSS
- Preloads background images
- Ensures they're available for rendering

## Image Processing Options

```typescript
interface ImageProcessingOptions {
  compress?: boolean;      // Enable image compression
  quality?: number;        // JPEG quality (0-1)
  maxWidth?: number;       // Max image width in pixels
  grayscale?: boolean;     // Convert to grayscale
}
```

### Default Options

From `src/core.ts:190`:
```typescript
{
  compress: this.options.compress,    // From PDFGeneratorOptions
  quality: this.options.imageQuality, // Default: 0.85
  maxWidth: this.pageConfig.widthPx,  // Based on page format
}
```

## Processing Order

The order matters for correct rendering:

1. **Load external styles** (for HTML strings)
   - External CSS might affect image sizing

2. **Preload images**
   - Wait for all <img> tags to load

3. **Convert SVGs**
   - Replace SVG elements with raster images

4. **Optimize images** (if enabled)
   - Compress and resize loaded images

5. **Process background images**
   - Handle CSS background-image properties

6. **Process tables**
   - Table processing comes after images

7. **Apply page breaks**
   - Final layout adjustments

## Timing

From `src/core.ts`:

```typescript
// Step 1: Load styles (for HTML strings)
await loadExternalStyles(element);
await new Promise(resolve => setTimeout(resolve, 100));

// Step 2: Process images
this.options.onProgress(7);
await processImagesForPDF(clone, options);

// Step 3: Process background images
await processBackgroundImages(clone);

// Step 4: Other processing...
this.options.onProgress(8);
processTablesForPDF(clone, options);

// Step 5: Final wait
await new Promise(resolve => setTimeout(resolve, 200));
```

Total wait times:
- 100ms after style loading
- ~variable ms for image processing
- 200ms final wait
- **Total: ~300ms + image load time**

## Common Issues

### Images Appear Blank

**Cause:** Images not loaded before rendering
**Solution:** `preloadImages` waits for images to load

### SVGs Don't Render

**Cause:** html2canvas poor SVG support
**Solution:** `convertSVGsToImages` converts to raster

### Large PDF Files

**Cause:** High-resolution images
**Solution:** Enable `compress: true` option

### Background Images Missing

**Cause:** html2canvas sometimes misses them
**Solution:** `processBackgroundImages` explicitly handles them

## Summary

✅ **Used Functions:**
- `processImagesForPDF` - Main orchestrator
- `preloadImages` - Wait for images to load
- `convertSVGsToImages` - Convert SVGs to raster
- `optimizeImage` - Compress/resize images
- `processBackgroundImages` - Handle background-image CSS

❌ **Removed from core.ts imports:**
- `waitForImagesToLoad` - Similar to preloadImages, but not used
- `convertSVGsToImages` - Only used inside processImagesForPDF

These removed functions are still exported from the package for users who want direct access to them.
