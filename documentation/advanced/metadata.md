# Metadata

## Overview

PDF metadata allows you to embed document properties and searchable information within the PDF file itself. This metadata is visible in PDF readers' document properties/information dialogs and helps with document organization, search, and identification.

Key metadata fields:
- **Title** - Main document heading
- **Author** - Document creator
- **Subject** - Brief document description
- **Keywords** - Searchable tags
- **Creator** - Application that created the PDF
- **Producer** - PDF processing application
- **Creation Date** - Document generation timestamp

## Configuration Interface

```typescript
export interface PDFMetadata {
  /** Document title */
  title?: string;

  /** Document author */
  author?: string;

  /** Document subject */
  subject?: string;

  /** Document keywords */
  keywords?: string[];

  /** Creator application name */
  creator?: string;

  /** Producer application name */
  producer?: string;

  /** Creation date */
  creationDate?: Date;
}
```

## Basic Usage

### Simple Metadata

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  metadata: {
    title: 'Annual Report 2024',
    author: 'Finance Department',
    subject: 'Financial Performance Summary',
    creator: 'My Application v1.0'
  }
});
```

### Complete Metadata

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Q4 2024 Business Report',
    author: 'John Smith',
    subject: 'Quarterly Financial Analysis and Performance Review',
    keywords: ['Q4', 'finance', 'report', '2024', 'quarterly'],
    creator: 'Company Reporting System',
    producer: 'pdf-generator v2.0',
    creationDate: new Date()
  }
});
```

### With Headers/Footers Integration

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Product Catalog 2024',
    author: 'Marketing Team',
    subject: 'Complete Product Listing'
  },
  headerTemplate: {
    template: '<div style="text-align: center;">{{title}}</div>',
    height: 12
  },
  footerTemplate: {
    template: '<div style="text-align: right; font-size: 9px;">Page {{pageNumber}}</div>',
    height: 10
  }
});
```

## Advanced Examples

### Dynamic Metadata from Document Content

```typescript
function generateDocumentWithMetadata(
  content: HTMLElement,
  title: string,
  documentType: 'report' | 'invoice' | 'proposal'
) {
  const metadataMap = {
    report: {
      subject: 'Business Report',
      keywords: ['report', 'business', 'analysis'],
      creator: 'Report Generator'
    },
    invoice: {
      subject: 'Invoice Document',
      keywords: ['invoice', 'billing', 'payment'],
      creator: 'Billing System'
    },
    proposal: {
      subject: 'Business Proposal',
      keywords: ['proposal', 'business', 'opportunity'],
      creator: 'Proposal System'
    }
  };

  const baseMetadata = metadataMap[documentType];

  return generator.generate(content, {
    metadata: {
      title: title,
      author: 'System Generated',
      ...baseMetadata,
      creationDate: new Date()
    }
  });
}
```

### Metadata with Organization Context

```typescript
const orgMetadata = {
  companyName: 'Acme Corporation',
  department: 'Finance',
  year: 2024
};

const result = await generator.generate(element, {
  metadata: {
    title: `${orgMetadata.companyName} - ${orgMetadata.department} Report ${orgMetadata.year}`,
    author: `${orgMetadata.department} Department`,
    subject: `${orgMetadata.companyName} Financial Report`,
    keywords: [
      'company',
      'report',
      orgMetadata.companyName.toLowerCase(),
      orgMetadata.department.toLowerCase(),
      String(orgMetadata.year)
    ],
    creator: 'Acme Reporting System',
    creationDate: new Date()
  }
});
```

### Timestamped Metadata

```typescript
function getTimestampedMetadata(baseTitle: string) {
  const now = new Date();
  const dateString = now.toLocaleDateString();
  const timeString = now.toLocaleTimeString();

  return {
    title: `${baseTitle} - ${dateString}`,
    subject: `Generated on ${dateString} at ${timeString}`,
    creator: 'PDF Generator v2.0',
    producer: 'jsPDF + html2canvas',
    creationDate: now
  };
}

