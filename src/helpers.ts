/**
 * Shared PDF Generation Helpers
 *
 * Centralized utilities for PDF generation across the app
 * Includes color conversion, style injection, and common settings
 */

import { TAILWIND_COLOR_REPLACEMENTS } from './utils';

/**
 * Complete OKLCH to RGB color conversion map
 * Includes all Tailwind CSS colors used in the app
 */
export const PDF_COLOR_REPLACEMENTS = {
  ...TAILWIND_COLOR_REPLACEMENTS,
  // Add any custom app colors here if needed
};

/**
 * Generate comprehensive CSS for PDF rendering
 * Handles OKLCH color conversion and ensures proper styling
 */
export function generatePDFColorCSS(): string {
  return `
    :root, :host, * {
      /* Red colors */
      --color-red-50: #fef2f2 !important;
      --color-red-100: #fee2e2 !important;
      --color-red-200: #fecaca !important;
      --color-red-300: #fca5a5 !important;
      --color-red-400: #f87171 !important;
      --color-red-500: #ef4444 !important;
      --color-red-600: #dc2626 !important;
      --color-red-700: #b91c1c !important;
      --color-red-800: #991b1b !important;
      --color-red-900: #7f1d1d !important;

      /* Orange colors */
      --color-orange-50: #fff7ed !important;
      --color-orange-100: #ffedd5 !important;
      --color-orange-200: #fed7aa !important;
      --color-orange-300: #fdba74 !important;
      --color-orange-400: #fb923c !important;
      --color-orange-500: #f97316 !important;
      --color-orange-600: #ea580c !important;
      --color-orange-700: #c2410c !important;
      --color-orange-800: #9a3412 !important;
      --color-orange-900: #7c2d12 !important;

      /* Yellow colors */
      --color-yellow-50: #fefce8 !important;
      --color-yellow-100: #fef9c3 !important;
      --color-yellow-200: #fef08a !important;
      --color-yellow-300: #fde047 !important;
      --color-yellow-400: #facc15 !important;
      --color-yellow-500: #eab308 !important;
      --color-yellow-600: #ca8a04 !important;
      --color-yellow-700: #a16207 !important;
      --color-yellow-800: #854d0e !important;
      --color-yellow-900: #713f12 !important;

      /* Green colors */
      --color-green-50: #f0fdf4 !important;
      --color-green-100: #dcfce7 !important;
      --color-green-200: #bbf7d0 !important;
      --color-green-300: #86efac !important;
      --color-green-400: #4ade80 !important;
      --color-green-500: #22c55e !important;
      --color-green-600: #16a34a !important;
      --color-green-700: #15803d !important;
      --color-green-800: #166534 !important;
      --color-green-900: #14532d !important;

      /* Blue colors */
      --color-blue-50: #eff6ff !important;
      --color-blue-100: #dbeafe !important;
      --color-blue-200: #bfdbfe !important;
      --color-blue-300: #93c5fd !important;
      --color-blue-400: #60a5fa !important;
      --color-blue-500: #3b82f6 !important;
      --color-blue-600: #2563eb !important;
      --color-blue-700: #1d4ed8 !important;
      --color-blue-800: #1e40af !important;
      --color-blue-900: #1e3a8a !important;

      /* Purple colors */
      --color-purple-50: #faf5ff !important;
      --color-purple-100: #f3e8ff !important;
      --color-purple-200: #e9d5ff !important;
      --color-purple-300: #d8b4fe !important;
      --color-purple-400: #c084fc !important;
      --color-purple-500: #a855f7 !important;
      --color-purple-600: #9333ea !important;
      --color-purple-700: #7e22ce !important;
      --color-purple-800: #6b21a8 !important;
      --color-purple-900: #581c87 !important;

      /* Gray colors */
      --color-gray-50: #f9fafb !important;
      --color-gray-100: #f3f4f6 !important;
      --color-gray-200: #e5e7eb !important;
      --color-gray-300: #d1d5db !important;
      --color-gray-400: #9ca3af !important;
      --color-gray-500: #6b7280 !important;
      --color-gray-600: #4b5563 !important;
      --color-gray-700: #374151 !important;
      --color-gray-800: #1f2937 !important;
      --color-gray-900: #111827 !important;

      /* Basic colors */
      --color-black: #000000 !important;
      --color-white: #ffffff !important;
    }

    /* Background color utilities */
    .bg-red-50 { background-color: #fef2f2 !important; }
    .bg-red-100 { background-color: #fee2e2 !important; }
    .bg-red-600 { background-color: #dc2626 !important; }
    .bg-red-700 { background-color: #b91c1c !important; }

    .bg-orange-50 { background-color: #fff7ed !important; }
    .bg-orange-100 { background-color: #ffedd5 !important; }
    .bg-orange-600 { background-color: #ea580c !important; }
    .bg-orange-700 { background-color: #c2410c !important; }

    .bg-yellow-50 { background-color: #fefce8 !important; }
    .bg-yellow-100 { background-color: #fef9c3 !important; }
    .bg-yellow-200 { background-color: #fef08a !important; }

    .bg-green-50 { background-color: #f0fdf4 !important; }
    .bg-green-100 { background-color: #dcfce7 !important; }
    .bg-green-600 { background-color: #16a34a !important; }
    .bg-green-700 { background-color: #15803d !important; }

    .bg-blue-50 { background-color: #eff6ff !important; }
    .bg-blue-100 { background-color: #dbeafe !important; }
    .bg-blue-200 { background-color: #bfdbfe !important; }
    .bg-blue-600 { background-color: #2563eb !important; }
    .bg-blue-700 { background-color: #1d4ed8 !important; }

    .bg-purple-50 { background-color: #faf5ff !important; }
    .bg-purple-100 { background-color: #f3e8ff !important; }
    .bg-purple-200 { background-color: #e9d5ff !important; }
    .bg-purple-600 { background-color: #9333ea !important; }

    .bg-gray-50 { background-color: #f9fafb !important; }
    .bg-gray-100 { background-color: #f3f4f6 !important; }
    .bg-gray-200 { background-color: #e5e7eb !important; }

    /* Border color utilities */
    .border-red-200 { border-color: #fecaca !important; }
    .border-red-300 { border-color: #fca5a5 !important; }

    .border-orange-200 { border-color: #fed7aa !important; }
    .border-orange-300 { border-color: #fdba74 !important; }

    .border-yellow-200 { border-color: #fef08a !important; }

    .border-green-200 { border-color: #bbf7d0 !important; }

    .border-blue-200 { border-color: #bfdbfe !important; }
    .border-blue-300 { border-color: #93c5fd !important; }
    .border-blue-400 { border-color: #60a5fa !important; }

    .border-purple-200 { border-color: #e9d5ff !important; }
    .border-purple-300 { border-color: #d8b4fe !important; }

    .border-gray-200 { border-color: #e5e7eb !important; }
    .border-gray-300 { border-color: #d1d5db !important; }
    .border-gray-400 { border-color: #9ca3af !important; }

    /* Text color utilities */
    .text-red-600 { color: #dc2626 !important; }
    .text-red-700 { color: #b91c1c !important; }

    .text-orange-600 { color: #ea580c !important; }
    .text-orange-700 { color: #c2410c !important; }

    .text-yellow-600 { color: #ca8a04 !important; }

    .text-green-600 { color: #16a34a !important; }
    .text-green-700 { color: #15803d !important; }

    .text-blue-600 { color: #2563eb !important; }
    .text-blue-700 { color: #1d4ed8 !important; }

    .text-purple-600 { color: #9333ea !important; }

    .text-gray-500 { color: #6b7280 !important; }
    .text-gray-600 { color: #4b5563 !important; }
    .text-gray-700 { color: #374151 !important; }
    .text-gray-900 { color: #111827 !important; }
  `;
}

