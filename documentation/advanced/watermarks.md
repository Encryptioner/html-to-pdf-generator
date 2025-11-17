# Watermarks

## Overview

The watermark feature allows you to add visual overlays to your PDF documents for branding, security, or informational purposes. You can use text watermarks (e.g., "CONFIDENTIAL", "DRAFT") or image watermarks (logos, stamps) with full control over positioning, opacity, rotation, and styling.

Watermarks can be applied to all pages of the PDF or specific pages, making them suitable for:
- Confidentiality notices
- Draft/internal document marks
- Company branding
- Security stamps
- Copyright notices

## Configuration Interface

```typescript
export interface WatermarkOptions {
  /** Watermark text */
  text?: string;

  /** Watermark image (data URL or path) */
  image?: string;

  /** Opacity (0-1, default: 0.1 for text, 0.15 for images) */
  opacity?: number;

  /** Position of watermark */
  position?: 'center' | 'diagonal' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

  /** Font size for text watermark (default: 48) */
  fontSize?: number;

  /** Color for text watermark (hex or rgb, default: '#cccccc') */
  color?: string;

  /** Rotation angle in degrees (default: 45 for diagonal, 0 otherwise) */
  rotation?: number;

  /** Apply to all pages (default: true) */
  allPages?: boolean;
}
```

## Basic Usage

### Text Watermark

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.1,
    position: 'diagonal',
    rotation: 45,
    color: '#999999',
    fontSize: 60
  }
});
```

### Image Watermark

```typescript
const result = await generator.generate(element, {
  watermark: {
    image: '/images/logo.png', // or data URL
    opacity: 0.15,
    position: 'center',
    allPages: true
  }
});
```

### Positioned Watermark

```typescript
const result = await generator.generate(element, {
  watermark: {
    text: 'DRAFT',
    position: 'top-right',
    opacity: 0.2,
    fontSize: 36,
    color: '#ff0000',
    rotation: -15
  }
});
```

## Advanced Examples

### Dynamic Watermark Based on Document Type

```typescript
function getWatermarkForDocType(docType: string) {
  const watermarks = {
    confidential: {
      text: 'CONFIDENTIAL',
      color: '#cc0000',
      opacity: 0.08,
      position: 'diagonal' as const,
      rotation: 45
    },
    draft: {
      text: 'DRAFT',
      color: '#ff9900',
      opacity: 0.12,
      position: 'top-right' as const,
      rotation: -30
    },
    approved: {
      image: '/images/approved-stamp.png',
      opacity: 0.2,
      position: 'bottom-right' as const
    }
  };

  return watermarks[docType as keyof typeof watermarks];
}

const element = document.getElementById('content');
const watermark = getWatermarkForDocType('confidential');

await generator.generate(element, { watermark });
```

### Multi-Level Branding Watermark

```typescript
// Combine with company branding
const element = document.getElementById('content');

await generator.generate(element, {
  watermark: {
    image: '/images/company-logo.png',
    position: 'center',
    opacity: 0.08,
    allPages: true
  },
  customCSS: `
    ::before {
      content: 'Company © 2024';
      position: fixed;
      bottom: 20px;
      right: 20px;
      font-size: 10px;
      color: #cccccc;
      z-index: 1;
    }
  `
});
```

### Conditional Watermark Application

```typescript
function generateDocument(content: HTMLElement, isConfidential: boolean) {
  const options: PDFGeneratorOptions = {
    format: 'a4',
    margins: [20, 20, 20, 20]
  };

  if (isConfidential) {
    options.watermark = {
      text: 'CONFIDENTIAL',
      opacity: 0.1,
      position: 'diagonal',
      fontSize: 72,
      color: '#ff0000',
      rotation: 45,
      allPages: true
    };
  }

  return generator.generate(content, options);
}
```

### Watermark with Custom Styling

```typescript
await generator.generate(element, {
  watermark: {
    text: 'FOR REVIEW ONLY',
    fontSize: 48,
    color: '#FF6B6B',
    opacity: 0.15,
    position: 'center',
    rotation: 25,
    allPages: true
  },
  customCSS: `
    body {
      background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
    }
  `
});
```

## Common Patterns

### Confidential Document Watermark

```typescript
const confidentialWatermark: WatermarkOptions = {
  text: 'CONFIDENTIAL',
  color: '#cc0000',
  fontSize: 64,
  opacity: 0.08,
  position: 'diagonal',
  rotation: 45,
  allPages: true
};
```

### Draft Status Watermark

```typescript
const draftWatermark: WatermarkOptions = {
  text: 'DRAFT',
  color: '#ff9900',
  fontSize: 48,
  opacity: 0.12,
  position: 'top-left',
  rotation: -30,
  allPages: true
};
```

### Company Logo Watermark

```typescript
const logoWatermark: WatermarkOptions = {
  image: '/images/company-logo.png',
  opacity: 0.1,
  position: 'center',
  allPages: true
};
```

### Timestamp Watermark

```typescript
const timestamp = new Date().toLocaleString();
const timestampWatermark: WatermarkOptions = {
  text: `Generated: ${timestamp}`,
  fontSize: 10,
  opacity: 0.3,
  position: 'bottom-left',
  color: '#999999',
  allPages: true
};
```

## Tips and Best Practices

1. **Opacity Considerations**: Use lower opacity (0.08-0.15) for important document content to remain readable. Higher opacity (0.2+) for less critical documents.

2. **Position Selection**:
   - Use `diagonal` for prominent watermarks (CONFIDENTIAL, DRAFT)
   - Use `center` for logos and stamps
   - Use corner positions for subtle branding

3. **Font Size**: Larger sizes (60+) for security notices, smaller sizes (24-36) for subtle branding

4. **Color Contrast**: Choose colors that contrast with the background but don't obscure content

5. **Image Watermarks**: Use PNG images with transparency for best results. Ensure images are optimized for file size.

6. **Data URLs**: For images, consider embedding small logos as base64 data URLs to avoid file path issues

7. **Multiple Watermarks**: Layer text and image watermarks using custom CSS combined with watermark options

## See Also

- [Headers/Footers](./headers-footers.md) - Add page headers and footers
- [Metadata](./metadata.md) - Embed document metadata
- [Security](./security.md) - Encrypt and protect PDFs
- [CSS Styling](./multi-page.md) - Custom styling and formatting
