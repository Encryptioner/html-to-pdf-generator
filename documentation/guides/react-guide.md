# React Integration Guide

Complete guide to using HTML to PDF Generator in your React applications.

## Installation

```bash
npm install @encryptioner/html-to-pdf-generator
```

## Quick Start

### Using the `usePDFGenerator` Hook

The simplest way to generate PDFs in React:

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

export default function Invoice() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'invoice.pdf',
    format: 'a4',
    showPageNumbers: true,
  });

  return (
    <div>
      <div ref={targetRef} className="w-[794px] p-8 bg-white">
        <h1 className="text-3xl font-bold">Invoice #12345</h1>
        <p>Amount: $1,234.56</p>
      </div>

      <button
        onClick={generatePDF}
        disabled={isGenerating}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
      </button>
    </div>
  );
}
```

## The `usePDFGenerator` Hook

### Basic Usage

```tsx
const { targetRef, generatePDF, isGenerating, progress, error, result } =
  usePDFGenerator({
    filename: 'document.pdf',
    format: 'a4',
  });
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `targetRef` | `RefObject<HTMLDivElement>` | Attach to element to convert |
| `generatePDF()` | `() => Promise<void>` | Generate and download PDF |
| `generateBlob()` | `() => Promise<Blob>` | Generate blob without download |
| `isGenerating` | `boolean` | Whether PDF is being generated |
| `progress` | `number` | Current progress (0-100) |
| `error` | `Error \| null` | Error if generation failed |
| `result` | `PDFGenerationResult \| null` | Result from last generation |
| `reset()` | `() => void` | Reset state |

### All Options

```tsx
const pdf = usePDFGenerator({
  // Required
  filename: 'document.pdf',

  // Paper settings
  format: 'a4',                    // 'a4' | 'letter' | 'a3' | 'legal'
  orientation: 'portrait',         // 'portrait' | 'landscape'
  margins: [10, 10, 10, 10],      // [top, right, bottom, left] in mm

  // Quality
  scale: 2,                        // 1-4, higher = better quality
  imageQuality: 0.85,             // 0-1 (legacy, use imageOptions instead)
  compress: true,

  // Image Optimization (v5.1.0) ⭐ NEW
  imageOptions: {
    dpi: 300,                      // 72 (web), 150 (print), 300 (high-quality)
    format: 'jpeg',                // 'jpeg' | 'png' | 'webp'
    backgroundColor: '#ffffff',    // Background for transparent images
    optimizeForPrint: true,        // Enable print optimizations
    interpolate: true,             // Image smoothing
    quality: 0.92                  // Compression quality
  },

  // Features
  showPageNumbers: true,
  pageNumberPosition: 'footer',    // 'header' | 'footer'

  // Callbacks
  onProgress: (progress) => console.log(`${progress}%`),
  onComplete: (blob) => console.log('Done!', blob),
  onError: (error) => console.error('Failed:', error),
});
```

## The `usePDFGeneratorManual` Hook

For cases where you can't use refs or need more control:

```tsx
import { usePDFGeneratorManual } from '@encryptioner/html-to-pdf-generator/react';

export default function FlexiblePDF() {
  const { generatePDF, isGenerating, progress } = usePDFGeneratorManual({
    filename: 'document.pdf',
  });

  const handleDownload = () => {
    const element = document.getElementById('my-content');
    if (element) {
      generatePDF(element);
    }
  };

  return (
    <div>
      <div id="my-content">
        <h1>Content</h1>
      </div>
      <button onClick={handleDownload}>Download</button>
    </div>
  );
}
```

## Common Patterns

### With Loading State

```tsx
export default function Report() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'report.pdf',
  });

  return (
    <div>
      <div ref={targetRef}>{/* Content */}</div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? (
          <div className="flex items-center gap-2">
            <Spinner />
            <span>Generating {progress}%</span>
          </div>
        ) : (
          'Download PDF'
        )}
      </button>
    </div>
  );
}
```

### With Error Handling

```tsx
export default function Document() {
  const { targetRef, generatePDF, error } = usePDFGenerator({
    filename: 'document.pdf',
    onError: (err) => {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF');
    },
  });

  return (
    <div>
      <div ref={targetRef}>{/* Content */}</div>
      <button onClick={generatePDF}>Download</button>
      {error && (
        <div className="text-red-500">
          Error: {error.message}
        </div>
      )}
    </div>
  );
}
```

### Upload to Server

```tsx
export default function UploadablePDF() {
  const { targetRef, generateBlob, isGenerating } = usePDFGenerator({
    filename: 'document.pdf',
  });

  const handleUpload = async () => {
    const blob = await generateBlob();

    const formData = new FormData();
    formData.append('pdf', blob, 'document.pdf');

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    toast.success('PDF uploaded!');
  };

  return (
    <div>
      <div ref={targetRef}>{/* Content */}</div>
      <button onClick={handleUpload} disabled={isGenerating}>
        Upload PDF
      </button>
    </div>
  );
}
```

### Multiple PDFs in One Component