/**
 * Inject PDF color styles into the document
 * Returns cleanup function to remove styles
 */
export function injectPDFStyles(): () => void {
  const styleId = 'pdf-color-override';

  // Remove existing style if present
  const existing = document.getElementById(styleId);
  if (existing) {
    existing.remove();
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = generatePDFColorCSS();
  document.head.appendChild(style);

  // Return cleanup function
  return () => {
    const el = document.getElementById(styleId);
    if (el) {
      el.remove();
    }
  };
}

/**
 * Default PDF generator options optimized for the app
 */
export const DEFAULT_PDF_OPTIONS = {
  format: 'a4' as const,
  orientation: 'portrait' as const,
  margins: [10, 10, 10, 10] as [number, number, number, number],
  compress: true,
  showPageNumbers: false,
  imageQuality: 0.95,
  scale: 3,
  colorReplacements: PDF_COLOR_REPLACEMENTS,
};

/**
 * High-quality PDF options for detailed documents
 */
export const HIGH_QUALITY_PDF_OPTIONS = {
  ...DEFAULT_PDF_OPTIONS,
  imageQuality: 0.98,
  scale: 4,
};

/**
 * Fast PDF options for quick generation
 */
export const FAST_PDF_OPTIONS = {
  ...DEFAULT_PDF_OPTIONS,
  imageQuality: 0.85,
  scale: 2,
};

/**
 * Calculate PDF content width in pixels
 * This ensures consistent width across all PDF-rendered components
 *
 * Formula: (Paper Width - Left Margin - Right Margin) × MM_TO_PX
 * For A4 Portrait with 10mm margins: (210 - 10 - 10) × 3.7795 = 718.105px
 */
export function getPDFContentWidth(): number {
  const a4WidthMm = 210; // A4 paper width
  const [, marginRight, , marginLeft] = DEFAULT_PDF_OPTIONS.margins;
  const usableWidthMm = a4WidthMm - marginLeft - marginRight;
  const MM_TO_PX = 3.7795275591; // Exact 96 DPI conversion
  return Math.round(usableWidthMm * MM_TO_PX); // 718px
}

/**
 * PDF content width constant for consistent rendering
 * Use this value for all PDF-targeted content widths
 */
export const PDF_CONTENT_WIDTH_PX = getPDFContentWidth();
