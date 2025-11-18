# URL to PDF Conversion

## Overview

Convert web pages and URLs directly to PDF without needing to extract HTML first. This feature is ideal for:
- Archiving web pages
- Converting reports from URLs
- Batch processing web content
- Generating PDFs from dynamic web applications
- Creating documentation from live websites

Key features:
- **URL Loading** - Fetch and render web pages
- **Selector Waiting** - Wait for specific elements before capture
- **Network Idle** - Ensure all resources load before PDF generation
- **Custom Injection** - Inject JavaScript and CSS
- **Cookie Support** - Set cookies for authentication
- **Viewport Control** - Define page dimensions

## Configuration Interface

```typescript
export interface URLToPDFOptions {
  /** URL to convert */
  url: string;

  /** Wait for selector before capturing */
  waitForSelector?: string;

  /** Timeout in milliseconds */
  timeout?: number;

  /** Wait for network idle */
  waitForNetworkIdle?: boolean;

  /** Custom viewport size */
  viewport?: {
    width: number;
    height: number;
  };

  /** Inject custom JavaScript */
  injectJS?: string;

  /** Inject custom CSS */
  injectCSS?: string;

  /** Cookies to set */
  cookies?: Array<{
    name: string;
    value: string;
    domain?: string;
  }>;
}
```

## Basic Usage

### Simple URL to PDF

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();

