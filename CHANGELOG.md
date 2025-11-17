# PDF Generator Library - Changelog

## [1.0.0] - 2025-11-16 - Initial Release

### Complete HTML to PDF Generator with Advanced Features

A modern, framework-agnostic library for converting HTML to professional multi-page PDFs with smart pagination and comprehensive feature set.

---

## Phase 1: Core Advanced Features

### 1. Watermark Support
- **Text Watermarks** - Customizable text with opacity, rotation, position
- **Image Watermarks** - Add logo or image watermarks
- **Position Control** - center, diagonal, corners
- **All Pages Support** - Apply to all pages or specific pages

**Usage:**
```typescript
{
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal',
    fontSize: 48,
    color: '#cccccc',
    allPages: true
  }
}
```

### 2. Header/Footer Templates
- **Dynamic Variables** - {{pageNumber}}, {{totalPages}}, {{date}}, {{title}}
- **Custom Height** - Configurable header/footer height
- **First Page Control** - Show/hide on first page

**Usage:**
```typescript
{
  headerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}}',
    height: 20,
    firstPage: false
  }
}
```

### 3. PDF Metadata
- **Document Properties** - title, author, subject, keywords
- **Creator Information** - Application and creation date
- **Embedded Metadata** - Stored in PDF properties

**Usage:**
```typescript
{
  metadata: {
    title: 'Annual Report 2025',
    author: 'John Doe',
    keywords: ['report', 'finance']
  }
}
```

### 4. Print Media CSS Emulation
- **@media print Support** - Apply print-specific styles
- **Automatic Extraction** - Extracts CSS rules from @media print blocks

**Usage:**
```typescript
{
  emulateMediaType: 'print'  // 'screen' (default) or 'print'
}
```

### 5. Batch PDF Generation
- **Multiple Content Items** - Combine multiple items in one PDF
- **Auto-Scaling** - Automatically scale content to fit specified page count
- **Progress Tracking** - Per-item and overall progress tracking

**Usage:**
```typescript
const items = [
  { content: htmlElement, pageCount: 2 },
  { content: '<div>...</div>', pageCount: 1 }
];
await generateBatchPDF(items, 'report.pdf');
```

---

## Phase 2: Template & Content Features

