/**
 * PDF Generator Library - Utilities
 *
 * Helper functions for PDF generation, color conversion, and styling
 */

import type {
  PDFGeneratorOptions,
  PDFPageConfig,
  WatermarkOptions,
  HeaderFooterTemplate,
  PDFMetadata,
  TemplateOptions,
  FontOptions,
  TOCOptions,
  BookmarkOptions,
  TemplateContext,
  TOCEntry,
  BookmarkEntry
} from './types';

/** Standard paper formats in mm */
export const PAPER_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 215.9, height: 279.4 },
  a3: { width: 297, height: 420 },
  legal: { width: 215.9, height: 355.6 },
} as const;

/** Default options for PDF generation */
export const DEFAULT_OPTIONS: Required<PDFGeneratorOptions> = {
  orientation: 'portrait',
  format: 'a4',
  margins: [10, 10, 10, 10],
  compress: true,
  scale: 2,
  imageQuality: 0.85,
  header: () => null,
  footer: () => null,
  showPageNumbers: false,
  pageNumberPosition: 'footer',
  customCSS: '',
  colorReplacements: {},
  optimizeImages: true,
  maxImageWidth: 1200,
  convertSVG: true,
  repeatTableHeaders: true,
  avoidTableRowSplit: true,
  preventOrphanedHeadings: true,
  respectCSSPageBreaks: true,
  onProgress: () => {},
  onComplete: () => {},
  onError: () => {},
  emulateMediaType: 'screen',
  watermark: undefined as unknown as WatermarkOptions,
  headerTemplate: undefined as unknown as HeaderFooterTemplate,
  footerTemplate: undefined as unknown as HeaderFooterTemplate,
  metadata: undefined as unknown as PDFMetadata,
  templateOptions: undefined as unknown as TemplateOptions,
  fontOptions: undefined as unknown as FontOptions,
  tocOptions: undefined as unknown as TOCOptions,
  bookmarkOptions: undefined as unknown as BookmarkOptions,
};

/**
 * Calculate page configuration based on options
 */
export function calculatePageConfig(
  options: Required<PDFGeneratorOptions>
): PDFPageConfig {
  const format = PAPER_FORMATS[options.format];
  const [marginTop, marginRight, marginBottom, marginLeft] = options.margins;

  const width = options.orientation === 'portrait' ? format.width : format.height;
  const height = options.orientation === 'portrait' ? format.height : format.width;

  const usableWidth = width - marginLeft - marginRight;
  const usableHeight = height - marginTop - marginBottom;

  // Convert mm to pixels (96 DPI: 1mm = 3.7795px)
  const MM_TO_PX = 3.7795;
  const widthPx = usableWidth * MM_TO_PX;
  const heightPx = usableHeight * MM_TO_PX;

  return {
    width,
    height,
    usableWidth,
    usableHeight,
    widthPx,
    heightPx,
  };
}

/**
 * Common Tailwind OKLCH color replacements
 */
