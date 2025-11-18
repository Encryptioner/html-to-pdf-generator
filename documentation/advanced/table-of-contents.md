# Table of Contents

## Overview

Automatically generate a table of contents (TOC) from your document's headings. This feature scans the HTML content for heading elements (h1-h6) and creates a navigable TOC with clickable links to sections. Perfect for long documents, manuals, reports, and books.

Key features:
- **Auto-Generate** - Extract headings automatically
- **Configurable Levels** - Include specific heading levels
- **Positioning** - Place TOC at start or end of document
- **Page Numbers** - Show page numbers for each entry
- **Nested Structure** - Support hierarchical heading levels
- **Internal Links** - Navigate directly to sections

## Configuration Interface

```typescript
export interface TOCEntry {
  /** Entry title */
  title: string;

  /** Entry level (1, 2, 3 for h1, h2, h3) */
  level: number;

  /** Page number */
  page: number;

  /** Optional custom ID */
  id?: string;

  /** Children entries (for nested TOC) */
  children?: TOCEntry[];
}

export interface TOCOptions {
  /** Generate TOC */
  enabled?: boolean;

  /** TOC title */
  title?: string;

  /** Heading levels to include (e.g., [1, 2, 3]) */
  levels?: number[];

  /** Position of TOC */
  position?: 'start' | 'end';

  /** Include page numbers */
  includePageNumbers?: boolean;

  /** Custom CSS for TOC */
  css?: string;

  /** Enable links to sections */
  enableLinks?: boolean;

  /** Indentation per level in mm */
  indentPerLevel?: number;
}
```

## Basic Usage

### Simple TOC at Start

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    position: 'start',
    includePageNumbers: true,
    levels: [1, 2]
  }
});
```

### TOC with Custom Styling

```typescript
const result = await generator.generate(element, {
  tocOptions: {
    enabled: true,
    title: 'Contents',
    position: 'start',
    levels: [1, 2, 3],
    includePageNumbers: true,
    enableLinks: true,
    css: `
      .toc {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 5px;
      }
      .toc-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
      }
      .toc-entry {
        margin-bottom: 8px;
      }
      .toc-level-1 {
        font-weight: bold;
        font-size: 13px;
      }
      .toc-level-2 {
        margin-left: 15px;
        font-size: 12px;
      }
      .toc-level-3 {
        margin-left: 30px;
        font-size: 11px;
        color: #666;
      }
    `
  }
});
```

### TOC at End (Appendix)

```typescript
const result = await generator.generate(element, {
  tocOptions: {
    enabled: true,
    title: 'Index',
    position: 'end',
    levels: [1, 2],
    includePageNumbers: true
  }
});
```

## Advanced Examples

### Multi-Level TOC

```typescript
const result = await generator.generate(element, {
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    position: 'start',
    levels: [1, 2, 3],
    indentPerLevel: 8,
    includePageNumbers: true,
    enableLinks: true,
    css: `
      .toc {
        padding: 20px;
        line-height: 1.8;
      }
      .toc-title {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
        border-bottom: 2px solid #333;
        padding-bottom: 10px;
      }
      .toc-entry {
        display: flex;
        justify-content: space-between;
      }
      .toc-entry-title {
        flex: 1;
      }
      .toc-entry-page {
        text-align: right;
        min-width: 40px;
        padding-left: 10px;
      }
      .toc-level-1 {
        font-weight: bold;
        font-size: 13px;
        margin-top: 8px;
      }
      .toc-level-2 {
        font-size: 12px;
        margin-left: 15px;
      }
      .toc-level-3 {
        font-size: 11px;
        margin-left: 30px;
        color: #666;
      }
    `
  }
});
```

### Professional Book TOC

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Complete Manual - Version 2024'
  },
  tocOptions: {
    enabled: true,
    title: 'Contents',
    position: 'start',
    levels: [1, 2],
    indentPerLevel: 10,
    includePageNumbers: true,
    enableLinks: true,
    css: `
      .toc {
        font-family: 'Georgia', serif;
        padding: 30px;
        page-break-after: always;
      }
      .toc-title {
        text-align: center;
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 30px;
        color: #1a1a1a;
      }
      .toc-entry {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 10px;
      }
      .toc-entry-title {
        flex: 1;
        text-transform: capitalize;
      }
      .toc-dots {
        flex: 0;
        margin: 0 8px;
        border-bottom: 1px dotted #999;
      }
      .toc-entry-page {
        flex: 0;
        font-weight: bold;
      }
      .toc-level-1 {
        font-size: 14px;
        font-weight: bold;
        margin-top: 12px;
      }
      .toc-level-2 {
        font-size: 12px;
        margin-left: 20px;
        color: #444;
      }
    `
  }
});
```

