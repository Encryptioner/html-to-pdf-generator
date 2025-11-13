/**
 * PDF Generator Library - Core Implementation
 *
 * Multi-page PDF generation from HTML content with smart pagination
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type {
  PDFGeneratorOptions,
  PDFPageConfig,
  PDFGenerationResult,
  PDFRenderContext,
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

      if (this.options.showPageNumbers) {
        this.addPageNumber(pdf, pageNumber, totalPages);
      }

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
