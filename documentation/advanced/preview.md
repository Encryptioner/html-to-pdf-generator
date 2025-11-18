# Real-Time PDF Preview

> **🚧 NOT YET IMPLEMENTED**: This feature is documented for future implementation. The `previewOptions` parameter is defined but not functional. See [FEATURE_IMPLEMENTATION_STATUS.md](../../FEATURE_IMPLEMENTATION_STATUS.md) for details.

## Overview

The PDFPreview component provides real-time preview functionality, allowing users to see how their document will look as a PDF before final generation. This is especially useful for interactive document builders, form systems, and applications where users customize content.

Key features:
- **Live Updates** - Preview updates as content changes
- **Performance Optimized** - Debounced rendering to prevent excessive computation
- **Quality Control** - Adjustable preview quality and scale
- **Container Control** - Render preview into specific DOM elements
- **Performance Balanced** - Configurable quality vs. speed tradeoff

## Configuration Interface

```typescript
export interface PreviewOptions {
  /** Enable live preview updates */
  liveUpdate?: boolean;

  /** Debounce delay in milliseconds */
  debounce?: number;

  /** Preview quality (lower = faster) */
  quality?: number;

  /** Scale factor for preview */
  scale?: number;

  /** Container element ID for preview */
  containerId?: string;
}
```

## Basic Usage

### Simple Live Preview

```typescript
import { PDFPreview } from '@html-to-pdf/generator/react';

export function DocumentEditor() {
  const [content, setContent] = useState('<h1>My Document</h1>');
  const previewRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', height: '500px' }}
        />
      </div>
      <div style={{ flex: 1 }}>
        <PDFPreview
          content={content}
          options={{
            liveUpdate: true,
            debounce: 500,
            quality: 0.85,
            scale: 2
          }}
          containerRef={previewRef}
        />
      </div>
    </div>
  );
}
```

### Preview with Adjustable Quality

```typescript
export function AdvancedPreview() {
  const [quality, setQuality] = useState(0.85);
  const [scale, setScale] = useState(2);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Quality: {quality}
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
          />
        </label>
        <label style={{ marginLeft: '20px' }}>
          Scale: {scale}x
          <input
            type="range"
            min="1"
            max="3"
            step="0.5"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </label>
      </div>

      <div ref={contentRef}>
        <h1>My Document</h1>
        <p>This is the content being previewed...</p>
      </div>

      <PDFPreview
        content={contentRef}
        options={{
          liveUpdate: true,
          debounce: 300,
          quality: quality,
          scale: scale
        }}
      />
    </div>
  );
}
```

## Advanced Examples

### Interactive Form Preview

```typescript
export function FormPDFPreview() {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    date: new Date().toLocaleDateString(),
    amount: '1,250.00',
    details: 'Invoice details here...'
  });

  const previewContainerRef = useRef<HTMLDivElement>(null);

  const generateInvoiceHTML = () => `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>Invoice</h1>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Date:</strong> ${formData.date}</p>
      <p><strong>Amount:</strong> $${formData.amount}</p>
      <p><strong>Details:</strong> ${formData.details}</p>
    </div>
  `;

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2>Form</h2>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <input
          type="text"
          placeholder="Amount"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          style={{ display: 'block', width: '100%', marginBottom: '10px', padding: '8px' }}
        />
        <textarea
          placeholder="Details"
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          style={{ display: 'block', width: '100%', height: '100px', padding: '8px' }}
        />
      </div>

      <div style={{ flex: 1 }} ref={previewContainerRef}>
        <h2>Preview</h2>
        <PDFPreview
          content={generateInvoiceHTML()}
          options={{
            liveUpdate: true,
            debounce: 500,
            quality: 0.85,
            scale: 1.5,
            containerId: 'pdf-preview'
          }}
        />
      </div>
    </div>
  );
}
```

### Document Builder with Multiple Sections

```typescript
export function DocumentBuilder() {
  const [sections, setSections] = useState([
    { id: 1, title: 'Title Page', content: 'Welcome' },
    { id: 2, title: 'Introduction', content: 'Introduction text...' }
  ]);

  const handleUpdateSection = (id: number, content: string) => {
    setSections(prev =>
      prev.map(s => s.id === id ? { ...s, content } : s)
    );
  };

  const generateDocumentHTML = () => `
    <div style="font-family: 'Times New Roman', serif; line-height: 1.6;">
      ${sections.map(s => `
        <div style="page-break-after: always; padding: 20px;">
          <h1>${s.title}</h1>
          <div>${s.content}</div>
        </div>
      `).join('')}
    </div>
  `;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h2>Editor</h2>
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            <label>{section.title}</label>
            <textarea
              value={section.content}
              onChange={(e) => handleUpdateSection(section.id, e.target.value)}
              style={{ width: '100%', height: '150px', padding: '8px' }}
            />
          </div>
        ))}
      </div>

      <div>
        <h2>PDF Preview</h2>
        <PDFPreview
          content={generateDocumentHTML()}
          options={{
            liveUpdate: true,
            debounce: 800,
            quality: 0.8,
            scale: 1.2
          }}
        />
      </div>
    </div>
  );
}
```