### 1. Template Variable System
- **Simple Variables** - {{variable}} replacement
- **Loops** - {{#each items}}{{name}}{{/each}}
- **Conditionals** - {{#if condition}}text{{/if}}
- **Nested Objects** - Access nested properties

**Usage:**
```typescript
{
  templateOptions: {
    enableVariables: true,
    enableLoops: true,
    enableConditionals: true,
    context: {
      title: 'Invoice',
      items: [{ name: 'Item 1', price: '$10' }]
    }
  }
}
```

### 2. Font Handling
- **Web-Safe Fonts** - 14 pre-defined web-safe fonts
- **Custom Font Embedding** - @font-face CSS generation
- **Fallback Support** - Automatic fallback font configuration

**Usage:**
```typescript
{
  fontOptions: {
    fonts: [
      {
        family: 'Roboto',
        src: '/fonts/Roboto-Regular.ttf',
        weight: 400
      }
    ],
    embedFonts: true,
    fallbackFont: 'Arial'
  }
}
```

### 3. Table of Contents Generation
- **Auto-Generate** - Extract h1, h2, h3 from document
- **Hierarchical Structure** - Parent-child relationships
- **Page Numbers** - Automatic page number tracking
- **Custom Styling** - Default CSS with customization

**Usage:**
```typescript
{
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    levels: [1, 2, 3],
    position: 'start',
    includePageNumbers: true
  }
}
```

### 4. Bookmarks/Outline Support
- **Auto-Generate** - Create outline from headings
- **Custom Bookmarks** - Define manual entries
- **Nested Structure** - Hierarchical navigation
- **Page Targeting** - Link to specific pages

**Usage:**
```typescript
{
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2, 3],
    custom: [
      { title: 'Chapter 1', page: 1, level: 1 }
    ]
  }
}
```

---

## Phase 3: Advanced Processing Features

### 1. PDF Security & Encryption Configuration
- **Password Protection** - User and owner passwords
- **Permission Controls** - Printing, modifying, copying, annotating
- **Encryption Strength** - 128-bit or 256-bit
- **Settings Storage** - Stored for server-side post-processing

**Usage:**
```typescript
{
  securityOptions: {
    enabled: true,
    userPassword: 'open-password',
    ownerPassword: 'permissions-password',
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false
    },
    encryptionStrength: 256
  }
}
```

**Note:** Browser-based jsPDF doesn't support native encryption. Settings are stored in `pdf.__securityOptions` for server-side post-processing using pdf-lib, PyPDF2, or Adobe SDK.

### 2. Async Processing with Webhooks
- **Non-Blocking Generation** - Background PDF generation
- **Webhook Notifications** - HTTP callbacks on completion/failure
- **Job ID Tracking** - Unique job identifiers
- **Custom Headers** - Add authorization headers

**Usage:**
```typescript
const generator = new PDFGenerator({
  asyncOptions: {
    enabled: true,
    webhookUrl: 'https://api.example.com/pdf-ready',
    webhookHeaders: {
      'Authorization': 'Bearer token'
    },
    jobId: 'custom-job-id'
  }
});

const { jobId, status } = await generator.generatePDFAsync(element, 'report.pdf');
```

**Webhook Payload:**
```json
{
  "jobId": "pdf-1234567890-abc",
  "status": "completed",
  "result": {
    "pageCount": 5,
    "fileSize": 423567,
    "generationTime": 1823
  },
  "timestamp": "2025-11-16T12:34:56.789Z"
}
```

### 3. Real-time Preview Component (React)
- **Live PDF Preview** - Real-time preview updates
- **Debounced Updates** - Configurable debounce delay
- **Quality Control** - Preview quality adjustment
- **Memory Management** - Automatic blob URL cleanup

**Component Usage:**
```typescript
import { PDFPreview } from '@encryptioner/html-to-pdf-generator/react';

<PDFPreview
  content={elementOrHTMLString}
  debounce={500}
  quality={0.7}
  className="preview-container"
  onError={(error) => console.error(error)}
/>
```

**Hook Usage:**
```typescript
import { usePDFPreview } from '@encryptioner/html-to-pdf-generator/react';

const { generatePreview, isGenerating, previewUrl, clearPreview } = usePDFPreview({
  format: 'a4'
});

const url = await generatePreview(element);
```

### 4. URL to PDF Conversion
- **Client-Side Conversion** - Convert web pages to PDF
- **Selector Waiting** - Wait for specific CSS selectors
- **CSS/JS Injection** - Inject custom CSS and JavaScript
- **CORS Aware** - Clear error messages for CORS issues

**Usage:**
```typescript
await generator.generatePDFFromURL(
  'https://example.com/page',
  'webpage.pdf',
  {
    waitForSelector: '.content-loaded',
    timeout: 10000,
    injectCSS: '.no-print { display: none; }',
    injectJS: 'console.log("Ready");'
  }
);
```

**Limitations:**
- **CORS restrictions** - Only same-origin or CORS-enabled URLs
- **No dynamic loading** - Cannot wait for network requests
- **Limited control** - Basic page state management

**Production Recommendation:** For production URL-to-PDF, use server-side solutions like Puppeteer, Playwright, wkhtmltopdf, or cloud services (PDFShift, CloudConvert).

---

## Phase 4: Production Quality Enhancements

### 1. Enhanced Image Optimization with DPI Control
- **DPI Control** - 72 DPI (web), 150 DPI (print), 300 DPI (high-quality)
- **Format Selection** - Choose JPEG, PNG, or WebP output
- **Transparent Background Handling** - Configure background color for transparent images
- **Interpolation Control** - Enable/disable image smoothing
- **Print Optimization** - Dedicated mode for print-quality output

**ImageProcessingOptions:**
```typescript
interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;                 // 0.1-1.0 (default: 0.85)
  compress?: boolean;
  grayscale?: boolean;
  dpi?: number;                     // 72/150/300
  format?: 'jpeg' | 'png' | 'webp';
  backgroundColor?: string;          // default: '#ffffff'
  interpolate?: boolean;            // default: true
  optimizeForPrint?: boolean;
}
```

**Usage:**
```typescript
import { optimizeImage, getRecommendedDPI } from '@encryptioner/html-to-pdf-generator';

const optimizedSrc = await optimizeImage(imgElement, {
  dpi: 300,
  format: 'jpeg',
  backgroundColor: '#ffffff',
  optimizeForPrint: true,
  quality: 0.92
});

// Or use in PDF generation
const generator = new PDFGenerator({
  imageOptions: {
    dpi: 300,
    format: 'jpeg',
    backgroundColor: '#ffffff',
    optimizeForPrint: true,
    quality: 0.92
  }
});
```

### 2. New Utility Functions
- `calculateDPIDimensions(widthInches, heightInches, dpi)` - Calculate pixel dimensions for given DPI
- `getRecommendedDPI(useCase)` - Get recommended DPI ('web' → 72, 'print' → 150, 'high-quality-print' → 300)
- `hasTransparency(img)` - Detect if image has transparent pixels

**Usage:**
```typescript
const dpi = getRecommendedDPI('high-quality-print'); // Returns 300
const { width, height } = calculateDPIDimensions(8.5, 11, 300); // Letter size
const hasAlpha = await hasTransparency(imgElement);
```

### 3. Critical Bug Fix: Black Background on Transparent Images

**Problem:** Transparent images were rendering with black backgrounds when converted to JPEG format.

**Root Cause:** Canvas wasn't filled with background color before drawing the image, causing transparent areas to appear black in JPEG (which doesn't support transparency).

**Fix:** Fill canvas with white background BEFORE drawing image in both `optimizeImage()` and `imageToDataURL()` functions:

```typescript
if (format === 'jpeg' || backgroundColor !== 'transparent') {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
```

**Impact:** All PDFs with transparent images (PNG with transparency, SVG with transparent backgrounds) now render correctly with white (or custom) backgrounds instead of black.

### 4. Accessibility Features (Built-in)
- **Searchable Text** - Text rendered as actual text elements (not images)
- **Screen Reader Support** - Accessible to assistive technologies
- **Selectable Text** - Users can select and copy text
- **SEO-Friendly** - Text searchable by PDF viewers and search engines

**Why Our Library Excels:**
Unlike screenshot-based solutions (Puppeteer screenshots, PhantomJS), our library uses jsPDF's native text rendering which maintains text as actual text elements in the PDF. This provides:
- Full searchability with browser/PDF reader search
- Accessibility for users with disabilities
- Better user experience (copyable text)
- SEO benefits for web-based PDF viewers

---

## Core Features (Included in v1.0.0)

### Multi-Page PDF Generation
- Smart continuous pagination without awkward content cuts
- Single-page optimization for content that fits on one page
- Content-aware splitting at optimal break points
- Multiple page formats (A4, Letter, A3, Legal)
- Portrait and landscape orientations
- Device independence - same output on all screen sizes

### Image Handling
- SVG to image conversion
- Image optimization & compression
- Background image support
- Automatic preloading
- DPI control for print quality
- Format selection (JPEG/PNG/WebP)
- Transparent image background handling

### Table Features
- Header repetition on each page
- Row split prevention
- Automatic borders
- Zebra striping
- Column width fixing

### Color Management
- **OKLCH Color Support** - Native OKLCH to RGB conversion via html2canvas-pro
- **Tailwind CSS v4 Compatible** - Full support for Tailwind's OKLCH colors
- **All Format Support** - oklch(L C H), oklch(L C H / alpha), percentages, angle units
- **Automatic Conversion** - Transparent conversion before rendering
- **Zero Configuration** - Works automatically

### Framework Support
- **React** - Hooks and components (usePDFGenerator, useBatchPDFGenerator, PDFPreview)
- **Vue 3** - Composables (usePDFGenerator, useBatchPDFGenerator)
- **Svelte** - Stores (createPDFGenerator, createBatchPDFGenerator)
- **Vanilla JS/TypeScript** - Direct API access

### TypeScript Support
- Full TypeScript support with complete type definitions
- 50+ exported functions/classes
- Comprehensive interface definitions

---

## Migration Guide

This is the initial v1.0.0 release. No migration needed.

All features are designed to be:
- **Backwards compatible** - New features are additive
- **Optional** - Enable only what you need
- **Well-documented** - Comprehensive guides for all frameworks

### Getting Started

```bash
npm install @encryptioner/html-to-pdf-generator
```

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  format: 'a4',
  showPageNumbers: true
});
```

See [Complete Documentation](./documentation/index.md) for detailed guides.

---

## Summary

**Version 1.0.0** includes:
- 🎯 **Phase 1**: Watermarks, Headers/Footers, Metadata, Print CSS, Batch Generation
- 🎯 **Phase 2**: Templates, Fonts, TOC, Bookmarks
- 🎯 **Phase 3**: Security, Async Processing, Preview Component, URL to PDF
- ⭐ **Phase 4**: Enhanced Image Optimization, DPI Control, Transparent Image Fix, Accessibility

**Production-ready** with:
- 50+ exported functions/classes
- 15+ major feature categories
- Full TypeScript support
- Framework adapters (React, Vue, Svelte, Vanilla JS)
- Comprehensive documentation
- Real-world examples
- Performance optimized
- NPM package ready

Perfect for generating professional, print-quality PDFs from HTML content across all major frameworks!
