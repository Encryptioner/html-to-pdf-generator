# Color Management

Comprehensive guide to color handling in PDF generation, including OKLCH color conversion and Tailwind CSS support.

## Overview

The PDF generator provides automatic color management:
- **OKLCH to RGB Conversion** - Automatic conversion of OKLCH colors
- **Tailwind CSS Support** - Pre-configured color replacements
- **Custom Color Mappings** - Define your own color replacements
- **CSS Variable Support** - Replace CSS custom properties
- **Consistent Output** - Reliable colors across all browsers

## Basic Usage

### Automatic Tailwind CSS Support

Tailwind CSS colors are automatically converted:

```html
<div class="bg-blue-500 text-white p-4">
  <h2>Tailwind Styled Content</h2>
  <p class="text-gray-700">This works out of the box!</p>
</div>
```

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

await generatePDF(element, 'document.pdf');
// Tailwind colors automatically converted
```

## OKLCH Color Conversion

### What is OKLCH?

OKLCH is a modern color space that provides:
- Perceptually uniform colors
- Better color manipulation
- Wider color gamut

However, PDFs require RGB colors, so automatic conversion is performed.

### Automatic Conversion

```css
.modern-color {
  color: oklch(0.5 0.2 180);  /* OKLCH format */
  background: oklch(0.9 0.05 120);
}
```

The generator automatically converts these to RGB equivalents in the PDF.

## Tailwind CSS Support

### Pre-Configured Colors

These Tailwind classes work automatically:

```html
<!-- Background colors -->
<div class="bg-red-500">Red background</div>
<div class="bg-blue-600">Blue background</div>
<div class="bg-green-400">Green background</div>

<!-- Text colors -->
<p class="text-gray-800">Dark gray text</p>
<p class="text-purple-500">Purple text</p>

<!-- Border colors -->
<div class="border border-yellow-300">Yellow border</div>
```

### Supported Tailwind Colors

All standard Tailwind colors are supported:
- `slate`, `gray`, `zinc`, `neutral`, `stone`
- `red`, `orange`, `amber`, `yellow`, `lime`, `green`
- `emerald`, `teal`, `cyan`, `sky`, `blue`
- `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

## Custom Color Replacements

### Define Custom Mappings

```typescript
await generatePDF(element, 'document.pdf', {
  colorReplacements: {
    '--brand-primary': '#3b82f6',
    '--brand-secondary': '#10b981',
    '--accent-color': '#f59e0b',
  },
});
```

### CSS Variable Example

```css
:root {
  --brand-primary: oklch(0.5 0.2 250);
  --brand-secondary: oklch(0.6 0.15 150);
}

.brand-button {
  background-color: var(--brand-primary);
  color: white;
}
```

```typescript
await generatePDF(element, 'document.pdf', {
  colorReplacements: {
    '--brand-primary': '#3b82f6',
    '--brand-secondary': '#10b981',
  },
});
```

## Advanced Color Handling

### Hex Colors

Standard hex colors work without conversion:

```css
.element {
  color: #333333;
  background: #f5f5f5;
}
```

### RGB/RGBA Colors

RGB and RGBA are native to PDFs:

```css
.element {
  color: rgb(51, 51, 51);
  background: rgba(245, 245, 245, 0.9);
}
```

### Named Colors

CSS named colors work:

```css
.element {
  color: darkblue;
  background: lightgray;
}
```

### HSL Colors

HSL colors are converted to RGB:

```css
.element {
  color: hsl(210, 100%, 50%);
  background: hsla(0, 0%, 96%, 0.9);
}
```

## Tailwind CSS Examples

