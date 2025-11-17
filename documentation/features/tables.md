# Table Support

Comprehensive guide to handling tables in PDF generation with smart pagination, header repetition, and row splitting prevention.

## Overview

The PDF generator provides advanced table handling capabilities:
- **Header Repetition** - Table headers automatically repeat on each page
- **Row Splitting Prevention** - Keeps table rows together across pages
- **Auto-borders** - Enforce borders for better PDF visibility
- **Column Width Fixing** - Consistent column widths across pages
- **Text Wrapping** - Smart text wrapping in table cells
- **Table Splitting** - Intelligently split large tables across pages

## Basic Usage

### Enable Table Features

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
});
```

## Configuration Options

### repeatTableHeaders

Repeat table headers (`<thead>`) on each page.

```typescript
repeatTableHeaders: true  // Repeat headers (default: true)
```

When enabled, `<thead>` content appears at the top of each page where the table continues.

### avoidTableRowSplit

Prevent table rows from splitting across pages.

```typescript
avoidTableRowSplit: true  // Keep rows together (default: true)
```

Ensures each `<tr>` stays on a single page. If a row doesn't fit, it moves to the next page.

## Table Structure

### Proper HTML Structure

Use semantic HTML for best results:

```html
<table>
  <thead>
    <tr>
      <th>Product</th>
      <th>Price</th>
      <th>Quantity</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Widget A</td>
      <td>$10.00</td>
      <td>5</td>
      <td>$50.00</td>
    </tr>
    <tr>
      <td>Widget B</td>
      <td>$15.00</td>
      <td>3</td>
      <td>$45.00</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total:</td>
      <td>$95.00</td>
    </tr>
  </tfoot>
</table>
```

```typescript
await generatePDF(element, 'invoice.pdf', {
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
});
```

### Table Styling

```css
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f3f4f6;
  font-weight: bold;
}

th, td {
  padding: 12px;
  text-align: left;
  border: 1px solid #d1d5db;
}

tbody tr:nth-child(even) {
  background-color: #f9fafb;
}
```

## Header Repetition

### Basic Header Repetition

Headers automatically repeat when tables span multiple pages:

```html
<table>
  <thead>
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Amount</th>
    </tr>
  </thead>
  <tbody>
    <!-- 100 rows of data -->
    <tr><td>2024-01-01</td><td>Payment</td><td>$100</td></tr>
    <!-- ... more rows ... -->
  </tbody>
</table>
```

```typescript
await generatePDF(element, 'report.pdf', {
  repeatTableHeaders: true,  // Headers appear on every page
});
```

### Multi-Row Headers

Complex headers with multiple rows:

```html
<thead>
  <tr>
    <th rowspan="2">Product</th>
    <th colspan="2">Q1</th>
    <th colspan="2">Q2</th>
  </tr>
  <tr>
    <th>Units</th>
    <th>Revenue</th>
    <th>Units</th>
    <th>Revenue</th>
  </tr>
</thead>
```

Both header rows repeat on each page automatically.

## Row Splitting Prevention

### Keep Rows Together

```typescript
await generatePDF(element, 'document.pdf', {
  avoidTableRowSplit: true,  // Rows stay on single page
});
```

**Behavior**:
- If a row fits on current page → rendered on current page
- If a row doesn't fit → moved to next page entirely
- No partial row content on page boundaries

### Large Rows

For very large rows (taller than a page), the row will be split but cell content is kept together:

```html
<tr>
  <td>Product Name</td>
  <td>
    <div style="height: 400mm;">
      <!-- Very tall content -->
    </div>
  </td>
</tr>
```

**Behavior**: Content splits at natural boundaries, but cell integrity is maintained.

## Column Width Control

### Fixed Column Widths

Use explicit widths for consistent columns:

```html
<table style="table-layout: fixed;">
  <colgroup>
    <col style="width: 40%;">
    <col style="width: 30%;">
    <col style="width: 30%;">
  </colgroup>
  <thead>
    <tr>
      <th>Description</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <!-- rows -->
  </tbody>
</table>
```

### Responsive Column Widths

Use percentage widths for flexibility:

```css
table {
  width: 100%;
}

th:nth-child(1), td:nth-child(1) { width: 50%; }
th:nth-child(2), td:nth-child(2) { width: 25%; }
th:nth-child(3), td:nth-child(3) { width: 25%; }
```

## Borders and Styling

### Border Enforcement

Borders are automatically enforced for PDF clarity:

```css
table {
  border-collapse: collapse;
}

th, td {
  border: 1px solid #000;  /* Clear borders for PDF */
}
```

### Zebra Striping

Alternating row colors for readability:

```css
tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

