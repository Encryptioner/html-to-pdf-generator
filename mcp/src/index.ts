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
import { JSDOM } from 'jsdom';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

// Import the core PDF generator from parent package
// In production, this would use the installed package
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDir = join(__dirname, '..', '..');

// For now, we'll use dynamic import to load the built library
// This will be properly resolved when the package is installed
let PDFGenerator: any;
let generatePDFBlob: any;

try {
  // Try to import from the parent dist folder
  const coreModule = await import(join(parentDir, 'dist', 'index.js'));
  PDFGenerator = coreModule.PDFGenerator;
  generatePDFBlob = coreModule.generatePDFBlob;
} catch (error) {
  console.error('Failed to load PDF generator core library:', error);
  console.error('Please ensure the main package is built: pnpm run build');
  process.exit(1);
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
    return [
      {
        name: 'generate_pdf',
        description: 'Generate a PDF file from HTML content. Supports A4/Letter/A3/Legal formats, custom margins, watermarks, headers/footers, and more. Returns the file path of the generated PDF.',
        inputSchema: {
          type: 'object',
          properties: {
            html: {
              type: 'string',
              description: 'HTML content to convert to PDF. Can include inline styles and CSS.',
            },
            outputPath: {
              type: 'string',
              description: 'Output file path for the PDF (e.g., "/path/to/document.pdf"). Must be absolute path.',
            },
            options: {
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
                  description: 'Add watermark to pages',
                  properties: {
                    text: {
                      type: 'string',
                      description: 'Watermark text',
                    },
                    opacity: {
                      type: 'number',
                      description: 'Opacity 0-1 (default: 0.3)',
                    },
                    fontSize: {
                      type: 'number',
                      description: 'Font size in px (default: 48)',
                    },
                    color: {
                      type: 'string',
                      description: 'Text color (default: #cccccc)',
                    },
                    position: {
                      type: 'string',
                      enum: ['center', 'diagonal', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
                      description: 'Watermark position (default: diagonal)',
                    },
                  },
                },
                metadata: {
                  type: 'object',
                  description: 'PDF metadata',
                  properties: {
                    title: { type: 'string' },
                    author: { type: 'string' },
                    subject: { type: 'string' },
                    keywords: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
          required: ['html', 'outputPath'],
        },
      },
    ];
  }

  /**
   * Handle PDF generation tool
   */
  private async handleGeneratePDF(args: any): Promise<any> {
    const { html, outputPath, options = {} } = args;

    if (!html || typeof html !== 'string') {
      throw new Error('html parameter is required and must be a string');
    }

    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('outputPath parameter is required and must be a string');
    }

    // Create a virtual DOM environment for server-side rendering
    const dom = new JSDOM(html);
    const document = dom.window.document;
    const element = document.body;

    // Create PDF generator instance
    const generator = new PDFGenerator(options);

    try {
      // Generate PDF blob
      const blob = await generatePDFBlob(element, options);

      // Convert blob to buffer
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Write to file
      writeFileSync(outputPath, buffer);

      // Return success response
      const stats = {
        fileSize: buffer.length,
        filePath: outputPath,
        format: options.format || 'a4',
        orientation: options.orientation || 'portrait',
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              message: 'PDF generated successfully',
              ...stats,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : String(error)}`);
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
