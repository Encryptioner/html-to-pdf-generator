# Options Reference

Complete reference for all PDF generation options.

## Feature Documentation Links

- **[Multi-Page Generation](../advanced/multi-page.md)** - Page splitting and pagination
- **[Image Optimization](../advanced/image-optimization.md)** - Image handling and quality
- **[Watermarks](../advanced/watermarks.md)** - Add watermarks to PDFs
- **[Headers & Footers](../advanced/headers-footers.md)** - Dynamic templates
- **[Metadata](../advanced/metadata.md)** - Document properties
- **[Batch Generation](../advanced/batch-generation.md)** - Multiple content items
- **[Templates](../advanced/templates.md)** - Template system
- **[Fonts](../advanced/fonts.md)** - Custom fonts
- **[Table of Contents](../advanced/table-of-contents.md)** - Auto-generate TOC
- **[Bookmarks](../advanced/bookmarks.md)** - PDF navigation
- **[Security & Encryption](../advanced/security.md)** - Password protection
- **[Async Processing](../advanced/async-processing.md)** - Background generation
- **[Preview Component](../advanced/preview.md)** - Live preview (React)
- **[URL to PDF](../advanced/url-to-pdf.md)** - Web page conversion

---

## PDFGeneratorOptions

```typescript
interface PDFGeneratorOptions {
  // Paper settings
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | 'a3' | 'legal';
  margins?: [number, number, number, number];

  // Quality settings
  compress?: boolean;
  scale?: number;
  imageQuality?: number;

  // Features
  showPageNumbers?: boolean;
  pageNumberPosition?: 'header' | 'footer';
  customCSS?: string;
  colorReplacements?: Record<string, string>;

  // Image handling
  optimizeImages?: boolean;
  maxImageWidth?: number;
  convertSVG?: boolean;
  imageOptions?: ImageProcessingOptions;

  // Table handling
  repeatTableHeaders?: boolean;
  avoidTableRowSplit?: boolean;

  // Page breaks
  preventOrphanedHeadings?: boolean;
  respectCSSPageBreaks?: boolean;

  // Callbacks
  onProgress?: (progress: number) => void;
  onComplete?: (blob: Blob) => void;
  onError?: (error: Error) => void;

  // Advanced features (Phase 1-2)
  watermark?: WatermarkOptions;
  headerTemplate?: HeaderFooterTemplate;
  footerTemplate?: HeaderFooterTemplate;
  metadata?: PDFMetadata;
  emulateMediaType?: 'screen' | 'print';
  templateOptions?: TemplateOptions;
  fontOptions?: FontOptions;
  tocOptions?: TOCOptions;
  bookmarkOptions?: BookmarkOptions;

  // Advanced features (Phase 3)
  securityOptions?: PDFSecurityOptions;
  asyncOptions?: AsyncProcessingOptions;
  previewOptions?: PreviewOptions;
  urlToPDFOptions?: URLToPDFOptions;
}
```

## Paper Settings

### orientation

Paper orientation.

- **Type**: `'portrait' | 'landscape'`
- **Default**: `'portrait'`

```javascript
orientation: 'portrait'   // Vertical pages (default)
orientation: 'landscape'  // Horizontal pages
```

### format

Paper format.

- **Type**: `'a4' | 'letter' | 'a3' | 'legal'`
- **Default**: `'a4'`

```javascript
format: 'a4'      // 210mm × 297mm (default)
format: 'letter'  // 8.5" × 11"
format: 'a3'      // 297mm × 420mm
format: 'legal'   // 8.5" × 14"
```

### margins

Page margins in millimeters.

- **Type**: `[number, number, number, number]`
- **Default**: `[10, 10, 10, 10]`
- **Format**: `[top, right, bottom, left]`

```javascript
margins: [10, 10, 10, 10]   // Equal margins
margins: [20, 15, 20, 15]   // Vertical 20mm, horizontal 15mm
margins: [25, 15, 15, 15]   // Extra top margin for binding
```

