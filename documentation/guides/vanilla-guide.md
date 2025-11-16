# Vanilla JavaScript Guide

Complete guide to using HTML to PDF Generator with plain JavaScript and TypeScript.

## Installation

```bash
npm install @encryptioner/html-to-pdf-generator
```

## Quick Start

### Basic HTML + JavaScript

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PDF Generator Example</title>
  <style>
    .pdf-content {
      width: 794px; /* A4 width at 96 DPI */
      padding: 20px;
      font-family: Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div id="content" class="pdf-content">
    <h1>My Document</h1>
    <p>This content will be converted to PDF.</p>
  </div>

  <button id="download-btn">Download PDF</button>

  <script type="module">
    import { generatePDF } from '@encryptioner/html-to-pdf-generator';

    document.getElementById('download-btn').addEventListener('click', async () => {
      const element = document.getElementById('content');
      await generatePDF(element, 'document.pdf', {
        format: 'a4',
        showPageNumbers: true,
      });
    });
  </script>
</body>
</html>
```

## Core Functions

### `generatePDF()`

Generate and download a PDF file.

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
const result = await generatePDF(element, 'document.pdf', {
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10],
  showPageNumbers: true,
  compress: true,
  onProgress: (progress) => {
    console.log(`Progress: ${progress}%`);
  },
});

console.log(`Generated ${result.pageCount} pages`);
console.log(`File size: ${result.fileSize} bytes`);
console.log(`Time: ${result.generationTime}ms`);
```

### `generatePDFBlob()`

Generate PDF as a Blob without downloading.

```javascript
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
const blob = await generatePDFBlob(element, {
  format: 'a4',
  compress: true,
});

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');
await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});
```

### `generatePDFFromHTML()`

Generate PDF from HTML string.

```javascript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #333; }
      </style>
    </head>
    <body>
      <h1>Invoice #12345</h1>
      <p>Amount: $1,234.56</p>
    </body>
  </html>
`;

await generatePDFFromHTML(html, 'invoice.pdf', {
  format: 'a4',
});
```

## Using the PDFGenerator Class

For more control and reusability:

```javascript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

// Create generator instance
const generator = new PDFGenerator({
  format: 'a4',
  orientation: 'portrait',
  margins: [15, 15, 15, 15],
  compress: true,
  scale: 2,
  onProgress: (progress) => {
    updateProgressBar(progress);
  },
  onComplete: (blob) => {
    console.log(`PDF generated: ${blob.size} bytes`);
  },
  onError: (error) => {
    console.error('Generation failed:', error);
  },
});

// Generate PDF
const element = document.getElementById('content');
const result = await generator.generatePDF(element, 'document.pdf');

// Or generate blob
const blob = await generator.generateBlob(element);

// Update options
generator.updateOptions({
  format: 'letter',
  showPageNumbers: true,
});

// Get current config
const config = generator.getConfig();
console.log(config.options);
console.log(config.pageConfig);
```

## Common Patterns

### With Progress Indicator

```html
<div id="content">
  <h1>Document Content</h1>
</div>

<button id="download-btn">Download PDF</button>
<div id="progress" style="display: none;">
  <div class="progress-bar">
    <div id="progress-fill" style="width: 0%; height: 20px; background: blue;"></div>
  </div>
  <span id="progress-text">0%</span>
</div>

<script type="module">
  import { generatePDF } from '@encryptioner/html-to-pdf-generator';

  const btn = document.getElementById('download-btn');
  const progressDiv = document.getElementById('progress');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    progressDiv.style.display = 'block';

    const element = document.getElementById('content');
    await generatePDF(element, 'document.pdf', {
      onProgress: (progress) => {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
      },
      onComplete: () => {
        progressDiv.style.display = 'none';
        btn.disabled = false;
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
        progressDiv.style.display = 'none';
        btn.disabled = false;
      },
    });
  });
</script>
```

### With Error Handling

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

async function downloadPDF() {
  const element = document.getElementById('content');

  if (!element) {
    console.error('Content element not found');
    return;
  }

  try {
    const result = await generatePDF(element, 'document.pdf', {
      format: 'a4',
      onError: (error) => {
        showError(`Failed to generate PDF: ${error.message}`);
      },
    });

    console.log('PDF generated successfully:', result);
    showSuccess('PDF downloaded successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
    showError('An unexpected error occurred');
  }
}

function showError(message) {
  const errorDiv = document.getElementById('error-message');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function showSuccess(message) {
  const successDiv = document.getElementById('success-message');
  successDiv.textContent = message;
  successDiv.style.display = 'block';
  setTimeout(() => {
    successDiv.style.display = 'none';
  }, 3000);
}
```

