# Interactive Demo - HTML to PDF Generator

An extensible, modular interactive demonstration of the `@encryptioner/html-to-pdf-generator` library features.

## Overview

This Vite-based demo provides hands-on testing of various PDF generation features through a clean, tabbed interface. It's designed to be easily extensible with new feature demonstrations.

## Setup

### Prerequisites
- Node.js 16+ or pnpm installed
- The main package built (`pnpm run build` from root)

### Installation

```bash
cd examples/vite-demo
pnpm install
```

### Development

```bash
pnpm dev
```

Then open `http://localhost:5173` in your browser.

### Production Build

```bash
pnpm run build
pnpm run preview
```

## Features

### Currently Available

#### 📦 Batch PDF Generation
Test the `newPage` parameter for controlling page breaks in batch PDF generation.

**Test Scenarios:**
1. **newPage = true** - Forces each item on separate pages (fixes the issue where domA and domB appeared on same page)
2. **newPage = false** - Allows items to share pages if they fit
3. **newPage = undefined** - Default behavior with page breaks after each item

**What to Test:**
- Verify domA appears on page 1, domB on page 2 with `newPage: true`
- Verify both items can share page 1 with `newPage: false`
- Check file size, generation time, and page count

### Coming Soon

The demo is designed to be extended with additional features:

- 📄 **Single PDF** - Basic PDF generation from HTML
- 📊 **Tables** - Table pagination and header repetition
- 🖼️ **Images** - SVG conversion and image optimization
- 🎨 **Colors** - OKLCH color support and Tailwind CSS
- 📑 **Page Breaks** - CSS page-break handling
- 🔤 **Fonts** - Custom font embedding

## Project Structure

```
vite-demo/
├── index.html          # Main HTML with tab navigation
├── main.js             # Entry point, tab switching, feature loading
├── styles.css          # Global styles
├── features/           # Modular feature demonstrations
│   ├── batch-pdf.js    # Batch PDF generation tests
│   └── [future features will go here]
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Adding New Features

The demo is designed to be easily extensible. To add a new feature:

### 1. Create Feature Module

Create a new file in `features/` directory:

```javascript
// features/my-feature.js
export function initMyFeature() {
  console.log('Initializing My Feature...');

  // Set up event listeners
  const button = document.getElementById('myFeatureBtn');
  button.addEventListener('click', async () => {
    // Feature logic here
  });

  console.log('My Feature ready');
}
```

### 2. Add Tab to HTML

Edit `index.html` and uncomment/add your tab:

```html
<!-- In the <nav class="tabs"> section -->
<button class="tab-button" data-tab="my-feature">
  🎯 My Feature
</button>

<!-- In the <main class="tab-content"> section -->
<section id="my-feature" class="tab-panel">
  <!-- Your feature UI here -->
</section>
```

### 3. Import and Initialize

Edit `main.js`:

```javascript
import { initMyFeature } from './features/my-feature.js';

function initFeatures() {
  initBatchPDF();
  initMyFeature(); // Add your feature
}
```

### 4. Test

Run `pnpm dev` and switch to your new tab!

## Design Patterns

### Modular Feature Structure

Each feature module should:
- Export an `init*` function
- Handle its own event listeners
- Display status/results in its panel
- Use the library imports from `@encryptioner/html-to-pdf-generator`

### Status Display Pattern

```javascript
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  status.innerHTML = message;
  status.style.borderLeftColor = isError ? '#dc2626' : '#667eea';
  status.style.background = isError ? '#fef2f2' : '#f0f9ff';
}
```

### Test Function Pattern

```javascript
async function testFeature() {
  showStatus('Testing feature...');

  try {
    const result = await someLibraryFunction();

    showStatus(`
      <strong>✅ Test Completed</strong><br>
      Result: ${result}
    `);
  } catch (error) {
    showStatus(`<strong>❌ Error:</strong> ${error.message}`, true);
  }
}
```

## Why Vite?

The built library uses ES modules with bare imports (like `import jsPDF from 'jspdf'`) which require a bundler to work in browsers. Vite provides:

- **Fast Development** - Instant hot module replacement
- **Dependency Resolution** - Handles bare imports automatically
- **Production Builds** - Optimized bundles for deployment
- **Modern Tooling** - Out-of-the-box TypeScript support

## Styling

The demo uses a custom CSS design system with:
- Tab-based navigation
- Gradient buttons (primary, secondary, info)
- Responsive grid layout
- Code block syntax highlighting
- Status feedback styling

Colors:
- Primary: `#667eea` (Purple gradient)
- Secondary: `#f093fb` (Pink gradient)
- Info: `#4facfe` (Blue gradient)
- Error: `#dc2626` (Red)
- Success: `#667eea` (Purple)

## Testing

### Manual Testing

1. Start the dev server
2. Switch between tabs
3. Click test buttons
4. Verify PDF downloads
5. Open PDFs and check:
   - Page count matches expected
   - Content appears correctly
   - Page breaks work as intended

### Browser Console

Check the browser console for:
- Feature initialization logs
- Test execution logs
- Any errors or warnings

## Troubleshooting

### "Module not found" errors

Make sure you've built the main package first:
```bash
cd ../..
pnpm run build
cd examples/vite-demo
```

### PDFs not downloading

Check browser console for errors. Ensure:
- Content elements exist in DOM
- Library is properly imported
- No CORS or security errors

### Styling issues

Clear browser cache and hard reload (Ctrl+Shift+R / Cmd+Shift+R)

## Related Documentation

- [Main README](../../README.md)
- [Batch Generation Guide](../../documentation/advanced/batch-generation.md)
- [API Documentation](../../documentation/api/options.md)
- [Examples Overview](../README.md)

## Contributing

To add new feature demonstrations:

1. Follow the "Adding New Features" guide above
2. Ensure your feature is well-documented
3. Test thoroughly across browsers
4. Update this README with your feature details

## License

Same as the main package - MIT License
