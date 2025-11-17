#!/usr/bin/env node

/**
 * MCP Server for HTML to PDF Generator
 *
 * Provides server-side PDF generation capabilities via Model Context Protocol.
 * This allows Claude Desktop and other MCP clients to generate PDFs from HTML.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, statSync } from 'fs';

// Import the core PDF generator from parent package
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDir = join(__dirname, '..', '..');

// Try to use Puppeteer-based server generator first (best quality)
// Fall back to browser-based generator if Puppeteer not available
let ServerPDFGenerator: any;
let usePuppeteer = false;

try {
  // Try to load the Node.js adapter with Puppeteer support
  const nodeModule = await import(join(parentDir, 'dist', 'node.js'));
  ServerPDFGenerator = nodeModule.ServerPDFGenerator;
  usePuppeteer = true;
  console.error('[MCP] Using Puppeteer for server-side rendering (recommended)');
} catch (error) {
  console.error('[MCP] Puppeteer not available, using fallback mode');
  console.error('[MCP] For best quality, install Puppeteer: npm install puppeteer');
  usePuppeteer = false;
}

// Fallback: Load JSDOM-based generator (lower quality but works without Puppeteer)
let PDFGenerator: any;
let generatePDFBlob: any;
let generateBatchPDF: any;
let JSDOM: any;

if (!usePuppeteer) {
  try {
    const coreModule = await import(join(parentDir, 'dist', 'index.js'));
    PDFGenerator = coreModule.PDFGenerator;
    generatePDFBlob = coreModule.generatePDFBlob;
    generateBatchPDF = coreModule.generateBatchPDF;

    // Import JSDOM for fallback
    const jsdomModule = await import('jsdom');
    JSDOM = jsdomModule.JSDOM;
  } catch (error) {
    console.error('Failed to load PDF generator library:', error);
    console.error('Please ensure the package is built: pnpm run build');
    process.exit(1);
  }
}

/**
 * MCP Server for PDF Generation
 */
class PDFMCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'html-to-pdf-generator',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  /**
   * Define available MCP tools
   */
  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.getTools(),
      };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'generate_pdf':
            return await this.handleGeneratePDF(args);
          case 'generate_batch_pdf':
            return await this.handleGenerateBatchPDF(args);
          case 'generate_pdf_from_url':
            return await this.handleGeneratePDFFromURL(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  /**
   * Get list of available tools with descriptions
   */
  private getTools(): Tool[] {
    // Common PDF options schema (reusable across tools)
    const pdfOptionsSchema = {
      type: 'object',
      description: 'PDF generation options',
      properties: {
        format: {
          type: 'string',
          enum: ['a4', 'letter', 'a3', 'legal'],
          description: 'Paper format (default: a4)',
        },
        orientation: {
          type: 'string',
          enum: ['portrait', 'landscape'],
          description: 'Page orientation (default: portrait)',
        },
        margins: {
          type: 'array',
          items: { type: 'number' },
          minItems: 4,
          maxItems: 4,
          description: 'Margins in mm: [top, right, bottom, left] (default: [10, 10, 10, 10])',
        },
        showPageNumbers: {
          type: 'boolean',
          description: 'Show page numbers (default: false)',
        },
        scale: {
          type: 'number',
          description: 'Scale factor 1-4, higher = better quality (default: 2)',
        },
        imageQuality: {
          type: 'number',
          description: 'Image quality 0-1 (default: 0.85)',
        },
        watermark: {
          type: 'object',
          description: 'Add text or image watermark',
          properties: {
            text: { type: 'string', description: 'Watermark text' },
            image: { type: 'string', description: 'Watermark image (data URL or base64)' },
            opacity: { type: 'number', description: 'Opacity 0-1 (default: 0.3)' },
            fontSize: { type: 'number', description: 'Font size in px (default: 48)' },
            color: { type: 'string', description: 'Text color (default: #cccccc)' },
            position: {
              type: 'string',
              enum: ['center', 'diagonal', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
              description: 'Position (default: diagonal)',
            },
            allPages: { type: 'boolean', description: 'Apply to all pages (default: true)' },
          },
        },
        headerTemplate: {
          type: 'object',
          description: 'Add header to pages',
          properties: {
            template: { type: 'string', description: 'Header template with variables: {{pageNumber}}, {{totalPages}}, {{date}}, {{title}}' },
            height: { type: 'number', description: 'Header height in mm (default: 20)' },
            firstPage: { type: 'boolean', description: 'Show on first page (default: false)' },
          },
        },
        footerTemplate: {
          type: 'object',
          description: 'Add footer to pages',
          properties: {
            template: { type: 'string', description: 'Footer template with variables: {{pageNumber}}, {{totalPages}}, {{date}}, {{title}}' },
            height: { type: 'number', description: 'Footer height in mm (default: 20)' },
            firstPage: { type: 'boolean', description: 'Show on first page (default: true)' },
          },
        },
        metadata: {
          type: 'object',
          description: 'PDF metadata',
          properties: {
            title: { type: 'string' },
            author: { type: 'string' },
            subject: { type: 'string' },
            keywords: { type: 'array', items: { type: 'string' } },
            creator: { type: 'string' },
          },
        },
        emulateMediaType: {
          type: 'string',
          enum: ['screen', 'print'],
          description: 'Emulate media type for CSS (default: screen)',
        },
        imageOptions: {
          type: 'object',
          description: 'Image processing options',
          properties: {
            dpi: { type: 'number', description: 'DPI for images: 72 (web), 150 (print), 300 (high-quality)' },
            format: { type: 'string', enum: ['jpeg', 'png', 'webp'], description: 'Image format' },
            backgroundColor: { type: 'string', description: 'Background for transparent images (default: #ffffff)' },
            optimizeForPrint: { type: 'boolean', description: 'Enable print optimizations' },
            quality: { type: 'number', description: 'Image quality 0-1 (default: 0.92)' },
          },
        },
      },
    };

    return [
      {
        name: 'generate_pdf',
        description: 'Generate a PDF from HTML content or template. Supports all PDF features: watermarks, headers/footers, metadata, print CSS, image optimization. If templateContext is provided, HTML is treated as a template with variable substitution.',
        inputSchema: {
          type: 'object',
          properties: {
            html: {
              type: 'string',
              description: 'HTML content or template. Templates support {{variables}}, {{#each array}}...{{/each}}, {{#if condition}}...{{/if}}',
            },
            outputPath: {
              type: 'string',
              description: 'Absolute file path for the PDF (e.g., "/home/user/documents/report.pdf")',
            },
            templateContext: {
              type: 'object',
              description: 'Optional: Variables for template substitution. If provided, HTML is treated as template.',
            },
            options: pdfOptionsSchema,
          },
          required: ['html', 'outputPath'],
        },
      },
      {
        name: 'generate_batch_pdf',
        description: 'Generate a single PDF from multiple HTML content items with automatic scaling. Each item can specify target page count - content will be auto-scaled to fit. Ideal for multi-section reports, invoices, or documents.',
        inputSchema: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'Array of content items to include in PDF',
              items: {
                type: 'object',
                properties: {
                  html: { type: 'string', description: 'HTML content for this item' },
                  pageCount: { type: 'number', description: 'Target page count - content will be scaled to fit this number of pages' },
                },
                required: ['html', 'pageCount'],
              },
            },
            outputPath: {
              type: 'string',
              description: 'Absolute file path for the PDF (e.g., "/home/user/documents/batch-report.pdf")',
            },
            options: pdfOptionsSchema,
          },
          required: ['items', 'outputPath'],
        },
      },
      {
        name: 'generate_pdf_from_url',
        description: 'Generate PDF from a URL. CORS-aware: only works with same-origin or CORS-enabled URLs. For production use cases, prefer server-side solutions (Puppeteer, Playwright). Supports waiting for selectors and injecting custom CSS/JS.',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL to convert to PDF (must be same-origin or CORS-enabled)',
            },
            outputPath: {
              type: 'string',
              description: 'Absolute file path for the PDF',
            },
            urlOptions: {
              type: 'object',
              description: 'URL-specific options',
              properties: {
                waitForSelector: { type: 'string', description: 'CSS selector to wait for before capture' },
                timeout: { type: 'number', description: 'Max wait time in ms (default: 10000)' },
                injectCSS: { type: 'string', description: 'Custom CSS to inject into page' },
                injectJS: { type: 'string', description: 'Custom JavaScript to execute' },
              },
            },
            options: pdfOptionsSchema,
          },
          required: ['url', 'outputPath'],
        },
      },
    ];
  }

  /**
   * Handle PDF generation tool
   */
  private async handleGeneratePDF(args: any): Promise<any> {
    const { html, outputPath, templateContext, options = {} } = args;

    if (!html || typeof html !== 'string') {
      throw new Error('html parameter is required and must be a string');
    }

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('outputPath parameter is required and must be a string');
    }

    try {
      const startTime = Date.now();
      let result: any;

      // Use Puppeteer if available (best quality)
      if (usePuppeteer) {
        const generator = new ServerPDFGenerator(options);

        try {
          if (templateContext) {
            result = await generator.generatePDFFromTemplate(html, templateContext, outputPath);
          } else {
            result = await generator.generatePDF(html, outputPath);
          }
        } finally {
          await generator.close();
        }

        const generationTime = Date.now() - startTime;

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: 'PDF generated successfully (Puppeteer)',
                filePath: outputPath,
                fileSize: result.fileSize,
                pageCount: result.pageCount,
                format: options.format || 'a4',
                orientation: options.orientation || 'portrait',
                generationTime: `${generationTime}ms`,
                renderMode: 'puppeteer',
              }, null, 2),
            },
          ],
        };
      }

      // Fallback: Use JSDOM (works without Puppeteer but limited quality)
      const generator = new PDFGenerator(options);
      let blob: Blob;

      if (templateContext) {
        blob = await generator.generateBlobFromTemplate(html, templateContext);
      } else {
        const dom = new JSDOM(html);
        const element = dom.window.document.body;
        blob = await generatePDFBlob(element, options);
      }

      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      writeFileSync(outputPath, buffer);

      const generationTime = Date.now() - startTime;

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'PDF generated successfully (fallback mode - install Puppeteer for best quality)',
              filePath: outputPath,
              fileSize: buffer.length,
              format: options.format || 'a4',
              orientation: options.orientation || 'portrait',
              generationTime: `${generationTime}ms`,
              renderMode: 'jsdom-fallback',
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle batch PDF generation tool
   */
  private async handleGenerateBatchPDF(args: any): Promise<any> {
    const { items, outputPath, options = {} } = args;

    if (!items || !Array.isArray(items)) {
      throw new Error('items parameter is required and must be an array');
    }

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('outputPath parameter is required and must be a string');
    }

    try {
      const startTime = Date.now();

      // Convert HTML strings to content items with JSDOM
      const contentItems = items.map((item: any) => {
        if (!item.html || typeof item.html !== 'string') {
          throw new Error('Each item must have an html property (string)');
        }
        if (!item.pageCount || typeof item.pageCount !== 'number') {
          throw new Error('Each item must have a pageCount property (number)');
        }

        const dom = new JSDOM(item.html);
        return {
          content: dom.window.document.body,
          pageCount: item.pageCount,
        };
      });

      // Generate batch PDF
      const result = await generateBatchPDF(contentItems, outputPath, options);

      const generationTime = Date.now() - startTime;

      // Return success response
      const stats = {
        success: true,
        message: 'Batch PDF generated successfully',
        filePath: outputPath,
        fileSize: result.fileSize,
        totalPages: result.pageCount,
        itemCount: result.items.length,
        items: result.items.map((item: any) => ({
          index: item.index,
          pageCount: item.pageCount,
          startPage: item.startPage,
          endPage: item.endPage,
        })),
        generationTime: `${generationTime}ms`,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Batch PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Handle URL to PDF generation tool
   */
  private async handleGeneratePDFFromURL(args: any): Promise<any> {
    const { url, outputPath, urlOptions = {}, options = {} } = args;

    if (!url || typeof url !== 'string') {
      throw new Error('url parameter is required and must be a string');
    }

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('outputPath parameter is required and must be a string');
    }

    try {
      const startTime = Date.now();

      // Create PDF generator instance
      const generator = new PDFGenerator(options);

      // Generate PDF from URL (this will use generatePDF which returns result object)
      // Since we need to get the result with pageCount, we'll call the method directly
      const result = await generator.generatePDFFromURL(url, outputPath, urlOptions);

      const generationTime = Date.now() - startTime;

      // Return success response
      const stats = {
        success: true,
        message: 'PDF from URL generated successfully',
        filePath: outputPath,
        fileSize: result.fileSize,
        pageCount: result.pageCount,
        sourceURL: url,
        generationTime: `${generationTime}ms`,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(stats, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`URL to PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Setup error handling
   */
  private setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Start the MCP server
   */
  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('HTML to PDF MCP Server running on stdio');
  }
}

// Start the server
const server = new PDFMCPServer();
server.start().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