tbody tr:nth-child(even) {
  background-color: #f3f4f6;
}
```

### Cell Padding

Adequate padding improves readability:

```css
th, td {
  padding: 8px 12px;
}
```

## Text Wrapping

### Word Wrap in Cells

```css
td {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}
```

### Prevent Wrapping

For columns that should stay on one line:

```css
.no-wrap {
  white-space: nowrap;
}
```

```html
<td class="no-wrap">SKU-12345</td>
```

### Truncate Long Text

```css
.truncate {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

## Advanced Table Features

### Nested Tables

```html
<table>
  <tr>
    <td>
      Parent Cell
      <table>
        <tr>
          <td>Nested Cell 1</td>
          <td>Nested Cell 2</td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

**Note**: Keep nesting shallow (1-2 levels) for best results.

### Tables with Images

```html
<table>
  <tr>
    <td><img src="product.jpg" alt="Product" width="100"></td>
    <td>Product Description</td>
    <td>$29.99</td>
  </tr>
</table>
```

```typescript
await generatePDF(element, 'catalog.pdf', {
  repeatTableHeaders: true,
  optimizeImages: true,
});
```

### Conditional Row Styling

```html
<tr class="highlight">
  <td>Important Item</td>
  <td>$999.99</td>
</tr>
```

```css
tr.highlight {
  background-color: #fef3c7;
  font-weight: bold;
}
```

## Large Tables

### Paginated Data Tables

For tables with many rows (100+):

```typescript
await generatePDF(element, 'large-table.pdf', {
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
  showPageNumbers: true,
  compress: true,
});
```

### Performance Optimization

```typescript
// For very large tables (1000+ rows)
await generatePDF(element, 'huge-table.pdf', {
  scale: 1.5,  // Reduce scale for faster generation
  compress: true,
});
```

## Table Footers

### Total Rows

```html
<tfoot>
  <tr>
    <td colspan="3">Grand Total:</td>
    <td>$1,234.56</td>
  </tr>
</tfoot>
```

**Behavior**: Footers appear at the end of the table only (not repeated like headers).

### Repeating Footers

To repeat footers on each page, include them in both `<thead>` and `<tfoot>`:

```html
<table>
  <thead>
    <tr class="header-row">
      <th>Item</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    <!-- data rows -->
  </tbody>
  <tfoot>
    <tr class="footer-row">
      <td colspan="2">Page Total: Calculate manually</td>
    </tr>
  </tfoot>
</table>
```

## Troubleshooting

### Headers Not Repeating

**Problem**: Table headers don't repeat on new pages.

**Solutions**:
1. Ensure `repeatTableHeaders: true`
2. Use proper `<thead>` structure
3. Check that CSS doesn't hide thead

```typescript
await generatePDF(element, 'document.pdf', {
  repeatTableHeaders: true,  // Must be enabled
});
```

### Rows Split Across Pages

**Problem**: Table rows are split across page boundaries.

**Solutions**:
1. Enable `avoidTableRowSplit: true`
2. Reduce row height if possible
3. Check CSS that might force row height

```typescript
await generatePDF(element, 'document.pdf', {
  avoidTableRowSplit: true,
});
```

### Column Widths Inconsistent

**Problem**: Column widths vary across pages.

**Solutions**:
1. Use `table-layout: fixed`
2. Specify explicit column widths
3. Use colgroup to define columns

```css
table {
  table-layout: fixed;
  width: 100%;
}
```

### Borders Missing in PDF

**Problem**: Table borders don't appear in PDF.

**Solutions**:
1. Use explicit border styles
2. Avoid border-collapse issues
3. Use solid borders (not dashed/dotted)

```css
table {
  border-collapse: collapse;
}

td, th {
  border: 1px solid #000;
}
```

## Best Practices

### 1. Semantic HTML

Always use proper table structure:

```html
<table>
  <thead><!-- Headers --></thead>
  <tbody><!-- Data --></tbody>
  <tfoot><!-- Footers --></tfoot>
</table>
```

### 2. Consistent Styling

Use consistent styling across all tables:

```css
/* Global table styles */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}

thead {
  background-color: #f5f5f5;
  font-weight: bold;
}
```

### 3. Test with Real Data

Test with realistic data volumes:

```typescript
// Test with small dataset
const smallTable = createTable(10);
await generatePDF(smallTable, 'small.pdf');

// Test with large dataset
const largeTable = createTable(500);
await generatePDF(largeTable, 'large.pdf');
```

### 4. Mobile-Responsive Tables

For web version, use responsive tables; for PDF, use fixed layout:

```html
<!-- Web version -->
<div class="table-responsive">
  <table><!-- content --></table>
</div>

<!-- PDF version (remove wrapper) -->
<table><!-- content --></table>
```

## Examples

### Invoice Table

```html
<table class="invoice-table">
  <thead>
    <tr>
      <th>Item</th>
      <th>Description</th>
      <th>Qty</th>
      <th>Price</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>001</td>
      <td>Professional Services</td>
      <td>10</td>
      <td>$150.00</td>
      <td>$1,500.00</td>
    </tr>
    <!-- more rows -->
  </tbody>
  <tfoot>
    <tr>
      <td colspan="4">Subtotal:</td>
      <td>$1,500.00</td>
    </tr>
    <tr>
      <td colspan="4">Tax (10%):</td>
      <td>$150.00</td>
    </tr>
    <tr>
      <td colspan="4"><strong>Total:</strong></td>
      <td><strong>$1,650.00</strong></td>
    </tr>
  </tfoot>
</table>
```

```typescript
await generatePDF(invoiceElement, 'invoice.pdf', {
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
  format: 'a4',
  showPageNumbers: true,
});
```

### Data Report

```html
<table class="data-report">
  <thead>
    <tr>
      <th>Date</th>
      <th>Metric</th>
      <th>Value</th>
      <th>Change</th>
    </tr>
  </thead>
  <tbody>
    <!-- 200+ rows of data -->
  </tbody>
</table>
```

```typescript
await generatePDF(reportElement, 'monthly-report.pdf', {
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
  showPageNumbers: true,
  compress: true,
});
```

### Product Comparison

```html
<table class="comparison-table">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Basic</th>
      <th>Pro</th>
      <th>Enterprise</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Storage</td>
      <td>10 GB</td>
      <td>100 GB</td>
      <td>Unlimited</td>
    </tr>
    <!-- more features -->
  </tbody>
</table>
```

## See Also

- [Multi-Page Generation](../advanced/multi-page.md) - Page splitting behavior
- [Page Breaks](./page-breaks.md) - Control page breaking
- [Best Practices](../guides/best-practices.md) - Overall best practices
- [Options Reference](../api/options.md) - Complete options documentation
