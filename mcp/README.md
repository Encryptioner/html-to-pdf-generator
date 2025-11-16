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

### `generate_pdf`

Generate a PDF file from HTML content.

**Parameters:**

- `html` (string, required): HTML content to convert
- `outputPath` (string, required): Absolute path for the output PDF
- `options` (object, optional): PDF generation options
  - `format`: Paper format ('a4' | 'letter' | 'a3' | 'legal')
  - `orientation`: Page orientation ('portrait' | 'landscape')
  - `margins`: Margins in mm [top, right, bottom, left]
  - `showPageNumbers`: Show page numbers (boolean)
  - `scale`: Scale factor 1-4 for quality
  - `imageQuality`: Image quality 0-1
  - `watermark`: Watermark configuration
  - `metadata`: PDF metadata (title, author, subject, keywords)

**Example:**

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

**Response:**

```json
{
  "success": true,
  "message": "PDF generated successfully",
  "fileSize": 15432,
  "filePath": "/tmp/document.pdf",
  "format": "a4",
  "orientation": "portrait"
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
