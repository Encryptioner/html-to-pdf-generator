# PDF Bookmarks

> **🚧 NOT YET IMPLEMENTED**: This feature is documented for future implementation. The `bookmarkOptions` parameter is defined but not functional. See [FEATURE_IMPLEMENTATION_STATUS.md](../../FEATURE_IMPLEMENTATION_STATUS.md) for details.

## Overview

PDF bookmarks (also called outlines or navigation pane) provide a hierarchical navigation structure within the PDF document. They appear in the bookmarks panel of PDF readers, allowing users to quickly jump to different sections. Bookmarks can be auto-generated from headings or manually configured.

Key features:
- **Auto-Generate** - Create from document headings
- **Custom Bookmarks** - Define bookmarks manually
- **Hierarchical Structure** - Support nested bookmark levels
- **Page Linking** - Jump directly to sections
- **Default Panel** - Optionally open bookmarks on document open

## Configuration Interface

```typescript
export interface BookmarkEntry {
  /** Bookmark title */
  title: string;

  /** Target page number (1-indexed) */
  page: number;

  /** Bookmark level/depth */
  level?: number;

  /** Children bookmarks (for nested structure) */
  children?: BookmarkEntry[];

  /** Optional custom ID */
  id?: string;
}

export interface BookmarkOptions {
  /** Enable bookmarks */
  enabled?: boolean;

  /** Auto-generate from headings */
  autoGenerate?: boolean;

  /** Heading levels to include (e.g., [1, 2, 3]) */
  levels?: number[];

  /** Custom bookmark entries */
  custom?: BookmarkEntry[];

  /** Open bookmarks panel by default */
  openByDefault?: boolean;
}
```

## Basic Usage