### Technical Documentation TOC

```typescript
const result = await generator.generate(element, {
  tocOptions: {
    enabled: true,
    title: 'Quick Reference',
    position: 'start',
    levels: [1, 2, 3],
    indentPerLevel: 6,
    includePageNumbers: true,
    enableLinks: true,
    css: `
      .toc {
        background: linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%);
        padding: 25px;
        border-left: 4px solid #0066cc;
        font-family: 'Courier New', monospace;
      }
      .toc-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #0066cc;
      }
      .toc-entry {
        font-size: 10px;
      }
      .toc-level-1 {
        font-weight: bold;
        margin-top: 8px;
        color: #000;
      }
      .toc-level-2 {
        margin-left: 12px;
        color: #333;
      }
      .toc-level-3 {
        margin-left: 24px;
        color: #666;
      }
    `
  }
});
```

## Common Patterns

### Standard TOC

```typescript
const standardTOC = {
  tocOptions: {
    enabled: true,
    title: 'Contents',
    position: 'start',
    levels: [1, 2],
    includePageNumbers: true,
    enableLinks: true
  }
};
```

### Minimal TOC

```typescript
const minimalTOC = {
  tocOptions: {
    enabled: true,
    title: 'TOC',
    position: 'end',
    levels: [1],
    includePageNumbers: false,
    enableLinks: false
  }
};
```

### Comprehensive TOC

```typescript
const comprehensiveTOC = {
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    position: 'start',
    levels: [1, 2, 3],
    indentPerLevel: 10,
    includePageNumbers: true,
    enableLinks: true
  }
};
```

## Document Structure Example

For the TOC to work effectively, structure your HTML with proper heading hierarchy:

```html
<h1>Chapter 1: Introduction</h1>
<p>Introduction content...</p>

<h2>1.1 Background</h2>
<p>Background content...</p>

<h2>1.2 Objectives</h2>
<p>Objectives content...</p>

<h1>Chapter 2: Methods</h1>
<p>Methods content...</p>

<h2>2.1 Approach</h2>
<h3>2.1.1 Phase One</h3>
<p>Phase one details...</p>

<h3>2.1.2 Phase Two</h3>
<p>Phase two details...</p>
```

## Tips and Best Practices

1. **Heading Hierarchy**: Maintain proper H1 > H2 > H3 structure for clean TOC

2. **Level Selection**: Include only levels you need (typically 1-2 for reports, 1-3 for books)

3. **Positioning**: Place TOC at start for quick navigation, at end for reference

4. **Page Numbers**: Always include page numbers for practical document navigation

5. **Link Enablement**: Enable links for interactive PDFs, disable for printing

6. **Styling**: Keep TOC styling subtle to avoid overwhelming the document

7. **Indentation**: Use consistent indentation per level (6-10mm recommended)

8. **Title Uniqueness**: Ensure heading text is unique for better TOC clarity

9. **Long Documents**: Consider using position 'start' for documents over 20 pages

10. **Testing**: Always verify TOC accuracy after document generation

## See Also

- [Bookmarks](./bookmarks.md) - Create PDF bookmarks for navigation
- [Headers/Footers](./headers-footers.md) - Add page numbers
- [Templates](./templates.md) - Custom content generation