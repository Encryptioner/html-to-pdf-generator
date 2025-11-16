# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a framework-agnostic HTML-to-PDF generator library built for NPM distribution. It converts HTML content to multi-page PDFs using a "GoFullPage" approach - capturing full content height and intelligently splitting into pages at proper boundaries.

**Key Technologies:** TypeScript, jsPDF, html2canvas-pro

## Build and Development Commands

This project uses **pnpm** as the package manager for development.

```bash
# Install dependencies
pnpm install

# Build the library (creates dist/ folder with ESM/CJS bundles)
pnpm run build

# Watch mode for development
pnpm run dev

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Type check without emitting files
pnpm run typecheck

# Lint TypeScript files
pnpm run lint

# Clean build artifacts
pnpm run clean

# Prepare for publishing (clean, build, typecheck)
pnpm run prepublishOnly
```

## Architecture

### Core Rendering Pipeline (GoFullPage Approach)

The library uses a 3-step process similar to browser screenshot extensions:

1. **Natural Rendering** (core.ts:145-220)
   - Content rendered in fixed-width (794px = A4 at 96 DPI), unlimited-height container
   - Positioned offscreen (-9999px) to avoid viewport constraints
   - Allows content to flow naturally without forcing page breaks

2. **Full-Height Capture** (core.ts:226-247)
   - html2canvas captures ENTIRE content height in single canvas
   - No viewport limits - uses `element.scrollHeight` for full height
   - Scale factor (default 2) ensures high-quality text rendering

3. **Smart Page Splitting** (core.ts:253-365)
   - Canvas sliced at exact A4 page boundaries (not arbitrary content cuts)
   - Each page gets precise pixel height from canvas
   - Result: clean page breaks, no blank spaces, consistent formatting

### Module Structure

**Core Library (framework-agnostic) - `src/`:**
- `src/core.ts` - PDFGenerator class, main generation logic, batch PDF generation with auto-scaling
- `src/types.ts` - TypeScript interfaces and type definitions (includes PDFContentItem and BatchPDFGenerationResult)
- `src/utils.ts` - Helper functions (color conversion, page calculations, filename sanitization)
- `src/image-handler.ts` - SVG conversion, image optimization, background image processing
- `src/table-handler.ts` - Table pagination, header repetition, row splitting prevention
- `src/page-break-handler.ts` - CSS page-break properties, orphan prevention

**Framework Adapters - `src/adapters/`:**
- `src/adapters/react/usePDFGenerator.ts` - React hooks (ref-based, manual, and batch generation)
- `src/adapters/react/index.ts` - React adapter entry point
- `src/adapters/vue/usePDFGenerator.ts` - Vue 3 composable
- `src/adapters/vue/index.ts` - Vue adapter entry point
- `src/adapters/svelte/pdfGenerator.ts` - Svelte stores
- `src/adapters/svelte/index.ts` - Svelte adapter entry point

**Entry Points:**
- `src/index.ts` - Main core exports (framework-agnostic)
- `src/hooks.ts` - React hooks (compatibility, prefer adapters/react/)

### Build Configuration

`tsup.config.ts` creates separate bundles:
- Core bundle (ESM + CJS)
- React adapter (ESM + CJS)
- Vue adapter (ESM + CJS)
- Svelte adapter (ESM + CJS)

All bundles externalize dependencies (jspdf, html2canvas, framework packages).

## Key Implementation Details

### Fixed-Width Container Strategy

All PDFs use 794px width (A4 at 96 DPI) regardless of device screen size. This ensures:
- Identical output on iPhone, tablet, desktop, 4K monitor
- Consistent text wrapping and layout
- Predictable pagination

### Page Dimensions

```typescript
PAPER_FORMATS = {
  a4: { width: 210, height: 297 },      // mm
  letter: { width: 215.9, height: 279.4 },
  a3: { width: 297, height: 420 },
  legal: { width: 215.9, height: 355.6 }
}
```

Default margins: [10, 10, 10, 10] mm (top, right, bottom, left)

### Color Handling

**html2canvas-pro Integration (v4.1.1):**

The library now uses `html2canvas-pro` which natively supports OKLCH colors and modern CSS color functions. This eliminates the need for color conversion workarounds.

**OKLCH to RGB Fallback Conversion (v4.1.0):**

Comprehensive OKLCH to RGB conversion is still included as a fallback to ensure maximum compatibility.

