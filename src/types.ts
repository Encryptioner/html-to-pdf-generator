/**
 * PDF Generator Library - Types
 *
 * A modern, reusable library for generating multi-page PDFs from HTML content
 * with proper pagination, styling, and document-like formatting.
 */

export interface PDFGeneratorOptions {
  /** PDF orientation */
  orientation?: 'portrait' | 'landscape';

  /** Paper format */
  format?: 'a4' | 'letter' | 'a3' | 'legal';

  /** Page margins in mm [top, right, bottom, left] */
  margins?: [number, number, number, number];

  /** Enable compression */
  compress?: boolean;

  /** Scale factor for html2canvas (default: 2) */
  scale?: number;

  /** JPEG quality (0-1, default: 0.85) */
  imageQuality?: number;

  /** Custom page header function */
  header?: (pageNumber: number, totalPages: number) => HTMLElement | null;

  /** Custom page footer function */
  footer?: (pageNumber: number, totalPages: number) => HTMLElement | null;

  /** Enable page numbers */
  showPageNumbers?: boolean;

  /** Page number position */
  pageNumberPosition?: 'header' | 'footer';

  /** Custom CSS to inject before rendering */
  customCSS?: string;

  /** Color replacement map (OKLCH to RGB) */
  colorReplacements?: Record<string, string>;

  /** Enable image optimization */
  optimizeImages?: boolean;

  /** Maximum image width in pixels */
  maxImageWidth?: number;

  /** Enable SVG to image conversion */
  convertSVG?: boolean;

  /** Repeat table headers on each page */
  repeatTableHeaders?: boolean;

  /** Prevent table row splits */
  avoidTableRowSplit?: boolean;

  /** Prevent orphaned headings */
  preventOrphanedHeadings?: boolean;

  /** Respect CSS page-break properties */
  respectCSSPageBreaks?: boolean;

  /** Callback for progress updates (0-100) */
  onProgress?: (progress: number) => void;

  /** Callback when PDF generation completes */
  onComplete?: (blob: Blob) => void;

  /** Callback for errors */
  onError?: (error: Error) => void;
}

export interface PDFPageConfig {
  /** Page width in mm */
  width: number;

  /** Page height in mm */
  height: number;

  /** Usable page width (excluding margins) in mm */
  usableWidth: number;

  /** Usable page height (excluding margins) in mm */
  usableHeight: number;

  /** Page width in pixels at current scale */
  widthPx: number;

  /** Page height in pixels at current scale */
  heightPx: number;
}

export interface PDFGenerationResult {
  /** Generated PDF blob */
  blob: Blob;

  /** Total number of pages */
  pageCount: number;

  /** File size in bytes */
  fileSize: number;

  /** Generation time in milliseconds */
  generationTime: number;
}

export interface PDFRenderContext {
  /** jsPDF instance */
  pdf: any;

  /** Page configuration */
  pageConfig: PDFPageConfig;

  /** Current page number */
  currentPage: number;

  /** Total estimated pages */
  totalPages: number;

  /** Options */
  options: Required<PDFGeneratorOptions>;
}
