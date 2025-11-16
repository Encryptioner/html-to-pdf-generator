# MCP Tools Quick Reference

> Quick reference for the 3 MCP tools - use this when working with Claude Desktop

## 🚀 Quick Start

**Configure Claude Desktop:**

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

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

Restart Claude Desktop after configuration.

## 🛠️ Tool 1: generate_pdf

**Purpose:** Generate PDF from HTML content or template

**When to use:**
- Single HTML document to PDF
- Invoice, report, or document generation
- Template-based PDFs with variables

**Example prompts:**

```
"Generate a PDF with title 'My Report' and save to ~/Documents/report.pdf"

"Create an invoice PDF for Invoice #1234 with these items: Item 1 ($10), Item 2 ($20).
Save to ~/Documents/invoice.pdf"

"Generate a confidential PDF with a red DRAFT watermark and save to ~/Documents/draft.pdf"
```

**Parameters:**
- `html` (required) - HTML content or template
- `outputPath` (required) - Absolute file path
- `templateContext` (optional) - Variables for template substitution
- `options` (optional) - PDF configuration

**Template Syntax:**
- Variables: `{{name}}`, `{{title}}`, `{{price}}`
- Loops: `{{#each items}}...{{/each}}`
- Conditionals: `{{#if showFooter}}...{{/if}}`

## 🛠️ Tool 2: generate_batch_pdf

**Purpose:** Generate single PDF from multiple content items with auto-scaling

**When to use:**
- Multi-section reports (Executive Summary + Details + Appendix)
- Documents where each section has specific page count requirement
- Combining multiple content pieces into one PDF

**Example prompts:**

```
"Create a report with 3 sections:
1. Executive Summary (should be 1 page)
2. Financial Details (should be 2 pages)
3. Appendix (should be 1 page)
Save to ~/Documents/annual-report.pdf"

"Generate a multi-section document with Cover (1 page), Content (3 pages),
and Index (1 page). Save to ~/Documents/document.pdf"
```

**Parameters:**
- `items` (required) - Array of {html, pageCount}
  - `html` - HTML content for this section
  - `pageCount` - Target pages (content will be scaled to fit)
- `outputPath` (required) - Absolute file path
- `options` (optional) - PDF configuration

**Auto-Scaling:**
Content automatically scales to fit the specified page count. If content naturally fits 3 pages but you specify 2 pages, it will scale down. If it fits 1 page but you specify 2 pages, it will scale up.

## 🛠️ Tool 3: generate_pdf_from_url

**Purpose:** Convert URL to PDF (CORS-aware)

**When to use:**
- Convert web pages to PDF
- Capture documentation or articles
- Archive web content

**Example prompts:**

```
"Convert https://example.com to PDF and save to ~/Documents/webpage.pdf"

"Convert https://docs.example.com to PDF, wait for .content-loaded selector,
and apply print CSS. Save to ~/Documents/docs.pdf"
```

**Parameters:**
- `url` (required) - URL to convert (must be CORS-enabled or same-origin)
- `outputPath` (required) - Absolute file path
- `urlOptions` (optional)
  - `waitForSelector` - CSS selector to wait for
  - `timeout` - Max wait time (default: 10000ms)
  - `injectCSS` - Custom CSS to inject
  - `injectJS` - Custom JavaScript to execute
- `options` (optional) - PDF configuration

**⚠️ Limitations:**
- Only works with CORS-enabled or same-origin URLs
- For production, prefer server-side solutions (Puppeteer, Playwright)

## 📋 Common PDF Options

All 3 tools accept these options:

**Basic Options:**
- `format`: 'a4' | 'letter' | 'a3' | 'legal' (default: 'a4')
- `orientation`: 'portrait' | 'landscape' (default: 'portrait')
- `margins`: [top, right, bottom, left] in mm (default: [10, 10, 10, 10])
- `showPageNumbers`: boolean (default: false)

**Quality Options:**
- `scale`: 1-4 (default: 2) - Higher = better quality
- `imageQuality`: 0-1 (default: 0.85)

**Watermark:**
```
watermark: {
  text: 'CONFIDENTIAL',
  opacity: 0.3,
  fontSize: 48,
  color: '#ff0000',
  position: 'diagonal' | 'center' | 'top-left' | etc.
}
```

**Headers/Footers:**
```
headerTemplate: {
  template: 'Page {{pageNumber}} of {{totalPages}}',
  height: 20,
  firstPage: false
}
```

**Metadata:**
```
metadata: {
  title: 'My Document',
  author: 'John Doe',
  subject: 'Report',
  keywords: ['finance', 'report']
}
```

**Image Options:**
```
imageOptions: {
  dpi: 300,  // 72 (web), 150 (print), 300 (high-quality)
  format: 'jpeg' | 'png' | 'webp',
  backgroundColor: '#ffffff',
  optimizeForPrint: true
}
```

**Media Type:**
- `emulateMediaType`: 'screen' | 'print' - Apply @media print CSS

## 💡 Tips for Using with Claude

**1. Be Specific About File Paths**
- Always provide absolute paths: `~/Documents/report.pdf`
- Claude will expand `~` to your home directory

**2. Describe What You Want**
- "with a red watermark" → Claude configures watermark options
- "in landscape orientation" → Claude sets orientation: 'landscape'
- "with page numbers" → Claude sets showPageNumbers: true

**3. Multi-Section Documents**
- Use `generate_batch_pdf` when you need specific page counts per section
- Mention "should be X pages" and Claude will configure pageCount

**4. Templates**
- Provide the data and Claude will create the HTML template
- Claude understands the template syntax ({{variables}}, {{#each}}, {{#if}})

**5. Natural Language Works**
- You don't need to know the exact parameter names
- Claude translates natural language to tool parameters

## 🎯 Example Conversations

**Simple PDF:**
```
You: Generate a PDF with my contact info and save to ~/contacts.pdf
Claude: [Creates HTML, uses generate_pdf]
```

**Invoice:**
```
You: Create an invoice for customer John Doe with 3 items totaling $100
Claude: [Creates invoice template, uses generate_pdf with templateContext]
```

**Multi-Section Report:**
```
You: Create a 5-page report with Executive Summary (1 page) and Details (4 pages)
Claude: [Uses generate_batch_pdf with 2 items]
```

**Webpage to PDF:**
```
You: Convert https://example.com/docs to PDF
Claude: [Uses generate_pdf_from_url]
```

## 📚 More Information

- **[MCP Quick Start](./MCP_QUICKSTART.md)** - 5-minute setup guide
- **[MCP Server Docs](./mcp/README.md)** - Complete documentation
- **[Test Results](./MCP_TEST_RESULTS.md)** - Verification that all tools work
- **[Main Library](./README.md)** - Full feature documentation

---

**Need Help?** Open an issue at https://github.com/encryptioner/html-to-pdf-generator/issues
