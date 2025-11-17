# Server-Side PDF Generation Guide

> Complete guide for using html-to-pdf-generator in Node.js/server environments

## 🎯 Overview

The library now supports **both frontend and backend** PDF generation:

- **Frontend (Browser):** Uses jsPDF + html2canvas for client-side generation
- **Backend (Node.js):** Uses Puppeteer for true browser rendering (recommended for production)
- **MCP Server:** Model Context Protocol integration for Claude Desktop

## 📦 Installation

### Basic Installation (Frontend Only)

```bash
npm install @encryptioner/html-to-pdf-generator
```

### Server-Side Installation (with Puppeteer)

```bash
npm install @encryptioner/html-to-pdf-generator puppeteer
```

**Note:** Puppeteer is an optional peer dependency. Install it only if you need server-side features.

## 🚀 Usage

### Option 1: Node.js Adapter (Recommended)

For true server-side rendering with full browser capabilities:

```typescript
import { ServerPDFGenerator } from '@encryptioner/html-to-pdf-generator/node';

// Create generator instance
const generator = new ServerPDFGenerator({
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10]
});

// Generate PDF from HTML
await generator.generatePDF(
  '<h1>Hello World</h1><p>Server-side PDF generation!</p>',
  'output.pdf'
);

// Clean up
await generator.close();
```

**Convenience Functions:**

```typescript
import { generateServerPDF } from '@encryptioner/html-to-pdf-generator/node';

// Automatically handles browser lifecycle
await generateServerPDF(htmlString, 'output.pdf', {
  format: 'letter',
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3
  }
});
```

### Option 2: MCP Server (Claude Desktop)

The MCP server automatically uses Puppeteer when available, falls back to JSDOM mode otherwise:

```bash
# Install with Puppeteer for best quality
npm install @encryptioner/html-to-pdf-generator puppeteer

# Configure Claude Desktop
# See MCP_QUICKSTART.md for setup instructions
```

**MCP Server Modes:**

1. **Puppeteer Mode** (recommended)
   - Requires: `puppeteer` installed
   - Quality: Highest - true browser rendering
   - Features: All Phase 1-4 features supported
   - Response includes: `"renderMode": "puppeteer"`

2. **Fallback Mode** (JSDOM)
   - Requires: Only base package
   - Quality: Limited - virtual DOM rendering
   - Features: Basic features only
   - Response includes: `"renderMode": "jsdom-fallback"`

### Option 3: Browser-Compatible Backend

For environments where Puppeteer isn't available (e.g., serverless with size limits):

```typescript
// This uses the browser-based library but won't work properly
// in pure Node.js without JSDOM
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';
import { JSDOM } from 'jsdom';

const dom = new JSDOM(htmlString);
const generator = new PDFGenerator();
const blob = await generator.generateBlob(dom.window.document.body);
```

**⚠️ Limitations:** This approach has limited rendering capabilities.

## 🔧 ServerPDFGenerator API

### Constructor

```typescript
new ServerPDFGenerator(options?: Partial<PDFGeneratorOptions>)
```

### Methods

#### `generatePDF(html, filename)`

Generate PDF from HTML string.

```typescript
await generator.generatePDF(
  '<h1>Title</h1>',
  'output.pdf'
): Promise<PDFGenerationResult>
```

#### `generatePDFFromTemplate(template, context, filename)`

Generate PDF from template with variables.

```typescript
await generator.generatePDFFromTemplate(
  '<h1>{{title}}</h1>{{#each items}}<p>{{name}}</p>{{/each}}',
  { title: 'Invoice', items: [...] },
  'invoice.pdf'
): Promise<PDFGenerationResult>
```

#### `generateBatchPDF(items, filename)`

Generate single PDF from multiple content items with auto-scaling.

```typescript
await generator.generateBatchPDF(
  [
    { html: '<h1>Section 1</h1>', pageCount: 1 },
    { html: '<h1>Section 2</h1>', pageCount: 2 }
  ],
  'report.pdf'
): Promise<BatchPDFGenerationResult>
```

#### `generatePDFFromURL(url, filename, urlOptions)`

Generate PDF from URL (CORS-aware).

```typescript
await generator.generatePDFFromURL(
  'https://example.com',
  'webpage.pdf',
  {
    waitForSelector: '.content-loaded',
    timeout: 30000,
    injectCSS: '.no-print { display: none; }'
  }
): Promise<PDFGenerationResult>
```

#### `generateBlob(html)`

Generate PDF blob without saving to file.

```typescript
const blob = await generator.generateBlob(htmlString): Promise<Blob>
```

#### `close()`

Close the Puppeteer browser instance.

```typescript
await generator.close(): Promise<void>
```

**⚠️ Important:** Always call `close()` when done to free resources.

## 📝 Complete Example

### Express.js Server

```typescript
import express from 'express';
import { ServerPDFGenerator } from '@encryptioner/html-to-pdf-generator/node';

const app = express();
app.use(express.json());

app.post('/api/generate-pdf', async (req, res) => {
  const { html, options } = req.body;

  const generator = new ServerPDFGenerator(options);

  try {
    const blob = await generator.generateBlob(html);
    const buffer = Buffer.from(await blob.arrayBuffer());

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    await generator.close();
  }
});

app.listen(3000);
```

### Next.js API Route

