/**
 * PDF Generator Library - Image Handler
 *
 * Advanced image processing for PDF generation
 */

/**
 * Image processing options
 */
export interface ImageProcessingOptions {
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** JPEG quality (0-1) */
  quality?: number;
  /** Enable image compression */
  compress?: boolean;
  /** Convert to grayscale */
  grayscale?: boolean;
}

/**
 * Preload and optimize all images in an element
 */
export async function preloadImages(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll('img'));

  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalHeight !== 0) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          console.warn(`Image load timeout: ${img.src}`);
          resolve(); // Resolve anyway to not block
        }, 10000); // 10 second timeout

        img.addEventListener('load', () => {
          clearTimeout(timeout);
          resolve();
        });

        img.addEventListener('error', (e) => {
          clearTimeout(timeout);
          console.error(`Failed to load image: ${img.src}`, e);
          resolve(); // Resolve to not block other images
        });

        // If src is not set, resolve immediately
        if (!img.src) {
          clearTimeout(timeout);
          resolve();
        }
      });
    })
  );
}

/**
 * Convert SVG elements to images
 */
export async function convertSVGsToImages(element: HTMLElement): Promise<void> {
  const svgs = Array.from(element.querySelectorAll('svg'));

  await Promise.all(
    svgs.map(async (svg) => {
      try {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = document.createElement('img');
        const rect = svg.getBoundingClientRect();

        img.width = rect.width || parseInt(svg.getAttribute('width') || '100');
        img.height = rect.height || parseInt(svg.getAttribute('height') || '100');

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            // Replace SVG with IMG
            svg.parentNode?.replaceChild(img, svg);
            URL.revokeObjectURL(url);
            resolve();
          };
          img.onerror = reject;
          img.src = url;
        });
      } catch (error) {
        console.error('Failed to convert SVG:', error);
      }
    })
  );
}

/**
 * Optimize image quality and size
 */
export async function optimizeImage(
  img: HTMLImageElement,
  options: ImageProcessingOptions = {}
): Promise<string> {
  const {
    maxWidth = 2000,
    maxHeight = 2000,
    quality = 0.85,
    compress = true,
    grayscale = false,
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  let { width, height } = img;

  // Calculate scaling to fit within max dimensions
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  // Apply grayscale if requested
  if (grayscale) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Return optimized data URL
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Process all images in element for PDF rendering
 */
export async function processImagesForPDF(
  element: HTMLElement,
  options: ImageProcessingOptions = {}
): Promise<void> {
  // First, preload all images
  await preloadImages(element);

  // Convert SVGs to images
  await convertSVGsToImages(element);

  // Optimize remaining images if compression is enabled
  if (options.compress) {
    const images = Array.from(element.querySelectorAll('img'));
    await Promise.all(
      images.map(async (img) => {
        try {
          const optimized = await optimizeImage(img, options);
          img.src = optimized;
        } catch (error) {
          console.error('Failed to optimize image:', error);
        }
      })
    );
  }
}

/**
 * Handle background images in elements
 */
export async function processBackgroundImages(element: HTMLElement): Promise<void> {
  const elementsWithBg = Array.from(
    element.querySelectorAll('*')
  ).filter((el) => {
    const style = window.getComputedStyle(el);
    return style.backgroundImage && style.backgroundImage !== 'none';
  });

  await Promise.all(
    elementsWithBg.map(async (el) => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;

      // Extract URL from background-image
      const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (!urlMatch) return;

      const url = urlMatch[1];

      // Create temporary image to preload
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Continue even if image fails
        img.src = url;
      });
    })
  );
}

/**
 * Get image dimensions without loading the full image
 */
export async function getImageDimensions(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Convert image to data URL
 */
export async function imageToDataURL(
  img: HTMLImageElement,
  type: 'image/jpeg' | 'image/png' = 'image/jpeg',
  quality: number = 0.85
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL(type, quality);
}

/**
 * Check if image is already a data URL
 */
export function isDataURL(src: string): boolean {
  return src.startsWith('data:');
}

/**
 * Estimate image file size
 */
export function estimateImageSize(dataURL: string): number {
  // Remove data URL prefix
  const base64 = dataURL.split(',')[1];
  if (!base64) return 0;

  // Calculate size (base64 is ~33% larger than binary)
  return Math.ceil((base64.length * 3) / 4);
}
