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

The MCP server provides **3 tools** for different PDF generation scenarios:
- `generate_pdf` - Single HTML to PDF (with optional template support)
- `generate_batch_pdf` - Multiple content items with auto-scaling
- `generate_pdf_from_url` - URL to PDF conversion

### 1. Basic PDF Generation

```
You: Generate a PDF with the title "My Report" and some content, save it to ~/Documents/report.pdf

Claude: I'll create that PDF for you.

[Claude uses the generate_pdf tool]

✅ PDF generated successfully!
- File: /Users/you/Documents/report.pdf
- Size: 15.2 KB
- Format: A4 Portrait
```

### 2. PDF with Watermark

```
You: Create a PDF with "Q4 Financial Report" as the title and add a "DRAFT" watermark in red. Save to ~/Documents/draft-report.pdf

Claude: I'll generate that PDF with a draft watermark.

[Claude uses the generate_pdf tool with watermark options]

✅ PDF generated successfully!
- File: /Users/you/Documents/draft-report.pdf
- Watermark: "DRAFT" (red, diagonal)
- Format: A4 Portrait
```

### 3. Template with Variables

```
You: Create an invoice PDF for Invoice #1234 with these items:
- Item 1: $10.00
- Item 2: $20.00
Save to ~/Documents/invoice.pdf

Claude: I'll create that invoice using a template.

[Claude uses the generate_pdf tool with templateContext]

✅ PDF generated successfully!
- File: /Users/you/Documents/invoice.pdf
- Template variables processed
- Items: 2
```

### 4. Batch PDF (Multi-Section Report)

```
You: Create a report with 3 sections:
1. Executive Summary (should be 1 page)
2. Financial Details (should be 2 pages)
3. Appendix (should be 1 page)
Save to ~/Documents/annual-report.pdf

Claude: I'll create a multi-section PDF with auto-scaling.

[Claude uses the generate_batch_pdf tool]

✅ Batch PDF generated successfully!
- File: /Users/you/Documents/annual-report.pdf
- Total pages: 4
- Sections: 3
- Each section scaled to fit target pages
```

### 5. URL to PDF

```
You: Convert https://example.com to a PDF and save to ~/Documents/webpage.pdf

Claude: I'll convert that webpage to PDF.

[Claude uses the generate_pdf_from_url tool]

✅ PDF from URL generated successfully!
- File: /Users/you/Documents/webpage.pdf
- Source: https://example.com
- Pages: 3
```

### 6. Custom Format & Margins

```
You: Generate a landscape Letter-sized PDF with 20mm margins on all sides. Title should be "Wide Report". Save to ~/Documents/wide.pdf

Claude: I'll create that landscape Letter PDF with custom margins.

[Claude uses the generate_pdf tool with custom options]

✅ PDF generated successfully!
- File: /Users/you/Documents/wide.pdf
- Format: Letter Landscape
- Margins: 20mm all sides
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
