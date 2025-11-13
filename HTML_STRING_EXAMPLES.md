# HTML String to PDF - Examples

This document provides comprehensive examples of generating PDFs from HTML strings.

## Basic Usage

### Simple HTML Fragment

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
<div>
  <h1>Hello World</h1>
  <p>This is a simple HTML fragment converted to PDF.</p>
</div>
`;

await generatePDFFromHTML(html, 'simple.pdf');
```

### Full HTML Document

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Document</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    h1 {
      color: #333;
      border-bottom: 2px solid #0066cc;
    }
    p {
      line-height: 1.6;
      color: #666;
    }
  </style>
</head>
<body>
  <h1>Document Title</h1>
  <p>This is a complete HTML document with embedded styles.</p>
</body>
</html>
`;

await generatePDFFromHTML(html, 'full-document.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

## With Tailwind CSS

### Using CDN

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div class="container mx-auto p-8">
    <h1 class="text-4xl font-bold text-blue-600 mb-4">
      Styled with Tailwind
    </h1>
    <div class="bg-gray-100 p-6 rounded-lg">
      <p class="text-gray-700 leading-relaxed">
        This content uses Tailwind CSS classes and will be properly
        rendered in the PDF with correct colors and spacing.
      </p>
    </div>
    <div class="mt-6 grid grid-cols-2 gap-4">
      <div class="bg-blue-500 text-white p-4 rounded">Box 1</div>
      <div class="bg-green-500 text-white p-4 rounded">Box 2</div>
    </div>
  </div>
</body>
</html>
`;

await generatePDFFromHTML(html, 'tailwind.pdf');
```

### With Custom Tailwind Config

```typescript
const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brand: '#ff6b6b',
          }
        }
      }
    }
  </script>
</head>
<body class="bg-gray-50">
  <div class="max-w-4xl mx-auto p-8">
    <h1 class="text-brand text-5xl font-bold">
      Custom Brand Color
    </h1>
    <p class="text-gray-600 mt-4">
      Using custom Tailwind configuration.
    </p>
  </div>
</body>
</html>
`;

await generatePDFFromHTML(html, 'custom-tailwind.pdf');
```

## External Stylesheets

### From CDN

