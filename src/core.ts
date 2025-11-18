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

    // Inject custom CSS for color replacements
    const css = [
      generateColorReplacementCSS(this.options.colorReplacements, 'pdf-render-target'),
      this.options.customCSS,
    ].join('\n\n');

    this.styleElement = createStyleElement(css, 'pdf-color-override');
    document.head.appendChild(this.styleElement);

    // Wait for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 100));

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

    // Apply metadata if provided
    if (this.options.metadata) {
      const metadata = this.options.metadata;
      const properties: any = {};

      if (metadata.title) properties.title = metadata.title;
      if (metadata.author) properties.author = metadata.author;
      if (metadata.subject) properties.subject = metadata.subject;
      if (metadata.creator) properties.creator = metadata.creator;

      // Keywords can be array or string
      if (metadata.keywords) {
        properties.keywords = Array.isArray(metadata.keywords)
          ? metadata.keywords.join(', ')
          : metadata.keywords;
      }

      // Set creation date
      if (metadata.creationDate) {
        properties.creationDate = metadata.creationDate;
      }

      pdf.setProperties(properties);
    }

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

      // Apply header/footer callbacks
      await this.applyHeaderFooter(pdf, 1, 1);

      if (this.options.showPageNumbers) {
        this.addPageNumber(pdf, 1, 1);
      }

      // Apply watermark to page
      await this.applyWatermark(pdf);

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

      // Apply header/footer callbacks
      await this.applyHeaderFooter(pdf, pageNumber, totalPages);

      if (this.options.showPageNumbers) {
        this.addPageNumber(pdf, pageNumber, totalPages);
      }

      // Apply watermark to page
      await this.applyWatermark(pdf);

      // Move to next slice
      currentY += sliceHeight;
    }

    return pdf;
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
   * Apply header and footer callbacks (simplified text-based implementation)
   * Note: For complex HTML headers/footers, use headerTemplate/footerTemplate instead
   */
  private async applyHeaderFooter(pdf: jsPDF, pageNumber: number, totalPages: number): Promise<void> {
    const pageSize = pdf.internal.pageSize;
    const pageHeight = pageSize.getHeight();
    const pageWidth = pageSize.getWidth();

    // Apply header callback if provided
    if (this.options.header) {
      const headerElement = this.options.header(pageNumber, totalPages);
      if (headerElement) {
        // Simple text extraction from element
        const headerText = headerElement.textContent || headerElement.innerText || '';
        if (headerText) {
          pdf.setFontSize(10);
          pdf.setTextColor(64, 64, 64);
          pdf.text(headerText, pageWidth / 2, 7, { align: 'center' });
        }
      }
    }

    // Apply footer callback if provided
    if (this.options.footer) {
      const footerElement = this.options.footer(pageNumber, totalPages);
      if (footerElement) {
        // Simple text extraction from element
        const footerText = footerElement.textContent || footerElement.innerText || '';
        if (footerText) {
          pdf.setFontSize(10);
          pdf.setTextColor(64, 64, 64);
          pdf.text(footerText, pageWidth / 2, pageHeight - 7, { align: 'center' });
        }
      }
    }
  }

  /**
   * Apply watermark to current PDF page
   */
  private async applyWatermark(pdf: jsPDF): Promise<void> {
    const watermark = this.options.watermark;

    // Skip if no watermark configured
    if (!watermark || (!watermark.text && !watermark.image)) {
      return;
    }

    const pageSize = pdf.internal.pageSize;
    const pageHeight = pageSize.getHeight();
    const pageWidth = pageSize.getWidth();

    // Save current graphics state
    pdf.saveGraphicsState();

    // Handle text watermark
    if (watermark.text) {
      const fontSize = watermark.fontSize || 48;
      const opacity = watermark.opacity !== undefined ? watermark.opacity : 0.1;
      const color = watermark.color || '#cccccc';
      const position = watermark.position || 'diagonal';
      const rotation = watermark.rotation !== undefined
        ? watermark.rotation
        : (position === 'diagonal' ? 45 : 0);

      // Set text properties
      pdf.setFontSize(fontSize);

      // Parse color (support hex and rgb)
      let r = 204, g = 204, b = 204; // Default gray
      if (color.startsWith('#')) {
        const hex = color.substring(1);
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }

      pdf.setTextColor(r, g, b);
      (pdf as any).setGState((pdf as any).GState({ opacity }));

      // Calculate text dimensions (approximate)
      const textWidth = pdf.getTextWidth(watermark.text);
      const textHeight = fontSize * 0.35; // Approximate height in mm

      // Calculate position
      let x = pageWidth / 2;
      let y = pageHeight / 2;

      switch (position) {
        case 'center':
        case 'diagonal':
          x = pageWidth / 2;
          y = pageHeight / 2;
          break;
        case 'top-left':
          x = textWidth / 2 + 10;
          y = textHeight / 2 + 10;
          break;
        case 'top-right':
          x = pageWidth - textWidth / 2 - 10;
          y = textHeight / 2 + 10;
          break;
        case 'bottom-left':
          x = textWidth / 2 + 10;
          y = pageHeight - textHeight / 2 - 10;
          break;
        case 'bottom-right':
          x = pageWidth - textWidth / 2 - 10;
          y = pageHeight - textHeight / 2 - 10;
          break;
      }

      // Apply rotation and draw text
      if (rotation !== 0) {
        pdf.text(watermark.text, x, y, {
          align: 'center',
          angle: rotation,
        });
      } else {
        pdf.text(watermark.text, x, y, { align: 'center' });
      }
    }

    // Handle image watermark
    if (watermark.image) {
      const opacity = watermark.opacity !== undefined ? watermark.opacity : 0.15;
      const position = watermark.position || 'center';

      try {
        // Load image - support both data URLs and paths
        let imageData = watermark.image;

        // If it's a path, we need to load it as data URL
        if (!watermark.image.startsWith('data:')) {
          // For now, we'll skip loading external images in the browser context
          // This would require CORS and async image loading
          console.warn('External image URLs for watermarks require data URLs. Please convert image to base64.');
          pdf.restoreGraphicsState();
          return;
        }

        // Calculate image dimensions (we'll use a default size)
        const imgWidth = 50; // mm
        const imgHeight = 50; // mm

        // Calculate position
        let x = (pageWidth - imgWidth) / 2;
        let y = (pageHeight - imgHeight) / 2;

        switch (position) {
          case 'center':
          case 'diagonal':
            x = (pageWidth - imgWidth) / 2;
            y = (pageHeight - imgHeight) / 2;
            break;
          case 'top-left':
            x = 10;
            y = 10;
            break;
          case 'top-right':
            x = pageWidth - imgWidth - 10;
            y = 10;
            break;
          case 'bottom-left':
            x = 10;
            y = pageHeight - imgHeight - 10;
            break;
          case 'bottom-right':
            x = pageWidth - imgWidth - 10;
            y = pageHeight - imgHeight - 10;
            break;
        }

        // Set opacity
        (pdf as any).setGState((pdf as any).GState({ opacity }));

        // Add image
        pdf.addImage(imageData, 'PNG', x, y, imgWidth, imgHeight);
      } catch (error) {
        console.error('Failed to add image watermark:', error);
      }
    }

    // Restore graphics state
    pdf.restoreGraphicsState();
  }

  /**
   * Cleanup temporary elements
   */
  private cleanup(preparedElement?: HTMLElement): void {
    // Remove style element
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
 * Generate batch PDF from multiple content items
 *
 * Combines multiple HTML elements/strings into a single PDF. Each item is rendered
 * sequentially in the final document. Use the `newPage` parameter to control page breaks:
 * - newPage: true → Force item to start on a new page
 * - newPage: false → Allow item to share page with previous content
 * - newPage: undefined → Default behavior (page break after each item)
 *
 * Note: The pageCount property in each item is used as a hint for scaling but may
 * not be exact. The actual page count depends on content size and layout.
 *
 * @example
 * ```typescript
 * const items = [
 *   { content: document.getElementById('section1'), pageCount: 2, title: 'Introduction', newPage: true },
 *   { content: '<div><h1>Chapter 2</h1><p>Content...</p></div>', pageCount: 3, title: 'Details', newPage: true },
 *   { content: document.getElementById('section3'), pageCount: 1, title: 'Summary', newPage: false },
 * ];
 *
 * const result = await generateBatchPDF(items, 'report.pdf', {
 *   format: 'a4',
 *   showPageNumbers: true,
 *   onProgress: (progress) => console.log(`${progress}%`),
 * });
 *
 * console.log(`Generated ${result.totalPages} pages`);
 * console.log('Items:', result.items);
 * ```
 */
export async function generateBatchPDF(
  items: PDFContentItem[],
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult> {
  const result = await generateBatchPDFBlob(items, options);

  // Download the PDF if in browser environment and filename provided
  if (filename && typeof document !== 'undefined') {
    const sanitized = sanitizeFilename(filename, 'pdf');
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = sanitized;
    link.click();
    URL.revokeObjectURL(url);
  }

  return result;
}

/**
 * Generate batch PDF blob without downloading
 *
 * @example
 * ```typescript
 * const items = [
 *   { content: element1, pageCount: 2 },
 *   { content: element2, pageCount: 3 },
 * ];
 *
 * const result = await generateBatchPDFBlob(items, options);
 *
 * // Upload to server
 * const formData = new FormData();
 * formData.append('pdf', result.blob, 'report.pdf');
 * await fetch('/api/upload', { method: 'POST', body: formData });
 * ```
 */
export async function generateBatchPDFBlob(
  items: PDFContentItem[],
  options: Partial<PDFGeneratorOptions> = {}
): Promise<BatchPDFGenerationResult> {
  const startTime = Date.now();

  if (!items || items.length === 0) {
    throw new Error('Batch PDF generation requires at least one content item');
  }

  // Check if we're in a browser environment
  const isBrowser = typeof document !== 'undefined';

  if (!isBrowser) {
    throw new Error('Batch PDF generation currently requires a browser environment');
  }

  // Check if all items have newPage: true (separate PDF approach)
  const allNewPage = items.every(item => item.newPage === true);

  // Check if all items have newPage: false (combined approach)
  const allCombined = items.every(item => item.newPage === false);

  // If mixed or undefined, use the separate PDF approach for safety
  const useSeparatePDFs = allNewPage || (!allCombined && items.some(item => item.newPage !== false));

  if (useSeparatePDFs) {
    // APPROACH 1: Generate separate PDFs and merge them
    // This guarantees each item starts on a new page
    return generateBatchPDFSeparate(items, options, startTime);
  } else {
    // APPROACH 2: Combine all items in one container (for newPage: false)
    // Items can share pages naturally
    return generateBatchPDFCombined(items, options, startTime);
  }
}

/**
 * Generate separate PDFs for each item and merge them
 * This ensures each item starts on a new page
 */
async function generateBatchPDFSeparate(
  items: PDFContentItem[],
  options: Partial<PDFGeneratorOptions>,
  startTime: number
): Promise<BatchPDFGenerationResult> {
  const progressCallback = options.onProgress;
  const itemResults: BatchPDFGenerationResult['items'] = [];

  // We'll generate each item as a separate PDF and concatenate the blobs
  // This is simpler than trying to merge PDF objects
  const individualPDFs: Array<{ blob: Blob; title?: string }> = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];

    // Progress tracking
    if (progressCallback) {
      const progress = Math.floor(((i + 1) / items.length) * 90); // Reserve 10% for final merge
      progressCallback(progress);
    }

    // Prepare element
    let element: HTMLElement;
    if (typeof item.content === 'string') {
      element = htmlStringToElement(item.content);
    } else {
      element = item.content.cloneNode(true) as HTMLElement;
    }

    // Generate individual PDF for this item
    const generator = new PDFGenerator(options);
    const blob = await generator.generateBlob(element);

    individualPDFs.push({
      blob,
      title: item.title
    });
  }

  // Use pdf-lib to properly merge all PDFs into one
  const { PDFDocument } = await import('pdf-lib');

  // Create a new merged PDF document
  const mergedPdf = await PDFDocument.create();

  let currentPage = 0;

  // Process each individual PDF
  for (let i = 0; i < individualPDFs.length; i++) {
    const pdfData = individualPDFs[i];

    try {
      // Convert blob to array buffer
      const arrayBuffer = await pdfData.blob.arrayBuffer();

      // Load the PDF using pdf-lib
      const pdf = await PDFDocument.load(arrayBuffer);

      // Get all pages from this PDF
      const pageCount = pdf.getPageCount();

      // Copy all pages from this PDF to the merged PDF
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      // Add each copied page to the merged document
      copiedPages.forEach(page => {
        mergedPdf.addPage(page);
      });

      // Track metadata for this item
      const startPage = currentPage + 1;
      const endPage = currentPage + pageCount;

      itemResults.push({
        title: pdfData.title,
        startPage,
        endPage,
        pageCount,
        scaleFactor: 1.0,
      });

      currentPage = endPage;

    } catch (error) {
      console.error(`Failed to merge PDF for item ${i}:`, error);

      // Fallback metadata (still add to results even if merge failed)
      const pageCount = 1;
      const startPage = currentPage + 1;
      const endPage = currentPage + pageCount;

      itemResults.push({
        title: pdfData.title,
        startPage,
        endPage,
        pageCount,
        scaleFactor: 1.0,
      });

      currentPage = endPage;
    }
  }

  // Save the merged PDF as bytes
  const mergedPdfBytes = await mergedPdf.save();

  // Convert to Blob (type assertion needed for pdf-lib compatibility)
  const finalBlob = new Blob([mergedPdfBytes as any], { type: 'application/pdf' });
  const totalPages = currentPage;
  const generationTime = Date.now() - startTime;

  if (progressCallback) {
    progressCallback(100);
  }

  if (options.onComplete) {
    options.onComplete(finalBlob);
  }

  return {
    blob: finalBlob,
    totalPages,
    fileSize: finalBlob.size,
    generationTime,
    items: itemResults,
  };
}

