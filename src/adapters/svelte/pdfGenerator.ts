/**
 * PDF Generator - Svelte Adapter
 *
 * Svelte stores for PDF generation
 */

import { writable, derived, type Writable, type Readable } from 'svelte/store';
import { PDFGenerator } from '../../core';
import type { PDFGeneratorOptions, PDFGenerationResult } from '../../types';

export interface SveltePDFGeneratorOptions extends Partial<PDFGeneratorOptions> {
  /** Filename for the generated PDF */
  filename?: string;
}

export interface SveltePDFGeneratorReturn {
  /** Generate and download PDF */
  generatePDF: (element: HTMLElement) => Promise<PDFGenerationResult | null>;

  /** Generate PDF blob without downloading */
  generateBlob: (element: HTMLElement) => Promise<Blob | null>;

  /** Whether PDF is currently being generated */
  isGenerating: Readable<boolean>;

  /** Current progress (0-100) */
  progress: Readable<number>;

  /** Error if generation failed */
  error: Readable<Error | null>;

  /** Result from last successful generation */
  result: Readable<PDFGenerationResult | null>;

  /** Reset state */
  reset: () => void;
}

/**
 * Create a PDF generator for Svelte
 *
 * @example
 * ```svelte
 * <script>
 *   import { createPDFGenerator } from '@your-org/pdf-generator/svelte';
 *
 *   let targetElement;
 *
 *   const {
 *     generatePDF,
 *     isGenerating,
 *     progress,
 *   } = createPDFGenerator({
 *     filename: 'my-document.pdf',
 *     format: 'a4',
 *   });
 *
 *   const handleDownload = () => {
 *     if (targetElement) {
 *       generatePDF(targetElement);
 *     }
 *   };
 * </script>
 *
 * <div bind:this={targetElement}>
 *   <!-- Your content -->
 * </div>
 *
 * <button on:click={handleDownload} disabled={$isGenerating}>
 *   {$isGenerating ? `Generating... ${$progress}%` : 'Download PDF'}
 * </button>
 * ```
 */
export function createPDFGenerator(
  options: SveltePDFGeneratorOptions = {}
): SveltePDFGeneratorReturn {
  const isGenerating = writable(false);
  const progress = writable(0);
  const error = writable<Error | null>(null);
  const result = writable<PDFGenerationResult | null>(null);

  const generator = new PDFGenerator({
    ...options,
    onProgress: (p) => {
      progress.set(p);
      options.onProgress?.(p);
    },
    onError: (e) => {
      error.set(e);
      options.onError?.(e);
    },
    onComplete: (blob) => {
      options.onComplete?.(blob);
    },
  });

  const generatePDF = async (
    element: HTMLElement
  ): Promise<PDFGenerationResult | null> => {
    try {
      isGenerating.set(true);
      error.set(null);

      const res = await generator.generatePDF(
        element,
        options.filename || 'document.pdf'
      );

      result.set(res);
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.set(err);
      return null;
    } finally {
      isGenerating.set(false);
    }
  };

  const generateBlob = async (element: HTMLElement): Promise<Blob | null> => {
    try {
      isGenerating.set(true);
      error.set(null);

      return await generator.generateBlob(element);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.set(err);
      return null;
    } finally {
      isGenerating.set(false);
    }
  };

  const reset = () => {
    progress.set(0);
    error.set(null);
    result.set(null);
  };

  return {
    generatePDF,
    generateBlob,
    isGenerating: { subscribe: isGenerating.subscribe },
    progress: { subscribe: progress.subscribe },
    error: { subscribe: error.subscribe },
    result: { subscribe: result.subscribe },
    reset,
  };
}