## Quality Settings

### compress

Enable PDF compression to reduce file size.

- **Type**: `boolean`
- **Default**: `true`

```javascript
compress: true   // Smaller file size (recommended)
compress: false  // No compression
```

### scale

Canvas scale factor for html2canvas. Higher values produce better quality but slower generation.

- **Type**: `number`
- **Default**: `2`
- **Range**: `1-4`

```javascript
scale: 1    // Fastest, lowest quality
scale: 2    // Balanced (recommended)
scale: 3    // High quality, slower
scale: 4    // Maximum quality, slowest
```

### imageQuality

JPEG quality for images in PDF.

- **Type**: `number`
- **Default**: `0.85`
- **Range**: `0-1`

```javascript
imageQuality: 0.75  // Lower quality, smaller size
imageQuality: 0.85  // Balanced (recommended)
imageQuality: 1.0   // Maximum quality, larger size
```

## Page Features

### showPageNumbers

Add page numbers to PDF.

- **Type**: `boolean`
- **Default**: `false`

```javascript
showPageNumbers: true   // Add page numbers
showPageNumbers: false  // No page numbers
```

### pageNumberPosition

Position of page numbers.

- **Type**: `'header' | 'footer'`
- **Default**: `'footer'`

```javascript
pageNumberPosition: 'footer'  // Bottom of page (default)
pageNumberPosition: 'header'  // Top of page
```

### customCSS

Custom CSS to inject before rendering.

- **Type**: `string`
- **Default**: `undefined`

