/**
 * PDF Generator Library - Core Implementation
 *
 * Multi-page PDF generation from HTML content with smart pagination
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import type {
  PDFGeneratorOptions,
  PDFPageConfig,
  PDFGenerationResult,
  PDFRenderContext,
  PDFContentItem,
  BatchPDFGenerationResult,
} from './types';
import {
  DEFAULT_OPTIONS,
  calculatePageConfig,
  generateColorReplacementCSS,
  createStyleElement,
  sanitizeFilename,
  TAILWIND_COLOR_REPLACEMENTS,
  htmlStringToElement,
  loadExternalStyles,
  convertOklchToRgbInCSS,
  convertOklchInElement,
  convertOklchInStylesheets,
  extractAndConvertOklchFromStylesheets,
} from './utils';
import {
  processImagesForPDF,
  processBackgroundImages,
} from './image-handler';
import { processTablesForPDF, optimizeTableForPDF } from './table-handler';
import { applyPageBreakHints } from './page-break-handler';

/**
 * Main PDF Generator Class
 */
export class PDFGenerator {
  private options: Required<PDFGeneratorOptions>;
  private pageConfig: PDFPageConfig;
  private styleElement: HTMLStyleElement | null = null;

  constructor(options: Partial<PDFGeneratorOptions> = {}) {
    // Merge with defaults
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // Include Tailwind color replacements by default
    this.options.colorReplacements = {
      ...TAILWIND_COLOR_REPLACEMENTS,
      ...this.options.colorReplacements,
    };

    // Calculate page configuration
    this.pageConfig = calculatePageConfig(this.options);
  }

  /**
   * Generate PDF from HTML element
   */
  async generatePDF(
    element: HTMLElement,
    filename: string = 'document.pdf'
  ): Promise<PDFGenerationResult> {
    const startTime = performance.now();

    try {
      this.options.onProgress(0);

      // Step 1: Prepare element for rendering
      const preparedElement = await this.prepareElement(element);
      this.options.onProgress(10);

      // Step 2: Create canvas from HTML
      const canvas = await this.renderToCanvas(preparedElement);
      this.options.onProgress(40);

      // Step 3: Generate PDF with pagination
      const pdf = await this.createPDFFromCanvas(canvas);
      this.options.onProgress(80);

      // Step 4: Generate blob and download
      const blob = pdf.output('blob');
      const pageCount = pdf.internal.pages.length - 1; // jsPDF counts empty first page

      this.options.onProgress(90);

      // Step 5: Download file
      pdf.save(sanitizeFilename(filename, 'pdf'));
      this.options.onProgress(100);

      // Cleanup
      this.cleanup(preparedElement);

      const generationTime = performance.now() - startTime;
      const result: PDFGenerationResult = {
        blob,
        pageCount,
        fileSize: blob.size,
        generationTime,
      };

      this.options.onComplete(blob);
      return result;
    } catch (error) {
      this.cleanup();
      const err = error instanceof Error ? error : new Error(String(error));
      this.options.onError(err);
      throw err;
    }
  }

  /**
   * Generate PDF blob without downloading
   */
  async generateBlob(element: HTMLElement): Promise<Blob> {
    const startTime = performance.now();

    try {
      this.options.onProgress(0);

      const preparedElement = await this.prepareElement(element);
      this.options.onProgress(10);

      const canvas = await this.renderToCanvas(preparedElement);
      this.options.onProgress(40);

      const pdf = await this.createPDFFromCanvas(canvas);
      this.options.onProgress(80);

      const blob = pdf.output('blob');
      this.options.onProgress(100);

      this.cleanup(preparedElement);
      this.options.onComplete(blob);

      return blob;
    } catch (error) {
      this.cleanup();
      const err = error instanceof Error ? error : new Error(String(error));
      this.options.onError(err);
      throw err;
    }
  }