const result = await generator.generate({
  urlToPDF: {
    url: 'https://example.com/report'
  }
});
```

### With Custom Viewport

```typescript
const result = await generator.generate({
  urlToPDF: {
    url: 'https://example.com/document',
    viewport: {
      width: 1920,
      height: 1080
    }
  }
});
```

### Wait for Content to Load

```typescript
const result = await generator.generate({
  urlToPDF: {
    url: 'https://example.com/dynamic-report',
    waitForSelector: '.report-content',
    timeout: 30000 // 30 seconds
  }
});
```

## Advanced Examples

### Authenticated Page to PDF

```typescript
const result = await generator.generate({
  urlToPDF: {
    url: 'https://app.example.com/user/reports',
    cookies: [
      {
        name: 'session_token',
        value: 'abc123def456...',
        domain: 'app.example.com'
      },
      {
        name: 'user_id',
        value: '12345',
        domain: 'app.example.com'
      }
    ],
    waitForSelector: '.report-loaded',
    timeout: 15000
  },
  metadata: {
    title: 'User Report Export',
    author: 'Report System'
  }
});
```

### Dynamic Content with CSS Injection

```typescript
const result = await generator.generate({
  urlToPDF: {
    url: 'https://example.com/article',
    injectCSS: `
      /* Hide navigation and ads for cleaner PDF */
      nav, .advertisement, .sidebar { display: none !important; }

      /* Adjust layout for PDF */
      body { margin: 0; padding: 20px; }
      .article { max-width: 100%; }

      /* Print-friendly colors */
      a { color: #0066cc; text-decoration: underline; }
      h1, h2, h3 { color: #333; page-break-inside: avoid; }
    `,
    waitForNetworkIdle: true
  }
});
```

### JavaScript Injection for Data Processing

```typescript
const result = await generator.generate({
  urlToPDF: {
    url: 'https://example.com/analytics-dashboard',
    injectJS: `
      // Remove tracking scripts
      document.querySelectorAll('script[src*="analytics"]').forEach(el => el.remove());

      // Expand collapsed sections
      document.querySelectorAll('[data-expanded="false"]').forEach(el => {
        el.click();
      });

      // Hide interactive elements
      document.querySelectorAll('.interactive-chart').forEach(el => {
        el.style.display = 'none';
      });

      // Log completion
      console.log('Page prepared for PDF');
    `,
    waitForNetworkIdle: true,
    timeout: 20000
  }
});
```

### Multi-Page Web Report

```typescript
async function convertWebReportToPDF(reportUrl: string) {
  const result = await generator.generate({
    urlToPDF: {
      url: reportUrl,
      viewport: { width: 1200, height: 800 },
      injectCSS: `
        /* PDF-specific styles */
        @media print {
          * { background: white !important; color: black !important; }
          a { text-decoration: none; }
          img { max-width: 100%; }
        }

        /* Page breaks */
        .section { page-break-inside: avoid; }
        h1 { page-break-before: always; }
      `,
      waitForSelector: '.report-complete',
      timeout: 30000,
      waitForNetworkIdle: true
    },
    margins: [20, 20, 20, 20],
    metadata: {
      title: 'Web Report Export',
      subject: `Report from ${new Date().toLocaleDateString()}`,
      creator: 'Web PDF Generator'
    },
    headerTemplate: {
      template: '<div style="font-size: 10px; color: #999;">Report - Page {{pageNumber}} of {{totalPages}}</div>',
      height: 10
    }
  });

  return result;
}
```

### Scheduled Web Page Archiving

```typescript
async function archiveWebPage(url: string, archiveDate: Date) {
  try {
    const result = await generator.generate({
      urlToPDF: {
        url: url,
        waitForNetworkIdle: true,
        timeout: 30000,
        viewport: { width: 1024, height: 768 }
      },
      metadata: {
        title: `Archive of ${new URL(url).hostname}`,
        subject: `Web page archived on ${archiveDate.toLocaleDateString()}`,
        keywords: ['web-archive', 'snapshot', url],
        creator: 'Web Archiver v1.0',
        creationDate: archiveDate
      },
      watermark: {
        text: `Archived: ${archiveDate.toLocaleDateString()}`,
        opacity: 0.05,
        position: 'bottom-left',
        fontSize: 12,
        allPages: true
      }
    });

    // Store archived PDF
    await storePDF({
      originalUrl: url,
      archivedDate: archiveDate,
      pdfBlob: result.blob,
      fileSize: result.fileSize
    });

    return result;
  } catch (error) {
    console.error(`Failed to archive ${url}:`, error);
    throw error;
  }
}
```

### Form Submission to PDF

```typescript
async function submitFormAndCapture(formData: FormData) {
  // First, submit the form
  const response = await fetch('/submit-report', {
    method: 'POST',
    body: formData
  });

  const { resultUrl } = await response.json();

  // Convert results page to PDF
  const pdfResult = await generator.generate({
    urlToPDF: {
      url: resultUrl,
      waitForSelector: '.results-container',
      injectCSS: `
        .results-container {
          background-color: white;
          padding: 20px;
        }

        /* Hide form inputs in results */
        input, textarea, select { display: none; }

        /* Style results for printing */
        .result-item {
          page-break-inside: avoid;
          margin-bottom: 20px;
          padding: 10px;
          border: 1px solid #ddd;
        }
      `,
      timeout: 15000
    }
  });

  return pdfResult;
}
```

## Common Patterns

### News Article to PDF

```typescript
const articlePDF = {
  urlToPDF: {
    url: 'https://news.example.com/article/headline',
    injectCSS: `
      nav, .sidebar, .ads { display: none !important; }
      .article { width: 100%; margin: 0; padding: 20px; }
      img { max-width: 100%; height: auto; }
    `,
    waitForNetworkIdle: true
  }
};
```

### API Documentation to PDF

```typescript
const docPDF = {
  urlToPDF: {
    url: 'https://api-docs.example.com/v1',
    injectJS: `
      // Expand all collapsible sections
      document.querySelectorAll('[role="button"][aria-expanded="false"]')
        .forEach(btn => btn.click());
    `,
    waitForNetworkIdle: true,
    timeout: 30000
  }
};
```

### E-Commerce Receipt to PDF

```typescript
const receiptPDF = {
  urlToPDF: {
    url: 'https://shop.example.com/order-confirmation',
    cookies: [
      { name: 'order_token', value: 'order_123', domain: 'shop.example.com' }
    ],
    injectCSS: `
      .order-header { page-break-inside: avoid; }
      .line-items { page-break-inside: avoid; }
      button, .interactive { display: none; }
    `,
    waitForSelector: '.order-confirmed'
  }
};
```

## Best Practices

1. **Network Handling**:
   - Use `waitForNetworkIdle: true` for complex pages
   - Set appropriate timeouts (15-30 seconds)
   - Handle network failures gracefully

2. **CSS Injection**:
   - Hide navigation, sidebars, ads
   - Set print-friendly colors
   - Define page breaks explicitly
   - Use `!important` to override page styles

3. **Authentication**:
   - Pass cookies for authenticated sessions
   - Ensure token freshness before conversion
   - Handle authentication errors

4. **Content Waiting**:
   - Use `waitForSelector` for async-loaded content
   - Wait for specific elements before capture
   - Set reasonable timeouts

5. **JavaScript Injection**:
   - Use sparingly for cleanup only
   - Avoid heavy computations
   - Remove tracking/analytics scripts
   - Don't rely on page JavaScript

6. **Performance**:
   - Set appropriate viewport dimensions
   - Disable unnecessary resources
   - Cache downloaded pages
   - Implement rate limiting for URLs

7. **Error Handling**:
   - Catch timeout errors
   - Handle network failures
   - Provide fallback options
   - Log failed conversions

8. **SEO/Metadata**:
   - Extract page title for metadata
   - Use page URL in creation info
   - Include timestamp for archival

## URL Conversion Limitations

1. **JavaScript-Heavy Sites**: Some heavily JS-dependent pages may not render correctly
2. **Interactive Content**: Forms, maps, and interactive elements won't function
3. **Authentication**: May require special setup for SSO/OAuth flows
4. **Rate Limiting**: Be respectful of server resources
5. **CORS**: May face restrictions with certain domains
6. **Video/Audio**: Media content won't be included

## See Also

- [Batch Generation](./batch-generation.md) - Convert multiple URLs efficiently
- [Async Processing](./async-processing.md) - Handle long-running conversions
- [Security](./security.md) - Encrypt converted PDFs