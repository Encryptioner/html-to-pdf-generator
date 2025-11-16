# HTML to PDF Generator - MCP Server

> Server-side PDF generation via Model Context Protocol (MCP)

This MCP server enables Claude Desktop and other MCP clients to generate professional PDFs from HTML content server-side, with all the features of the client-side library.

## 🎯 What is MCP?

[Model Context Protocol (MCP)](https://modelcontextprotocol.io) is an open protocol that enables seamless integration between LLM applications and external data sources and tools. This MCP server exposes PDF generation capabilities to Claude Desktop and other MCP clients.

## ✨ Features

- **Server-Side PDF Generation** - Generate PDFs without browser dependencies
- **Full Feature Support** - All features from the client-side library
- **File System Integration** - Save PDFs directly to disk
- **Claude Desktop Integration** - Use with Claude Desktop via MCP
- **Token-Efficient Design** - Optimized for minimal token usage

## 📦 Installation

### Prerequisites

1. **Main Package Built**: The MCP server depends on the built main package
   ```bash
   # From the root of the repository
   pnpm install
   pnpm run build
   ```

2. **MCP Server Dependencies**: Install MCP server dependencies
   ```bash
   cd mcp
   pnpm install
   pnpm run build
   ```

## 🚀 Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "html-to-pdf": {
      "command": "node",
      "args": [
        "/path/to/html-to-pdf-generator/mcp/dist/index.js"
      ]
    }
  }
}
```

After restarting Claude Desktop, you can use PDF generation commands:

**Example Conversation:**

```
You: Generate a PDF with a title "Hello World" and save it to /tmp/hello.pdf

Claude: I'll generate that PDF for you.
[Uses generate_pdf tool]

