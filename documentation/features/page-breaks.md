# Page Breaks

Control how content splits across pages using CSS page-break properties and smart pagination features.

## Overview

The PDF generator respects CSS page-break properties and provides smart pagination features:
- **CSS Page Break Support** - Respects `page-break-before/after/inside` properties
- **Orphaned Heading Prevention** - Keeps headings with their content
- **Element Avoidance** - Configurable elements that shouldn't be split
- **Custom Break Points** - Define where pages should break
- **Widow/Orphan Control** - Prevents lonely lines at page boundaries

## Basic Usage

### Enable Page Break Features

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  respectCSSPageBreaks: true,
  preventOrphanedHeadings: true,
});
```

## Configuration Options

### respectCSSPageBreaks

Respect CSS `page-break-*` properties.

```typescript
respectCSSPageBreaks: true  // Respect CSS (default: true)
```

### preventOrphanedHeadings

Keep headings with their content.

```typescript
preventOrphanedHeadings: true  // Prevent orphans (default: true)
```

## CSS Page Break Properties

### page-break-before

Force a page break before an element:

```css
.chapter {
  page-break-before: always;
}
```

```html
<div class="chapter">
  <h1>Chapter 2</h1>
  <p>Content...</p>
</div>
```

**Values**:
- `auto` - Default behavior
- `always` - Always break before
- `avoid` - Avoid breaking before
- `left` - Break to next left page
- `right` - Break to next right page

### page-break-after

Force a page break after an element:

```css
.section-end {
  page-break-after: always;
}
```

```html
<div class="section">
  <h2>Section 1</h2>
  <p>Content...</p>
  <div class="section-end"></div>
</div>
<!-- New page starts here -->
```

### page-break-inside

Prevent page breaks inside an element:

```css
.keep-together {
  page-break-inside: avoid;
}
```

```html
<div class="keep-together">
  <h3>Important Section</h3>
  <p>This content stays together on one page.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

**Values**:
- `auto` - Allow breaks (default)
- `avoid` - Avoid breaks inside element

## Common Patterns

### Chapter Breaks

```css
.chapter {
  page-break-before: always;
}

.chapter:first-child {
  page-break-before: auto; /* Don't break before first chapter */
}
```

```html
<div class="chapter">
  <h1>Chapter 1: Introduction</h1>
  <p>Content...</p>
</div>

<div class="chapter">
  <h1>Chapter 2: Getting Started</h1>
  <p>Content...</p>
</div>
```

### Section Breaks

```css
.section {
  page-break-before: auto;
  page-break-after: auto;
  page-break-inside: avoid;
}
```

### Keep Lists Together

```css
ul, ol {
  page-break-inside: avoid;
}
```

### Keep Images with Captions

```css
figure {
  page-break-inside: avoid;
}
```

```html
<figure>
  <img src="chart.png" alt="Sales Chart">
  <figcaption>Figure 1: Q4 Sales Performance</figcaption>
</figure>
```

## Orphaned Heading Prevention

### Automatic Prevention

When `preventOrphanedHeadings: true`:

```html
<h2>Section Title</h2>
<p>Content that follows the heading...</p>
```

The generator ensures headings don't appear alone at the bottom of a page.

### Manual Control

```css
h1, h2, h3 {
  page-break-after: avoid;
}
```

## Advanced Techniques

### Multi-Column Layouts

```css
.two-column {
  column-count: 2;
  column-gap: 20px;
}

.two-column h3 {
  column-span: all;
  page-break-after: avoid;
}
```

### Complex Structures

```css
/* Keep article sections together */
article {
  page-break-inside: avoid;
}

/* But allow breaks between articles */
article + article {
  page-break-before: auto;
}
```

### Footnotes and References

```css
.footnotes {
  page-break-before: always;
  page-break-inside: avoid;
}
```

## Best Practices

### 1. Use Semantic HTML

```html
<article>
  <header><h1>Title</h1></header>
  <section>
    <h2>Section</h2>
    <p>Content...</p>
  </section>
</article>
```

### 2. Test with Different Content Lengths

```typescript
// Short content (1 page)
await generatePDF(shortContent, 'short.pdf');

// Medium content (3-5 pages)
await generatePDF(mediumContent, 'medium.pdf');

// Long content (10+ pages)
await generatePDF(longContent, 'long.pdf');
```

### 3. Avoid Over-Constraining

Don't use too many `avoid` declarations:

```css
/* Bad - too restrictive */
div, p, ul, ol, table {
  page-break-inside: avoid;
}

/* Good - selective */
.keep-together {
  page-break-inside: avoid;
}
```

## Troubleshooting

### Content Splitting Awkwardly

```css
/* Add to elements that should stay together */
.intact {
  page-break-inside: avoid;
}
```

### Too Many Forced Breaks

```css
/* Remove unnecessary breaks */
.chapter {
  page-break-before: auto; /* Instead of always */
}
```

### Headings Alone at Bottom

```typescript
await generatePDF(element, 'document.pdf', {
  preventOrphanedHeadings: true,  // Ensure this is enabled
});
```

## See Also

- [Multi-Page Generation](../features/multi-page.md)
- [Table Support](./tables.md)
- [Best Practices](../guides/best-practices.md)
