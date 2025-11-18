/**
 * PDF Generator Library - React Hooks
 *
 * React hooks for easy integration with React components
 */

import { useRef, useState, useCallback } from 'react';
import { PDFGenerator, generateBatchPDF } from '../../core';
import type {
  PDFGeneratorOptions,
  PDFGenerationResult,
  PDFContentItem,
  BatchPDFGenerationResult
} from '../../types';

export interface UsePDFGeneratorOptions extends Partial<PDFGeneratorOptions> {
  /** Filename for the generated PDF */
  filename?: string;
  /** Callback for progress updates */
  onProgress?: (progress: number) => void;
  /** Callback for errors */
  onError?: (error: Error) => void;
  /** Callback when PDF generation completes */
  onComplete?: (blob: Blob) => void;
}

export interface UsePDFGeneratorReturn {
  /** Ref to attach to the element you want to convert to PDF */
  targetRef: React.RefObject<HTMLDivElement | null>;

  /** Generate and download PDF */
  generatePDF: () => Promise<PDFGenerationResult | null>;

  /** Generate PDF blob without downloading */
  generateBlob: () => Promise<Blob | null>;

  /** Whether PDF is currently being generated */
  isGenerating: boolean;

  /** Current progress (0-100) */
  progress: number;

  /** Error if generation failed */
  error: Error | null;

  /** Result from last successful generation */
  result: PDFGenerationResult | null;

  /** Reset state */
  reset: () => void;
}

export interface UsePDFGeneratorManualReturn {
  /** Generate and download PDF from a custom element */
  generatePDF: (element: HTMLElement, filename?: string) => Promise<PDFGenerationResult | null>;

  /** Generate PDF blob from a custom element without downloading */
  generateBlob: (element: HTMLElement) => Promise<Blob | null>;

  /** Whether PDF is currently being generated */
  isGenerating: boolean;

  /** Current progress (0-100) */
  progress: number;

  /** Error if generation failed */
  error: Error | null;

  /** Result from last successful generation */
  result: PDFGenerationResult | null;

  /** Reset state */
  reset: () => void;
}

/**
 * React hook for PDF generation
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
 *     filename: 'my-document.pdf',
 *     format: 'a4',
 *     showPageNumbers: true,
 *   });
 *
 *   return (
 *     <div>
 *       <div ref={targetRef}>
 *         <h1>Content to convert to PDF</h1>
 *         <p>This will be in your PDF document</p>
 *       </div>
 *
 *       <button onClick={generatePDF} disabled={isGenerating}>
 *         {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePDFGenerator(
  options: UsePDFGeneratorOptions = {}
): UsePDFGeneratorReturn {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<PDFGenerationResult | null>(null);

  const generatorRef = useRef<PDFGenerator | null>(null);

  // Initialize generator
  const getGenerator = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = new PDFGenerator({
        ...options,
        onProgress: (p) => {
          setProgress(Math.round(p));
          options.onProgress?.(p);
        },
        onError: (err) => {
          setError(err);
          options.onError?.(err);
        },
        onComplete: (blob) => {
          options.onComplete?.(blob);
        },
      });
    }
    return generatorRef.current;
  }, [options]);

  const generatePDF = useCallback(async () => {
    if (!targetRef.current) {
      console.error('Target element not found. Did you attach targetRef to an element?');
      return null;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      const generator = getGenerator();
      const result = await generator.generatePDF(
        targetRef.current,
        options.filename || 'document.pdf'
      );

      setResult(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [options.filename, getGenerator]);

  const generateBlob = useCallback(async () => {
    if (!targetRef.current) {
      console.error('Target element not found. Did you attach targetRef to an element?');
      return null;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);

      const generator = getGenerator();
      const blob = await generator.generateBlob(targetRef.current);

      return blob;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      return null;
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  }, [getGenerator]);

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

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
 * Hook for generating PDF with custom element (not ref-based)
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { generatePDF, isGenerating, progress } = usePDFGeneratorManual({
 *     filename: 'my-document.pdf',
 *     format: 'a4',
 *   });
 *
 *   const handleDownload = () => {
 *     const element = document.getElementById('content');
 *     if (element) {
 *       generatePDF(element);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <div id="content">
 *         <h1>Content to convert to PDF</h1>
 *       </div>
 *       <button onClick={handleDownload} disabled={isGenerating}>
 *         {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePDFGeneratorManual(
  options: UsePDFGeneratorOptions = {}
): UsePDFGeneratorManualReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<PDFGenerationResult | null>(null);

  const generatorRef = useRef<PDFGenerator | null>(null);

  const getGenerator = useCallback(() => {
    if (!generatorRef.current) {
      generatorRef.current = new PDFGenerator({
        ...options,
        onProgress: (p) => {
          setProgress(Math.round(p));
          options.onProgress?.(p);
        },
        onError: (err) => {
          setError(err);
          options.onError?.(err);
        },
        onComplete: (blob) => {
          options.onComplete?.(blob);
        },
      });
    }
    return generatorRef.current;
  }, [options]);

  const generatePDF = useCallback(
    async (element: HTMLElement, filename?: string) => {
      try {
        setIsGenerating(true);
        setError(null);
        setProgress(0);

        const generator = getGenerator();
        const result = await generator.generatePDF(
          element,
          filename || options.filename || 'document.pdf'
        );

        setResult(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [options.filename, getGenerator]
  );

  const generateBlob = useCallback(
    async (element: HTMLElement) => {
      try {
        setIsGenerating(true);
        setError(null);
        setProgress(0);

        const generator = getGenerator();
        const blob = await generator.generateBlob(element);

        return blob;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        return null;
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [getGenerator]
  );

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

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

/**
 * Batch PDF generator options
 */