PDF generated successfully!
- File: /tmp/hello.pdf
- Size: 15.2 KB
- Format: A4 Portrait
```

### Standalone Usage

Run the MCP server directly:

```bash
cd mcp
pnpm start
```

The server communicates via stdio and follows the MCP protocol.

## 🛠️ Available Tools

The MCP server provides three token-efficient tools for PDF generation:

### 1. `generate_pdf`

Generate a PDF from HTML content or template. Supports all PDF features including watermarks, headers/footers, metadata, and image optimization.

**Parameters:**

- `html` (string, required): HTML content or template
  - Templates support `{{variables}}`, `{{#each array}}...{{/each}}`, `{{#if condition}}...{{/if}}`
- `outputPath` (string, required): Absolute path for the output PDF
- `templateContext` (object, optional): Variables for template substitution
- `options` (object, optional): PDF generation options
  - `format`: Paper format ('a4' | 'letter' | 'a3' | 'legal')
  - `orientation`: Page orientation ('portrait' | 'landscape')
  - `margins`: Margins in mm [top, right, bottom, left]
  - `showPageNumbers`: Show page numbers (boolean)
  - `scale`: Scale factor 1-4 for quality
  - `imageQuality`: Image quality 0-1
  - `watermark`: Watermark configuration (text or image)
  - `headerTemplate` / `footerTemplate`: Dynamic headers/footers
  - `metadata`: PDF metadata (title, author, subject, keywords, creator)
  - `emulateMediaType`: 'screen' or 'print' for CSS
  - `imageOptions`: Image processing (dpi, format, backgroundColor, optimizeForPrint)

**Example (Basic HTML):**

```json
{
  "html": "<h1>Hello World</h1><p>This is a PDF.</p>",
  "outputPath": "/tmp/document.pdf",
  "options": {
    "format": "a4",
    "orientation": "portrait",
    "margins": [10, 10, 10, 10],
    "showPageNumbers": true,
    "metadata": {
      "title": "My Document",
      "author": "John Doe"
    }
  }
}
```

**Example (Template with Variables):**

```json
{
  "html": "<h1>{{title}}</h1>{{#each items}}<p>{{name}}: ${{price}}</p>{{/each}}",
  "outputPath": "/tmp/invoice.pdf",
  "templateContext": {
    "title": "Invoice #1234",
    "items": [
      {"name": "Item 1", "price": "10.00"},
      {"name": "Item 2", "price": "20.00"}
    ]
  },
  "options": {
    "format": "a4",
    "metadata": {"title": "Invoice #1234"}
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "PDF generated successfully",
  "filePath": "/tmp/document.pdf",
  "fileSize": 15432,
  "format": "a4",
  "orientation": "portrait",
  "generationTime": "1823ms"
}
```

### 2. `generate_batch_pdf`

Generate a single PDF from multiple HTML content items with automatic scaling. Each item can specify a target page count, and content will be auto-scaled to fit. Ideal for multi-section reports, invoices, or documents.

**Parameters:**

- `items` (array, required): Array of content items
  - Each item has:
    - `html` (string, required): HTML content for this item
    - `pageCount` (number, required): Target page count (content will be scaled to fit)
- `outputPath` (string, required): Absolute path for the output PDF
- `options` (object, optional): Same PDF options as `generate_pdf`

**Example:**

```json
{
  "items": [
    {
      "html": "<h1>Section 1: Executive Summary</h1><p>Long content...</p>",
      "pageCount": 2
    },
    {
      "html": "<h1>Section 2: Details</h1><p>More content...</p>",
      "pageCount": 3
    }
  ],
  "outputPath": "/tmp/report.pdf",
  "options": {
    "format": "a4",
    "showPageNumbers": true,
    "metadata": {"title": "Multi-Section Report"}
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Batch PDF generated successfully",
  "filePath": "/tmp/report.pdf",
  "fileSize": 245678,
  "totalPages": 5,
  "itemCount": 2,
  "items": [
    {"index": 0, "pageCount": 2, "startPage": 1, "endPage": 2},
    {"index": 1, "pageCount": 3, "startPage": 3, "endPage": 5}
  ],
  "generationTime": "2341ms"
}
```

### 3. `generate_pdf_from_url`

Generate PDF from a URL. CORS-aware - only works with same-origin or CORS-enabled URLs. Supports waiting for selectors and injecting custom CSS/JS.

**⚠️ Note:** For production use cases, prefer server-side solutions (Puppeteer, Playwright, wkhtmltopdf) as this tool has CORS limitations.

**Parameters:**

- `url` (string, required): URL to convert to PDF (must be same-origin or CORS-enabled)
- `outputPath` (string, required): Absolute path for the output PDF
- `urlOptions` (object, optional): URL-specific options
  - `waitForSelector` (string): CSS selector to wait for before capture
  - `timeout` (number): Max wait time in ms (default: 10000)
  - `injectCSS` (string): Custom CSS to inject into page
  - `injectJS` (string): Custom JavaScript to execute
- `options` (object, optional): Same PDF options as `generate_pdf`

**Example:**

```json
{
  "url": "https://example.com/page",
  "outputPath": "/tmp/webpage.pdf",
  "urlOptions": {
    "waitForSelector": ".content-loaded",
    "timeout": 15000,
    "injectCSS": ".no-print { display: none; }"
  },
  "options": {
    "format": "a4",
    "emulateMediaType": "print"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "PDF from URL generated successfully",
  "filePath": "/tmp/webpage.pdf",
  "fileSize": 123456,
  "pageCount": 3,
  "sourceURL": "https://example.com/page",
  "generationTime": "3245ms"
}
```

## 🔧 Advanced Features

### Watermarks

Add text watermarks to your PDFs:

```json
{
  "html": "<h1>Confidential Document</h1>",
  "outputPath": "/tmp/confidential.pdf",
  "options": {
    "watermark": {
      "text": "CONFIDENTIAL",
      "opacity": 0.3,
      "fontSize": 48,
      "color": "#ff0000",
      "position": "diagonal"
    }
  }
}
```

### Custom Styling

Use inline CSS or style tags in your HTML:

```json
{
  "html": "<style>h1{color:blue;}</style><h1>Styled Title</h1>",
  "outputPath": "/tmp/styled.pdf"
}
```

### All Phase 1-4 Features Supported

The MCP server supports all features from the main library:
- ✅ Watermarks (text & image)
- ✅ Headers/Footers with templates
- ✅ PDF Metadata
- ✅ Print Media CSS
- ✅ Template Variables
- ✅ Font Handling
- ✅ Table of Contents
- ✅ Bookmarks
- ✅ Enhanced Image Optimization (DPI, format, transparency)

## 📝 Development

### Build

```bash
pnpm run build
```

### Watch Mode

```bash
pnpm run dev
```

### Testing

Test the MCP server with the MCP Inspector:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

## 🐛 Troubleshooting

### "Failed to load PDF generator core library"

Ensure the main package is built:

```bash
cd ..  # Go to root directory
pnpm run build
```

### Claude Desktop Not Detecting Server

1. Check the config file path is correct
2. Ensure the absolute path to `dist/index.js` is correct
3. Restart Claude Desktop completely
4. Check logs in `~/Library/Logs/Claude/` (macOS)

### Permission Errors

Ensure the output directory exists and has write permissions:

```bash
mkdir -p /tmp/pdfs
chmod 755 /tmp/pdfs
```

## 📚 Resources

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [MCP SDK](https://github.com/modelcontextprotocol/sdk)
- [Claude Desktop](https://claude.ai/download)
- [Main Library Documentation](../README.md)

## 🤝 Contributing

Issues and pull requests are welcome! Please see the main repository [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details.

---

**Part of [HTML to PDF Generator](../README.md)** - A modern, framework-agnostic library for professional PDF generation.