export const TAILWIND_COLOR_REPLACEMENTS: Record<string, string> = {
  '--color-red-50': '#fef2f2',
  '--color-red-100': '#fee2e2',
  '--color-red-200': '#fecaca',
  '--color-red-300': '#fca5a5',
  '--color-red-400': '#f87171',
  '--color-red-500': '#ef4444',
  '--color-red-600': '#dc2626',
  '--color-red-700': '#b91c1c',
  '--color-red-800': '#991b1b',
  '--color-red-900': '#7f1d1d',

  '--color-orange-50': '#fff7ed',
  '--color-orange-100': '#ffedd5',
  '--color-orange-200': '#fed7aa',
  '--color-orange-300': '#fdba74',
  '--color-orange-400': '#fb923c',
  '--color-orange-500': '#f97316',
  '--color-orange-600': '#ea580c',
  '--color-orange-700': '#c2410c',
  '--color-orange-800': '#9a3412',
  '--color-orange-900': '#7c2d12',

  '--color-yellow-50': '#fefce8',
  '--color-yellow-100': '#fef9c3',
  '--color-yellow-200': '#fef08a',
  '--color-yellow-300': '#fde047',
  '--color-yellow-400': '#facc15',
  '--color-yellow-500': '#eab308',
  '--color-yellow-600': '#ca8a04',
  '--color-yellow-700': '#a16207',
  '--color-yellow-800': '#854d0e',
  '--color-yellow-900': '#713f12',

  '--color-green-50': '#f0fdf4',
  '--color-green-100': '#dcfce7',
  '--color-green-200': '#bbf7d0',
  '--color-green-300': '#86efac',
  '--color-green-400': '#4ade80',
  '--color-green-500': '#22c55e',
  '--color-green-600': '#16a34a',
  '--color-green-700': '#15803d',
  '--color-green-800': '#166534',
  '--color-green-900': '#14532d',

  '--color-blue-50': '#eff6ff',
  '--color-blue-100': '#dbeafe',
  '--color-blue-200': '#bfdbfe',
  '--color-blue-300': '#93c5fd',
  '--color-blue-400': '#60a5fa',
  '--color-blue-500': '#3b82f6',
  '--color-blue-600': '#2563eb',
  '--color-blue-700': '#1d4ed8',
  '--color-blue-800': '#1e40af',
  '--color-blue-900': '#1e3a8a',

  '--color-purple-50': '#faf5ff',
  '--color-purple-100': '#f3e8ff',
  '--color-purple-200': '#e9d5ff',
  '--color-purple-300': '#d8b4fe',
  '--color-purple-400': '#c084fc',
  '--color-purple-500': '#a855f7',
  '--color-purple-600': '#9333ea',
  '--color-purple-700': '#7e22ce',
  '--color-purple-800': '#6b21a8',
  '--color-purple-900': '#581c87',

  '--color-gray-50': '#f9fafb',
  '--color-gray-100': '#f3f4f6',
  '--color-gray-200': '#e5e7eb',
  '--color-gray-300': '#d1d5db',
  '--color-gray-400': '#9ca3af',
  '--color-gray-500': '#6b7280',
  '--color-gray-600': '#4b5563',
  '--color-gray-700': '#374151',
  '--color-gray-800': '#1f2937',
  '--color-gray-900': '#111827',

  '--color-black': '#000000',
  '--color-white': '#ffffff',
};

/**
 * Generate CSS for color replacements
 */
export function generateColorReplacementCSS(
  colorReplacements: Record<string, string>,
  targetId?: string
): string {
  const selector = targetId ? `#${targetId}` : ':root';
  const cssVars = Object.entries(colorReplacements)
    .map(([key, value]) => `    ${key}: ${value} !important;`)
    .join('\n');

  let css = `
    ${selector} {
${cssVars}
    }
  `;

  // Add utility class overrides
  const utilityClasses: string[] = [];

  // Background colors
  ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'gray'].forEach((color) => {
    for (let i = 50; i <= 900; i += (i < 100 ? 50 : 100)) {
      const key = `--color-${color}-${i}`;
      const value = colorReplacements[key];
      if (value) {
        utilityClasses.push(
          `${targetId ? `#${targetId}` : ''} .bg-${color}-${i} { background-color: ${value} !important; }`
        );
        utilityClasses.push(
          `${targetId ? `#${targetId}` : ''} .text-${color}-${i} { color: ${value} !important; }`
        );
        utilityClasses.push(
          `${targetId ? `#${targetId}` : ''} .border-${color}-${i} { border-color: ${value} !important; }`
        );
      }
    }
  });

  css += '\n' + utilityClasses.join('\n');

  return css;
}

/**
 * Create a style element with custom CSS
 */
export function createStyleElement(css: string, id: string): HTMLStyleElement {
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  return style;
}

/**
 * Clone an element with all styles computed
 */
