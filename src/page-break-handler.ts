/**
 * PDF Generator Library - Page Break Handler
 *
 * Smart page break detection and element splitting
 */

export interface PageBreakOptions {
  /** Respect CSS page-break properties */
  respectCSSPageBreaks?: boolean;
  /** Prevent orphaned headings */
  preventOrphanedHeadings?: boolean;
  /** Minimum lines before page break */
  minLinesBeforeBreak?: number;
  /** Elements that should not be split */
  avoidBreakInside?: string[];
  /** Elements that should break before */
  breakBefore?: string[];
  /** Elements that should break after */
  breakAfter?: string[];
}

export interface PageBreakPoint {
  /** Element where break should occur */
  element: HTMLElement;
  /** Position in pixels from top */
  position: number;
  /** Type of break */
  type: 'natural' | 'forced' | 'avoid';
  /** Priority (higher = more important) */
  priority: number;
}

/**
 * Default elements that should not be split
 */
export const DEFAULT_AVOID_BREAK_INSIDE = [
  'table',
  'figure',
  'img',
  'svg',
  'pre',
  'code',
  'blockquote',
  'ul',
  'ol',
  'dl',
];

/**
 * Elements that typically force breaks
 */
export const DEFAULT_BREAK_BEFORE = ['h1', 'h2'];

/**
 * Analyze element for potential page break points
 */
export function analyzePageBreaks(
  element: HTMLElement,
  pageHeight: number,
  options: PageBreakOptions = {}
): PageBreakPoint[] {
  const {
    respectCSSPageBreaks = true,
    preventOrphanedHeadings = true,
    avoidBreakInside = DEFAULT_AVOID_BREAK_INSIDE,
    breakBefore = DEFAULT_BREAK_BEFORE,
    breakAfter = [],
  } = options;

  const breakPoints: PageBreakPoint[] = [];
  const allElements = Array.from(element.querySelectorAll('*'));

  allElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const rect = htmlEl.getBoundingClientRect();
    const style = window.getComputedStyle(htmlEl);

    // Check CSS page-break properties
    if (respectCSSPageBreaks) {
      if (
        style.pageBreakBefore === 'always' ||
        style.breakBefore === 'page'
      ) {
        breakPoints.push({
          element: htmlEl,
          position: rect.top,
          type: 'forced',
          priority: 100,
        });
        return;
      }

      if (
        style.pageBreakAfter === 'always' ||
        style.breakAfter === 'page'
      ) {
        breakPoints.push({
          element: htmlEl,
          position: rect.bottom,
          type: 'forced',
          priority: 100,
        });
        return;
      }

      if (
        style.pageBreakInside === 'avoid' ||
        style.breakInside === 'avoid'
      ) {
        breakPoints.push({
          element: htmlEl,
          position: rect.top,
          type: 'avoid',
          priority: 80,
        });
        return;
      }
    }

    const tagName = htmlEl.tagName.toLowerCase();

    // Check avoid break inside elements
    if (avoidBreakInside.includes(tagName)) {
      breakPoints.push({
        element: htmlEl,
        position: rect.top,
        type: 'avoid',
        priority: 70,
      });
    }

    // Check forced break before
    if (breakBefore.includes(tagName)) {
      breakPoints.push({
        element: htmlEl,
        position: rect.top,
        type: 'forced',
        priority: 90,
      });
    }

    // Check forced break after
    if (breakAfter.includes(tagName)) {
      breakPoints.push({
        element: htmlEl,
        position: rect.bottom,
        type: 'forced',
        priority: 90,
      });
    }

    // Prevent orphaned headings
    if (preventOrphanedHeadings && /^h[1-6]$/i.test(tagName)) {
      const nextEl = htmlEl.nextElementSibling;
      if (nextEl) {
        const nextRect = nextEl.getBoundingClientRect();
        const gap = nextRect.top - rect.bottom;

        // If heading is close to next element, keep them together
        if (gap < 50) {
          breakPoints.push({
            element: htmlEl,
            position: rect.top,
            type: 'avoid',
            priority: 85,
          });
        }
      }
    }
  });

  return breakPoints;
}

/**
 * Apply page break hints to elements
 */
export function applyPageBreakHints(
  element: HTMLElement,
  options: PageBreakOptions = {}
): void {
  const {
    avoidBreakInside = DEFAULT_AVOID_BREAK_INSIDE,
    breakBefore = DEFAULT_BREAK_BEFORE,
    breakAfter = [],
  } = options;

  // Apply avoid-break-inside to specific elements
  avoidBreakInside.forEach((selector) => {
    const elements = element.querySelectorAll(selector);
    elements.forEach((el) => {
      (el as HTMLElement).style.pageBreakInside = 'avoid';
      (el as HTMLElement).style.breakInside = 'avoid';
    });
  });

  // Apply break-before to specific elements
  breakBefore.forEach((selector) => {
    const elements = element.querySelectorAll(selector);
    elements.forEach((el) => {
      (el as HTMLElement).style.pageBreakBefore = 'always';
      (el as HTMLElement).style.breakBefore = 'page';
    });
  });

  // Apply break-after to specific elements
  breakAfter.forEach((selector) => {
    const elements = element.querySelectorAll(selector);
    elements.forEach((el) => {
      (el as HTMLElement).style.pageBreakAfter = 'always';
      (el as HTMLElement).style.breakAfter = 'page';
    });
  });

  // Prevent orphaned headings
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    (heading as HTMLElement).style.pageBreakAfter = 'avoid';
    (heading as HTMLElement).style.breakAfter = 'avoid-page';
  });

  // Prevent widow/orphan lines in paragraphs
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach((p) => {
    (p as HTMLElement).style.widows = '2';
    (p as HTMLElement).style.orphans = '2';
  });
}

