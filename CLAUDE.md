# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a framework-agnostic HTML-to-PDF generator library built for NPM distribution. It converts HTML content to multi-page PDFs using a "GoFullPage" approach - capturing full content height and intelligently splitting into pages at proper boundaries.

**Key Technologies:** TypeScript, jsPDF, html2canvas

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

Automatically converts Tailwind CSS v4 OKLCH colors to RGB for PDF compatibility. Pre-defined mappings in `TAILWIND_COLOR_REPLACEMENTS` (utils.ts).

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
- **html2canvas**: HTML to canvas rendering
- **React/Vue/Svelte**: Framework adapters (peer dependencies)

Keep jspdf and html2canvas versions flexible to avoid conflicts with user projects.
