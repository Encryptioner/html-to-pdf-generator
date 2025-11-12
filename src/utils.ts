/**
 * PDF Generator Library - Utilities
 *
 * Helper functions for PDF generation, color conversion, and styling
 */

import type { PDFGeneratorOptions, PDFPageConfig } from './types';

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
