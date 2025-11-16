/**
 * PDF Generator - React Adapter
 *
 * React hooks for PDF generation
 */

export {
  usePDFGenerator,
  usePDFGeneratorManual,
  useBatchPDFGenerator
} from './usePDFGenerator';
export type {
  UsePDFGeneratorOptions,
  UsePDFGeneratorReturn,
  UsePDFGeneratorManualReturn,
  UseBatchPDFGeneratorReturn,
} from './usePDFGenerator';

// Preview component and hook
export { PDFPreview, usePDFPreview } from './PDFPreview';
export type { PDFPreviewProps } from './PDFPreview';

// Re-export core functions for direct usage
export {
  PDFGenerator,
  generatePDF,
  generatePDFBlob,
  generatePDFFromHTML,
  generateBlobFromHTML,
  generateBatchPDF,
  generateBatchPDFBlob,
} from '../../core';

// Re-export all types
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
} from '../../types';

// Re-export utility functions
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
} from '../../utils';

// Re-export helper functions
export {
  DEFAULT_PDF_OPTIONS,
  injectPDFStyles,
  HIGH_QUALITY_PDF_OPTIONS,
  FAST_PDF_OPTIONS,
  generatePDFColorCSS,
  getPDFContentWidth,
  PDF_CONTENT_WIDTH_PX
} from '../../helpers';

// Re-export image handling functions
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
  calculateDPIDimensions,
  getRecommendedDPI,
  hasTransparency,
} from '../../image-handler';
export type { ImageProcessingOptions } from '../../image-handler';

// Re-export table handling functions
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
} from '../../table-handler';
export type { TableProcessingOptions, TableInfo } from '../../table-handler';

// Re-export page break handling functions
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
} from '../../page-break-handler';
export type { PageBreakOptions, PageBreakPoint } from '../../page-break-handler';