const result = await generator.generate(element, {
  metadata: getTimestampedMetadata('Monthly Sales Report')
});
```

### SEO-Friendly Metadata

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Comprehensive Guide to PDF Generation | Best Practices',
    author: 'Documentation Team',
    subject: 'A comprehensive guide covering PDF generation best practices, tips, and techniques',
    keywords: [
      'PDF',
      'generation',
      'guide',
      'best practices',
      'tutorial',
      'documentation',
      'HTML to PDF',
      'how-to'
    ],
    creator: 'Documentation System v1.0',
    creationDate: new Date()
  }
});
```

## Common Patterns

### Corporate Document Metadata

```typescript
const corporateMetadata: PDFMetadata = {
  title: 'Corporate Financial Statement Q4 2024',
  author: 'Corporate Finance Division',
  subject: 'Quarterly Financial Report and Analysis',
  keywords: ['financial', 'corporate', 'Q4', '2024', 'statement'],
  creator: 'Corporate Finance Portal',
  creationDate: new Date()
};
```

### Academic Paper Metadata

```typescript
const academicMetadata: PDFMetadata = {
  title: 'Research Paper: Machine Learning in Healthcare',
  author: 'Dr. Jane Doe, Dr. John Smith',
  subject: 'An exploration of machine learning applications in healthcare industry',
  keywords: ['machine learning', 'healthcare', 'AI', 'research', 'medical'],
  creator: 'Academic Publishing System',
  creationDate: new Date()
};
```

### Legal Document Metadata

```typescript
const legalMetadata: PDFMetadata = {
  title: 'Contract Agreement - Service Terms',
  author: 'Legal Department',
  subject: 'Service Agreement Contract - Effective January 2024',
  keywords: ['contract', 'legal', 'agreement', 'terms', 'service'],
  creator: 'Legal Document Management System',
  creationDate: new Date()
};
```

### Invoice Metadata

```typescript
const invoiceMetadata: PDFMetadata = {
  title: 'Invoice #INV-2024-001234',
  author: 'Accounting Department',
  subject: 'Invoice for Services Rendered',
  keywords: ['invoice', 'billing', 'payment', 'receipt'],
  creator: 'Billing System v3.0',
  creationDate: new Date()
};
```

## Metadata Properties Guide

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `title` | string | Document title (visible in PDF properties) | "Annual Report 2024" |
| `author` | string | Creator/author name | "John Smith" |
| `subject` | string | Short description of document | "Financial Report" |
| `keywords` | string[] | Searchable tags | ["report", "2024", "finance"] |
| `creator` | string | Application that created PDF | "My App v1.0" |
| `producer` | string | PDF processing tool | "jsPDF v2.5" |
| `creationDate` | Date | Document generation time | new Date() |

## Tips and Best Practices

1. **Consistent Titling**: Keep titles concise (under 100 characters) and descriptive

2. **Author Information**: Use consistent author names across your organization's documents

3. **Keywords Strategy**:
   - Include 5-10 relevant keywords
   - Use lowercase and separate with commas
   - Think about how users would search for documents

4. **Subject Line**: Write a brief but informative subject (50-150 characters)

5. **Creator Attribution**: Include your application name and version for tracking

6. **Date Management**: Always include creation date for audit trails and document versioning

7. **Special Characters**: Avoid special characters in metadata fields for maximum compatibility

8. **Multilingual**: Use English for broader compatibility unless targeting specific locales

9. **Document Tracking**: Include document IDs or version numbers in title for better organization

10. **Searchability**: Structure keywords to support your organization's document retrieval processes

## See Also

- [Headers & Footers](./headers-footers.md) - Reference document title in headers/footers
- [Watermarks](./watermarks.md) - Add document branding
- [Security](./security.md) - Protect document with encryption