```typescript
// pages/api/generate-pdf.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateServerPDF } from '@encryptioner/html-to-pdf-generator/node';
import fs from 'fs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { html } = req.body;

  try {
    const tempFile = `/tmp/document-${Date.now()}.pdf`;
    await generateServerPDF(html, tempFile);

    const pdfBuffer = fs.readFileSync(tempFile);
    fs.unlinkSync(tempFile);

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

### Background Job (Bull Queue)

```typescript
import { Queue, Worker } from 'bullmq';
import { ServerPDFGenerator } from '@encryptioner/html-to-pdf-generator/node';

const pdfQueue = new Queue('pdf-generation');

const worker = new Worker('pdf-generation', async (job) => {
  const { html, outputPath, options } = job.data;

  const generator = new ServerPDFGenerator(options);

  try {
    const result = await generator.generatePDF(html, outputPath);
    await job.updateProgress(100);
    return result;
  } finally {
    await generator.close();
  }
});

// Add job
await pdfQueue.add('generate', {
  html: '<h1>Document</h1>',
  outputPath: '/tmp/output.pdf',
  options: { format: 'a4' }
});
```

## 🎨 All Features Supported

The ServerPDFGenerator supports **all Phase 1-4 features**:

### Phase 1: Core Features
- ✅ Watermarks (text & image)
- ✅ Dynamic headers/footers with templates
- ✅ PDF metadata
- ✅ Print media CSS emulation
- ✅ Batch PDF generation with auto-scaling

### Phase 2: Content Features
- ✅ Template system ({{variables}}, {{#each}}, {{#if}})
- ✅ Custom fonts & web-safe fallbacks
- ✅ Table of Contents generation
- ✅ PDF bookmarks/outline

### Phase 3: Advanced Features
- ✅ Security/encryption configuration
- ✅ Async processing
- ✅ URL to PDF conversion
- ✅ Real-time preview (browser only)

### Phase 4: Production Quality
- ✅ DPI control (72/150/300)
- ✅ Image optimization
- ✅ Format selection (JPEG/PNG/WebP)
- ✅ Transparent image handling
- ✅ Searchable text (native)

## 🔄 Migration Guide

### From Browser-Only to Hybrid

**Before (Browser Only):**
```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

// Client-side only
await generatePDF(element, 'document.pdf');
```

**After (Frontend + Backend):**
```typescript
// Frontend (unchanged)
import { generatePDF } from '@encryptioner/html-to-pdf-generator';
await generatePDF(element, 'document.pdf');

// Backend (new)
import { generateServerPDF } from '@encryptioner/html-to-pdf-generator/node';
await generateServerPDF(htmlString, 'document.pdf');
```

### From JSDOM to Puppeteer

**Before (JSDOM - limited):**
```typescript
import { JSDOM } from 'jsdom';
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

const dom = new JSDOM(html);
const blob = await generatePDFBlob(dom.window.document.body, options);
```

**After (Puppeteer - full features):**
```typescript
import { ServerPDFGenerator } from '@encryptioner/html-to-pdf-generator/node';

const generator = new ServerPDFGenerator(options);
const result = await generator.generatePDF(html, 'output.pdf');
await generator.close();
```

## ⚡ Performance Comparison

| Method | Quality | Speed | Memory | Use Case |
|--------|---------|-------|---------|----------|
| **ServerPDFGenerator** | ⭐⭐⭐⭐⭐ | Medium | High | Production server-side |
| **Browser PDFGenerator** | ⭐⭐⭐⭐ | Fast | Low | Client-side only |
| **JSDOM Fallback** | ⭐⭐ | Fast | Low | Simple text documents |

## 🐛 Troubleshooting

### "Puppeteer is required" Error

**Solution:** Install Puppeteer
```bash
npm install puppeteer
```

### Puppeteer Download Fails

**Solution:** Skip browser download (if you have Chrome installed)
```bash
PUPPETEER_SKIP_DOWNLOAD=1 npm install puppeteer
```

Then set executable path:
```typescript
const generator = new ServerPDFGenerator({
  // ...options
});

// Access puppeteer instance and set path
await generator['initPuppeteer']();
```

### Memory Leaks

**Solution:** Always call `close()`
```typescript
const generator = new ServerPDFGenerator();
try {
  await generator.generatePDF(html, 'output.pdf');
} finally {
  await generator.close(); // Critical!
}
```

Or use convenience functions:
```typescript
// Automatically handles cleanup
await generateServerPDF(html, 'output.pdf');
```

### Permission Errors in Docker

**Solution:** Add browser args
```typescript
const generator = new ServerPDFGenerator({
  // Set via environment or config
});

// Puppeteer args are already set:
// ['--no-sandbox', '--disable-setuid-sandbox']
```

## 📚 Related Documentation

- **[MCP Quick Start](../../docs/MCP_QUICKSTART.md)** - Claude Desktop setup
- **[MCP Server Docs](../../mcp/README.md)** - MCP server details
- **[MCP Tools Reference](../../docs/MCP_TOOLS_REFERENCE.md)** - Tool usage guide
- **[Main README](../../README.md)** - Package overview
- **[API Reference](../api/options.md)** - All options

## 🤝 Contributing

Issues and pull requests welcome! Please ensure server-side tests pass:

```bash
# Run tests
pnpm test

# Build all adapters
pnpm run build

# Test MCP server
node mcp/dist/index.js
```

---

**Need Help?** Open an issue at https://github.com/encryptioner/html-to-pdf-generator/issues
