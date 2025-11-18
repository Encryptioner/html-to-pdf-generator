# Headers & Footers

## Overview

Add professional headers and footers to your PDF documents with dynamic template support. Headers and footers provide essential information like page numbers, dates, and document titles, creating a polished, document-like appearance.

Key features:
- **Template Variables** - `{{pageNumber}}`, `{{totalPages}}`, `{{date}}`, `{{title}}`
- **Custom HTML/CSS** - Full styling and layout control
- **First Page Control** - Optionally disable headers/footers on first page
- **Dynamic Height** - Adjustable in millimeters
- **Per-Page Updates** - Automatically updated for each page

## Configuration Interface

```typescript
export interface HeaderFooterTemplate {
  /** Template HTML string with variables: {{pageNumber}}, {{totalPages}}, {{date}}, {{title}} */
  template?: string;

  /** Height in mm */
  height?: number;

  /** Custom CSS for header/footer */
  css?: string;

  /** Enable on first page */
  firstPage?: boolean;
}
```

## Basic Usage

### Simple Page Numbers Footer

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  footerTemplate: {
    template: '<div style="text-align: center;">Page {{pageNumber}} of {{totalPages}}</div>',
    height: 15,
    firstPage: false // Skip on first page
  }
});
```

### Header with Title and Date

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Annual Report 2024'
  },
  headerTemplate: {
    template: `
      <div style="display: flex; justify-content: space-between; padding: 10px 0;">
        <span>{{title}}</span>
        <span>{{date}}</span>
      </div>
    `,
    height: 15,
    css: 'font-size: 11px; border-bottom: 1px solid #cccccc; color: #666666;'
  }
});
```

### Both Header and Footer

```typescript
const result = await generator.generate(element, {
  metadata: { title: 'Financial Report' },
  headerTemplate: {
    template: '<div style="text-align: center; font-weight: bold;">{{title}}</div>',
    height: 12,
    firstPage: true,
    css: 'border-bottom: 2px solid #333;'
  },
  footerTemplate: {
    template: '<div style="text-align: center; font-size: 10px;">Page {{pageNumber}}</div>',
    height: 10,
    firstPage: false,
    css: 'color: #999999; border-top: 1px solid #dddddd;'
  }
});
```

## Advanced Examples

### Professional Business Header

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Q4 2024 Business Report',
    author: 'Finance Department'
  },
  headerTemplate: {
    template: `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h3 style="margin: 0;">{{title}}</h3>
          <p style="margin: 0; font-size: 9px; color: #999;">Generated: {{date}}</p>
        </div>
        <div style="text-align: right; font-size: 9px; color: #999;">
          Confidential
        </div>
      </div>
    `,
    height: 20,
    css: `
      border-bottom: 2px solid #0066cc;
      padding-bottom: 10px;
      font-family: 'Segoe UI', sans-serif;
    `
  }
});
```

### Alternating Headers/Footers

```typescript
function generateDocWithAlternatingLayout(element: HTMLElement) {
  const result = await generator.generate(element, {
    metadata: { title: 'Technical Documentation' },
    headerTemplate: {
      // Left pages show document title, right pages show section
      template: '<span>{{title}}</span>',
      height: 12,
      css: 'text-align: left; font-size: 10px; padding: 5px 0;'
    },
    footerTemplate: {
      // All pages show page number
      template: '<span style="float: right;">{{pageNumber}}</span>',
      height: 10,
      css: 'font-size: 9px; color: #666666;'
    }
  });

  return result;
}
```

### Multi-Part Document with Section Headers

```typescript
const result = await generator.generate(element, {
  metadata: { title: 'Complete Manual' },
  headerTemplate: {
    template: `
      <div style="display: flex; justify-content: space-between;">
        <span style="font-weight: bold;">{{title}}</span>
        <span style="font-size: 10px; color: #999999;">Page {{pageNumber}} of {{totalPages}}</span>
      </div>
    `,
    height: 15,
    css: `
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 8px;
      margin-bottom: 0;
    `
  },
  footerTemplate: {
    template: `
      <div style="text-align: center; font-size: 9px;">
        <span style="color: #999999;">Generated {{date}} | Confidential</span>
      </div>
    `,
    height: 12,
    css: 'padding-top: 10px; border-top: 1px solid #e0e0e0;'
  }
});
```

### Formatted Page Numbers with Total

```typescript
const result = await generator.generate(element, {
  footerTemplate: {
    template: `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 9px; color: #999;">© 2024 Company Name</span>
        <span style="font-size: 11px; font-weight: bold;">
          {{pageNumber}} / {{totalPages}}
        </span>
      </div>
    `,
    height: 12,
    css: 'border-top: 1px solid #ddd; padding-top: 5px;'
  }
});
```

## Common Patterns

### Standard Business Document

```typescript
const headerFooter = {
  headerTemplate: {
    template: '<div style="text-align: center; font-weight: bold;">{{title}}</div>',
    height: 12,
    css: 'border-bottom: 1px solid #999; padding-bottom: 5px;'
  },
  footerTemplate: {
    template: '<div style="text-align: center;">Page {{pageNumber}} of {{totalPages}}</div>',
    height: 10,
    css: 'border-top: 1px solid #999; padding-top: 5px; font-size: 10px;'
  }
};
```

### Minimal Pagination

```typescript
const minimalFooter = {
  footerTemplate: {
    template: '<div style="text-align: right; font-size: 9px;">{{pageNumber}}</div>',
    height: 8,
    firstPage: false
  }
};
```

### Executive Summary Header

```typescript
const executiveHeader = {
  headerTemplate: {
    template: `
      <div style="background-color: #f0f0f0; padding: 8px; border-radius: 3px;">
        <strong>{{title}}</strong> | Updated {{date}}
      </div>
    `,
    height: 15,
    css: 'font-size: 11px; margin-bottom: 0;'
  }
};
```

## Template Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `{{pageNumber}}` | Current page number (1-indexed) | `1`, `2`, `3` |
| `{{totalPages}}` | Total number of pages in PDF | `15`, `42` |
| `{{date}}` | Current date/time (formatted) | `2024-01-15` or `Jan 15, 2024` |
| `{{title}}` | Document title from metadata | `Annual Report 2024` |

## Tips and Best Practices

1. **Height Sizing**: Use 10-15mm for footers, 12-20mm for headers with multiple lines

2. **First Page Exclusion**: Set `firstPage: false` for footers if you have a title page

3. **CSS Styling**: Use inline CSS for guaranteed compatibility across all pages

4. **Border Styling**: Add `border-top` to footers and `border-bottom` to headers for visual separation

5. **Font Size**: Keep font sizes between 9-11px for readability and professional appearance

6. **Padding**: Use appropriate padding to separate headers/footers from main content

7. **Typography**: Stick to web-safe fonts (Arial, Helvetica, Times New Roman, Courier New)

8. **Alignment**: Use `text-align` for simple layouts, flexbox for complex multi-column designs

9. **Color**: Use gray tones (#666, #999, #ccc) for subtle headers/footers that don't distract

## See Also

- [Metadata](./metadata.md) - Set document title and other metadata
- [Watermarks](./watermarks.md) - Add watermarks for branding or security
- [CSS Styling](./multi-page.md) - Advanced CSS styling options