/**
 * Calculate optimal page break positions
 */
export function calculatePageBreakPositions(
  contentHeight: number,
  pageHeight: number,
  breakPoints: PageBreakPoint[]
): number[] {
  const positions: number[] = [];
  let currentPosition = 0;

  while (currentPosition < contentHeight) {
    const nextPosition = currentPosition + pageHeight;

    // Find break points near this position
    const nearbyBreaks = breakPoints.filter(
      (bp) =>
        bp.position >= nextPosition - 100 && // Within 100px before
        bp.position <= nextPosition + 100 // or 100px after
    );

    if (nearbyBreaks.length > 0) {
      // Sort by priority and proximity to ideal break
      nearbyBreaks.sort((a, b) => {
        const aDist = Math.abs(a.position - nextPosition);
        const bDist = Math.abs(b.position - nextPosition);

        // If type is 'avoid', deprioritize
        if (a.type === 'avoid') return 1;
        if (b.type === 'avoid') return -1;

        // Otherwise sort by priority then distance
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return aDist - bDist;
      });

      // Use the best break point
      const bestBreak = nearbyBreaks[0];
      if (bestBreak.type !== 'avoid') {
        positions.push(bestBreak.position);
        currentPosition = bestBreak.position;
        continue;
      }
    }

    // No suitable break point found, use ideal position
    positions.push(nextPosition);
    currentPosition = nextPosition;
  }

  return positions;
}

/**
 * Insert page break markers in DOM
 */
export function insertPageBreakMarkers(
  element: HTMLElement,
  positions: number[]
): void {
  positions.forEach((position, index) => {
    const marker = document.createElement('div');
    marker.className = 'page-break-marker';
    marker.dataset.page = String(index + 2); // Page 2, 3, 4...
    marker.style.position = 'absolute';
    marker.style.top = `${position}px`;
    marker.style.left = '0';
    marker.style.right = '0';
    marker.style.height = '1px';
    marker.style.backgroundColor = 'transparent';
    marker.style.pageBreakBefore = 'always';

    element.appendChild(marker);
  });
}

/**
 * Remove page break markers
 */
export function removePageBreakMarkers(element: HTMLElement): void {
  const markers = element.querySelectorAll('.page-break-marker');
  markers.forEach((marker) => marker.remove());
}

/**
 * Detect if element would be split by page break
 */
export function wouldElementBeSplit(
  element: HTMLElement,
  pageBreakPosition: number
): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top < pageBreakPosition && rect.bottom > pageBreakPosition;
}

/**
 * Find the best element to break before to avoid splitting
 */
export function findBestBreakBefore(
  element: HTMLElement,
  pageBreakPosition: number
): HTMLElement | null {
  const children = Array.from(element.children) as HTMLElement[];

  for (let i = children.length - 1; i >= 0; i--) {
    const child = children[i];
    const rect = child.getBoundingClientRect();

    if (rect.bottom <= pageBreakPosition) {
      // This child ends before the break, perfect
      return child;
    }

    if (rect.top < pageBreakPosition) {
      // This child crosses the break, recurse
      const innerBreak = findBestBreakBefore(child, pageBreakPosition);
      if (innerBreak) return innerBreak;

      // If can't find good inner break, use this child
      return child;
    }
  }

  return null;
}

/**
 * Optimize content for clean page breaks
 */
export function optimizeForPageBreaks(
  element: HTMLElement,
  pageHeight: number,
  options: PageBreakOptions = {}
): void {
  // Apply basic page break hints
  applyPageBreakHints(element, options);

  // Analyze and find break points
  const breakPoints = analyzePageBreaks(element, pageHeight, options);

  // Calculate optimal positions
  const contentHeight = element.scrollHeight;
  const positions = calculatePageBreakPositions(
    contentHeight,
    pageHeight,
    breakPoints
  );

  // Insert markers (optional, for debugging)
  if (options.respectCSSPageBreaks) {
    insertPageBreakMarkers(element, positions);
  }
}

/**
 * Check if element has custom page break styling
 */
export function hasCustomPageBreak(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);

  return (
    style.pageBreakBefore !== 'auto' ||
    style.pageBreakAfter !== 'auto' ||
    style.pageBreakInside !== 'auto' ||
    style.breakBefore !== 'auto' ||
    style.breakAfter !== 'auto' ||
    style.breakInside !== 'auto'
  );
}

/**
 * Get page break CSS properties
 */
export function getPageBreakProperties(element: HTMLElement): {
  before: string;
  after: string;
  inside: string;
} {
  const style = window.getComputedStyle(element);

  return {
    before: style.pageBreakBefore || style.breakBefore || 'auto',
    after: style.pageBreakAfter || style.breakAfter || 'auto',
    inside: style.pageBreakInside || style.breakInside || 'auto',
  };
}
