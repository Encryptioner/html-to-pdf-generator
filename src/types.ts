/**
 * PDF Generator Library - Types
 *
 * A modern, reusable library for generating multi-page PDFs from HTML content
 * with proper pagination, styling, and document-like formatting.
 */

/**
 * Watermark configuration
 */
export interface WatermarkOptions {
  /** Watermark text */
  text?: string;

  /** Watermark image (data URL or path) */
  image?: string;

  /** Opacity (0-1) */
  opacity?: number;

  /** Position of watermark */
  position?: 'center' | 'diagonal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Font size for text watermark */
  fontSize?: number;

  /** Color for text watermark (hex or rgb) */
  color?: string;

  /** Rotation angle in degrees (default: 45 for diagonal) */
  rotation?: number;

  /** Apply to all pages */
  allPages?: boolean;
}

/**
 * Header/Footer template configuration
 */
export interface HeaderFooterTemplate {
  /** Template HTML string with variables: {{pageNumber}}, {{totalPages}}, {{date}}, {{title}} */
  template?: string;

  /** Height in mm */
  height?: number;

  /** Custom CSS for header/footer */
  css?: string;

  /** Enable on first page */
  firstPage?: boolean;
}

/**
 * PDF metadata configuration
 */
export interface PDFMetadata {
  /** Document title */
  title?: string;

  /** Document author */
  author?: string;

  /** Document subject */
  subject?: string;

  /** Document keywords */
  keywords?: string[];

  /** Creator application name */
  creator?: string;

  /** Producer application name */
  producer?: string;

  /** Creation date */
  creationDate?: Date;
}

/**
 * Template variable context for rendering
 */
export interface TemplateContext {
  /** Custom variables passed by user */
  [key: string]: string | number | boolean | string[] | Record<string, any>;
}

/**
 * Template system configuration
 */
export interface TemplateOptions {
  /** Template HTML string with variables */
  template: string;

  /** Context/variables to replace in template */
  context?: TemplateContext;

  /** Enable loops with {{#each}} syntax */
  enableLoops?: boolean;

  /** Enable conditionals with {{#if}} syntax */
  enableConditionals?: boolean;
}

/**
 * Font configuration for embedding
 */
export interface FontConfig {
  /** Font family name */
  family: string;

  /** Font source URL or path */
  src: string;

  /** Font weight (100-900) */
  weight?: number;

  /** Font style */
  style?: 'normal' | 'italic' | 'oblique';

  /** Font format */
  format?: 'truetype' | 'opentype' | 'woff' | 'woff2';
}

/**
 * Font handling options
 */
export interface FontOptions {
  /** Custom fonts to embed */
  fonts?: FontConfig[];

  /** Embed all fonts in PDF */
  embedFonts?: boolean;

  /** Fallback font if custom font fails */
  fallbackFont?: string;

  /** Convert to web-safe fonts */
  useWebSafeFonts?: boolean;
}

/**
 * Table of contents entry
 */
export interface TOCEntry {
  /** Entry title */
  title: string;

  /** Entry level (1, 2, 3 for h1, h2, h3) */
  level: number;

  /** Page number */
  page: number;

  /** Optional custom ID */
  id?: string;

  /** Children entries (for nested TOC) */
  children?: TOCEntry[];
}

/**
 * Table of contents configuration
 */
export interface TOCOptions {
  /** Generate TOC */
  enabled?: boolean;

  /** TOC title */
  title?: string;

  /** Heading levels to include (e.g., [1, 2, 3] for h1, h2, h3) */
  levels?: number[];

  /** Position of TOC */
  position?: 'start' | 'end';

  /** Include page numbers */
  includePageNumbers?: boolean;

  /** Custom CSS for TOC */
  css?: string;

  /** Enable links to sections */
  enableLinks?: boolean;

  /** Indentation per level in mm */
  indentPerLevel?: number;
}

/**
 * Bookmark/outline entry
 */
export interface BookmarkEntry {
  /** Bookmark title */
  title: string;

  /** Target page number (1-indexed) */
  page: number;

  /** Bookmark level/depth */
  level?: number;

  /** Children bookmarks (for nested structure) */
  children?: BookmarkEntry[];

  /** Optional custom ID */
  id?: string;
}

/**
 * Bookmarks/outline configuration
 */
export interface BookmarkOptions {
  /** Enable bookmarks */
  enabled?: boolean;

  /** Auto-generate from headings */
  autoGenerate?: boolean;

  /** Heading levels to include (e.g., [1, 2, 3] for h1, h2, h3) */
  levels?: number[];

  /** Custom bookmark entries */
  custom?: BookmarkEntry[];

  /** Open bookmarks panel by default */
  openByDefault?: boolean;
}

