/**
 * Node.js adapter for server-side PDF generation
 * Uses Puppeteer for true HTML rendering without browser dependencies
 */

import type {
  PDFGeneratorOptions,
  PDFGenerationResult,
  PDFContentItem,
  BatchPDFGenerationResult,
} from '../../types';

/**
 * Server-side PDF generator using Puppeteer
 * Provides full browser rendering capabilities in Node.js environment
 *
 * Note: Puppeteer types are optional to avoid build-time dependency.
 * Types will be resolved at runtime when Puppeteer is installed.
 */
export class ServerPDFGenerator {
  private options: Partial<PDFGeneratorOptions>;
  private browser: any | null = null; // Browser instance from Puppeteer
  private puppeteer: any = null;

  constructor(options: Partial<PDFGeneratorOptions> = {}) {
    this.options = options;
  }

  /**
   * Initialize Puppeteer (lazy loading)
   */
  private async initPuppeteer(): Promise<void> {
    if (this.browser) return;

    try {
      // Dynamic import to avoid bundling Puppeteer in browser builds
      // Using dynamic string to prevent TypeScript from checking at compile time
      const puppeteerModule = 'puppeteer';
      this.puppeteer = await import(puppeteerModule);

      this.browser = await this.puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } catch (error) {
      throw new Error(
        'Puppeteer is required for server-side PDF generation. ' +
        'Install it with: npm install puppeteer\n' +
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Generate PDF from HTML string (server-side)
   */
  async generatePDF(
    html: string,
    filename: string
  ): Promise<PDFGenerationResult> {
    await this.initPuppeteer();

    if (!this.browser) {
      throw new Error('Browser initialization failed');
    }

    const page = await this.browser.newPage();

    try {
      const startTime = performance.now();

      // Set viewport for consistent rendering
      await page.setViewportSize({
        width: 794, // A4 width at 96 DPI
        height: 1123, // A4 height at 96 DPI
      });

      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0', // Wait for all resources to load
      });

      // Apply emulateMediaType if specified
      if (this.options.emulateMediaType === 'print') {
        await page.emulateMediaType('print');
      }

      // Generate PDF using Puppeteer's native PDF generation
      const pdfBuffer = await page.pdf({
        format: this.getFormat(),
        printBackground: true,
        margin: this.getMargins(),
        displayHeaderFooter: this.hasHeaderFooter(),
        headerTemplate: this.getHeaderTemplate(),
        footerTemplate: this.getFooterTemplate(),
        preferCSSPageSize: false,
      });

      const generationTime = performance.now() - startTime;

      // Write to file if running in Node.js
      if (typeof process !== 'undefined' && process.versions?.node) {
        const fs = await import('fs');
        fs.writeFileSync(filename, pdfBuffer);
      }

      return {
        pageCount: await this.getPageCount(pdfBuffer),
        fileSize: pdfBuffer.length,
        generationTime: Math.round(generationTime),
        blob: new Blob([pdfBuffer], { type: 'application/pdf' }),
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Generate PDF from template with variables
   */
  async generatePDFFromTemplate(
    template: string,
    context: Record<string, any>,
    filename: string
  ): Promise<PDFGenerationResult> {
    // Import processTemplateWithContext from utils
    const { processTemplateWithContext } = await import('../../utils');

    const html = processTemplateWithContext(template, context, {
      enableLoops: true,
      enableConditionals: true,
    });

    return this.generatePDF(html, filename);
  }

  /**
   * Generate batch PDF from multiple HTML content items
   */
  async generateBatchPDF(
    items: Array<{ html: string; pageCount?: number }>,
    filename: string
  ): Promise<BatchPDFGenerationResult> {
    await this.initPuppeteer();

    if (!this.browser) {
      throw new Error('Browser initialization failed');
    }

    const startTime = performance.now();
    const page = await this.browser.newPage();

    try {
      // Combine all HTML content
      let combinedHTML = '<html><head><style>@page { size: A4; margin: 0; }</style></head><body>';

      items.forEach((item, index) => {
        if (index > 0) {
          combinedHTML += '<div style="page-break-before: always;"></div>';
        }
        combinedHTML += item.html;
      });

      combinedHTML += '</body></html>';

      await page.setContent(combinedHTML, { waitUntil: 'networkidle0' });

      if (this.options.emulateMediaType === 'print') {
        await page.emulateMediaType('print');
      }

      const pdfBuffer = await page.pdf({
        format: this.getFormat(),
        printBackground: true,
        margin: this.getMargins(),
      });

      const generationTime = performance.now() - startTime;

      // Write to file
      if (typeof process !== 'undefined' && process.versions?.node) {
        const fs = await import('fs');
        fs.writeFileSync(filename, pdfBuffer);
      }

      const totalPages = await this.getPageCount(pdfBuffer);

      return {
        pageCount: totalPages,
        fileSize: pdfBuffer.length,
        generationTime: Math.round(generationTime),
        items: items.map((item, index) => ({
          index,
          pageCount: item.pageCount || 1,
          startPage: index + 1,
          endPage: index + 1,
        })),
        blob: new Blob([pdfBuffer], { type: 'application/pdf' }),
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Generate PDF from URL
   */
  async generatePDFFromURL(
    url: string,
    filename: string,
    urlOptions: {
      waitForSelector?: string;
      timeout?: number;
      injectCSS?: string;
      injectJS?: string;
    } = {}
  ): Promise<PDFGenerationResult> {
    await this.initPuppeteer();

    if (!this.browser) {
      throw new Error('Browser initialization failed');
    }

    const page = await this.browser.newPage();

    try {
      const startTime = performance.now();

      // Navigate to URL
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: urlOptions.timeout || 30000,
      });

      // Wait for selector if specified
      if (urlOptions.waitForSelector) {
        await page.waitForSelector(urlOptions.waitForSelector, {
          timeout: urlOptions.timeout || 30000,
        });
      }

      // Inject CSS if provided
      if (urlOptions.injectCSS) {
        await page.addStyleTag({ content: urlOptions.injectCSS });
      }

      // Inject JS if provided
      if (urlOptions.injectJS) {
        await page.evaluate(urlOptions.injectJS);
      }

      if (this.options.emulateMediaType === 'print') {
        await page.emulateMediaType('print');
      }

      const pdfBuffer = await page.pdf({
        format: this.getFormat(),
        printBackground: true,
        margin: this.getMargins(),
      });

      const generationTime = performance.now() - startTime;

      // Write to file
      if (typeof process !== 'undefined' && process.versions?.node) {
        const fs = await import('fs');
        fs.writeFileSync(filename, pdfBuffer);
      }

      return {
        pageCount: await this.getPageCount(pdfBuffer),
        fileSize: pdfBuffer.length,
        generationTime: Math.round(generationTime),
        blob: new Blob([pdfBuffer], { type: 'application/pdf' }),
      };
    } finally {
      await page.close();
    }
  }

  /**
   * Generate blob without saving to file
   */
  async generateBlob(html: string): Promise<Blob> {
    const result = await this.generatePDF(html, '');
    return result.blob;
  }

  /**
   * Close browser instance
   */
  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  // Helper methods

  private getFormat(): 'a4' | 'letter' | 'a3' | 'legal' {
    const format = this.options.format || 'a4';
    return format as 'a4' | 'letter' | 'a3' | 'legal';
  }

  private getMargins(): { top: string; right: string; bottom: string; left: string } {
    const margins = this.options.margins || [10, 10, 10, 10];
    return {
      top: `${margins[0]}mm`,
      right: `${margins[1]}mm`,
      bottom: `${margins[2]}mm`,
      left: `${margins[3]}mm`,
    };
  }

  private hasHeaderFooter(): boolean {
    return !!(this.options.headerTemplate || this.options.footerTemplate);
  }

  private getHeaderTemplate(): string {
    if (!this.options.headerTemplate) return '';
    return this.options.headerTemplate.template || '';
  }

  private getFooterTemplate(): string {
    if (!this.options.footerTemplate) return '';
    return this.options.footerTemplate.template || '';
  }

  private async getPageCount(pdfBuffer: Buffer): Promise<number> {
    // Simple PDF page count by counting /Page objects
    const pdfString = pdfBuffer.toString('latin1');
    const matches = pdfString.match(/\/Type[\s]*\/Page[^s]/g);
    return matches ? matches.length : 1;
  }
}

/**
 * Convenience functions for server-side PDF generation
 */

export async function generateServerPDF(
  html: string,
  filename: string,
  options?: Partial<PDFGeneratorOptions>
): Promise<PDFGenerationResult> {
  const generator = new ServerPDFGenerator(options);
  try {
    return await generator.generatePDF(html, filename);
  } finally {
    await generator.close();
  }
}

export async function generateServerPDFBlob(
  html: string,
  options?: Partial<PDFGeneratorOptions>
): Promise<Blob> {
  const generator = new ServerPDFGenerator(options);
  try {
    return await generator.generateBlob(html);
  } finally {
    await generator.close();
  }
}

export async function generateServerBatchPDF(
  items: Array<{ html: string; pageCount?: number }>,
  filename: string,
  options?: Partial<PDFGeneratorOptions>
): Promise<BatchPDFGenerationResult> {
  const generator = new ServerPDFGenerator(options);
  try {
    return await generator.generateBatchPDF(items, filename);
  } finally {
    await generator.close();
  }
}