```tsx
export default function MultiPDF() {
  const invoice = usePDFGenerator({ filename: 'invoice.pdf' });
  const receipt = usePDFGenerator({ filename: 'receipt.pdf' });

  return (
    <div>
      <div ref={invoice.targetRef}>{/* Invoice content */}</div>
      <button onClick={invoice.generatePDF}>Download Invoice</button>

      <div ref={receipt.targetRef}>{/* Receipt content */}</div>
      <button onClick={receipt.generatePDF}>Download Receipt</button>
    </div>
  );
}
```

### With Progress Bar

```tsx
import { Progress } from '@/components/ui/progress';

export default function ProgressPDF() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'document.pdf',
  });

  return (
    <div>
      <div ref={targetRef}>{/* Content */}</div>

      {isGenerating && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-gray-600">
            Generating PDF... {progress}%
          </p>
        </div>
      )}

      <button onClick={generatePDF} disabled={isGenerating}>
        Download PDF
      </button>
    </div>
  );
}
```

## Advanced Examples

### Dynamic Content with State

```tsx
export default function DynamicInvoice() {
  const [items, setItems] = useState([
    { name: 'Item 1', price: 100 },
    { name: 'Item 2', price: 200 },
  ]);

  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'invoice.pdf',
    showPageNumbers: true,
  });

  return (
    <div>
      <div ref={targetRef} className="w-[794px]">
        <h1>Invoice</h1>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>${item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="font-bold">
          Total: ${items.reduce((sum, item) => sum + item.price, 0)}
        </p>
      </div>

      <button onClick={generatePDF}>
        {isGenerating ? 'Generating...' : 'Download Invoice'}
      </button>
    </div>
  );
}
```

### With Tailwind CSS

```tsx
export default function StyledPDF() {
  const { targetRef, generatePDF } = usePDFGenerator({
    filename: 'styled-document.pdf',
  });

  return (
    <div>
      <div ref={targetRef} className="w-[794px] p-8 bg-gray-50">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          Styled Document
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 leading-relaxed">
            This content uses Tailwind CSS classes that will appear in the PDF.
          </p>
        </div>
      </div>
      <button onClick={generatePDF}>Download</button>
    </div>
  );
}
```

### Conditional Rendering for PDF

```tsx
export default function ConditionalPDF() {
  const [showDetails, setShowDetails] = useState(false);
  const { targetRef, generatePDF } = usePDFGenerator({
    filename: 'document.pdf',
  });

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showDetails}
          onChange={(e) => setShowDetails(e.target.checked)}
        />
        Include detailed information in PDF
      </label>

      <div ref={targetRef}>
        <h1>Report</h1>
        <p>Summary information...</p>

        {showDetails && (
          <div>
            <h2>Detailed Information</h2>
            <p>This only appears if checkbox is checked before generating PDF</p>
          </div>
        )}
      </div>

      <button onClick={generatePDF}>Download PDF</button>
    </div>
  );
}
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```tsx
import type {
  PDFGeneratorOptions,
  PDFGenerationResult,
  UsePDFGeneratorOptions,
} from '@encryptioner/html-to-pdf-generator/react';

const options: UsePDFGeneratorOptions = {
  filename: 'document.pdf',
  format: 'a4',
  showPageNumbers: true,
};

const {
  targetRef,
  generatePDF,
  isGenerating,
  progress,
  error,
  result,
}: UsePDFGeneratorReturn = usePDFGenerator(options);

// Result type is fully typed
if (result) {
  const pageCount: number = result.pageCount;
  const fileSize: number = result.fileSize;
  const generationTime: number = result.generationTime;
}
```

## Best Practices

### 1. Use Fixed Width Container

```tsx
<div ref={targetRef} className="w-[794px]"> {/* A4 width */}
  {/* Content */}
</div>
```

### 2. Handle Loading States

```tsx
<button onClick={generatePDF} disabled={isGenerating}>
  {isGenerating ? `${progress}%` : 'Download'}
</button>
```

### 3. Implement Error Handling

```tsx
const pdf = usePDFGenerator({
  filename: 'document.pdf',
  onError: (err) => {
    console.error(err);
    toast.error('Failed to generate PDF');
  },
});
```

### 4. Wait for Images to Load

```tsx
useEffect(() => {
  // Ensure images are loaded
  const images = Array.from(document.images);
  Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
}, []);
```

### 5. Optimize for Performance

```tsx
const pdf = usePDFGenerator({
  filename: 'document.pdf',
  scale: 1.5,           // Lower for faster generation
  compress: true,       // Reduce file size
  imageQuality: 0.8,   // Balance quality/size
});
```

## Common Issues

### Issue: Ref is always null

```tsx
// ❌ Wrong: ref on wrong element
<div>
  <div ref={targetRef}>
    Content
  </div>
</div>

// ✅ Correct
<div ref={targetRef}>
  Content
</div>
```

### Issue: Styles not applied

```tsx
// Ensure CSS is loaded before generating
useEffect(() => {
  // Wait for stylesheets
  const styleSheets = Array.from(document.styleSheets);
  // ... load check
}, []);
```

### Issue: Content cut off

```tsx
// Use fixed width matching PDF format
<div ref={targetRef} style={{ width: '794px' }}>
  Content
</div>
```

## Next Steps

- **[Advanced Features](../advanced/watermarks.md)** - Watermarks, headers, templates
- **[API Reference](../api/react-hooks.md)** - Complete API documentation
- **[Examples](../examples/code-examples.md)** - More code examples

---

[← Back to Documentation](../index.md)