/**
 * Combine all items in one container (for newPage: false)
 * Items can share pages naturally
 */
async function generateBatchPDFCombined(
  items: PDFContentItem[],
  options: Partial<PDFGeneratorOptions>,
  startTime: number
): Promise<BatchPDFGenerationResult> {
  const progressCallback = options.onProgress;

  // Create a container for all content items
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96 DPI
  document.body.appendChild(container);

  try {
    // Process each content item
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let element: HTMLElement;

      if (typeof item.content === 'string') {
        element = htmlStringToElement(item.content);
      } else {
        element = item.content.cloneNode(true) as HTMLElement;
      }

      container.appendChild(element);
    }

    // Load external styles if any
    await loadExternalStyles(container);
    await new Promise(resolve => setTimeout(resolve, 200));

    // Track progress
    if (progressCallback) {
      progressCallback(50);
    }

    // Generate the PDF using the combined container
    const generator = new PDFGenerator(options);
    const blob = await generator.generateBlob(container);

    // Estimate page breakdown
    const totalPages = Math.ceil(items.reduce((sum, item) => sum + (item.pageCount || 1), 0));

    const itemResults: BatchPDFGenerationResult['items'] = items.map((item, index) => {
      const previousPages = items.slice(0, index).reduce((sum, it) => sum + (it.pageCount || 1), 0);
      return {
        title: item.title,
        startPage: previousPages + 1,
        endPage: previousPages + (item.pageCount || 1),
        pageCount: item.pageCount || 1,
        scaleFactor: 1.0,
      };
    });

    const generationTime = Date.now() - startTime;

    if (progressCallback) {
      progressCallback(100);
    }

    if (options.onComplete) {
      options.onComplete(blob);
    }

    return {
      blob,
      totalPages,
      fileSize: blob.size,
      generationTime,
      items: itemResults,
    };
  } finally {
    // Cleanup
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