**Implementation (utils.ts:411-586):**

1. **OKLCH Parsing** - Supports all OKLCH formats:
   - Basic: `oklch(L C H)`
   - With alpha: `oklch(L C H / alpha)`
   - Percentages: `oklch(L% C% H%)`
   - Angle units: deg, rad, grad, turn

2. **Color Space Conversion Pipeline**:
   - OKLCH → OKLab (cylindrical to rectangular)
   - OKLab → Linear RGB (via transformation matrix)
   - Linear RGB → sRGB (gamma correction)
   - sRGB → 0-255 range (clamping)

3. **Processing Functions**:
   - `oklchToRgb(oklchString)` - Convert single OKLCH color
   - `convertOklchToRgbInCSS(css)` - Convert all OKLCH in CSS text
   - `convertOklchInElement(element)` - Process inline styles recursively
   - `convertOklchInStylesheets(element)` - Process <style> tags

4. **Integration (core.ts:221-246)**:
   - Custom CSS converted before style injection
   - Clone's stylesheets processed
   - Clone's inline styles processed
   - Page-level stylesheets converted with temp markers
   - Cleanup removes temporary converted styles

**Tailwind CSS v4 Compatibility:**
Pre-defined color mappings in `TAILWIND_COLOR_REPLACEMENTS` (utils.ts) for common Tailwind colors, plus automatic OKLCH conversion for any custom colors.

### Image Processing

Before PDF generation (core.ts:188-196):
1. SVG elements converted to PNG images
2. Images optimized/compressed if enabled
3. Background images extracted and processed
4. All images preloaded to ensure rendering

### Table Handling

Tables automatically enhanced (core.ts:199-207):
- Headers repeat on each page
- Rows kept together (no mid-row splits)
- Borders enforced for better PDF visibility
- Column widths fixed for consistency

### Batch PDF Generation

The library supports generating PDFs from multiple content items with automatic scaling (core.ts:588-989):

**Key Features:**
- Accept array of content items (HTML elements or strings)
- Each item specifies desired page count
- Content automatically scaled to fit within specified pages
- All items combined into single PDF file
- Progress tracking for batch operations

**Auto-Scaling Behavior:**
- Content rendered at natural size first
- Scale factor calculated: `targetPages / naturalPages`
- Content scaled up/down to fit exactly into target page count
- Maintains aspect ratio and quality

**Usage Pattern:**
```typescript
const items = [
  { content: htmlElement, pageCount: 2 },      // Scale to fit 2 pages
  { content: '<div>...</div>', pageCount: 1 }, // Scale to fit 1 page
];
await generateBatchPDF(items, 'report.pdf');
```

**Result Structure:**
- Returns `BatchPDFGenerationResult` with overall stats
- Includes per-item tracking (startPage, endPage, actual pageCount)
- Total file size and generation time

**Framework Integration:**
- React: `useBatchPDFGenerator()` hook (src/adapters/react/)
- Vue/Svelte: Use core functions directly

### Phase 1 Features (Implemented in v4.0.0)

#### Watermark Support

Add text or image watermarks to PDF pages (core.ts:408-490):

**Text Watermarks:**
```typescript
{
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal', // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    fontSize: 48,
    color: '#cccccc',
    rotation: 45,
    allPages: true
  }
}
```

**Image Watermarks:**
```typescript
{
  watermark: {
    image: 'data:image/png;base64,...',
    opacity: 0.3,
    position: 'center',
    allPages: true
  }
}
```

#### Header/Footer Templates

Dynamic headers and footers with template variables (core.ts:495-553):

```typescript
{
  headerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}} | {{date}}',
    height: 20,
    firstPage: false // Skip on first page
  },
  footerTemplate: {
    template: '{{title}} - Confidential',
    height: 20,
    firstPage: true
  }
}
```

**Supported variables:**
- `{{pageNumber}}` - Current page number
- `{{totalPages}}` - Total page count
- `{{date}}` - Formatted date
- `{{title}}` - Document title from metadata

#### PDF Metadata

Set document properties (core.ts:558-577):

```typescript
{
  metadata: {
    title: 'Annual Report 2025',
    author: 'John Doe',
    subject: 'Financial Report',
    keywords: ['finance', 'report', '2025'],
    creator: 'My Application',
    creationDate: new Date()
  }
}
```

#### Print Media CSS Emulation