  /**
   * Prepare element for PDF rendering
   */
  private async prepareElement(element: HTMLElement): Promise<HTMLElement> {
    this.options.onProgress(5);

    // Create a container for offscreen rendering
    // This allows content to flow naturally to its full height
    const container = document.createElement('div');
    container.id = 'pdf-render-container';
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = `${this.pageConfig.widthPx}px`;
    container.style.padding = '0';
    container.style.margin = '0';
    container.style.backgroundColor = '#ffffff';
    container.style.height = 'auto'; // Allow natural height
    container.style.overflow = 'visible'; // Don't clip content

    // Clone the element
    const clone = element.cloneNode(true) as HTMLElement;
    clone.id = 'pdf-render-target';
    clone.style.width = `${this.pageConfig.widthPx}px`;
    clone.style.maxWidth = `${this.pageConfig.widthPx}px`;
    clone.style.minWidth = `${this.pageConfig.widthPx}px`;
    clone.style.height = 'auto'; // Allow natural content flow
    clone.style.boxSizing = 'border-box';

    container.appendChild(clone);
    document.body.appendChild(container);

    // Inject custom CSS for color replacements and print media emulation
    const cssBlocks = [
      generateColorReplacementCSS(this.options.colorReplacements, 'pdf-render-target'),
      this.options.customCSS,
    ];

    // Emulate print media if requested
    if (this.options.emulateMediaType === 'print') {
      cssBlocks.push(`
        /* Force print media styles to apply */
        @media screen {
          #pdf-render-target * {
            /* Convert print styles to screen */
          }
        }
      `);

      // Apply print styles by temporarily changing media
      const printStyles = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try {
            return Array.from(sheet.cssRules || []);
          } catch {
            return [];
          }
        })
        .filter(rule => {
          if (rule instanceof CSSMediaRule) {
            return rule.media.mediaText.includes('print');
          }
          return false;
        })
        .map(rule => rule.cssText.replace('@media print', ''))
        .join('\n');

