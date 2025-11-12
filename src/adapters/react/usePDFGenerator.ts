/**
 * PDF Generator Library - React Hooks
 *
 * React hooks for easy integration with React components
 */

import { useRef, useState, useCallback } from 'react';
import { PDFGenerator } from '../../core';
import type { PDFGeneratorOptions, PDFGenerationResult } from '../../types';

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