export interface UseBatchPDFGeneratorOptions extends Partial<PDFGeneratorOptions> {
  /** Filename for the generated PDF */
  filename?: string;
}

/**
 * Return type for useBatchPDFGenerator hook
 */
export interface UseBatchPDFGeneratorReturn {
  /** Generate and download batch PDF */
  generateBatchPDF: (items: PDFContentItem[], filename?: string) => Promise<BatchPDFGenerationResult | null>;

  /** Generate batch PDF blob without downloading */
  generateBatchBlob: (items: PDFContentItem[]) => Promise<BatchPDFGenerationResult | null>;

  /** Whether PDF is currently being generated */
  isGenerating: boolean;

  /** Current progress (0-100) */
  progress: number;

  /** Error if generation failed */
  error: Error | null;

  /** Result from last successful batch generation */
  result: BatchPDFGenerationResult | null;

  /** Reset state */
  reset: () => void;
}

/**
 * React hook for batch PDF generation with automatic scaling
 *
 * @example
 * ```tsx
 * function BatchReport() {
 *   const { generateBatchPDF, isGenerating, progress, result } = useBatchPDFGenerator({
 *     filename: 'report.pdf',
 *     format: 'a4',
 *     showPageNumbers: true,
 *   });
 *
 *   const handleGenerate = async () => {
 *     const items = [
 *       { content: document.getElementById('section1')!, pageCount: 2, title: 'Introduction' },
 *       { content: document.getElementById('section2')!, pageCount: 3, title: 'Details' },
 *       { content: document.getElementById('section3')!, pageCount: 1, title: 'Summary' },
 *     ];
 *
 *     await generateBatchPDF(items);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleGenerate} disabled={isGenerating}>
 *         {isGenerating ? `Generating... ${progress}%` : 'Generate Report'}
 *       </button>
 *       {result && (
 *         <div>
 *           Generated {result.totalPages} pages in {result.generationTime}ms
 *         </div>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useBatchPDFGenerator(
  options: UseBatchPDFGeneratorOptions = {}
): UseBatchPDFGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<BatchPDFGenerationResult | null>(null);

  const generateBatch = useCallback(
    async (items: PDFContentItem[], filename?: string) => {
      try {
        setIsGenerating(true);
        setError(null);
        setProgress(0);
        setResult(null);

        const batchOptions = {
          ...options,
          onProgress: (p: number) => {
            setProgress(p);
            options.onProgress?.(p);
          },
          onError: (err: Error) => {
            setError(err);
            options.onError?.(err);
          },
          onComplete: options.onComplete,
        };

        const batchResult = await generateBatchPDF(
          items,
          filename || options.filename || 'document.pdf',
          batchOptions
        );

        setResult(batchResult);
        return batchResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [options]
  );

  const generateBatchBlob = useCallback(
    async (items: PDFContentItem[]) => {
      try {
        setIsGenerating(true);
        setError(null);
        setProgress(0);
        setResult(null);

        const batchOptions = {
          ...options,
          onProgress: (p: number) => {
            setProgress(p);
            options.onProgress?.(p);
          },
          onError: (err: Error) => {
            setError(err);
            options.onError?.(err);
          },
        };

        // Use empty filename to skip download
        const batchResult = await generateBatchPDF(items, '', batchOptions);

        setResult(batchResult);
        return batchResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        options.onError?.(error);
        return null;
      } finally {
        setIsGenerating(false);
        setProgress(0);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setResult(null);
  }, []);

  return {
    generateBatchPDF: generateBatch,
    generateBatchBlob,
    isGenerating,
    progress,
    error,
    result,
    reset,
  };
}
