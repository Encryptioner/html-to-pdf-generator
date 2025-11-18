# Custom Fonts

> **🚧 NOT YET IMPLEMENTED**: This feature is documented for future implementation. The `fontOptions` parameter is defined but not functional. See [FEATURE_IMPLEMENTATION_STATUS.md](../../FEATURE_IMPLEMENTATION_STATUS.md) for details.

## Overview

The font system allows you to embed custom fonts in your PDF documents, ensuring that text renders with your specified typefaces regardless of what fonts are installed on the user's system. This is essential for maintaining brand consistency and ensuring documents look exactly as designed.

Key features:
- **Font Embedding** - Include TrueType, OpenType, WOFF, and WOFF2 fonts
- **Web-Safe Fallbacks** - Automatic fallback to system fonts
- **Multiple Weights** - Support for font weights (100-900)
- **Font Styles** - Normal, italic, and oblique styles
- **Format Support** - Multiple font file formats

## Configuration Interface

```typescript
export interface FontConfig {
  /** Font family name */
  family: string;

  /** Font source URL or path */
  src: string;

  /** Font weight (100-900) */
  weight?: number;

  /** Font style */
  style?: 'normal' | 'italic' | 'oblique';

  /** Font format */
  format?: 'truetype' | 'opentype' | 'woff' | 'woff2';
}

export interface FontOptions {
  /** Custom fonts to embed */
  fonts?: FontConfig[];

  /** Embed all fonts in PDF */
  embedFonts?: boolean;

  /** Fallback font if custom font fails */
  fallbackFont?: string;

  /** Convert to web-safe fonts */
  useWebSafeFonts?: boolean;
}
```

## Basic Usage

### Single Custom Font

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  fontOptions: {
    fonts: [
      {
        family: 'Montserrat',
        src: '/fonts/Montserrat-Regular.ttf',
        weight: 400,
        style: 'normal',
        format: 'truetype'
      }
    ],
    embedFonts: true,
    fallbackFont: 'Arial'
  },
  customCSS: `
    body {
      font-family: 'Montserrat', Arial, sans-serif;
    }
  `
});
```

### Multiple Font Weights

```typescript
const result = await generator.generate(element, {
  fontOptions: {
    fonts: [
      {
        family: 'Roboto',
        src: '/fonts/Roboto-Light.ttf',
        weight: 300,
        style: 'normal',
        format: 'truetype'
      },
      {
        family: 'Roboto',
        src: '/fonts/Roboto-Regular.ttf',
        weight: 400,
        style: 'normal',
        format: 'truetype'
      },
      {
        family: 'Roboto',
        src: '/fonts/Roboto-Bold.ttf',
        weight: 700,
        style: 'normal',
        format: 'truetype'
      }
    ],
    embedFonts: true,
    fallbackFont: 'Helvetica'
  },
  customCSS: `
    body { font-family: 'Roboto', Helvetica, sans-serif; font-weight: 400; }
    h1, h2, h3 { font-weight: 700; }
    .light { font-weight: 300; }
  `
});
```

### Web Fonts (WOFF2)

```typescript
const result = await generator.generate(element, {
  fontOptions: {
    fonts: [
      {
        family: 'Inter',
        src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHAPMtVVLlC.woff2',
        weight: 400,
        style: 'normal',
        format: 'woff2'
      }
    ],
    embedFonts: true
  },
  customCSS: `
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  `
});
```

## Advanced Examples

### Complete Font Family with Variants

```typescript
const result = await generator.generate(element, {
  fontOptions: {
    fonts: [
      // Regular weights
      {
        family: 'Lato',
        src: '/fonts/Lato-Thin.ttf',
        weight: 100,
        style: 'normal',
        format: 'truetype'
      },
      {
        family: 'Lato',
        src: '/fonts/Lato-Light.ttf',
        weight: 300,
        style: 'normal',
        format: 'truetype'
      },
      {
        family: 'Lato',
        src: '/fonts/Lato-Regular.ttf',
        weight: 400,
        style: 'normal',
        format: 'truetype'
      },
      {
        family: 'Lato',
        src: '/fonts/Lato-Bold.ttf',
        weight: 700,
        style: 'normal',
        format: 'truetype'
      },
      // Italic variants
      {
        family: 'Lato',
        src: '/fonts/Lato-Italic.ttf',
        weight: 400,
        style: 'italic',
        format: 'truetype'
      },
      {
        family: 'Lato',
        src: '/fonts/Lato-BoldItalic.ttf',
        weight: 700,
        style: 'italic',
        format: 'truetype'
      }
    ],
    embedFonts: true,
    fallbackFont: 'Georgia'
  },
  customCSS: `
    body { font-family: 'Lato', Georgia, serif; font-weight: 400; }
    h1, h2, h3 { font-weight: 700; }
    em, i { font-style: italic; }
    strong, b { font-weight: 700; }
    .thin { font-weight: 100; }
    .light { font-weight: 300; }
    .bold { font-weight: 700; }
  `
});
```

### Corporate Branding Fonts

```typescript
const corporateFont = {
  fontOptions: {
    fonts: [
      // Headings font
      {
        family: 'Corporate Sans',
        src: '/fonts/corporate-sans-bold.ttf',
        weight: 700,
        style: 'normal',
        format: 'truetype'
      },
      // Body font
      {
        family: 'Corporate Text',
        src: '/fonts/corporate-text-regular.ttf',
        weight: 400,
        style: 'normal',
        format: 'truetype'
      }
    ],
    embedFonts: true,
    fallbackFont: 'Arial'
  },
  customCSS: `
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Corporate Sans', Arial, sans-serif;
      font-weight: 700;
    }
    body, p {
      font-family: 'Corporate Text', Arial, sans-serif;
      font-weight: 400;
      line-height: 1.6;
    }
  `
};

