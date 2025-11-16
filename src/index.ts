/**
 * PDF Generator Library
 *
 * A modern, reusable library for generating multi-page PDFs from HTML content
 *
 * @example
 * ```typescript
 * import { generatePDF, PDFGenerator } from './lib/pdf-generator';
 *
 * // Quick usage
 * const element = document.getElementById('content');
 * await generatePDF(element, 'my-document.pdf', {
 *   format: 'a4',
 *   orientation: 'portrait',
 *   showPageNumbers: true,
 * });
 *
 * // Advanced usage with class
 * const generator = new PDFGenerator({
 *   format: 'a4',
 *   margins: [10, 10, 10, 10],
 *   onProgress: (progress) => console.log(`${progress}%`),
 * });
 *
 * const result = await generator.generatePDF(element, 'document.pdf');
 * console.log(`Generated ${result.pageCount} pages in ${result.generationTime}ms`);
 * ```
 */

export {
  PDFGenerator,
  generatePDF,
  generatePDFBlob,
  generatePDFFromHTML,
  generateBlobFromHTML,
  generateBatchPDF,
  generateBatchPDFBlob,
} from './core';
export type {
  PDFGeneratorOptions,
  PDFPageConfig,
  PDFGenerationResult,
  PDFRenderContext,
  PDFContentItem,
  BatchPDFGenerationResult,
  WatermarkOptions,
  HeaderFooterTemplate,
  PDFMetadata,
  TemplateOptions,
  TemplateContext,
  FontOptions,
  FontConfig,
  TOCOptions,
  TOCEntry,
  BookmarkOptions,
  BookmarkEntry,
  PDFSecurityOptions,
  PDFSecurityPermissions,
  AsyncProcessingOptions,
  PreviewOptions,
  URLToPDFOptions,
} from './types';
export {
  PAPER_FORMATS,
  DEFAULT_OPTIONS,
  TAILWIND_COLOR_REPLACEMENTS,
  WEB_SAFE_FONT_MAP,
  calculatePageConfig,
  generateColorReplacementCSS,
  sanitizeFilename,
  htmlStringToElement,
  loadExternalStyles,
  processTemplateWithContext,
  extractHeadings,
  buildTOCHierarchy,
  generateTOCHTML,
  generateTOCCSS,
  buildBookmarkHierarchy,
  replaceWithWebSafeFonts,
  generateFontFaceCSS,
  oklchToRgb,
  convertOklchToRgbInCSS,
  convertOklchInElement,
  convertOklchInStylesheets,
  extractAndConvertOklchFromStylesheets,
} from './utils';
export {
  DEFAULT_PDF_OPTIONS,
  injectPDFStyles,
  HIGH_QUALITY_PDF_OPTIONS,
  FAST_PDF_OPTIONS,
  generatePDFColorCSS,
  getPDFContentWidth,
  PDF_CONTENT_WIDTH_PX
} from './helpers';

// Advanced image handling exports
export {
  preloadImages,
  convertSVGsToImages,
  optimizeImage,
  processImagesForPDF,
  processBackgroundImages,
  getImageDimensions,
  imageToDataURL,
  isDataURL,
  estimateImageSize,
} from './image-handler';
export type { ImageProcessingOptions } from './image-handler';

// Advanced table handling exports
export {
  analyzeTable,
  prepareTableForPDF,
  splitTableForPagination,
  processTablesForPDF,
  addTableZebraStriping,
  fixTableColumnWidths,
  enforceMinimumColumnWidths,
  wrapTableCellText,
  optimizeTableForPDF,
  calculateTableSplitPoints,
  addTableFooter,
} from './table-handler';
export type { TableProcessingOptions, TableInfo } from './table-handler';

// Advanced page break handling exports
export {
  analyzePageBreaks,
  applyPageBreakHints,
  calculatePageBreakPositions,
  insertPageBreakMarkers,
  removePageBreakMarkers,
  wouldElementBeSplit,
  findBestBreakBefore,
  optimizeForPageBreaks,
  hasCustomPageBreak,
  getPageBreakProperties,
  DEFAULT_AVOID_BREAK_INSIDE,
  DEFAULT_BREAK_BEFORE,
} from './page-break-handler';
export type { PageBreakOptions, PageBreakPoint } from './page-break-handler';