```javascript
customCSS: `
  .pdf-only { display: block; }
  .no-pdf { display: none; }
  h1 { color: #333; }
`
```

### colorReplacements

Custom color replacements map.

- **Type**: `Record<string, string>`
- **Default**: `{}`

```javascript
colorReplacements: {
  '--brand-color': '#3b82f6',
  '--accent-color': '#10b981',
}
```

## Image Handling

### optimizeImages

Enable image optimization and compression.

- **Type**: `boolean`
- **Default**: `false`

```javascript
optimizeImages: true   // Compress images
optimizeImages: false  // Original image quality
```

### maxImageWidth

Maximum image width in pixels. Images larger than this are resized.

- **Type**: `number`
- **Default**: `undefined`

```javascript
maxImageWidth: 1200   // Limit images to 1200px wide
maxImageWidth: 2000   // Higher limit for better quality
```

### convertSVG

Convert SVG elements to images before PDF generation.

- **Type**: `boolean`
- **Default**: `true`

```javascript
convertSVG: true   // Convert SVGs (recommended)
convertSVG: false  // Keep SVGs as-is
```

### imageOptions

Advanced image processing options for print-quality PDFs.

- **Type**: `ImageProcessingOptions`
- **Default**: `undefined` (uses defaults)

```typescript
interface ImageProcessingOptions {
  maxWidth?: number;               // Max width in pixels
  maxHeight?: number;              // Max height in pixels
  quality?: number;                // 0.1-1.0 (default: 0.85)
  compress?: boolean;              // Enable compression
  grayscale?: boolean;             // Convert to grayscale
  dpi?: number;                    // DPI control (72/150/300)
  format?: 'jpeg' | 'png' | 'webp'; // Output format
  backgroundColor?: string;         // Background color (default: '#ffffff')
  interpolate?: boolean;           // Image smoothing (default: true)
  optimizeForPrint?: boolean;      // Print optimization
}
```

**Example:**
```javascript
// High-quality print PDF
imageOptions: {
  dpi: 300,                      // Print quality
  format: 'jpeg',                // Output format
  backgroundColor: '#ffffff',    // Background for transparent images
  optimizeForPrint: true,        // Enable print optimizations
  interpolate: true,             // High-quality scaling
  quality: 0.92                  // JPEG quality
}

// Web PDF (optimized for screen)
imageOptions: {
  dpi: 72,                       // Screen quality
  format: 'jpeg',
  quality: 0.85,
  optimizeForPrint: false
}

// Preserve transparency
imageOptions: {
  format: 'png',                 // PNG preserves transparency
  backgroundColor: 'transparent',
  interpolate: true
}
```

**DPI Guidelines:**
- **72 DPI**: Web/screen display
- **150 DPI**: Standard print quality
- **300 DPI**: High-quality professional print

**Image Formats:**
- **JPEG**: Best for photos, smaller file size, no transparency
- **PNG**: Supports transparency, larger file size
- **WebP**: Modern format, good compression, transparency support

See [Image Optimization Guide](../advanced/image-optimization.md) for detailed documentation.

## Table Handling

### repeatTableHeaders

Repeat table headers (`<thead>`) on each page.

- **Type**: `boolean`
- **Default**: `true`

```javascript
repeatTableHeaders: true   // Repeat headers (recommended)
repeatTableHeaders: false  // Headers only on first page
```

### avoidTableRowSplit

Prevent table rows from being split across pages.

- **Type**: `boolean`
- **Default**: `true`

```javascript
avoidTableRowSplit: true   // Keep rows together (recommended)
avoidTableRowSplit: false  // Allow row splits
```

## Page Break Control

### preventOrphanedHeadings

Keep headings with their content (prevent orphaned headings at page bottom).

- **Type**: `boolean`
- **Default**: `true`

```javascript
preventOrphanedHeadings: true   // Keep headings with content (recommended)
preventOrphanedHeadings: false  // Allow orphaned headings
```

### respectCSSPageBreaks

Respect CSS `page-break-before/after/inside` properties.

- **Type**: `boolean`
- **Default**: `true`

```javascript
respectCSSPageBreaks: true   // Honor CSS page breaks (recommended)
respectCSSPageBreaks: false  // Ignore CSS page breaks
```

## Callbacks

### onProgress

Called with generation progress (0-100).

- **Type**: `(progress: number) => void`
- **Default**: `undefined`

```javascript
onProgress: (progress) => {
  console.log(`Generating: ${progress}%`);
  updateProgressBar(progress);
}
```

### onComplete

Called when PDF generation completes successfully.

- **Type**: `(blob: Blob) => void`
- **Default**: `undefined`

```javascript
onComplete: (blob) => {
  console.log(`PDF ready! Size: ${blob.size} bytes`);
  toast.success('PDF generated successfully');
}
```

### onError

Called when PDF generation fails.

- **Type**: `(error: Error) => void`
- **Default**: `undefined`

```javascript
onError: (error) => {
  console.error('PDF generation failed:', error);
  toast.error('Failed to generate PDF');
}
```

## Advanced Features

### watermark

Watermark configuration.

- **Type**: `WatermarkOptions`
- **Default**: `undefined`

Add text or image watermarks to your PDFs.

```javascript
watermark: {
  text: 'CONFIDENTIAL',
  opacity: 0.3,
  position: 'diagonal',
  fontSize: 48,
  color: '#cccccc',
}
```

### headerTemplate

Header template configuration.

- **Type**: `HeaderFooterTemplate`
- **Default**: `undefined`

Configure custom headers with template variables.

```javascript
headerTemplate: {
  template: 'Page {{pageNumber}} of {{totalPages}}',
  height: 20,
  firstPage: false,
}
```

### footerTemplate

Footer template configuration.

- **Type**: `HeaderFooterTemplate`
- **Default**: `undefined`

```javascript
footerTemplate: {
  template: '{{title}} - {{date}}',
  height: 20,
}
```

### metadata

PDF document metadata.

- **Type**: `PDFMetadata`
- **Default**: `undefined`

Set document metadata including title, author, keywords, etc.

```javascript
metadata: {
  title: 'Annual Report 2025',
  author: 'John Doe',
  subject: 'Financial Report',
  keywords: ['finance', 'report', '2025'],
}
```

### emulateMediaType

Emulate print or screen media type.

- **Type**: `'screen' | 'print'`
- **Default**: `'screen'`

```javascript
emulateMediaType: 'print'  // Apply @media print styles
emulateMediaType: 'screen' // Use screen styles (default)
```

### templateOptions

Template system configuration.

- **Type**: `TemplateOptions`
- **Default**: `undefined`

Process template variables with support for loops and conditionals.

```javascript
templateOptions: {
  template: '<h1>{{title}}</h1>',
  context: { title: 'Report' },
  enableLoops: true,
  enableConditionals: true,
}
```

### fontOptions

Font handling options.

- **Type**: `FontOptions`
- **Default**: `undefined`

Configure custom fonts and web-safe fallbacks.

```javascript
fontOptions: {
  fonts: [
    {
      family: 'Roboto',
      src: '/fonts/Roboto-Regular.ttf',
      weight: 400,
    }
  ],
  useWebSafeFonts: true,
  fallbackFont: 'Arial',
}
```

### tocOptions

Table of contents configuration.

- **Type**: `TOCOptions`
- **Default**: `undefined`

Auto-generate table of contents from document headings.

```javascript
tocOptions: {
  enabled: true,
  title: 'Table of Contents',
  levels: [1, 2, 3],
  includePageNumbers: true,
}
```

### bookmarkOptions

PDF bookmarks/outline configuration.

- **Type**: `BookmarkOptions`
- **Default**: `undefined`

Create PDF outline/bookmarks for easy navigation.

```javascript
bookmarkOptions: {
  enabled: true,
  autoGenerate: true,
  levels: [1, 2, 3],
}
```

## Default Values

All options with their defaults:

```javascript
const DEFAULT_OPTIONS = {
  orientation: 'portrait',
  format: 'a4',
  margins: [10, 10, 10, 10],
  compress: true,
  scale: 2,
  imageQuality: 0.85,
  showPageNumbers: false,
  pageNumberPosition: 'footer',
  optimizeImages: false,
  convertSVG: true,
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
  preventOrphanedHeadings: true,
  respectCSSPageBreaks: true,
  emulateMediaType: 'screen',
};
```

## Examples

### Minimal Configuration

```javascript
await generatePDF(element, 'document.pdf');
```

### Standard Configuration

```javascript
await generatePDF(element, 'document.pdf', {
  format: 'a4',
  orientation: 'portrait',
  showPageNumbers: true,
  compress: true,
});
```

### High Quality Configuration

```javascript
await generatePDF(element, 'document.pdf', {
  scale: 3,
  imageQuality: 1.0,
  compress: false,
  optimizeImages: false,
});
```

### Fast Generation Configuration

```javascript
await generatePDF(element, 'document.pdf', {
  scale: 1,
  imageQuality: 0.7,
  compress: true,
  optimizeImages: true,
});
```

### Complete Configuration

```javascript
await generatePDF(element, 'document.pdf', {
  // Paper
  format: 'a4',
  orientation: 'portrait',
  margins: [15, 15, 15, 15],

  // Quality
  scale: 2,
  imageQuality: 0.85,
  compress: true,

  // Features
  showPageNumbers: true,
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
  preventOrphanedHeadings: true,

  // Images
  optimizeImages: true,
  maxImageWidth: 1200,
  convertSVG: true,

  // Callbacks
  onProgress: (p) => console.log(`${p}%`),
  onComplete: (blob) => console.log('Done!'),
  onError: (err) => console.error(err),

  // Advanced
  watermark: {
    text: 'DRAFT',
    opacity: 0.3,
  },
  metadata: {
    title: 'My Document',
    author: 'John Doe',
  },
});
```

## Next Steps

- **[PDFGenerator Class](./pdf-generator.md)** - Core class API
- **[React Hooks API](./react-hooks.md)** - React-specific API
- **[Utility Functions](./utilities.md)** - Helper functions

---

[← Back to Documentation](../index.md)