      if (printStyles) {
        cssBlocks.push(`/* Print media styles */\n${printStyles}`);
      }
    }

    const css = cssBlocks.join('\n\n');

    // Convert OKLCH colors in custom CSS to RGB
    const cssWithRgb = convertOklchToRgbInCSS(css);

    // Extract and convert all OKLCH rules from document stylesheets
    const oklchOverrides = extractAndConvertOklchFromStylesheets();

    // Combine all CSS
    const finalCss = [cssWithRgb, oklchOverrides].filter(Boolean).join('\n\n');

    this.styleElement = createStyleElement(finalCss, 'pdf-color-override');
    document.head.appendChild(this.styleElement);

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Convert OKLCH colors in stylesheets to RGB (before html2canvas)
    this.options.onProgress(6);
    convertOklchInStylesheets(clone);

    // Convert OKLCH colors in inline styles and computed styles to RGB
    // This is crucial for colors from external stylesheets or Tailwind CSS
    convertOklchInElement(clone);

    // Process images (SVG conversion, optimization, preloading)
    this.options.onProgress(7);
    await processImagesForPDF(clone, {
      compress: this.options.compress,
      quality: this.options.imageQuality,
      maxWidth: this.pageConfig.widthPx,
    });

    // Process background images
    await processBackgroundImages(clone);

    // Process tables for better pagination
    this.options.onProgress(8);
    processTablesForPDF(clone, {
      repeatHeaders: true,
      enforceBorders: true,
      allowRowSplit: false,
    });

    // Optimize tables
    const tables = clone.querySelectorAll('table');
    tables.forEach((table) => optimizeTableForPDF(table as HTMLTableElement));

    // Apply page break hints
    this.options.onProgress(9);
    applyPageBreakHints(clone, {
      preventOrphanedHeadings: true,
      respectCSSPageBreaks: true,
    });

    // Final wait for all processing
    await new Promise((resolve) => setTimeout(resolve, 200));

    return clone;
  }

  /**
   * Render element to canvas using html2canvas
   * Like GoFullPage, captures the ENTIRE content height at once
   */
  private async renderToCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    // Get the actual rendered height of the content
    const actualHeight = element.scrollHeight || element.offsetHeight;

    const canvas = await html2canvas(element, {
      scale: this.options.scale,
      logging: false,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      removeContainer: false,
      imageTimeout: 0,
      width: this.pageConfig.widthPx,
      height: actualHeight, // Capture full content height
      windowWidth: this.pageConfig.widthPx,
      windowHeight: actualHeight, // Allow full height rendering
      scrollY: -window.scrollY, // Reset scroll offset
      scrollX: -window.scrollX,
    });

    return canvas;
  }

  /**
   * Create PDF from canvas with intelligent multi-page pagination
   * Similar to GoFullPage - captures full content and splits into pages naturally
   */
  private async createPDFFromCanvas(canvas: HTMLCanvasElement): Promise<jsPDF> {
    const [marginTop, marginRight, marginBottom, marginLeft] = this.options.margins;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Create PDF
    const pdf = new jsPDF({
      orientation: this.options.orientation,
      unit: 'mm',
      format: this.options.format,
      compress: this.options.compress,
    });

    // Set PDF metadata
    this.setPDFMetadata(pdf);

    // Calculate dimensions - image width fills the usable page width
    const imgWidth = this.pageConfig.usableWidth;

    // Calculate what the full image height would be at this width
    const imgHeightMm = (canvasHeight * imgWidth) / canvasWidth;

    // Calculate how much content fits on one page
    const pageHeightMm = this.pageConfig.usableHeight;

    // Check if content fits on a single page
    if (imgHeightMm <= pageHeightMm) {
      // Single page - add directly
      const imgData = canvas.toDataURL('image/jpeg', this.options.imageQuality);

      pdf.addImage(
        imgData,
        'JPEG',
        marginLeft,
        marginTop,
        imgWidth,
        imgHeightMm
      );

      // Add header/footer
      this.addHeaderFooter(pdf, 1, 1);

      // Add watermark
      if (this.options.watermark?.allPages !== false) {
        this.addWatermark(pdf);
      }

      // Add page number
      if (this.options.showPageNumbers) {
        this.addPageNumber(pdf, 1, 1);
      }

      return pdf;
    }

    // Multi-page: split the canvas into page-sized chunks
    // Calculate how many pixels fit on one page
    const pageHeightPx = (pageHeightMm * canvasWidth) / imgWidth;

    let currentY = 0;
    let pageNumber = 0;
    const totalPages = Math.ceil(canvasHeight / pageHeightPx);

    while (currentY < canvasHeight) {
      pageNumber++;

      if (pageNumber > 1) {
        pdf.addPage();
      }

      // Calculate height for this slice
      const remainingHeight = canvasHeight - currentY;
      const sliceHeight = Math.min(pageHeightPx, remainingHeight);

      // Create a canvas for this page
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvasWidth;
      pageCanvas.height = sliceHeight;

      const ctx = pageCanvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        break;
      }

      // Fill with white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, sliceHeight);

      // Draw the slice from the main canvas
      ctx.drawImage(
        canvas,
        0, currentY,           // Source position
        canvasWidth, sliceHeight,  // Source dimensions
        0, 0,                  // Destination position
        canvasWidth, sliceHeight   // Destination dimensions
      );

      // Convert this slice to image
      const pageImgData = pageCanvas.toDataURL('image/jpeg', this.options.imageQuality);

      // Calculate the mm height for this slice
      const sliceHeightMm = (sliceHeight * imgWidth) / canvasWidth;

      // Add to PDF
      pdf.addImage(
        pageImgData,
        'JPEG',
        marginLeft,
        marginTop,
        imgWidth,
        sliceHeightMm
      );

      // Add header/footer
      this.addHeaderFooter(pdf, pageNumber, totalPages);

      // Add watermark
      if (this.options.watermark?.allPages !== false) {
        this.addWatermark(pdf);
      }

      // Add page number
      if (this.options.showPageNumbers) {
        this.addPageNumber(pdf, pageNumber, totalPages);
      }

      // Move to next slice
      currentY += sliceHeight;
    }

    return pdf;
  }


  /**
   * Add watermark to PDF page
   */
  private addWatermark(pdf: jsPDF): void {
    if (!this.options.watermark) return;

    const watermark = this.options.watermark;
    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const pageHeight = pageSize.getHeight();

    // Set opacity
    const opacity = watermark.opacity ?? 0.3;
    // @ts-ignore - jsPDF GState is not in types
    pdf.setGState(new pdf.GState({ opacity }));

    if (watermark.text) {
      // Text watermark
      const fontSize = watermark.fontSize ?? 48;
      const color = watermark.color ?? '#cccccc';
      const position = watermark.position ?? 'diagonal';
      const rotation = watermark.rotation ?? (position === 'diagonal' ? 45 : 0);

      pdf.setFontSize(fontSize);

      // Parse color
      const rgb = this.parseColor(color);
      pdf.setTextColor(rgb.r, rgb.g, rgb.b);

      // Calculate text dimensions (approximate)
      const textWidth = (pdf.getStringUnitWidth(watermark.text) * fontSize) / pdf.internal.scaleFactor;
      const textHeight = fontSize / pdf.internal.scaleFactor;

      // Calculate position
      const pos = this.calculateWatermarkPosition(
        position,
        pageWidth,
        pageHeight,
        textWidth,
        textHeight
      );

      // Save state and rotate
      pdf.saveGraphicsState();

      if (rotation !== 0) {
        // Translate to position, rotate, then draw
        pdf.text(watermark.text, pos.x, pos.y, {
          angle: rotation,
          align: 'center',
          baseline: 'middle'
        });
      } else {
        pdf.text(watermark.text, pos.x, pos.y, {
          align: position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'center',
          baseline: position.includes('top') ? 'top' : position.includes('bottom') ? 'bottom' : 'middle'
        });
      }

      pdf.restoreGraphicsState();
    } else if (watermark.image) {
      // Image watermark
      const position = watermark.position ?? 'center';
      const imgWidth = 100; // Default width in mm
      const imgHeight = 100; // Default height in mm

      const pos = this.calculateWatermarkPosition(
        position,
        pageWidth,
        pageHeight,
        imgWidth,
        imgHeight
      );

      pdf.addImage(
        watermark.image,
        'PNG',
        pos.x - imgWidth / 2,
        pos.y - imgHeight / 2,
        imgWidth,
        imgHeight
      );
    }

    // Reset opacity
    // @ts-ignore - jsPDF GState is not in types
    pdf.setGState(new pdf.GState({ opacity: 1 }));
  }

  /**
   * Add header/footer template to PDF page
   */
  private addHeaderFooter(
    pdf: jsPDF,
    pageNumber: number,
    totalPages: number
  ): void {
    const pageSize = pdf.internal.pageSize;
    const pageWidth = pageSize.getWidth();
    const [marginTop, marginRight, marginBottom, marginLeft] = this.options.margins;

    // Add header
    if (this.options.headerTemplate?.template) {
      const header = this.options.headerTemplate;

      // Skip first page if configured
      if (pageNumber === 1 && header.firstPage === false) {
        return;
      }

      const variables = {
        pageNumber: String(pageNumber),
        totalPages: String(totalPages),
        date: this.formatDate(),
        title: this.options.metadata?.title || ''
      };

      const headerHtml = this.processTemplate(header.template || '', variables);
      const height = header.height ?? 20;

      // Render header text (simple text rendering)
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(headerHtml, pageWidth / 2, marginTop / 2, { align: 'center' });
    }

    // Add footer
    if (this.options.footerTemplate?.template) {
      const footer = this.options.footerTemplate;

      // Skip first page if configured
      if (pageNumber === 1 && footer.firstPage === false) {
        return;
      }

      const variables = {
        pageNumber: String(pageNumber),
        totalPages: String(totalPages),
        date: this.formatDate(),
        title: this.options.metadata?.title || ''
      };

      const footerHtml = this.processTemplate(footer.template || '', variables);
      const pageHeight = pageSize.getHeight();

      // Render footer text
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      pdf.text(footerHtml, pageWidth / 2, pageHeight - marginBottom / 2, { align: 'center' });
    }
  }

  /**
   * Set PDF metadata
   */
  private setPDFMetadata(pdf: jsPDF): void {
    if (!this.options.metadata) return;

    const metadata = this.options.metadata;

    const properties: any = {};

    if (metadata.title) properties.title = metadata.title;
    if (metadata.author) properties.author = metadata.author;
    if (metadata.subject) properties.subject = metadata.subject;
    if (metadata.keywords) properties.keywords = metadata.keywords.join(', ');
    if (metadata.creator) properties.creator = metadata.creator;

    pdf.setProperties(properties);

    // Set creation date if provided
    if (metadata.creationDate) {
      pdf.setCreationDate(metadata.creationDate);
    }
  }

  /**
   * Helper: Parse color string to RGB
   */
  private parseColor(color: string): { r: number; g: number; b: number } {
    // Try hex color
    const hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
    if (hex) {
      return {
        r: parseInt(hex[1], 16),
        g: parseInt(hex[2], 16),
        b: parseInt(hex[3], 16)
      };
    }

    // Default to gray
    return { r: 200, g: 200, b: 200 };
  }

  /**
   * Helper: Calculate watermark position
   */
  private calculateWatermarkPosition(
    position: string,
    pageWidth: number,
    pageHeight: number,
    width: number,
    height: number
  ): { x: number; y: number } {
    switch (position) {
      case 'center':
      case 'diagonal':
        return { x: pageWidth / 2, y: pageHeight / 2 };
      case 'top-left':
        return { x: width / 2 + 10, y: height / 2 + 10 };
      case 'top-right':
        return { x: pageWidth - width / 2 - 10, y: height / 2 + 10 };
      case 'bottom-left':
        return { x: width / 2 + 10, y: pageHeight - height / 2 - 10 };
      case 'bottom-right':
        return { x: pageWidth - width / 2 - 10, y: pageHeight - height / 2 - 10 };
      default:
        return { x: pageWidth / 2, y: pageHeight / 2 };
    }
  }

  /**
   * Helper: Process template string
   */
  private processTemplate(template: string, variables: Record<string, string>): string {
    let processed = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, value);
    });
    return processed;
  }

  /**
   * Helper: Format date
   */
  private formatDate(date: Date = new Date()): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Add page number to PDF
   */
  private addPageNumber(pdf: jsPDF, pageNumber: number, totalPages: number): void {
    const pageSize = pdf.internal.pageSize;
    const pageHeight = pageSize.getHeight();
    const pageWidth = pageSize.getWidth();

    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);

    const text = `${pageNumber} / ${totalPages}`;

    if (this.options.pageNumberPosition === 'footer') {
      pdf.text(text, pageWidth / 2, pageHeight - 5, { align: 'center' });
    } else {
      pdf.text(text, pageWidth / 2, 5, { align: 'center' });
    }
  }

  /**
   * Cleanup temporary elements
   */
  private cleanup(preparedElement?: HTMLElement): void {
    // Remove style element (includes OKLCH overrides)
    if (this.styleElement && this.styleElement.parentNode) {
      document.head.removeChild(this.styleElement);
      this.styleElement = null;
    }

    // Remove prepared element and container
    if (preparedElement) {
      const container = preparedElement.parentNode;
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    }

    // Remove any stray containers
    const containers = document.querySelectorAll('#pdf-render-container');
    containers.forEach((container) => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
  }

  /**
   * Update options
   */
  updateOptions(options: Partial<PDFGeneratorOptions>): void {
    this.options = { ...this.options, ...options };
    this.pageConfig = calculatePageConfig(this.options);
  }

  /**
   * Get current configuration
   */
  getConfig(): { options: Required<PDFGeneratorOptions>; pageConfig: PDFPageConfig } {
    return {
      options: this.options,
      pageConfig: this.pageConfig,
    };
  }
}