### Auto-Generated Bookmarks

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2],
    openByDefault: true
  }
});
```

### Custom Bookmarks

```typescript
const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    custom: [
      { title: 'Executive Summary', page: 1 },
      { title: 'Financial Overview', page: 2, children: [
        { title: 'Revenue', page: 2 },
        { title: 'Expenses', page: 3 }
      ]},
      { title: 'Appendices', page: 5 }
    ],
    openByDefault: false
  }
});
```

### Combined Auto and Custom

```typescript
const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2],
    custom: [
      { title: 'Cover Page', page: 1, level: 0 },
      { title: 'Back to TOC', page: 2, level: 0 }
    ],
    openByDefault: true
  }
});
```

## Advanced Examples

### Complex Hierarchical Bookmarks

```typescript
const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    custom: [
      {
        title: 'Part I: Introduction',
        page: 1,
        level: 0,
        children: [
          { title: 'Chapter 1: Overview', page: 1, level: 1 },
          { title: 'Chapter 2: Background', page: 3, level: 1 }
        ]
      },
      {
        title: 'Part II: Main Content',
        page: 5,
        level: 0,
        children: [
          {
            title: 'Chapter 3: Analysis',
            page: 5,
            level: 1,
            children: [
              { title: '3.1 Methods', page: 5, level: 2 },
              { title: '3.2 Results', page: 7, level: 2 },
              { title: '3.3 Discussion', page: 9, level: 2 }
            ]
          },
          { title: 'Chapter 4: Conclusions', page: 10, level: 1 }
        ]
      },
      {
        title: 'References',
        page: 12,
        level: 0
      }
    ],
    openByDefault: true
  }
});
```

### Business Report Bookmarks

```typescript
const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    custom: [
      { title: 'Cover', page: 1, level: 0 },
      { title: 'Executive Summary', page: 2, level: 0 },
      {
        title: 'Financial Results',
        page: 3,
        level: 0,
        children: [
          { title: 'Revenue Analysis', page: 3, level: 1 },
          { title: 'Profit & Loss', page: 4, level: 1 },
          { title: 'Balance Sheet', page: 5, level: 1 },
          { title: 'Cash Flow', page: 6, level: 1 }
        ]
      },
      {
        title: 'Operations',
        page: 7,
        level: 0,
        children: [
          { title: 'Sales Performance', page: 7, level: 1 },
          { title: 'Marketing Metrics', page: 9, level: 1 },
          { title: 'Operational Efficiency', page: 10, level: 1 }
        ]
      },
      { title: 'Risk Assessment', page: 12, level: 0 },
      { title: 'Appendices', page: 14, level: 0 }
    ],
    openByDefault: true
  }
});
```

### Technical Documentation Bookmarks

```typescript
const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2, 3],
    custom: [
      { title: 'Quick Start', page: 1, level: 0 },
      { title: 'API Reference', page: 5, level: 0 },
      { title: 'Code Examples', page: 15, level: 0 },
      { title: 'Troubleshooting', page: 20, level: 0 },
      { title: 'Glossary', page: 25, level: 0 }
    ],
    openByDefault: true
  }
});
```

### Book Structure Bookmarks

```typescript
const result = await generator.generate(element, {
  bookmarkOptions: {
    enabled: true,
    custom: [
      { title: 'Front Matter', page: 1, level: 0, children: [
        { title: 'Title Page', page: 1, level: 1 },
        { title: 'Copyright', page: 2, level: 1 },
        { title: 'Dedication', page: 3, level: 1 },
        { title: 'Table of Contents', page: 4, level: 1 },
        { title: 'Foreword', page: 6, level: 1 }
      ]},
      { title: 'Main Text', page: 8, level: 0, children: [
        { title: 'Part 1', page: 8, level: 1, children: [
          { title: 'Chapter 1', page: 8, level: 2 },
          { title: 'Chapter 2', page: 15, level: 2 }
        ]},
        { title: 'Part 2', page: 22, level: 1, children: [
          { title: 'Chapter 3', page: 22, level: 2 },
          { title: 'Chapter 4', page: 30, level: 2 }
        ]}
      ]},
      { title: 'Back Matter', page: 38, level: 0, children: [
        { title: 'Appendix A', page: 38, level: 1 },
        { title: 'Bibliography', page: 42, level: 1 },
        { title: 'Index', page: 45, level: 1 }
      ]}
    ],
    openByDefault: true
  }
});
```

## Common Patterns

### Standard Document Bookmarks

```typescript
const standardBookmarks = {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2],
    openByDefault: false
  }
};
```

### Interactive Bookmarks

```typescript
const interactiveBookmarks = {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2, 3],
    openByDefault: true
  }
};
```

### Manual Bookmarks Only

```typescript
const manualBookmarks = {
  bookmarkOptions: {
    enabled: true,
    autoGenerate: false,
    custom: [
      { title: 'Start Here', page: 1 },
      { title: 'Main Content', page: 5 },
      { title: 'Conclusion', page: 20 }
    ],
    openByDefault: true
  }
};
```

## Tips and Best Practices

1. **Auto-Generation**: Use auto-generate for documents with proper heading structure

2. **Manual Bookmarks**: Define custom bookmarks for precise control over navigation

3. **Hierarchy Levels**: Limit nesting to 3-4 levels for clarity and usability

4. **Meaningful Titles**: Use clear, descriptive bookmark titles matching document structure

5. **Page Accuracy**: Ensure page numbers correspond to actual section positions

6. **Consistent Naming**: Maintain consistent bookmark naming conventions

7. **Opening Default**: Set `openByDefault: true` for long or complex documents

8. **TOC Coordination**: Align bookmarks with table of contents structure

9. **Navigation Flow**: Order bookmarks logically following document flow

10. **Testing**: Verify bookmarks in actual PDF readers (Adobe, Preview, Chrome)

## Comparison: Bookmarks vs. Table of Contents

| Feature | Bookmarks | TOC |
|---------|-----------|-----|
| Location | PDF viewer sidebar | Inside document |
| Auto-generation | Yes | Yes |
| Visibility | Optional panel | Always visible |
| Interaction | Click to jump | Internal navigation |
| Printing | Not printed | Printed with document |
| Best for | Long documents | Quick reference |

## See Also

- [Table of Contents](./table-of-contents.md) - Auto-generate TOC from headings
- [Headers/Footers](./headers-footers.md) - Page numbers and structure
- [Multi-Page](./multi-page.md) - Page structure and organization