const result = await generator.generate(element, corporateFont);
```

### Google Fonts Integration

```typescript
const result = await generator.generate(element, {
  fontOptions: {
    fonts: [
      {
        family: 'Open Sans',
        src: 'https://fonts.gstatic.com/s/opensans/v20/memSYaGs126MiZpBA-UvWbX5ZZB.woff2',
        weight: 400,
        style: 'normal',
        format: 'woff2'
      },
      {
        family: 'Open Sans',
        src: 'https://fonts.gstatic.com/s/opensans/v20/memSYaGs126MiZpBA-UvYY35ZZB.woff2',
        weight: 700,
        style: 'normal',
        format: 'woff2'
      },
      {
        family: 'Playfair Display',
        src: 'https://fonts.gstatic.com/s/playfairdisplay/v31/_Xmr-Ha7KX-AhhsPmg87aH6A6NxSMQ.woff2',
        weight: 700,
        style: 'normal',
        format: 'woff2'
      }
    ],
    embedFonts: true,
    fallbackFont: 'serif'
  },
  customCSS: `
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 36px;
      font-weight: 700;
    }
    body {
      font-family: 'Open Sans', sans-serif;
      font-size: 14px;
      font-weight: 400;
    }
    strong, b {
      font-weight: 700;
    }
  `
});
```

### Base64 Embedded Fonts

```typescript
const result = await generator.generate(element, {
  fontOptions: {
    fonts: [
      {
        family: 'CustomFont',
        // Base64 encoded font data
        src: 'data:font/truetype;base64,AAEAAAALAIAAAwAwT1MvMg8SBP...',
        weight: 400,
        style: 'normal',
        format: 'truetype'
      }
    ],
    embedFonts: true
  }
});
```

## Common Patterns

### Sans-Serif Professional

```typescript
const sansSerifFonts = {
  fonts: [
    {
      family: 'Source Sans Pro',
      src: '/fonts/SourceSansPro-Regular.ttf',
      weight: 400,
      style: 'normal',
      format: 'truetype'
    },
    {
      family: 'Source Sans Pro',
      src: '/fonts/SourceSansPro-Bold.ttf',
      weight: 700,
      style: 'normal',
      format: 'truetype'
    }
  ],
  embedFonts: true,
  fallbackFont: 'Helvetica'
};
```

### Serif Traditional

```typescript
const serifFonts = {
  fonts: [
    {
      family: 'Crimson Text',
      src: '/fonts/CrimsonText-Regular.ttf',
      weight: 400,
      style: 'normal',
      format: 'truetype'
    },
    {
      family: 'Crimson Text',
      src: '/fonts/CrimsonText-Bold.ttf',
      weight: 700,
      style: 'normal',
      format: 'truetype'
    }
  ],
  embedFonts: true,
  fallbackFont: 'Georgia'
};
```

### Monospace Code

```typescript
const monospaceFonts = {
  fonts: [
    {
      family: 'JetBrains Mono',
      src: '/fonts/JetBrainsMono-Regular.ttf',
      weight: 400,
      style: 'normal',
      format: 'truetype'
    }
  ],
  embedFonts: true,
  fallbackFont: 'Courier New'
};
```

## Font Weight Standards

| Weight | Name | Usage |
|--------|------|-------|
| 100 | Thin | Headers, decorative |
| 300 | Light | Subheaders, lightweight |
| 400 | Normal | Body text (default) |
| 500 | Medium | Emphasized text |
| 700 | Bold | Strong emphasis, headings |
| 900 | Black | Very strong emphasis |

## Tips and Best Practices

1. **File Size**: Embed only necessary font weights/styles to minimize PDF size

2. **Format Selection**:
   - WOFF2: Best compression, modern browsers (use for web)
   - WOFF: Good compatibility
   - TrueType/OpenType: Maximum compatibility

3. **Fallback Fonts**: Always specify web-safe fallbacks (Arial, Georgia, Courier New)

4. **Font URLs**: Use absolute URLs for reliable font loading

5. **Font Licensing**: Ensure you have proper licenses for embedding fonts in PDFs

6. **Performance**: Load fonts asynchronously to avoid blocking PDF generation

7. **Consistency**: Use the same font family consistently across headings and body text

8. **Weight Strategy**: Include only weights you'll actually use (typically 400, 700)

9. **Character Sets**: Verify fonts support necessary characters/languages

10. **Testing**: Test PDF appearance across different PDF readers

## See Also

- [Watermarks](./watermarks.md) - Custom font styling in watermarks
- [CSS Styling](./multi-page.md) - Advanced CSS for typography
- [Headers/Footers](./headers-footers.md) - Font styling in headers and footers