```typescript
const html = `
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <style>
    body { font-family: Arial; padding: 20px; }
    .icon-box { padding: 10px; margin: 10px 0; border: 1px solid #ddd; }
  </style>
</head>
<body>
  <h1>Document with Icons</h1>
  <div class="icon-box">
    <i class="fas fa-check"></i> Completed Task
  </div>
  <div class="icon-box">
    <i class="fas fa-times"></i> Pending Task
  </div>
</body>
</html>
`;

// External stylesheets are automatically loaded
await generatePDFFromHTML(html, 'with-icons.pdf');
```

## Complex Layouts

### Multi-Column Layout

```typescript
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Georgia, serif;
      padding: 40px;
      line-height: 1.6;
    }
    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-top: 20px;
    }
    .column {
      border: 1px solid #ddd;
      padding: 20px;
      background: #f9f9f9;
    }
    h1 {
      text-align: center;
      color: #2c3e50;
    }
  </style>
</head>
<body>
  <h1>Two-Column Layout</h1>
  <div class="columns">
    <div class="column">
      <h2>Column 1</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
    </div>
    <div class="column">
      <h2>Column 2</h2>
      <p>Sed do eiusmod tempor incididunt ut labore et dolore.</p>
    </div>
  </div>
</body>
</html>
`;

await generatePDFFromHTML(html, 'columns.pdf');
```

### Invoice Template

```typescript
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; margin: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; }
    .invoice-details { margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #3498db; color: white; }
    .total { text-align: right; font-weight: bold; font-size: 18px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">ACME Corporation</div>
    <div>123 Business St, City, State 12345</div>
  </div>

  <div class="invoice-details">
    <strong>Invoice #:</strong> INV-001<br>
    <strong>Date:</strong> 2024-01-15<br>
    <strong>Due Date:</strong> 2024-02-15
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Product A</td>
        <td>2</td>
        <td>$50.00</td>
        <td>$100.00</td>
      </tr>
      <tr>
        <td>Product B</td>
        <td>1</td>
        <td>$75.00</td>
        <td>$75.00</td>
      </tr>
    </tbody>
  </table>

  <div class="total">
    Total: $175.00
  </div>
</body>
</html>
`;

await generatePDFFromHTML(html, 'invoice.pdf', {
  format: 'a4',
  margins: [20, 20, 20, 20],
});
```

## Reading from File

### Load HTML from File System (Node.js)

```typescript
import { readFileSync } from 'fs';
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

// Read HTML file
const html = readFileSync('./template.html', 'utf-8');

// Generate PDF
await generatePDFFromHTML(html, 'output.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

### Fetch HTML from URL (Browser)

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

// Fetch HTML from remote URL
const response = await fetch('https://example.com/template.html');
const html = await response.text();

// Generate PDF
await generatePDFFromHTML(html, 'fetched.pdf');
```

## Template with Variables

### Simple Template Replacement

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

function renderTemplate(template: string, data: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || '');
}

const template = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; padding: 40px; }
    .greeting { font-size: 24px; color: #2c3e50; }
  </style>
</head>
<body>
  <div class="greeting">Hello, {{name}}!</div>
  <p>Welcome to {{company}}. Your account ID is {{accountId}}.</p>
</body>
</html>
`;

const data = {
  name: 'John Doe',
  company: 'ACME Corp',
  accountId: 'ACC-12345',
};

const html = renderTemplate(template, data);
await generatePDFFromHTML(html, 'personalized.pdf');
```

## Generate Blob for Upload

### Upload to Server

```typescript
import { generateBlobFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
<div>
  <h1>Report</h1>
  <p>This will be uploaded to the server.</p>
</div>
`;

// Generate blob instead of downloading
const blob = await generateBlobFromHTML(html, {
  format: 'a4',
  compress: true,
});

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'report.pdf');

await fetch('/api/upload-pdf', {
  method: 'POST',
  body: formData,
});
```

## Advanced Options

### With All Options

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; padding: 20px; }
  </style>
</head>
<body>
  <h1>Advanced PDF</h1>
  <p>With all configuration options.</p>
</body>
</html>
`;

await generatePDFFromHTML(html, 'advanced.pdf', {
  format: 'a4',
  orientation: 'portrait',
  margins: [15, 15, 15, 15], // top, right, bottom, left in mm
  compress: true,
  scale: 2,
  imageQuality: 0.95,
  showPageNumbers: true,
  pageNumberPosition: 'footer',
  onProgress: (progress) => {
    console.log(`Generating PDF: ${progress}%`);
  },
  onComplete: (blob) => {
    console.log(`PDF generated! Size: ${blob.size} bytes`);
  },
  onError: (error) => {
    console.error('PDF generation failed:', error);
  },
});
```

## Error Handling

```typescript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

try {
  const html = '<div><h1>My Document</h1></div>';

  await generatePDFFromHTML(html, 'document.pdf', {
    onProgress: (progress) => {
      console.log(`Progress: ${progress}%`);
    },
  });

  console.log('PDF generated successfully!');
} catch (error) {
  console.error('Failed to generate PDF:', error);
  // Handle error (show message to user, retry, etc.)
}
```

## Tips

1. **External Stylesheets**: The library automatically fetches and inlines external CSS
2. **Tailwind Support**: Tailwind CSS from CDN works out of the box
3. **Full Documents**: You can use complete HTML documents with `<html>`, `<head>`, `<body>` tags
4. **Fragments**: Or just HTML fragments like `<div>...</div>`
5. **Templates**: Use template strings with variables for dynamic content
6. **File Loading**: Read HTML from files in Node.js or fetch from URLs in browsers
7. **Progress Tracking**: Use `onProgress` callback for loading indicators
8. **Blob Generation**: Use `generateBlobFromHTML` when you need the blob instead of download