### Full Tailwind Document

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="container mx-auto p-8">
    <header class="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold">Report Title</h1>
      <p class="text-blue-100">Generated with Tailwind CSS</p>
    </header>

    <main class="mt-8">
      <div class="bg-gray-50 p-6 rounded-lg">
        <h2 class="text-2xl text-gray-800 mb-4">Section Title</h2>
        <p class="text-gray-600">Content goes here...</p>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="bg-green-100 p-4 rounded">
          <h3 class="text-green-800 font-bold">Success</h3>
          <p class="text-green-600">Positive metric</p>
        </div>
        <div class="bg-red-100 p-4 rounded">
          <h3 class="text-red-800 font-bold">Alert</h3>
          <p class="text-red-600">Needs attention</p>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

await generatePDFFromHTML(html, 'tailwind-report.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

## Best Practices

### 1. Use Standard Color Formats

Prefer hex, RGB, or Tailwind classes:

```css
/* Good */
.element {
  color: #333;
  background: rgb(245, 245, 245);
}

/* Also good */
.element {
  @apply text-gray-800 bg-gray-50;
}
```

### 2. Test Color Consistency

```typescript
// Generate test PDF
await generatePDF(colorSampleElement, 'color-test.pdf');

// Verify colors match expectations
```

### 3. Avoid Gradients (if possible)

Gradients may not render consistently:

```css
/* Gradients work but may vary */
.gradient {
  background: linear-gradient(to right, #3b82f6, #10b981);
}

/* Solid colors are more reliable */
.solid {
  background: #3b82f6;
}
```

### 4. Define a Color Palette

```typescript
const brandColors = {
  '--color-primary': '#3b82f6',
  '--color-secondary': '#10b981',
  '--color-accent': '#f59e0b',
  '--color-neutral': '#6b7280',
};

await generatePDF(element, 'document.pdf', {
  colorReplacements: brandColors,
});
```

## Troubleshooting

### Colors Look Different in PDF

**Problem**: Colors in PDF don't match the web version.

**Solutions**:
1. Check color format (use RGB/hex for consistency)
2. Define explicit color replacements
3. Test with print media emulation

```typescript
await generatePDF(element, 'document.pdf', {
  emulateMediaType: 'print',  // Use print styles
});
```

### Tailwind Colors Not Working

**Problem**: Tailwind CSS colors don't appear correctly.

**Solutions**:
1. Ensure Tailwind CDN or build is loaded
2. Wait for styles to load before generating
3. Use inline Tailwind classes

```typescript
// Wait for Tailwind to load
await new Promise(resolve => setTimeout(resolve, 500));
await generatePDF(element, 'document.pdf');
```

### Custom Variables Not Replacing

**Problem**: CSS variables don't get replaced.

**Solutions**:
1. Define explicit replacements
2. Check variable names match exactly
3. Include `--` prefix in replacement keys

```typescript
await generatePDF(element, 'document.pdf', {
  colorReplacements: {
    '--my-color': '#3b82f6',  // Include -- prefix
  },
});
```

## Examples

### Brand Color Document

```typescript
const brandColors = {
  '--brand-blue': '#0066cc',
  '--brand-green': '#00cc66',
  '--brand-gray': '#666666',
};

await generatePDF(brandedContent, 'brand-doc.pdf', {
  colorReplacements: brandColors,
});
```

### Accessible Color Scheme

```css
/* High contrast for accessibility */
.accessible {
  color: #000000;
  background: #ffffff;
}

.accessible-inverse {
  color: #ffffff;
  background: #000000;
}

.accessible-link {
  color: #0000EE;  /* High contrast blue */
}
```

### Print-Friendly Colors

```css
@media print {
  * {
    color: #000 !important;
    background: #fff !important;
  }

  a {
    text-decoration: underline;
    color: #000 !important;
  }
}
```

```typescript
await generatePDF(element, 'print-friendly.pdf', {
  emulateMediaType: 'print',
});
```

## See Also

- [Tailwind CSS Official Documentation](https://tailwindcss.com)
- [OKLCH Color Space](https://oklch.com)
- [Best Practices](../guides/best-practices.md)
- [Options Reference](../api/options.md)
