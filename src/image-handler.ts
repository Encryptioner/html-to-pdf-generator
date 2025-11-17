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
  /** DPI for print quality (72, 150, 300) */
  dpi?: number;
  /** Image format */
  format?: 'jpeg' | 'png' | 'webp';
  /** Background color for transparent images (hex or rgb) */
  backgroundColor?: string;
  /** Enable image interpolation (may cause blur) */
  interpolate?: boolean;
  /** Optimize for print quality */
  optimizeForPrint?: boolean;
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
    dpi = 150,
    format = 'jpeg',
    backgroundColor = '#ffffff',
    interpolate = true,
    optimizeForPrint = false,
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  let { width, height } = img;

  // Apply DPI scaling for print quality
  let dpiScale = 1;
  if (optimizeForPrint && dpi) {
    // Scale based on DPI (72 DPI is web standard, 300 DPI is print standard)
    dpiScale = dpi / 72;
  }

  // Calculate scaling to fit within max dimensions
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width *= ratio;
    height *= ratio;
  }

  // Apply DPI scaling
  const finalWidth = Math.floor(width * dpiScale);
  const finalHeight = Math.floor(height * dpiScale);

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // Control interpolation to prevent blur
  if (!interpolate) {
    ctx.imageSmoothingEnabled = false;
  } else {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // FIX: Fill canvas with background color BEFORE drawing image
  // This prevents transparent areas from becoming black in JPEG
  if (format === 'jpeg' || backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, finalWidth, finalHeight);
  }

  // Draw image
  ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

  // Apply grayscale if requested
  if (grayscale) {
    const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;     // Red
      data[i + 1] = avg; // Green
      data[i + 2] = avg; // Blue
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // Return optimized data URL with specified format
  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
  return canvas.toDataURL(mimeType, quality);
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
  type: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality: number = 0.85,
  backgroundColor: string = '#ffffff'
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  // FIX: Fill canvas with background color BEFORE drawing image
  // This prevents transparent areas from becoming black in JPEG
  if (type === 'image/jpeg' || backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

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

/**
 * Calculate pixel dimensions for given DPI
 */
export function calculateDPIDimensions(
  widthInches: number,
  heightInches: number,
  dpi: number
): { width: number; height: number } {
  return {
    width: Math.floor(widthInches * dpi),
    height: Math.floor(heightInches * dpi)
  };
}

/**
 * Get recommended DPI based on use case
 */
export function getRecommendedDPI(useCase: 'web' | 'print' | 'high-quality-print'): number {
  switch (useCase) {
    case 'web':
      return 72;
    case 'print':
      return 150;
    case 'high-quality-print':
      return 300;
    default:
      return 150;
  }
}

/**
 * Detect if image has transparency
 */
export function hasTransparency(img: HTMLImageElement): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(false);
      return;
    }

    ctx.drawImage(img, 0, 0);

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check if any pixel has alpha < 255
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] < 255) {
          resolve(true);
          return;
        }
      }
      resolve(false);
    } catch (error) {
      // CORS error or other issue
      console.warn('Could not detect transparency:', error);
      resolve(false);
    }
  });
}