/**
 * Convenience function for quick PDF generation from HTMLElement
 */
export async function generatePDF(
  element: HTMLElement,
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<PDFGenerationResult> {
  const generator = new PDFGenerator(options);
  return generator.generatePDF(element, filename);
}

/**
 * Convenience function for blob generation from HTMLElement
 */
export async function generatePDFBlob(
  element: HTMLElement,
  options: Partial<PDFGeneratorOptions> = {}
): Promise<Blob> {
  const generator = new PDFGenerator(options);
  return generator.generateBlob(element);
}

/**
 * Generate PDF from HTML string (full document or fragment)
 * Supports Tailwind CSS and external stylesheets
 *
 * @example
 * ```typescript
 * const html = `
 *   <!DOCTYPE html>
 *   <html>
 *     <head>
 *       <style>body { font-family: Arial; }</style>
 *     </head>
 *     <body>
 *       <h1>My Document</h1>
 *       <p>Content here</p>
 *     </body>
 *   </html>
 * `;
 *
 * await generatePDFFromHTML(html, 'document.pdf');
 * ```
 */
export async function generatePDFFromHTML(
  htmlString: string,
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<PDFGenerationResult> {
  // Convert HTML string to element
  const element = htmlStringToElement(htmlString);

  // Append to document temporarily (needed for styles to compute)
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.top = '0';
  document.body.appendChild(element);

  try {
    // Load external stylesheets if any
    await loadExternalStyles(element);

    // Wait a bit for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate PDF
    const generator = new PDFGenerator(options);
    const result = await generator.generatePDF(element, filename);

    return result;
  } finally {
    // Cleanup
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

/**
 * Generate PDF blob from HTML string (full document or fragment)
 *
 * @example
 * ```typescript
 * const html = '<div><h1>Hello</h1><p>World</p></div>';
 * const blob = await generateBlobFromHTML(html);
 *
 * // Upload to server
 * const formData = new FormData();
 * formData.append('pdf', blob, 'document.pdf');
 * await fetch('/api/upload', { method: 'POST', body: formData });
 * ```
 */
export async function generateBlobFromHTML(
  htmlString: string,
  options: Partial<PDFGeneratorOptions> = {}
): Promise<Blob> {
  // Convert HTML string to element
  const element = htmlStringToElement(htmlString);

  // Append to document temporarily
  element.style.position = 'absolute';
  element.style.left = '-9999px';
  element.style.top = '0';
  document.body.appendChild(element);

  try {
    // Load external stylesheets if any
    await loadExternalStyles(element);

    // Wait for styles to apply
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate blob
    const generator = new PDFGenerator(options);
    const blob = await generator.generateBlob(element);

    return blob;
  } finally {
    // Cleanup
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }
}

/**
 * Generate PDF from array of content items with specified page counts
 * Content will be automatically scaled to fit within the specified number of pages
 *
 * @example
 * ```typescript
 * const items = [
 *   {
 *     content: document.getElementById('section1'),
 *     pageCount: 2
 *   },
 *   {
 *     content: '<div><h1>Section 2</h1><p>Content</p></div>',
 *     pageCount: 1
 *   }
 * ];
 *
 * const result = await generateBatchPDF(items, 'report.pdf', {
 *   format: 'a4',
 *   showPageNumbers: true
 * });
 *
 * console.log(`Generated ${result.pageCount} pages`);
 * console.log('Items:', result.items);
 * ```
 */
export async function generateBatchPDF(
  contentItems: PDFContentItem[],
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult> {
  const startTime = performance.now();
  const generator = new PDFGenerator(options);
  const config = generator.getConfig();

  try {
    config.options.onProgress(0);

    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: config.options.orientation,
      unit: 'mm',
      format: config.options.format,
      compress: config.options.compress,
    });

    // Set PDF metadata
    generator['setPDFMetadata'](pdf);

    const [marginTop, marginRight, marginBottom, marginLeft] = config.options.margins;
    const itemResults: Array<{
      index: number;
      pageCount: number;
      startPage: number;
      endPage: number;
    }> = [];

    let currentPage = 0;
    let firstItem = true;

    // Process each content item
    for (let i = 0; i < contentItems.length; i++) {
      const item = contentItems[i];
      const progressBase = (i / contentItems.length) * 90;
      config.options.onProgress(progressBase);

      // Convert string content to element if needed
      let element: HTMLElement;
      if (typeof item.content === 'string') {
        element = htmlStringToElement(item.content);
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '0';
        document.body.appendChild(element);
        await loadExternalStyles(element);
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        element = item.content;
      }

      // Prepare element for rendering
      const preparedElement = await generator['prepareElement'](element);
      config.options.onProgress(progressBase + 5);

      // Calculate target height for the specified page count
      const targetPageHeightMm = config.pageConfig.usableHeight * item.pageCount;

      // Render to canvas
      const canvas = await generator['renderToCanvas'](preparedElement);
      config.options.onProgress(progressBase + 15);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate image dimensions
      const imgWidth = config.pageConfig.usableWidth;
      const naturalHeightMm = (canvasHeight * imgWidth) / canvasWidth;

      // Calculate scale factor to fit content into specified pages
      const scaleFactor = targetPageHeightMm / naturalHeightMm;
      const scaledHeightMm = naturalHeightMm * scaleFactor;
      const scaledWidth = imgWidth * scaleFactor;

      // Calculate how many actual pages this will occupy
      const pagesNeeded = Math.ceil(scaledHeightMm / config.pageConfig.usableHeight);
      const startPage = currentPage + 1;

      // Add pages and content
      for (let pageIndex = 0; pageIndex < pagesNeeded; pageIndex++) {
        if (!firstItem || pageIndex > 0) {
          pdf.addPage();
        }
        firstItem = false;
        currentPage++;

        // Calculate the slice of canvas for this page
        const pageHeightMm = config.pageConfig.usableHeight;
        const currentYOffset = pageIndex * pageHeightMm;
        const remainingHeight = scaledHeightMm - currentYOffset;
        const pageContentHeight = Math.min(pageHeightMm, remainingHeight);

        // Calculate canvas coordinates
        const canvasYStart = (currentYOffset / scaledHeightMm) * canvasHeight;
        const canvasSliceHeight = (pageContentHeight / scaledHeightMm) * canvasHeight;

        // Create page canvas
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = canvasSliceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasWidth, canvasSliceHeight);

          ctx.drawImage(
            canvas,
            0, canvasYStart,
            canvasWidth, canvasSliceHeight,
            0, 0,
            canvasWidth, canvasSliceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', config.options.imageQuality);

          pdf.addImage(
            pageImgData,
            'JPEG',
            marginLeft,
            marginTop,
            scaledWidth,
            pageContentHeight
          );

          // Add header/footer
          generator['addHeaderFooter'](pdf, currentPage, -1); // Total pages unknown at this stage

          // Add watermark
          if (config.options.watermark?.allPages !== false) {
            generator['addWatermark'](pdf);
          }

          // Add page number
          if (config.options.showPageNumbers) {
            const pageSize = pdf.internal.pageSize;
            const pageHeight = pageSize.getHeight();
            const pageWidth = pageSize.getWidth();

            pdf.setFontSize(10);
            pdf.setTextColor(128, 128, 128);

            const text = `${currentPage}`;

            if (config.options.pageNumberPosition === 'footer') {
              pdf.text(text, pageWidth / 2, pageHeight - 5, { align: 'center' });
            } else {
              pdf.text(text, pageWidth / 2, 5, { align: 'center' });
            }
          }
        }
      }

      const endPage = currentPage;

      itemResults.push({
        index: i,
        pageCount: pagesNeeded,
        startPage,
        endPage,
      });

      // Cleanup prepared element
      generator['cleanup'](preparedElement);

      // Cleanup temporary element if we created one
      if (typeof item.content === 'string' && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      config.options.onProgress(progressBase + 20);
    }

    config.options.onProgress(90);

    // Generate blob and download
    const blob = pdf.output('blob');
    const totalPages = pdf.internal.pages.length - 1;

    config.options.onProgress(95);

    pdf.save(sanitizeFilename(filename, 'pdf'));
    config.options.onProgress(100);

    const generationTime = performance.now() - startTime;
    const result: BatchPDFGenerationResult = {
      blob,
      pageCount: totalPages,
      fileSize: blob.size,
      generationTime,
      items: itemResults,
    };

    config.options.onComplete(blob);
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    config.options.onError(err);
    throw err;
  }
}

/**
 * Generate PDF blob from array of content items with specified page counts
 * Returns only the blob without downloading
 *
 * @example
 * ```typescript
 * const items = [
 *   {
 *     content: '<div>Section 1</div>',
 *     pageCount: 1
 *   },
 *   {
 *     content: document.getElementById('section2'),
 *     pageCount: 2
 *   }
 * ];
 *
 * const result = await generateBatchPDFBlob(items);
 * // Upload blob to server
 * ```
 */
export async function generateBatchPDFBlob(
  contentItems: PDFContentItem[],
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult> {
  const startTime = performance.now();
  const generator = new PDFGenerator(options);
  const config = generator.getConfig();

  try {
    config.options.onProgress(0);

    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: config.options.orientation,
      unit: 'mm',
      format: config.options.format,
      compress: config.options.compress,
    });

    const [marginTop, marginRight, marginBottom, marginLeft] = config.options.margins;
    const itemResults: Array<{
      index: number;
      pageCount: number;
      startPage: number;
      endPage: number;
    }> = [];

    let currentPage = 0;
    let firstItem = true;

    // Process each content item
    for (let i = 0; i < contentItems.length; i++) {
      const item = contentItems[i];
      const progressBase = (i / contentItems.length) * 90;
      config.options.onProgress(progressBase);

      // Convert string content to element if needed
      let element: HTMLElement;
      if (typeof item.content === 'string') {
        element = htmlStringToElement(item.content);
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.top = '0';
        document.body.appendChild(element);
        await loadExternalStyles(element);
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        element = item.content;
      }

      // Prepare element for rendering
      const preparedElement = await generator['prepareElement'](element);
      config.options.onProgress(progressBase + 5);

      // Calculate target height for the specified page count
      const targetPageHeightMm = config.pageConfig.usableHeight * item.pageCount;

      // Render to canvas
      const canvas = await generator['renderToCanvas'](preparedElement);
      config.options.onProgress(progressBase + 15);

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // Calculate image dimensions
      const imgWidth = config.pageConfig.usableWidth;
      const naturalHeightMm = (canvasHeight * imgWidth) / canvasWidth;

      // Calculate scale factor to fit content into specified pages
      const scaleFactor = targetPageHeightMm / naturalHeightMm;
      const scaledHeightMm = naturalHeightMm * scaleFactor;
      const scaledWidth = imgWidth * scaleFactor;

      // Calculate how many actual pages this will occupy
      const pagesNeeded = Math.ceil(scaledHeightMm / config.pageConfig.usableHeight);
      const startPage = currentPage + 1;

      // Add pages and content
      for (let pageIndex = 0; pageIndex < pagesNeeded; pageIndex++) {
        if (!firstItem || pageIndex > 0) {
          pdf.addPage();
        }
        firstItem = false;
        currentPage++;

        // Calculate the slice of canvas for this page
        const pageHeightMm = config.pageConfig.usableHeight;
        const currentYOffset = pageIndex * pageHeightMm;
        const remainingHeight = scaledHeightMm - currentYOffset;
        const pageContentHeight = Math.min(pageHeightMm, remainingHeight);

        // Calculate canvas coordinates
        const canvasYStart = (currentYOffset / scaledHeightMm) * canvasHeight;
        const canvasSliceHeight = (pageContentHeight / scaledHeightMm) * canvasHeight;

        // Create page canvas
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = canvasSliceHeight;

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasWidth, canvasSliceHeight);

          ctx.drawImage(
            canvas,
            0, canvasYStart,
            canvasWidth, canvasSliceHeight,
            0, 0,
            canvasWidth, canvasSliceHeight
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', config.options.imageQuality);

          pdf.addImage(
            pageImgData,
            'JPEG',
            marginLeft,
            marginTop,
            scaledWidth,
            pageContentHeight
          );

          // Add header/footer
          generator['addHeaderFooter'](pdf, currentPage, -1); // Total pages unknown at this stage

          // Add watermark
          if (config.options.watermark?.allPages !== false) {
            generator['addWatermark'](pdf);
          }

          // Add page number
          if (config.options.showPageNumbers) {
            const pageSize = pdf.internal.pageSize;
            const pageHeight = pageSize.getHeight();
            const pageWidth = pageSize.getWidth();

            pdf.setFontSize(10);
            pdf.setTextColor(128, 128, 128);

            const text = `${currentPage}`;

            if (config.options.pageNumberPosition === 'footer') {
              pdf.text(text, pageWidth / 2, pageHeight - 5, { align: 'center' });
            } else {
              pdf.text(text, pageWidth / 2, 5, { align: 'center' });
            }
          }
        }
      }

      const endPage = currentPage;

      itemResults.push({
        index: i,
        pageCount: pagesNeeded,
        startPage,
        endPage,
      });

      // Cleanup prepared element
      generator['cleanup'](preparedElement);

      // Cleanup temporary element if we created one
      if (typeof item.content === 'string' && element.parentNode) {
        element.parentNode.removeChild(element);
      }

      config.options.onProgress(progressBase + 20);
    }

    config.options.onProgress(90);

    // Generate blob
    const blob = pdf.output('blob');
    const totalPages = pdf.internal.pages.length - 1;

    config.options.onProgress(100);

    const generationTime = performance.now() - startTime;
    const result: BatchPDFGenerationResult = {
      blob,
      pageCount: totalPages,
      fileSize: blob.size,
      generationTime,
      items: itemResults,
    };

    config.options.onComplete(blob);
    return result;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    config.options.onError(err);
    throw err;
  }
}
