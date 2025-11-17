/**
 * Node.js adapter for server-side PDF generation
 *
 * This adapter uses Puppeteer for true browser rendering in Node.js environments.
 * Requires Puppeteer as a peer dependency: npm install puppeteer
 *
 * @example
 * ```typescript
 * import { ServerPDFGenerator } from '@encryptioner/html-to-pdf-generator/node';
 *
 * const generator = new ServerPDFGenerator({ format: 'a4' });
 * await generator.generatePDF('<h1>Hello</h1>', 'output.pdf');
 * await generator.close();
 * ```
 */

export {
  ServerPDFGenerator,
  generateServerPDF,
  generateServerPDFBlob,
  generateServerBatchPDF,
} from './ServerPDFGenerator';

// Re-export types for convenience
export type {
  PDFGeneratorOptions,
  PDFGenerationResult,
  PDFContentItem,
  BatchPDFGenerationResult,
  PDFPageConfig,
  PDFRenderContext,
  WatermarkOptions,
  HeaderFooterTemplate,
  PDFMetadata,
  URLToPDFOptions,
  PDFSecurityOptions,
  PDFSecurityPermissions,
  AsyncProcessingOptions,
  PreviewOptions,
  TOCOptions,
  TOCEntry,
  BookmarkOptions,
  BookmarkEntry,
  FontOptions,
  FontConfig,
  TemplateOptions,
  TemplateContext,
} from '../../types';
