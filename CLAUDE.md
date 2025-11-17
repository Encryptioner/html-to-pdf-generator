# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a framework-agnostic HTML-to-PDF generator library built for NPM distribution. It converts HTML content to multi-page PDFs with smart pagination and rich features.

**Key Technologies:** TypeScript, jsPDF, html2canvas-pro, Puppeteer (optional)

## Build and Development Commands

This project uses **pnpm** as the package manager.

```bash
# Install dependencies
pnpm install

# Build library + MCP server
pnpm run build

# Build only library
pnpm run build:lib

# Build only MCP server
pnpm run build:mcp

# Watch mode for development
pnpm run dev

# Run tests
pnpm test

# Type check
pnpm run typecheck

# Lint
pnpm run lint

# Clean build artifacts
pnpm run clean

# Prepare for publishing
pnpm run prepublishOnly
```

## Architecture

### Module Structure

**Core Library (framework-agnostic) - `src/`:**
- `src/core.ts` - PDFGenerator class, main generation logic
- `src/types.ts` - TypeScript interfaces and type definitions
- `src/utils.ts` - Helper functions (color conversion, page calculations, etc.)
- `src/image-handler.ts` - Image processing (SVG conversion, optimization, DPI control)
- `src/table-handler.ts` - Table pagination logic
- `src/page-break-handler.ts` - CSS page-break handling
- `src/helpers.ts` - Utility functions
- `src/hooks.ts` - Legacy React hooks (compatibility)

**Framework Adapters - `src/adapters/`:**
- `src/adapters/node/` - Node.js/Puppeteer server-side adapter
- `src/adapters/react/` - React hooks
- `src/adapters/vue/` - Vue 3 composables
- `src/adapters/svelte/` - Svelte stores

**MCP Server - `mcp/`:**
- Model Context Protocol server for Claude Desktop integration
- 3 tools: generate_pdf, generate_batch_pdf, generate_pdf_from_url
- Built separately with own package.json

### Build Configuration

`tsup.config.ts` creates 5 separate bundles:
- Core bundle (ESM + CJS) - framework-agnostic
- Node adapter (ESM + CJS) - server-side with Puppeteer
- React adapter (ESM + CJS)
- Vue adapter (ESM + CJS)
- Svelte adapter (ESM + CJS)

All bundles externalize dependencies (jspdf, html2canvas-pro, framework packages).

## Key Implementation Details

### Rendering Pipeline

1. **Natural Rendering**
   - Content rendered in fixed-width (794px = A4 at 96 DPI), unlimited-height container
   - Positioned offscreen to avoid viewport constraints
   - Content flows naturally without forced page breaks

2. **Full-Height Capture**
   - html2canvas-pro captures entire content height in single canvas
   - Uses `element.scrollHeight` for full height
   - Scale factor (default 2) for high-quality text

3. **Smart Page Splitting**
   - Canvas sliced at exact A4 page boundaries
   - Clean page breaks, no arbitrary content cuts

### Fixed-Width Container Strategy

All PDFs use 794px width (A4 at 96 DPI) regardless of device screen size. This ensures:
- Identical output across devices
- Consistent text wrapping and layout
- Predictable pagination

### Color Handling

Uses `html2canvas-pro` which natively supports OKLCH colors and modern CSS color functions. Fallback conversion still included for maximum compatibility.

### Image Processing

- SVG to PNG conversion
- DPI-based scaling (72/150/300 DPI)
- Format selection (JPEG/PNG/WebP)
- Transparent background handling
- Optimization and compression

### Table Handling

- Headers repeat on each page
- Rows kept together (no mid-row splits)
- Borders enforced for PDF visibility
- Column widths fixed for consistency

## Package Structure

```
package.json exports:
  "." → dist/index.js (core, framework-agnostic)
  "./node" → dist/node.js (Node.js/Puppeteer adapter)
  "./react" → dist/react.js (React adapter)
  "./vue" → dist/vue.js (Vue adapter)
  "./svelte" → dist/svelte.js (Svelte adapter)
```

**Dependencies** (bundled):
- jspdf ^2.5.2
- html2canvas-pro ^1.5.8

**Peer Dependencies** (optional):
- puppeteer (for Node.js adapter)
- react ^18.0.0 || ^19.0.0 (for React adapter)
- react-dom ^18.0.0 || ^19.0.0 (for React adapter)
- vue ^3.0.0 (for Vue adapter)
- svelte ^4.0.0 || ^5.0.0 (for Svelte adapter)

## Common Patterns

### Adding New Options

1. Add to `PDFGeneratorOptions` interface (src/types.ts)
2. Update `DEFAULT_OPTIONS` (src/utils.ts)
3. Implement in PDFGenerator class (src/core.ts)
4. Update TypeScript exports (src/index.ts)

### Creating New Framework Adapter

1. Create `src/adapters/{framework}/` directory
2. Import core PDFGenerator class from `../../core`
3. Wrap in framework-specific primitives
4. Create index.ts export file
5. Add to tsup.config.ts as new entry point
6. Update package.json exports field
7. Add framework to peerDependencies and peerDependenciesMeta

### Debugging PDF Issues

Common issues and locations:
- **Content cut off**: Check container height logic (src/core.ts)
- **Blank pages**: Check canvas slicing math (src/core.ts)
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

Typical generation times:
- 1 page: ~500ms
- 5 pages: ~2s
- 10 pages: ~4s

File size: ~400KB for typical documents (scale=2, quality=0.85)

## Dependencies

- **jsPDF** - PDF document creation
- **html2canvas-pro** - HTML to canvas rendering with OKLCH support
- **Puppeteer** (optional) - Server-side true browser rendering
- **React/Vue/Svelte** (peer deps) - Framework adapters