### Dynamic Content

```html
<div id="invoice-form">
  <input type="text" id="invoice-number" placeholder="Invoice #" />
  <input type="text" id="customer-name" placeholder="Customer Name" />
  <button id="add-item">Add Item</button>
  <div id="items-list"></div>
</div>

<div id="pdf-preview" style="width: 794px; padding: 20px; border: 1px solid #ccc;">
  <h1>Invoice <span id="preview-number"></span></h1>
  <p>Customer: <span id="preview-customer"></span></p>
  <div id="preview-items"></div>
</div>

<button id="generate-pdf">Generate PDF</button>

<script type="module">
  import { generatePDF } from '@encryptioner/html-to-pdf-generator';

  const items = [];

  // Update preview when inputs change
  document.getElementById('invoice-number').addEventListener('input', (e) => {
    document.getElementById('preview-number').textContent = e.target.value;
  });

  document.getElementById('customer-name').addEventListener('input', (e) => {
    document.getElementById('preview-customer').textContent = e.target.value;
  });

  // Add item
  document.getElementById('add-item').addEventListener('click', () => {
    const item = prompt('Enter item name:');
    const price = prompt('Enter price:');
    if (item && price) {
      items.push({ item, price });
      updatePreview();
    }
  });

  function updatePreview() {
    const previewItems = document.getElementById('preview-items');
    previewItems.innerHTML = items
      .map(({ item, price }) => `<p>${item}: $${price}</p>`)
      .join('');
  }

  // Generate PDF
  document.getElementById('generate-pdf').addEventListener('click', async () => {
    const element = document.getElementById('pdf-preview');
    const invoiceNumber = document.getElementById('invoice-number').value || 'DRAFT';

    await generatePDF(element, `invoice-${invoiceNumber}.pdf`, {
      format: 'a4',
      showPageNumbers: true,
    });
  });
</script>
```

### Waiting for Images to Load

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

async function generatePDFSafe() {
  // Wait for all images to load
  const images = Array.from(document.images);
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      });
    })
  );

  // Wait for document to be fully loaded
  if (document.readyState !== 'complete') {
    await new Promise((resolve) => {
      window.addEventListener('load', resolve);
    });
  }

  // Now generate PDF
  const element = document.getElementById('content');
  await generatePDF(element, 'document.pdf');
}
```

### Uploading to Server

```javascript
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

async function uploadPDF() {
  const element = document.getElementById('content');

  // Generate blob
  const blob = await generatePDFBlob(element, {
    format: 'a4',
    compress: true,
  });

  // Upload to server
  const formData = new FormData();
  formData.append('pdf', blob, 'document.pdf');
  formData.append('title', 'My Document');

  const response = await fetch('/api/upload-pdf', {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Upload successful:', data);
  } else {
    console.error('Upload failed');
  }
}
```

### Preview Before Download

```javascript
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

async function previewPDF() {
  const element = document.getElementById('content');

  // Generate blob
  const blob = await generatePDFBlob(element, {
    format: 'a4',
  });

  // Create object URL
  const url = URL.createObjectURL(blob);

  // Open in new window or iframe
  window.open(url, '_blank');

  // Or display in iframe
  const iframe = document.getElementById('pdf-preview');
  iframe.src = url;

  // Clean up when done
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 60000); // Revoke after 1 minute
}
```

## TypeScript Support

Full TypeScript support with type definitions:

```typescript
import {
  generatePDF,
  generatePDFBlob,
  PDFGenerator,
  type PDFGeneratorOptions,
  type PDFGenerationResult,
  type PDFPageConfig,
} from '@encryptioner/html-to-pdf-generator';

// Typed options
const options: PDFGeneratorOptions = {
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10],
  showPageNumbers: true,
  compress: true,
  scale: 2,
  imageQuality: 0.85,  // Legacy, use imageOptions instead

  // Image Optimization (v5.1.0) ⭐ NEW
  imageOptions: {
    dpi: 300,                      // 72 (web), 150 (print), 300 (high-quality)
    format: 'jpeg',                // 'jpeg' | 'png' | 'webp'
    backgroundColor: '#ffffff',    // Background for transparent images
    optimizeForPrint: true,        // Enable print optimizations
    interpolate: true,             // Image smoothing
    quality: 0.92                  // Compression quality
  },

  onProgress: (progress: number) => {
    console.log(`Progress: ${progress}%`);
  },
  onComplete: (blob: Blob) => {
    console.log('Complete!', blob);
  },
  onError: (error: Error) => {
    console.error('Error:', error);
  },
};