export function cloneElementWithStyles(
  element: HTMLElement,
  targetWidth: number
): HTMLElement {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${targetWidth}px`;
  clone.style.maxWidth = `${targetWidth}px`;
  clone.style.minWidth = `${targetWidth}px`;
  clone.style.boxSizing = 'border-box';
  return clone;
}

/**
 * Generate a sanitized filename
 */
export function sanitizeFilename(name: string, extension: string): string {
  const sanitized = name
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, ' ') // Replace special chars
    .replace(/\s+/g, '_') // Replace spaces with underscore
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .substring(0, 50); // Limit length

  return sanitized ? `${sanitized}.${extension}` : `document.${extension}`;
}

/**
 * Convert HTML string to HTMLElement
 * Supports full HTML documents or HTML fragments
 */
export function htmlStringToElement(htmlString: string): HTMLElement {
  // Create a temporary container
  const container = document.createElement('div');

  // Clean up the HTML string
  const trimmedHTML = htmlString.trim();

  // Check if it's a full HTML document
  const isFullDocument = /^<!DOCTYPE|^<html/i.test(trimmedHTML);

  if (isFullDocument) {
    // Parse as full document
    const parser = new DOMParser();
    const doc = parser.parseFromString(trimmedHTML, 'text/html');

    // Extract body content
    const body = doc.body;

    // Also extract and apply styles from head
    const styles = doc.head.querySelectorAll('style, link[rel="stylesheet"]');
    const wrapper = document.createElement('div');

    // Add styles to wrapper
    styles.forEach(style => {
      wrapper.appendChild(style.cloneNode(true));
    });

    // Add body content
    Array.from(body.children).forEach(child => {
      wrapper.appendChild(child.cloneNode(true));
    });

    return wrapper;
  } else {
    // Parse as HTML fragment
    container.innerHTML = trimmedHTML;

    // If there's only one child, return it directly
    if (container.children.length === 1) {
      return container.children[0] as HTMLElement;
    }

    // Otherwise return the container with all children
    return container;
  }
}

/**
 * Load external CSS from link tags in HTML string
 */
export async function loadExternalStyles(element: HTMLElement): Promise<void> {
  const linkTags = element.querySelectorAll('link[rel="stylesheet"]');

  const promises = Array.from(linkTags).map(async (link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    try {
      const response = await fetch(href);
      const cssText = await response.text();

      // Create style element
      const style = document.createElement('style');
      style.textContent = cssText;

      // Replace link with style
      link.parentNode?.replaceChild(style, link);
    } catch (error) {
      console.warn(`Failed to load external stylesheet: ${href}`, error);
    }
  });

  await Promise.all(promises);
}

/**
 * Estimate the number of pages needed based on content height
 */
export function estimatePageCount(
  contentHeight: number,
  pageHeight: number
): number {
  return Math.ceil(contentHeight / pageHeight);
}

/**
 * Wait for images to load in an element
 */
export async function waitForImagesToLoad(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));
  const imagePromises = images.map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.addEventListener('load', () => resolve());
      img.addEventListener('error', () => resolve()); // Resolve even on error
    });
  });

  await Promise.all(imagePromises);
}

/**
 * Calculate optimal scale based on content width
 */
export function calculateOptimalScale(
  contentWidth: number,
  targetWidth: number,
  maxScale: number = 3
): number {
  const scale = targetWidth / contentWidth;
  return Math.min(scale, maxScale);
}

/**
 * Process template string with variables
 * Supports: {{pageNumber}}, {{totalPages}}, {{date}}, {{title}}
 */
export function processTemplate(
  template: string,
  variables: Record<string, string | number>
): string {
  let processed = template;

  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    processed = processed.replace(regex, String(value));
  });

  return processed;
}

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert OKLCH to linear RGB
 * Based on OKLCH color space specification
 */
function oklchToLinearRgb(L: number, C: number, h: number): [number, number, number] {
  // Convert OKLCH to OKLab
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b = C * Math.sin(hRad);

  // OKLab to linear RGB transformation matrix
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  return [
    +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ];
}

/**
 * Apply gamma correction to linear RGB
 */
function linearToSrgb(c: number): number {
  const abs = Math.abs(c);
  if (abs > 0.0031308) {
    return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
  }
  return 12.92 * c;
}

/**
 * Clamp value between 0 and 255
 */
function clamp(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value * 255)));
}

/**
 * Convert OKLCH color to RGB
 * Handles various OKLCH formats:
 * - oklch(L C H)
 * - oklch(L C H / alpha)
 * - oklch(L% C% H)
 * - oklch(L% C% H / alpha)
 *
 * @param oklchString - OKLCH color string (e.g., "oklch(0.5 0.2 180)" or "oklch(50% 20% 180deg / 0.5)")
 * @returns RGB color string (e.g., "rgb(123, 45, 67)" or "rgba(123, 45, 67, 0.5)")
 */
export function oklchToRgb(oklchString: string): string | null {
  // Match OKLCH format with optional alpha
  // Supports: oklch(L C H), oklch(L C H / alpha), oklch(L% C% H), oklch(L% C% Hdeg / alpha%), etc.
  const oklchRegex = /oklch\(\s*([\d.]+)%?\s+([\d.]+)%?\s+([\d.]+)(?:deg|rad|grad|turn)?\s*(?:\/\s*([\d.]+)%?\s*)?\)/i;
  const match = oklchString.match(oklchRegex);

  if (!match) {
    return null;
  }

  let [, lStr, cStr, hStr, alphaStr] = match;

  // Parse L (lightness): 0-1 or 0-100%
  let L = parseFloat(lStr);
  if (oklchString.includes(`${lStr}%`)) {
    L = L / 100;
  }
  // If L > 1, assume it's a percentage without % symbol
  if (L > 1) {
    L = L / 100;
  }

  // Parse C (chroma): 0-0.4 typical range, but can be higher
  let C = parseFloat(cStr);
  if (oklchString.includes(`${cStr}%`)) {
    C = C / 100 * 0.4; // Scale percentage to typical chroma range
  }

  // Parse H (hue): 0-360 degrees
  let h = parseFloat(hStr);
  const hMatch = hStr.match(/([\d.]+)(deg|rad|grad|turn)?/i);
  if (hMatch && hMatch[2]) {
    const unit = hMatch[2].toLowerCase();
    if (unit === 'rad') {
      h = (h * 180) / Math.PI;
    } else if (unit === 'grad') {
      h = (h * 360) / 400;
    } else if (unit === 'turn') {
      h = h * 360;
    }
  }

  // Parse alpha (optional): 0-1 or 0-100%
  let alpha: number | undefined;
  if (alphaStr) {
    alpha = parseFloat(alphaStr);
    if (oklchString.includes(`${alphaStr}%`)) {
      alpha = alpha / 100;
    }
    // Clamp alpha between 0 and 1
    alpha = Math.max(0, Math.min(1, alpha));
  }

  // Convert OKLCH to linear RGB
  const [rLinear, gLinear, bLinear] = oklchToLinearRgb(L, C, h);

  // Apply gamma correction and convert to 0-255 range
  const r = clamp(linearToSrgb(rLinear));
  const g = clamp(linearToSrgb(gLinear));
  const b = clamp(linearToSrgb(bLinear));

  // Return RGB or RGBA
  if (alpha !== undefined) {
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Convert all OKLCH colors in CSS text to RGB
 * Handles both inline styles and CSS rules
 *
 * @param css - CSS text containing OKLCH colors
 * @returns CSS text with OKLCH colors converted to RGB
 */
export function convertOklchToRgbInCSS(css: string): string {
  // Match all OKLCH color functions
  const oklchRegex = /oklch\([^)]+\)/gi;

  return css.replace(oklchRegex, (match) => {
    const rgb = oklchToRgb(match);
    return rgb || match; // Return original if conversion fails
  });
}

/**
 * Convert OKLCH colors in element's inline styles and computed styles
 * Modifies the element in place
 *
 * @param element - HTML element to process
 */
export function convertOklchInElement(element: HTMLElement): void {
  // Process inline styles on root element
  if (element.style.cssText) {
    element.style.cssText = convertOklchToRgbInCSS(element.style.cssText);
  }

  // Also check computed styles and apply as inline if they contain OKLCH
  const computedStyle = window.getComputedStyle(element);
  _applyOklchConversionFromComputed(element, computedStyle);

  // Process all child elements recursively
  const children = element.querySelectorAll('*');
  children.forEach((child) => {
    if (child instanceof HTMLElement) {
      // Convert inline styles
      if (child.style.cssText) {
        child.style.cssText = convertOklchToRgbInCSS(child.style.cssText);
      }

      // Convert computed styles
      const childComputed = window.getComputedStyle(child);
      _applyOklchConversionFromComputed(child, childComputed);
    }
  });
}

/**
 * Helper function to check computed styles for OKLCH and apply converted values
 * @internal
 */
function _applyOklchConversionFromComputed(element: HTMLElement, computedStyle: CSSStyleDeclaration): void {
  // Properties that commonly use colors
  const colorProperties = [
    'color',
    'background-color',
    'border-color',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    'outline-color',
    'text-decoration-color',
    'column-rule-color',
    'caret-color',
  ];

  colorProperties.forEach((prop) => {
    const value = computedStyle.getPropertyValue(prop);
    if (value && value.includes('oklch')) {
      const converted = convertOklchToRgbInCSS(value);
      // Apply as inline style to override computed style
      element.style.setProperty(prop, converted, 'important');
    }
  });

  // Handle background shorthand which might contain OKLCH
  const background = computedStyle.getPropertyValue('background');
  if (background && background.includes('oklch')) {
    const converted = convertOklchToRgbInCSS(background);
    element.style.setProperty('background', converted, 'important');
  }

  // Handle border shorthand
  const border = computedStyle.getPropertyValue('border');
  if (border && border.includes('oklch')) {
    const converted = convertOklchToRgbInCSS(border);
    element.style.setProperty('border', converted, 'important');
  }
}

/**
 * Process all stylesheets in an element to convert OKLCH to RGB
 * Creates new style elements with converted CSS
 *
 * @param element - HTML element containing stylesheets
 */
export function convertOklchInStylesheets(element: HTMLElement): void {
  // Process <style> tags
  const styleTags = element.querySelectorAll('style');
  styleTags.forEach((styleTag) => {
    if (styleTag.textContent) {
      styleTag.textContent = convertOklchToRgbInCSS(styleTag.textContent);
    }
  });
}

/**
 * Extract all CSS rules from document stylesheets that contain OKLCH
 * and create a comprehensive override stylesheet
 *
 * @returns CSS text with all OKLCH colors converted to RGB
 */
export function extractAndConvertOklchFromStylesheets(): string {
  const cssRules: string[] = [];

  // Iterate through all stylesheets
  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      // Try to access cssRules (may fail for cross-origin stylesheets)
      const rules = sheet.cssRules || sheet.rules;
      if (!rules) return;

      Array.from(rules).forEach((rule) => {
        const cssText = rule.cssText;

        // Check if rule contains OKLCH
        if (cssText && cssText.includes('oklch')) {
          // Convert OKLCH to RGB in this rule
          const converted = convertOklchToRgbInCSS(cssText);
          cssRules.push(converted);
        }
      });
    } catch (e) {
      // Silently fail for cross-origin stylesheets
      // This is expected for external CSS files from different domains
    }
  });

  return cssRules.join('\n');
}

/**
 * Get watermark rotation angle based on position
 */
export function getWatermarkRotation(position: string): number {
  if (position === 'diagonal') return 45;
  return 0;
}

/**
 * Calculate watermark position coordinates
 */
export function calculateWatermarkPosition(
  position: string,
  pageWidth: number,
  pageHeight: number,
  textWidth: number,
  textHeight: number
): { x: number; y: number } {
  switch (position) {
    case 'center':
      return {
        x: pageWidth / 2,
        y: pageHeight / 2
      };
    case 'diagonal':
      return {
        x: pageWidth / 2,
        y: pageHeight / 2
      };
    case 'top-left':
      return {
        x: textWidth / 2 + 10,
        y: textHeight / 2 + 10
      };
    case 'top-right':
      return {
        x: pageWidth - textWidth / 2 - 10,
        y: textHeight / 2 + 10
      };
    case 'bottom-left':
      return {
        x: textWidth / 2 + 10,
        y: pageHeight - textHeight / 2 - 10
      };
    case 'bottom-right':
      return {
        x: pageWidth - textWidth / 2 - 10,
        y: pageHeight - textHeight / 2 - 10
      };
    default:
      return {
        x: pageWidth / 2,
        y: pageHeight / 2
      };
  }
}

/**
 * Format date for templates
 */
export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Process template with context variables
 * Supports simple variables: {{variable}}
 * Supports loops: {{#each items}}{{name}}{{/each}}
 * Supports conditionals: {{#if condition}}text{{/if}}
 */
export function processTemplateWithContext(
  template: string,
  context: TemplateContext,
  options: { enableLoops?: boolean; enableConditionals?: boolean } = {}
): string {
  let processed = template;

  // Process simple variables first: {{variable}}
  Object.entries(context).forEach(([key, value]) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processed = processed.replace(regex, String(value));
    }
  });

  // Process loops: {{#each items}}{{name}}{{/each}}
  if (options.enableLoops) {
    const loopRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
    processed = processed.replace(loopRegex, (match, arrayKey, template) => {
      const arrayData = context[arrayKey];
      if (!Array.isArray(arrayData)) return match;

      return arrayData
        .map((item: any) => {
          let itemHtml = template;
          if (typeof item === 'object') {
            Object.entries(item).forEach(([key, value]) => {
              const regex = new RegExp(`{{${key}}}`, 'g');
              itemHtml = itemHtml.replace(regex, String(value));
            });
          } else {
            itemHtml = itemHtml.replace(/{{this}}/g, String(item));
          }
          return itemHtml;
        })
        .join('');
    });
  }

  // Process conditionals: {{#if condition}}text{{/if}}
  if (options.enableConditionals) {
    const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
    processed = processed.replace(ifRegex, (match, conditionKey, content) => {
      const condition = context[conditionKey];
      return condition ? content : '';
    });
  }

  return processed;
}

/**
 * Extract headings from HTML element for TOC or bookmarks
 */
export function extractHeadings(
  element: HTMLElement,
  levels: number[] = [1, 2, 3]
): Array<{ title: string; level: number; id: string; element: HTMLElement }> {
  const headings: Array<{ title: string; level: number; id: string; element: HTMLElement }> = [];
  const selectors = levels.map(level => `h${level}`).join(', ');
  const headingElements = element.querySelectorAll(selectors);

  headingElements.forEach((heading, index) => {
    const level = parseInt(heading.tagName.substring(1));
    const title = heading.textContent?.trim() || '';
    let id = heading.id;

    // Generate ID if not present
    if (!id) {
      id = `heading-${index}-${title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}`;
      heading.id = id;
    }

    headings.push({
      title,
      level,
      id,
      element: heading as HTMLElement
    });
  });

  return headings;
}

/**
 * Build hierarchical TOC structure from flat heading list
 */
export function buildTOCHierarchy(
  headings: Array<{ title: string; level: number; page: number; id: string }>
): TOCEntry[] {
  const root: TOCEntry[] = [];
  const stack: Array<TOCEntry & { level: number }> = [];

  headings.forEach(heading => {
    const entry: TOCEntry & { level: number } = {
      title: heading.title,
      level: heading.level,
      page: heading.page,
      id: heading.id,
      children: []
    };

    // Find parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(entry);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(entry);
    }

    stack.push(entry);
  });

  return root;
}

/**
 * Generate TOC HTML from entries
 */
export function generateTOCHTML(
  entries: TOCEntry[],
  options: {
    includePageNumbers?: boolean;
    indentPerLevel?: number;
    title?: string;
  } = {}
): string {
  const { includePageNumbers = true, indentPerLevel = 10, title = 'Table of Contents' } = options;

  let html = `<div class="pdf-toc">`;
  if (title) {
    html += `<h1 class="pdf-toc-title">${title}</h1>`;
  }
  html += `<div class="pdf-toc-entries">`;

  const renderEntry = (entry: TOCEntry, depth: number = 0): string => {
    const indent = depth * indentPerLevel;
    let entryHtml = `<div class="pdf-toc-entry pdf-toc-level-${entry.level}" style="margin-left: ${indent}mm;">`;
    entryHtml += `<span class="pdf-toc-entry-title">${entry.title}</span>`;
    if (includePageNumbers) {
      entryHtml += `<span class="pdf-toc-entry-page">${entry.page}</span>`;
    }
    entryHtml += `</div>`;

    if (entry.children && entry.children.length > 0) {
      entry.children.forEach(child => {
        entryHtml += renderEntry(child, depth + 1);
      });
    }

    return entryHtml;
  };

  entries.forEach(entry => {
    html += renderEntry(entry);
  });

  html += `</div></div>`;
  return html;
}

/**
 * Generate default TOC CSS
 */
export function generateTOCCSS(): string {
  return `
    .pdf-toc {
      page-break-after: always;
      padding: 20px 0;
    }
    .pdf-toc-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
    }
    .pdf-toc-entries {
      line-height: 1.6;
    }
    .pdf-toc-entry {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
      border-bottom: 1px dotted #ccc;
    }
    .pdf-toc-entry-title {
      flex: 1;
    }
    .pdf-toc-entry-page {
      margin-left: 10px;
      font-weight: bold;
    }
    .pdf-toc-level-1 {
      font-weight: bold;
      font-size: 16px;
      margin-top: 10px;
    }
    .pdf-toc-level-2 {
      font-size: 14px;
    }
    .pdf-toc-level-3 {
      font-size: 12px;
      color: #666;
    }
  `;
}

/**
 * Build hierarchical bookmark structure from flat heading list
 */
export function buildBookmarkHierarchy(
  headings: Array<{ title: string; level: number; page: number; id: string }>
): BookmarkEntry[] {
  const root: BookmarkEntry[] = [];
  const stack: Array<BookmarkEntry & { level: number }> = [];

  headings.forEach(heading => {
    const entry: BookmarkEntry & { level: number } = {
      title: heading.title,
      page: heading.page,
      level: heading.level,
      id: heading.id,
      children: []
    };

    // Find parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(entry);
    } else {
      const parent = stack[stack.length - 1];
      if (!parent.children) parent.children = [];
      parent.children.push(entry);
    }

    stack.push(entry);
  });

  return root;
}

/**
 * Web-safe font replacements
 */
export const WEB_SAFE_FONT_MAP: Record<string, string> = {
  'Arial': 'Arial, Helvetica, sans-serif',
  'Helvetica': 'Helvetica, Arial, sans-serif',
  'Times New Roman': 'Times New Roman, Times, serif',
  'Times': 'Times, Times New Roman, serif',
  'Courier New': 'Courier New, Courier, monospace',
  'Courier': 'Courier, Courier New, monospace',
  'Verdana': 'Verdana, Geneva, sans-serif',
  'Georgia': 'Georgia, serif',
  'Palatino': 'Palatino Linotype, Book Antiqua, Palatino, serif',
  'Garamond': 'Garamond, serif',
  'Comic Sans MS': 'Comic Sans MS, cursive',
  'Trebuchet MS': 'Trebuchet MS, Helvetica, sans-serif',
  'Arial Black': 'Arial Black, Gadget, sans-serif',
  'Impact': 'Impact, Charcoal, sans-serif',
};

/**
 * Replace custom fonts with web-safe alternatives
 */
export function replaceWithWebSafeFonts(css: string): string {
  let processedCSS = css;

  Object.entries(WEB_SAFE_FONT_MAP).forEach(([custom, webSafe]) => {
    const regex = new RegExp(`font-family:\\s*['"]?${custom}['"]?`, 'gi');
    processedCSS = processedCSS.replace(regex, `font-family: ${webSafe}`);
  });

  return processedCSS;
}

/**
 * Generate @font-face CSS for custom fonts
 */
export function generateFontFaceCSS(fonts: Array<{ family: string; src: string; weight?: number; style?: string }>): string {
  return fonts.map(font => {
    const weight = font.weight || 400;
    const style = font.style || 'normal';

    return `
      @font-face {
        font-family: '${font.family}';
        src: url('${font.src}');
        font-weight: ${weight};
        font-style: ${style};
      }
    `;
  }).join('\n');
}