### Performance-Optimized Preview

```typescript
export function PerformanceOptimizedPreview() {
  const [previewQuality, setPreviewQuality] = useState<'draft' | 'normal' | 'high'>('normal');
  const [content, setContent] = useState('');

  const qualitySettings = {
    draft: { quality: 0.6, scale: 1, debounce: 1000 },
    normal: { quality: 0.8, scale: 1.5, debounce: 500 },
    high: { quality: 0.95, scale: 2, debounce: 300 }
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setPreviewQuality('draft')}>Draft</button>
        <button onClick={() => setPreviewQuality('normal')}>Normal</button>
        <button onClick={() => setPreviewQuality('high')}>High</button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your content..."
        style={{ width: '100%', height: '300px', marginBottom: '20px' }}
      />

      <PDFPreview
        content={content}
        options={{
          liveUpdate: true,
          ...qualitySettings[previewQuality]
        }}
      />
    </div>
  );
}
```

### Real-Time Report Editor

```typescript
interface ReportData {
  title: string;
  sections: ReportSection[];
  metadata: {
    author: string;
    date: string;
  };
}

interface ReportSection {
  id: string;
  heading: string;
  content: string;
}

export function ReportEditor() {
  const [report, setReport] = useState<ReportData>({
    title: 'Annual Report 2024',
    sections: [
      { id: '1', heading: 'Executive Summary', content: '...' },
      { id: '2', heading: 'Financial Results', content: '...' }
    ],
    metadata: {
      author: 'Finance Team',
      date: new Date().toLocaleDateString()
    }
  });

  const generateReportHTML = () => `
    <div style="font-family: Arial, sans-serif;">
      <h1>${report.title}</h1>
      <p style="color: #666;">By ${report.metadata.author} on ${report.metadata.date}</p>
      ${report.sections.map(s => `
        <section style="page-break-inside: avoid; margin-bottom: 30px;">
          <h2>${s.heading}</h2>
          <p>${s.content}</p>
        </section>
      `).join('')}
    </div>
  `;

  const updateSection = (id: string, content: string) => {
    setReport(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === id ? { ...s, content } : s
      )
    }));
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ flex: 1 }}>
        {report.sections.map(section => (
          <div key={section.id} style={{ marginBottom: '20px' }}>
            <h3>{section.heading}</h3>
            <textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, e.target.value)}
              style={{ width: '100%', height: '200px' }}
            />
          </div>
        ))}
      </div>

      <div style={{ flex: 1 }}>
        <PDFPreview
          content={generateReportHTML()}
          options={{
            liveUpdate: true,
            debounce: 600,
            quality: 0.85,
            scale: 1.5
          }}
        />
      </div>
    </div>
  );
}
```

## Quality Settings Recommendations

| Use Case | Quality | Scale | Debounce | Performance |
|----------|---------|-------|----------|-------------|
| Fast Drafting | 0.6 | 1.0 | 1000ms | Excellent |
| Normal Editing | 0.8 | 1.5 | 500ms | Good |
| High Fidelity | 0.95 | 2.0 | 300ms | Fair |
| Large Documents | 0.7 | 1.2 | 1000ms | Excellent |

## Tips and Best Practices

1. **Debounce Timing**:
   - 300ms: Responsive, may impact performance on large docs
   - 500ms: Good balance for most use cases
   - 800-1000ms: Reduces strain on slower devices

2. **Quality Settings**:
   - 0.6-0.7: Draft quality, very fast
   - 0.8: Good for editing, balanced performance
   - 0.9-1.0: Print quality, slower rendering

3. **Scale Factor**:
   - 1.0: Screen resolution, fastest
   - 1.5-2.0: Better readability on previews
   - Avoid 3x+ for performance

4. **Container Sizing**: Preview container should match expected PDF aspect ratio

5. **Update Frequency**: Debounce prevents excessive re-renders, especially helpful for large documents

6. **Memory Management**: Clear old previews to prevent memory leaks in long-running sessions

7. **Mobile Optimization**: Reduce quality and scale on mobile devices for performance

8. **Progressive Enhancement**: Fallback to static preview if generation fails

9. **Accessibility**: Include alt text and keyboard navigation in preview

10. **Testing**: Test with various document sizes and complexity levels

## See Also

- [React Integration](../adapters/react.md) - React hook integration
- [Performance](../guides/performance.md) - Optimize PDF generation
- [Batch Generation](./batch-generation.md) - Generate multiple PDFs