Apply @media print styles (core.ts:183-214):

```typescript
{
  emulateMediaType: 'print' // 'screen' (default) or 'print'
}
```

When set to 'print', the library extracts and applies CSS rules from `@media print` blocks, ensuring print-specific styles are used in the generated PDF.

### Phase 2 Features (Implemented in v4.0.0)

#### Template Variable System

Advanced template processing with variables, loops, and conditionals (utils.ts:479-534):

**Features:**
- Simple variable replacement: `{{variable}}`
- Loop support: `{{#each items}}{{name}}{{/each}}`
- Conditional support: `{{#if condition}}text{{/if}}`
- Nested object access
- Array iteration with context
- Boolean conditionals

**Usage:**
```typescript
import { processTemplateWithContext } from './utils';

const template = `
  <h1>{{title}}</h1>
  {{#each items}}
    <p>{{name}}: {{price}}</p>
  {{/each}}
  {{#if showFooter}}
    <footer>Thank you!</footer>
  {{/if}}
`;

const html = processTemplateWithContext(template, {
  title: 'Invoice',
  items: [{ name: 'Item 1', price: '$10' }],
  showFooter: true
}, {
  enableLoops: true,
  enableConditionals: true
});
```

**Implementation:**
- Regex-based variable substitution
- Loop processing with array context
- Conditional evaluation with boolean checks
- Nested property access for objects

#### Font Handling Improvements

Better font management with web-safe replacements and custom font embedding (utils.ts:737-785):

**Features:**
- Web-safe font map with 14 pre-defined fonts
- Automatic font family detection and replacement
- @font-face CSS generation for custom fonts
- Support for TrueType, OpenType, WOFF, WOFF2
- Fallback font configuration
- Font weight and style control

**Supported Fonts:**
- Arial, Helvetica, Times New Roman, Times, Courier New, Courier
- Verdana, Georgia, Palatino, Garamond
- Comic Sans MS, Trebuchet MS, Arial Black, Impact

**Usage:**
```typescript
{
  fontOptions: {
    fonts: [
      {
        family: 'Roboto',
        src: '/fonts/Roboto-Regular.ttf',
        weight: 400,
        style: 'normal'
      }
    ],
    embedFonts: true,
    fallbackFont: 'Arial',
    useWebSafeFonts: true
  }
}
```

**Utility Functions:**
- `replaceWithWebSafeFonts(css)` - Replace custom fonts with web-safe alternatives
- `generateFontFaceCSS(fonts)` - Generate @font-face rules for custom fonts

#### Table of Contents Generation

Auto-generate TOC from document headings (utils.ts:536-695):

**Features:**
- Extract h1, h2, h3 (or custom levels) from HTML
- Build hierarchical TOC structure with parent-child relationships
- Generate HTML with indentation and page numbers
- Default CSS styling with dotted lines
- Configurable indent per level
- Optional clickable links to sections
- Automatic heading ID generation

**Usage:**
```typescript
{
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    levels: [1, 2, 3],
    position: 'start', // or 'end'
    includePageNumbers: true,
    indentPerLevel: 10,
    enableLinks: true
  }
}
```

**Utility Functions:**
- `extractHeadings(element, levels)` - Extract headings from HTML
- `buildTOCHierarchy(headings)` - Build nested TOC structure
- `generateTOCHTML(entries, options)` - Generate TOC HTML
- `generateTOCCSS()` - Generate default TOC styling

**Implementation:**
1. Parse document for h1, h2, h3 elements
2. Generate IDs for headings if not present
3. Track page numbers during PDF generation
4. Build hierarchical structure using stack-based algorithm
5. Render HTML with indentation based on level
6. Apply default CSS or custom styling
7. Insert at start or end of document

#### Bookmarks/Outline Support

Create PDF outline for easy navigation (utils.ts:697-732):

**Features:**
- Auto-generate from document headings
- Custom bookmark entries
- Hierarchical structure with children
- Page targeting with 1-indexed pages
- Level control (matches heading levels)
- Open by default option

**Usage:**
```typescript
{
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2, 3],
    custom: [
      { title: 'Chapter 1', page: 1, level: 1 },
      { title: 'Section 1.1', page: 3, level: 2 }
    ],
    openByDefault: true
  }
}
```

**Utility Functions:**
- `buildBookmarkHierarchy(headings)` - Build nested bookmark structure
- Uses same hierarchy algorithm as TOC

**Implementation:**
1. Extract headings from document
2. Build hierarchical bookmark tree
3. Merge with custom bookmarks if provided
4. Create PDF outline entries with page targets
5. Set outline visibility (open by default)

**Note:** Full bookmark implementation in core.ts requires jsPDF outline API integration (Phase 3 enhancement).

### Phase 3 Features (Implemented in v5.0.0)

#### PDF Security/Encryption

Configure PDF security settings for password protection and permissions (core.ts:700-749):

**Features:**
- User password (required to open PDF)
- Owner password (required to modify permissions)
- Granular permission controls
- 128-bit or 256-bit encryption strength
- Settings stored for post-processing

**Permissions:**
- Printing (none, low resolution, high resolution)
- Modifying document
- Copying text and graphics
- Adding annotations
- Filling forms
- Content accessibility
- Document assembly

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
      copying: false,
      annotating: true,
      fillingForms: true,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 256
  }
}
```

**Implementation:**
- Security settings stored in PDF metadata via `applyPDFSecurity()`
- Actual encryption requires external tools (pdf-lib, PyPDF2, Adobe SDK)
- Settings available in `pdf.__securityOptions` for post-processing

**Note:** Browser-based jsPDF doesn't support native encryption. For production use, apply encryption server-side.

#### Async Processing with Webhooks

Background PDF generation with webhook notifications (core.ts:111-189):

**Features:**
- Non-blocking PDF generation
- Webhook notifications on completion/failure
- Job ID tracking
- Custom webhook headers
- Progress URL callbacks

**Usage:**
```typescript
const generator = new PDFGenerator({
  asyncOptions: {
    enabled: true,
    webhookUrl: 'https://api.example.com/pdf-ready',
    webhookHeaders: {
      'Authorization': 'Bearer token',
      'X-Custom-Header': 'value'
    },
    jobId: 'custom-job-id',  // Optional
    progressUrl: 'https://api.example.com/progress'
  }
});

const { jobId, status } = await generator.generatePDFAsync(element, 'report.pdf');
console.log(`Job ${jobId} started with status: ${status}`);
```

**Webhook Payload (Success):**
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

**Webhook Payload (Error):**
```json
{
  "jobId": "pdf-1234567890-abc",
  "status": "failed",
  "error": "Failed to load images",
  "timestamp": "2025-11-16T12:34:56.789Z"
}
```

**Methods:**
- `generatePDFAsync(element, filename)` - Start async generation
- `generateJobId()` - Generate unique job ID
- `sendWebhook(url, data)` - Send webhook notification

#### Real-time Preview Component

Live PDF preview for React applications (src/adapters/react/PDFPreview.tsx):

**Features:**
- Real-time PDF preview updates
- Debounced re-generation
- Quality and scale controls
- Loading and error states
- Memory-efficient blob URL management

**Usage (Component):**
```typescript
import { PDFPreview } from 'html-to-pdf-generator/react';

function App() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={contentRef}>
        <h1>My Document</h1>
        <p>Content goes here</p>
      </div>

      <PDFPreview
        content={contentRef.current}
        debounce={500}
        quality={0.7}
        scale={1.5}
        className="preview-container"
        style={{ width: '600px', height: '800px' }}
        loadingPlaceholder={<div>Generating preview...</div>}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}
```

**Usage (Hook):**
```typescript
import { usePDFPreview } from 'html-to-pdf-generator/react';

function App() {
  const { generatePreview, isGenerating, error, previewUrl, clearPreview } = usePDFPreview({
    format: 'a4',
    margins: [10, 10, 10, 10]
  });

  const handlePreview = async () => {
    const element = document.getElementById('content');
    const url = await generatePreview(element);
    console.log('Preview URL:', url);
  };

  return (
    <div>
      <button onClick={handlePreview} disabled={isGenerating}>
        Generate Preview
      </button>
      {previewUrl && <iframe src={previewUrl} />}
      {error && <div>Error: {error.message}</div>}
    </div>
  );
}
```

**Props:**
- `content` - HTML element or string to preview
- `options` - PDF generator options
- `debounce` - Debounce delay (default: 500ms)
- `quality` - Preview quality 0.1-1.0 (default: 0.7)
- `scale` - Scale factor (default: 1)
- `className` / `style` - Container styling
- `loadingPlaceholder` - Custom loading UI
- `onError` - Error handler

**Implementation:**
- Uses PDFGenerator.generateBlob() for preview
- Manages blob URL lifecycle
- Debounced updates for performance
- Automatic cleanup on unmount

#### URL to PDF Conversion

Client-side URL to PDF conversion with limitations (core.ts:191-308):

**Features:**
- Convert any URL to PDF
- Wait for specific selectors
- Inject custom CSS/JS
- Timeout configuration
- CORS-aware

**Usage:**
```typescript
const generator = new PDFGenerator();

await generator.generatePDFFromURL(
  'https://example.com/page',
  'webpage.pdf',
  {
    waitForSelector: '.content-loaded',
    timeout: 10000,
    injectCSS: `
      .no-print { display: none; }
      body { font-size: 14px; }
    `,
    injectJS: `
      console.log('Injected script running');
    `
  }
);
```

**Options:**
- `waitForSelector` - CSS selector to wait for before capture
- `timeout` - Maximum wait time in milliseconds (default: 10000)
- `injectCSS` - Custom CSS to inject into page
- `injectJS` - Custom JavaScript to execute

**Limitations:**
- **CORS restrictions** - Only works with same-origin or CORS-enabled URLs
- **No dynamic loading** - Cannot wait for network requests
- **Limited control** - Cannot handle complex page states

**Production Recommendation:**
For production URL-to-PDF, use server-side solutions:
- **Puppeteer** - Full Chrome automation
- **Playwright** - Cross-browser support
- **wkhtmltopdf** - Lightweight CLI tool
- **Cloud services** - PDFShift, CloudConvert, etc.

**Client-side Use Cases:**
- Same-origin pages only
- Simple static content
- Development/testing
- Preview generation

## Package Structure for NPM

```
package.json exports:
  "." → dist/index.js (core, framework-agnostic)
  "./react" → dist/react.js (React adapter)
  "./vue" → dist/vue.js (Vue adapter)
  "./svelte" → dist/svelte.js (Svelte adapter)
```

**Dependencies:**
- jspdf ^2.5.2 (bundled with package)
- html2canvas ^1.4.1 (bundled with package)

**Peer Dependencies (optional):**
- react ^18.0.0 || ^19.0.0 (only needed for React adapter)
- react-dom ^18.0.0 || ^19.0.0 (only needed for React adapter)
- vue ^3.0.0 (only needed for Vue adapter)
- svelte ^4.0.0 || ^5.0.0 (only needed for Svelte adapter)

This approach prevents version conflicts - jspdf and html2canvas are bundled, while framework dependencies are optional peer deps.

## Common Patterns

### Adding New Options

1. Add to `PDFGeneratorOptions` interface (src/types.ts)
2. Update `DEFAULT_OPTIONS` (src/utils.ts)
3. Implement in PDFGenerator class (src/core.ts)
4. Update TypeScript exports (src/index.ts)

### Creating New Framework Adapter

1. Create `src/adapters/{framework}/` directory
2. Import core PDFGenerator class from `../../core`
3. Wrap in framework-specific primitives (hooks/composables/stores)
4. Create index.ts export file
5. Add to tsup.config.ts as new entry point
6. Update package.json exports field
7. Add framework to peerDependencies and peerDependenciesMeta

### Debugging PDF Issues

Common issues and locations:
- **Content cut off**: Check container height logic (src/core.ts:145-172)
- **Blank pages**: Check canvas slicing math (src/core.ts:298-362)
- **Images missing**: Check image processing (src/image-handler.ts)
- **Table breaks mid-row**: Check table handling (src/table-handler.ts)

## Testing Approach

When making changes:
1. Test with short content (< 1 page)
2. Test with medium content (2-3 pages)
3. Test with long content (10+ pages)
4. Verify on different devices/browsers
5. Check file size remains reasonable

## Performance Characteristics

Typical generation time for 10-item document:
- Render: ~500ms
- Capture: ~1000ms
- PDF generation: ~300ms
- **Total: ~1.8 seconds**

File size: ~400KB for typical documents (scale=2, quality=0.85)

## Dependencies

- **jsPDF**: PDF document creation
- **html2canvas-pro**: HTML to canvas rendering with native OKLCH support
- **React/Vue/Svelte**: Framework adapters (peer dependencies)

Note: As of v4.1.1, we use `html2canvas-pro` instead of `html2canvas` for better CSS compatibility and native OKLCH color support.
