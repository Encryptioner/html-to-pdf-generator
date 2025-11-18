/**
 * Real-time PDF Preview Component for React
 *
 * Displays a live preview of PDF generation with debounced updates
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { PDFGenerator } from '../../core';
import type { PDFGeneratorOptions } from '../../types';

export interface PDFPreviewProps {
  /** HTML element or content to preview */
  content: HTMLElement | string;

  /** PDF generator options */
  options?: Partial<PDFGeneratorOptions>;

  /** Debounce delay in milliseconds */
  debounce?: number;

  /** Preview quality (0.1 - 1.0) */
  quality?: number;

  /** Scale factor for preview */
  scale?: number;

  /** Custom className for container */
  className?: string;

  /** Custom styles for container */
  style?: React.CSSProperties;

  /** Loading placeholder */
  loadingPlaceholder?: React.ReactNode;

  /** Error handler */
  onError?: (error: Error) => void;
}

/**
 * Real-time PDF Preview Component
 *
 * @example
 * ```tsx
 * import { PDFPreview } from 'html-to-pdf-generator/react';
 *
 * function App() {
 *   const contentRef = useRef<HTMLDivElement>(null);
 *
 *   return (
 *     <div>
 *       <div ref={contentRef}>
 *         <h1>My Document</h1>
 *         <p>Content goes here</p>
 *       </div>
 *
 *       <PDFPreview
 *         content={contentRef.current}
 *         debounce={500}
 *         quality={0.7}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export const PDFPreview: React.FC<PDFPreviewProps> = ({
  content,
  options = {},
  debounce = 500,
  quality = 0.7,
  scale = 1,
  className = '',
  style = {},
  loadingPlaceholder,
  onError,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const generatorRef = useRef<PDFGenerator>();

  // Initialize generator
  useEffect(() => {
    generatorRef.current = new PDFGenerator({
      ...options,
      imageQuality: quality,
      scale: scale,
    });
  }, [options, quality, scale]);

  // Generate preview
  const generatePreview = useCallback(async () => {
    if (!content || !generatorRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Convert content to element if string
      let element: HTMLElement;
      if (typeof content === 'string') {
        const div = document.createElement('div');
        div.innerHTML = content;
        element = div;
      } else {
        element = content;
      }

      // Generate PDF blob
      const blob = await generatorRef.current.generateBlob(element);

      // Create object URL for preview
      const url = URL.createObjectURL(blob);

      // Revoke previous URL to prevent memory leaks
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(url);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [content, previewUrl, onError]);

  // Debounced preview update
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      generatePreview();
    }, debounce);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, debounce, generatePreview]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Render loading state
  if (isLoading && !previewUrl) {
    return (
      <div className={`pdf-preview-loading ${className}`} style={style}>
        {loadingPlaceholder || <div>Generating preview...</div>}
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={`pdf-preview-error ${className}`} style={{ ...style, color: 'red' }}>
        Error: {error.message}
      </div>
    );
  }

  // Render preview
  return (
    <div className={`pdf-preview-container ${className}`} style={style}>
      {previewUrl && (
        <iframe
          src={previewUrl}
          title="PDF Preview"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            ...style,
          }}
        />
      )}
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Updating...
        </div>
      )}
    </div>
  );
};

/**
 * Hook for programmatic PDF preview control
 */
export function usePDFPreview(
  options: Partial<PDFGeneratorOptions> = {}
): {
  generatePreview: (content: HTMLElement) => Promise<string>;
  isGenerating: boolean;
  error: Error | null;
  previewUrl: string | null;
  clearPreview: () => void;
} {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const generatorRef = useRef<PDFGenerator>();

  useEffect(() => {
    generatorRef.current = new PDFGenerator(options);
  }, [options]);

  const generatePreview = useCallback(async (content: HTMLElement): Promise<string> => {
    if (!generatorRef.current) {
      throw new Error('PDF Generator not initialized');
    }

    setIsGenerating(true);
    setError(null);

    try {
      const blob = await generatorRef.current.generateBlob(content);
      const url = URL.createObjectURL(blob);

      // Revoke previous URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      setPreviewUrl(url);
      return url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [previewUrl]);

  const clearPreview = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return {
    generatePreview,
    isGenerating,
    error,
    previewUrl,
    clearPreview,
  };
}
