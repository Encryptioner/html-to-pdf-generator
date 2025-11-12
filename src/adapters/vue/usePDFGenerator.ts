/**
 * PDF Generator - Vue 3 Adapter
 *
 * Vue 3 composable for easy PDF generation
 */

import { ref, type Ref } from 'vue';
import { PDFGenerator } from '../../core';
import type { PDFGeneratorOptions, PDFGenerationResult } from '../../types';

export interface UsePDFGeneratorOptions extends Partial<PDFGeneratorOptions> {
  /** Filename for the generated PDF */
  filename?: string;
}

export interface UsePDFGeneratorReturn {
  /** Ref to bind to the element you want to convert to PDF */
  targetRef: Ref<HTMLElement | null>;

  /** Generate and download PDF */
  generatePDF: () => Promise<PDFGenerationResult | null>;

  /** Generate PDF blob without downloading */
  generateBlob: () => Promise<Blob | null>;

  /** Whether PDF is currently being generated */
  isGenerating: Ref<boolean>;

  /** Current progress (0-100) */
  progress: Ref<number>;

  /** Error if generation failed */
  error: Ref<Error | null>;

  /** Result from last successful generation */
  result: Ref<PDFGenerationResult | null>;

  /** Reset state */
  reset: () => void;
}

/**
 * Vue 3 composable for PDF generation
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePDFGenerator } from '@your-org/pdf-generator/vue';
 *
 * const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
 *   filename: 'my-document.pdf',
 *   format: 'a4',
 * });
 * </script>
 *
 * <template>
 *   <div>
 *     <div ref="targetRef">
 *       <!-- Your content -->
 *     </div>
 *     <button @click="generatePDF" :disabled="isGenerating">
 *       {{ isGenerating ? `Generating... ${progress}%` : 'Download PDF' }}
 *     </button>
 *   </div>
 * </template>
 * ```
 */
export function usePDFGenerator(
  options: UsePDFGeneratorOptions = {}
): UsePDFGeneratorReturn {
  const targetRef = ref<HTMLElement | null>(null);
  const isGenerating = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);
  const result = ref<PDFGenerationResult | null>(null);

  const generator = new PDFGenerator({
    ...options,
    onProgress: (p) => {
      progress.value = p;
      options.onProgress?.(p);
    },
    onError: (e) => {
      error.value = e;
      options.onError?.(e);
    },
    onComplete: (blob) => {
      options.onComplete?.(blob);
    },
  });

  const generatePDF = async (): Promise<PDFGenerationResult | null> => {
    if (!targetRef.value) {
      console.error('Target element ref is not bound');
      return null;
    }

    try {
      isGenerating.value = true;
      error.value = null;

      const res = await generator.generatePDF(
        targetRef.value,
        options.filename || 'document.pdf'
      );

      result.value = res;
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  const generateBlob = async (): Promise<Blob | null> => {
    if (!targetRef.value) {
      console.error('Target element ref is not bound');
      return null;
    }

    try {
      isGenerating.value = true;
      error.value = null;

      const blob = await generator.generateBlob(targetRef.value);
      return blob;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  const reset = () => {
    progress.value = 0;
    error.value = null;
    result.value = null;
  };

  return {
    targetRef,
    generatePDF,
    generateBlob,
    isGenerating,
    progress,
    error,
    result,
    reset,
  };
}

/**
 * Manual mode composable - for generating PDF from any element
 *
 * @example
 * ```vue
 * <script setup>
 * import { usePDFGeneratorManual } from '@your-org/pdf-generator/vue';
 *
 * const { generatePDF, isGenerating, progress } = usePDFGeneratorManual({
 *   format: 'a4',
 * });
 *
 * const handleExport = async () => {
 *   const element = document.getElementById('my-content');
 *   if (element) {
 *     await generatePDF(element, 'document.pdf');
 *   }
 * };
 * </script>
 * ```
 */
export function usePDFGeneratorManual(
  options: Partial<PDFGeneratorOptions> = {}
) {
  const isGenerating = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);
  const result = ref<PDFGenerationResult | null>(null);

  const generator = new PDFGenerator({
    ...options,
    onProgress: (p) => {
      progress.value = p;
      options.onProgress?.(p);
    },
    onError: (e) => {
      error.value = e;
      options.onError?.(e);
    },
    onComplete: (blob) => {
      options.onComplete?.(blob);
    },
  });

  const generatePDF = async (
    element: HTMLElement,
    filename: string = 'document.pdf'
  ): Promise<PDFGenerationResult | null> => {
    try {
      isGenerating.value = true;
      error.value = null;

      const res = await generator.generatePDF(element, filename);
      result.value = res;
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  const generateBlob = async (element: HTMLElement): Promise<Blob | null> => {
    try {
      isGenerating.value = true;
      error.value = null;

      return await generator.generateBlob(element);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.value = err;
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  const reset = () => {
    progress.value = 0;
    error.value = null;
    result.value = null;
  };

  return {
    generatePDF,
    generateBlob,
    isGenerating,
    progress,
    error,
    result,
    reset,
  };
}
