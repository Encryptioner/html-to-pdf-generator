# MCP Server Quick Start Guide

> Get started with the HTML to PDF Generator MCP Server in 5 minutes

## 🎯 What You Get

The MCP (Model Context Protocol) server enables you to:
- **Generate PDFs server-side** via Claude Desktop
- **No browser dependencies** - runs in Node.js
- **Full feature access** - All Phase 1-4 features available
- **File system integration** - Save PDFs directly to disk

## 📦 Installation

### Step 1: Install the Package

```bash
npm install @encryptioner/html-to-pdf-generator
```

### Step 2: The MCP Server is Ready!

The MCP server binary (`html-to-pdf-mcp`) is automatically installed with the package.

## 🚀 Usage with Claude Desktop

### Configure Claude Desktop

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "html-to-pdf": {
      "command": "npx",
      "args": ["html-to-pdf-mcp"]
    }
  }
}
```

Or if installed globally:

```json
{
  "mcpServers": {
    "html-to-pdf": {
      "command": "html-to-pdf-mcp"
    }
  }
}
```

### Restart Claude Desktop

Close and reopen Claude Desktop completely for the changes to take effect.

## 💬 Example Conversations

### Basic PDF Generation

```
You: Generate a PDF with the title "My Report" and some content, save it to ~/Documents/report.pdf

Claude: I'll create that PDF for you.

[Claude uses the generate_pdf tool]

✅ PDF generated successfully!
- File: /Users/you/Documents/report.pdf
- Size: 15.2 KB
- Format: A4 Portrait
```

### With Watermark

```
You: Create a PDF with "Q4 Financial Report" as the title and add a "DRAFT" watermark in red. Save to ~/Documents/draft-report.pdf

Claude: I'll generate that PDF with a draft watermark.

[Claude uses the generate_pdf tool with watermark options]

✅ PDF generated successfully!
- File: /Users/you/Documents/draft-report.pdf
- Watermark: "DRAFT" (red, diagonal)
- Format: A4 Portrait
```

### Custom Format & Margins

```
You: Generate a landscape Letter-sized PDF with 20mm margins on all sides. Title should be "Wide Report". Save to ~/Documents/wide.pdf

Claude: I'll create that landscape Letter PDF with custom margins.

[Claude uses the generate_pdf tool with custom options]

✅ PDF generated successfully!
- File: /Users/you/Documents/wide.pdf
- Format: Letter Landscape
- Margins: 20mm all sides
```

### Complex HTML Content

```
You: Create a PDF with a table of products, prices, and descriptions. Include:
- Product A: $19.99 - High quality item
- Product B: $29.99 - Premium item
- Product C: $39.99 - Deluxe item
Add a header "Product Catalog" and save to ~/Documents/catalog.pdf

Claude: I'll create that product catalog PDF with a table.

[Claude generates HTML with a styled table and uses generate_pdf]

✅ PDF generated successfully!
- File: /Users/you/Documents/catalog.pdf
- Pages: 1
- Contains: Formatted table with 3 products
```

## 🔧 Advanced Features

### All Features Available

You can use any feature from the main library:

**Watermarks:**
```
Add a confidential watermark in the top-right corner with 0.2 opacity
```

**Headers/Footers:**
```
Add page numbers in the footer with "Page X of Y" format
```

**Metadata:**
```
Set the PDF title to "Annual Report 2024" and author to "John Doe"
```

**Custom Styling:**
```
Use blue headings and a 2-column layout
```

Claude will understand your natural language requests and configure the PDF generator appropriately!

## 🐛 Troubleshooting

### MCP Server Not Found

**Error:** `command not found: html-to-pdf-mcp`

**Solution:** Use `npx` to run the binary:
```json
{
  "command": "npx",
  "args": ["html-to-pdf-mcp"]
}
```

### Permission Denied

**Error:** Permission denied when saving PDF

**Solution:** Ensure the output directory exists and has write permissions:
```bash
mkdir -p ~/Documents/pdfs
chmod 755 ~/Documents/pdfs
```

### Changes Not Reflecting

**Solution:**
1. Save the config file
2. **Completely quit** Claude Desktop (don't just close the window)
3. Reopen Claude Desktop

### Check Logs

**macOS Logs:**
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Windows Logs:**
```powershell
Get-Content "$env:APPDATA\Claude\logs\mcp*.log" -Wait
```

## 📚 Learn More

- **[MCP Server README](./mcp/README.md)** - Full MCP server documentation
- **[Main Library Docs](./README.md)** - Complete feature documentation
- **[API Reference](./documentation/api/options.md)** - All configuration options
- **[MCP Protocol](https://modelcontextprotocol.io)** - Learn about MCP

## 🎉 Next Steps

Try these commands with Claude:

1. **"Generate a simple invoice PDF"**
2. **"Create a PDF with my resume information"**
3. **"Make a multi-page document with a table of contents"**
4. **"Generate a report with watermarks and page numbers"**

Claude will handle the HTML generation and PDF creation automatically!

---

**Questions?** Check the [MCP Server README](./mcp/README.md) or [open an issue](https://github.com/encryptioner/html-to-pdf-generator/issues).
