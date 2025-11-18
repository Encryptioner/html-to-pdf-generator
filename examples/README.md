# Examples - HTML to PDF Generator

This directory contains interactive demonstrations and test examples for the `@encryptioner/html-to-pdf-generator` library.

## Available Examples

### Interactive Vite Demo (Recommended)

**Directory:** `vite-demo/`

An extensible, modular browser-based demo with a tabbed interface for testing library features.

**Quick Start:**
```bash
cd examples/vite-demo
pnpm install
pnpm dev
```

Then open `http://localhost:5173` in your browser.

**Current Features:**
- 📦 **Batch PDF Generation** - Test `newPage` parameter for controlling page breaks

**Coming Soon:**
- 📄 Single PDF generation
- 📊 Table pagination
- 🖼️ Image handling
- 🎨 Color support (OKLCH)
- And more...

**Why This Demo?**
- Clean tabbed UI for testing different features
- Real-time PDF generation with result display
- Modular architecture - easy to add new features
- Proper bundling with Vite (handles dependencies)
- Comprehensive README inside vite-demo/

**📖 Full Documentation:** See [vite-demo/README.md](./vite-demo/README.md) for:
- Adding new features
- Design patterns
- Troubleshooting
- Project structure

---

## Feature: Batch PDF newPage Parameter

### Problem Statement

**Original Issue:** When generating batch PDF with domA (1 page) and domB (1 page), both were appearing on page 1 instead of separate pages, even though the total PDF page count was 2.

**Solution:** Added `newPage` parameter to `PDFContentItem` interface to control page break behavior using physical spacing.

## Test Scenarios

### Scenario 1: newPage = true (FIXES THE ISSUE ✅)

```typescript
const items = [
  {
    content: domA,
    pageCount: 1,
    newPage: true,  // domA on page 1
  },
  {
    content: domB,
    pageCount: 1,
    newPage: true,  // domB on page 2
  }
];

await generateBatchPDF(items, 'separate-pages.pdf');
```

**Expected Result:** DOM A on page 1, DOM B on page 2 (total 2 pages)

**This solves the original issue!**

### Scenario 2: newPage = false (Allow Sharing)

```typescript
const items = [
  {
    content: domA,
    pageCount: 1,
    newPage: false,  // Can share page
  },
  {
    content: domB,
    pageCount: 1,
    newPage: false,  // Can share page
  }
];

await generateBatchPDF(items, 'shared-page.pdf');
```

**Expected Result:** Both DOM A and DOM B on page 1 if they fit (total 1 page)

### Scenario 3: newPage = undefined (Default)

```typescript
const items = [
  {
    content: domA,
    pageCount: 1,
    // newPage not specified
  },
  {
    content: domB,
    pageCount: 1,
    // newPage not specified
  }
];

await generateBatchPDF(items, 'default.pdf');
```

**Expected Result:** Default behavior (page break after each item)

### Scenario 4: Mixed Values

```typescript
const items = [
  { content: coverPage, pageCount: 1, newPage: true },      // Cover on page 1
  { content: header, pageCount: 1, newPage: false },         // Can share with content
  { content: content, pageCount: 1, newPage: false },        // Can share with header
  { content: chapter2, pageCount: 1, newPage: true },        // Chapter 2 on new page
];

await generateBatchPDF(items, 'mixed.pdf');
```

**Expected Result:** Flexible page break control for complex documents

## Implementation Details

### Type Definition (src/types.ts)

```typescript
export interface PDFContentItem {
  content: HTMLElement | string;
  pageCount: number;
  title?: string;
  /**
   * Force this item to start on a new page
   * - true: Item starts on a new page (adds page break before)
   * - false: Item can share page with previous content (no forced page break)
   * - undefined: Default behavior (adds page break after each item)
   */
  newPage?: boolean;
}
```

### Core Logic (src/core.ts, lines 674-686)

```typescript
// Handle page breaks based on newPage parameter
if (item.newPage === true && i > 0) {
  // Force this item to start on a new page (add page break before)
  element.style.pageBreakBefore = 'always';
} else if (item.newPage === false) {
  // Allow item to share page with previous content (no forced page break)
  // Don't add any page break
} else if (item.newPage === undefined) {
  // Default behavior: add page break after each item (except the last one)
  if (i < items.length - 1) {
    element.style.pageBreakAfter = 'always';
  }
}
```

## Usage in Different Contexts

### Vanilla JavaScript/TypeScript

```typescript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  { content: domA, pageCount: 1, newPage: true },
  { content: domB, pageCount: 1, newPage: true },
];

const result = await generateBatchPDF(items, 'output.pdf');
console.log(`Generated ${result.totalPages} pages`);
```

### React

```tsx
import { useBatchPDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { generateBatchPDF, isGenerating } = useBatchPDFGenerator();

  const handleGenerate = async () => {
    const items = [
      { content: domA, pageCount: 1, newPage: true },
      { content: domB, pageCount: 1, newPage: true },
    ];
    await generateBatchPDF(items, 'output.pdf');
  };

  return <button onClick={handleGenerate}>Generate PDF</button>;
}
```

### MCP Server (Claude Desktop)

```json
{
  "tool": "generate_batch_pdf",
  "arguments": {
    "items": [
      {
        "html": "<h1>DOM A</h1><p>Content...</p>",
        "pageCount": 1,
        "title": "DOM A",
        "newPage": true
      },
      {
        "html": "<h1>DOM B</h1><p>Content...</p>",
        "pageCount": 1,
        "title": "DOM B",
        "newPage": true
      }
    ],
    "outputPath": "/tmp/output.pdf"
  }
}
```

## Verification

To verify the implementation works correctly:

1. **Run the browser demo:**
   ```bash
   cd examples/vite-demo
   pnpm install
   pnpm dev
   ```
   Then open the shown URL and test all three scenarios.

2. **Check the generated PDFs:**
   - With `newPage: true`, verify DOM A and DOM B are on separate pages
   - With `newPage: false`, verify they can share a page if they fit
   - Check page numbers in the PDF viewer

## Related Documentation

- [Batch PDF Generation Guide](../documentation/advanced/batch-generation.md)
- [MCP Server README](../mcp/README.md)
- [Main README](../README.md)

## Implementation Status

✅ All implementations complete:
- Types updated (`src/types.ts`)
- Core logic updated (`src/core.ts`)
- Documentation updated (`documentation/advanced/batch-generation.md`)
- MCP server updated (`mcp/src/index.ts`, `mcp/README.md`)
- All builds passing
- All type checks passing
- Changes committed and pushed