/**
 * PDF security permissions
 */
export interface PDFSecurityPermissions {
  /** Allow printing */
  printing?: 'none' | 'lowResolution' | 'highResolution';

  /** Allow modifying the document */
  modifying?: boolean;

  /** Allow copying text and graphics */
  copying?: boolean;

  /** Allow adding or modifying annotations */
  annotating?: boolean;

  /** Allow filling in form fields */
  fillingForms?: boolean;

  /** Allow content accessibility */
  contentAccessibility?: boolean;

  /** Allow assembling document */
  documentAssembly?: boolean;
}

/**
 * PDF security/encryption configuration
 */
export interface PDFSecurityOptions {
  /** Enable encryption */
  enabled?: boolean;

  /** User password (required to open the PDF) */
  userPassword?: string;

  /** Owner password (required to modify permissions) */
  ownerPassword?: string;

  /** Document permissions */
  permissions?: PDFSecurityPermissions;

  /** Encryption strength (128 or 256 bit) */
  encryptionStrength?: 128 | 256;
}

/**
 * Async processing configuration
 */
export interface AsyncProcessingOptions {
  /** Enable async processing */
  enabled?: boolean;

  /** Webhook URL to call when PDF is ready */
  webhookUrl?: string;

  /** Custom headers for webhook request */
  webhookHeaders?: Record<string, string>;

  /** Job ID for tracking */
  jobId?: string;

  /** Progress callback URL */
  progressUrl?: string;
}

/**
 * Preview options for real-time PDF preview
 */
export interface PreviewOptions {
  /** Enable live preview updates */
  liveUpdate?: boolean;

  /** Debounce delay in milliseconds */
  debounce?: number;

  /** Preview quality (lower = faster) */
  quality?: number;

  /** Scale factor for preview */
  scale?: number;

  /** Container element ID for preview */
  containerId?: string;
}

/**
 * URL to PDF configuration
 */
export interface URLToPDFOptions {
  /** URL to convert */
  url: string;

  /** Wait for selector before capturing */
  waitForSelector?: string;

  /** Timeout in milliseconds */
  timeout?: number;

  /** Wait for network idle */
  waitForNetworkIdle?: boolean;

  /** Custom viewport size */
  viewport?: {
    width: number;
    height: number;
  };

  /** Inject custom JavaScript */
  injectJS?: string;

  /** Inject custom CSS */
  injectCSS?: string;

  /** Cookies to set */
  cookies?: Array<{
    name: string;
    value: string;
    domain?: string;
  }>;
}

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

  /** Watermark configuration */
  watermark?: WatermarkOptions;

  /** Header template configuration */
  headerTemplate?: HeaderFooterTemplate;

  /** Footer template configuration */
  footerTemplate?: HeaderFooterTemplate;

  /** PDF metadata */
  metadata?: PDFMetadata;

  /** Emulate print media CSS (@media print) */
  emulateMediaType?: 'screen' | 'print';

  /** Template system configuration */
  templateOptions?: TemplateOptions;

  /** Font handling options */
  fontOptions?: FontOptions;

  /** Table of contents configuration */
  tocOptions?: TOCOptions;

  /** Bookmarks/outline configuration */
  bookmarkOptions?: BookmarkOptions;

  /** PDF security/encryption configuration */
  securityOptions?: PDFSecurityOptions;

  /** Async processing configuration */
  asyncOptions?: AsyncProcessingOptions;

  /** Preview options */
  previewOptions?: PreviewOptions;
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

/**
 * Content item for batch PDF generation
 */
export interface PDFContentItem {
  /** HTML content as element or string */
  content: HTMLElement | string;

  /** Target number of pages for this item */
  pageCount: number;

  /** Optional title for this section */
  title?: string;

  /**
   * Force this item to start on a new page
   * - true: Item starts on a new page (adds page break before)
   * - false: Item can share page with previous content (no forced page break)
   * - undefined: Default behavior (adds page break after each item)
   */
  newPage?: boolean;
}

/**
 * Result from batch PDF generation
 */
export interface BatchPDFGenerationResult {
  /** Generated PDF blob */
  blob: Blob;

  /** Total number of pages across all items */
  totalPages: number;

  /** File size in bytes */
  fileSize: number;

  /** Total generation time in milliseconds */
  generationTime: number;

  /** Per-item statistics */
  items: Array<{
    /** Title if provided */
    title?: string;

    /** Starting page number (1-indexed) */
    startPage: number;

    /** Ending page number (1-indexed) */
    endPage: number;

    /** Actual page count for this item */
    pageCount: number;

    /** Scale factor applied to fit target pages */
    scaleFactor: number;
  }>;
}