// Generate with types
const element = document.getElementById('content') as HTMLElement;
const result: PDFGenerationResult = await generatePDF(element, 'document.pdf', options);

console.log(`Pages: ${result.pageCount}`);
console.log(`Size: ${result.fileSize}`);
console.log(`Time: ${result.generationTime}`);

// Using class
const generator = new PDFGenerator(options);
const config: { options: Required<PDFGeneratorOptions>; pageConfig: PDFPageConfig } =
  generator.getConfig();
```

## Module Formats

The library supports both ESM and CommonJS:

### ES Modules (Recommended)

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';
```

### CommonJS

```javascript
const { generatePDF } = require('@encryptioner/html-to-pdf-generator');
```

### CDN (Browser)

```html
<script type="module">
  import { generatePDF } from 'https://cdn.jsdelivr.net/npm/@encryptioner/html-to-pdf-generator/+esm';

  // Now use generatePDF
</script>
```

## Best Practices

### 1. Use Fixed Width Container

```html
<div id="content" style="width: 794px;"> <!-- A4 width -->
  Your content here
</div>
```

### 2. Wait for Content to Load

```javascript
// Wait for everything to load
window.addEventListener('load', async () => {
  const element = document.getElementById('content');
  await generatePDF(element, 'document.pdf');
});
```

### 3. Handle Errors Gracefully

```javascript
try {
  await generatePDF(element, 'document.pdf', {
    onError: (error) => {
      console.error('Generation error:', error);
    },
  });
} catch (error) {
  console.error('Unexpected error:', error);
  alert('Failed to generate PDF. Please try again.');
}
```

### 4. Show Loading State

```javascript
const btn = document.getElementById('download-btn');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  btn.textContent = 'Generating...';

  try {
    await generatePDF(element, 'document.pdf');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Download PDF';
  }
});
```

### 5. Optimize for Performance

```javascript
await generatePDF(element, 'document.pdf', {
  scale: 1.5,           // Lower for faster generation
  compress: true,       // Enable compression
  imageQuality: 0.8,   // Balance quality/size
  optimizeImages: true, // Optimize images
});
```

## Common Issues

### Issue: "element is not defined"

```javascript
// ❌ Wrong: Element not found
const element = document.getElementById('wrong-id');
await generatePDF(element, 'document.pdf'); // Error!

// ✅ Correct: Check element exists
const element = document.getElementById('content');
if (!element) {
  console.error('Element not found');
  return;
}
await generatePDF(element, 'document.pdf');
```

### Issue: Styles not applied

```javascript
// Wait for stylesheets to load
const styleSheets = Array.from(document.styleSheets);
await Promise.all(
  styleSheets.map((sheet) => {
    try {
      // Access cssRules to ensure loaded
      const rules = sheet.cssRules;
      return Promise.resolve();
    } catch (e) {
      return Promise.resolve();
    }
  })
);

await generatePDF(element, 'document.pdf');
```

### Issue: Images not showing

```javascript
// Preload images
async function preloadImages() {
  const images = Array.from(document.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );
}

await preloadImages();
await generatePDF(element, 'document.pdf');
```

## Integration Examples

### With Vanilla Router

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

// Route handler
function handleInvoicePage() {
  const container = document.getElementById('app');
  container.innerHTML = `
    <div id="invoice-content">
      <h1>Invoice</h1>
    </div>
    <button id="download-invoice">Download</button>
  `;

  document.getElementById('download-invoice').addEventListener('click', async () => {
    const element = document.getElementById('invoice-content');
    await generatePDF(element, 'invoice.pdf');
  });
}
```

### With Build Tools (Webpack/Vite)

```javascript
// Works out of the box with modern bundlers
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

// Your code here
```

### With Web Components

```javascript
class PDFDocument extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <div id="content">
        <h1>Document</h1>
      </div>
      <button id="download">Download PDF</button>
    `;

    this.shadowRoot.getElementById('download').addEventListener('click', async () => {
      const element = this.shadowRoot.getElementById('content');
      await generatePDF(element, 'document.pdf');
    });
  }
}

customElements.define('pdf-document', PDFDocument);
```

## Next Steps

- **[Advanced Features](../advanced/watermarks.md)** - Watermarks, headers, templates
- **[API Reference](../api/pdf-generator.md)** - Complete API documentation
- **[Examples](../examples/code-examples.md)** - More code examples

---

[← Back to Documentation](../index.md)
