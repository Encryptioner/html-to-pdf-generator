/**
 * Vanilla JavaScript Example - Advanced Features Tutorial
 *
 * This tutorial covers all advanced features including:
 * - Batch PDF generation
 * - Watermarks
 * - Headers/Footers
 * - Metadata
 * - Print media emulation
 * - Template variables
 * - Table of Contents
 * - Bookmarks
 */

import {
  generatePDF,
  generateBatchPDF,
  PDFGenerator,
  PAPER_FORMATS,
} from '@your-org/pdf-generator';

// ===== 1. BATCH PDF GENERATION =====
// Generate multiple content items in a single PDF with automatic scaling

async function batchPDFExample() {
  const items = [
    {
      content: document.getElementById('cover-page'),
      pageCount: 1, // This content will be scaled to fit exactly 1 page
    },
    {
      content: document.getElementById('introduction'),
      pageCount: 2, // This content will be scaled to fit exactly 2 pages
    },
    {
      content: '<div style="padding: 40px;"><h1>Chapter 1</h1><p>Custom HTML content...</p></div>',
      pageCount: 3, // HTML string content scaled to 3 pages
    },
  ];

  const result = await generateBatchPDF(items, 'complete-report.pdf', {
    format: 'a4',
    orientation: 'portrait',
    onProgress: (progress) => {
      console.log(`Batch generation: ${progress}%`);
    },
  });

  console.log(`
    Batch PDF Generated:
    - Total pages: ${result.totalPages}
    - Total items: ${result.itemResults.length}
    - File size: ${(result.fileSize / 1024).toFixed(2)} KB
    - Generation time: ${result.generationTime.toFixed(0)}ms

    Item breakdown:
    ${result.itemResults.map((item, i) => `
      Item ${i + 1}: Pages ${item.startPage}-${item.endPage} (${item.pageCount} pages)
    `).join('')}
  `);
}

// ===== 2. WATERMARKS =====
// Add text or image watermarks to your PDFs

async function watermarkExample() {
  const element = document.getElementById('confidential-document');

  // Text watermark
  await generatePDF(element, 'confidential.pdf', {
    watermark: {
      text: 'CONFIDENTIAL',
      opacity: 0.3,
      position: 'diagonal', // 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'diagonal'
      fontSize: 48,
      color: '#ff0000',
      rotation: 45,
      allPages: true, // Apply to all pages
    },
  });

  // Image watermark (e.g., company logo)
  await generatePDF(element, 'branded.pdf', {
    watermark: {
      image: 'data:image/png;base64,...', // Base64 encoded image
      opacity: 0.2,
      position: 'center',
      allPages: true,
    },
  });

  // Different watermark on first page only
  await generatePDF(element, 'draft.pdf', {
    watermark: {
      text: 'DRAFT',
      opacity: 0.4,
      position: 'center',
      fontSize: 60,
      color: '#cccccc',
      allPages: false, // Only on first page
    },
  });
}

// ===== 3. HEADERS AND FOOTERS =====
// Add dynamic headers and footers with template variables

async function headerFooterExample() {
  const element = document.getElementById('report');

  await generatePDF(element, 'annual-report.pdf', {
    // Header template
    headerTemplate: {
      template: 'Company Name | {{title}} | {{date}}',
      height: 20, // Height in mm
      firstPage: false, // Skip header on first page (useful for cover pages)
    },

    // Footer template
    footerTemplate: {
      template: 'Page {{pageNumber}} of {{totalPages}} - Confidential',
      height: 20,
      firstPage: true, // Include footer on all pages including first
    },

    // PDF metadata (used in templates)
    metadata: {
      title: 'Annual Report 2025',
      author: 'John Doe',
      subject: 'Financial Report',
      keywords: ['finance', 'report', '2025'],
      creator: 'My Application',
      creationDate: new Date(),
    },
  });

  // Available template variables:
  // - {{pageNumber}} - Current page number
  // - {{totalPages}} - Total number of pages
  // - {{date}} - Formatted date
  // - {{title}} - Document title from metadata
}

// ===== 4. PDF METADATA =====
// Set document properties for better organization

async function metadataExample() {
  const element = document.getElementById('document');

  await generatePDF(element, 'document.pdf', {
    metadata: {
      title: 'Product Specification',
      author: 'Engineering Team',
      subject: 'Technical Documentation',
      keywords: ['product', 'specs', 'engineering'],
      creator: 'PDF Generator v4.0',
      creationDate: new Date('2025-01-15'),
    },
  });

  // The metadata is embedded in the PDF and visible in:
  // - PDF viewer properties
  // - Search engine indexing
  // - Document management systems
}

// ===== 5. PRINT MEDIA CSS EMULATION =====
// Apply @media print styles for print-optimized output

async function printMediaExample() {
  const element = document.getElementById('webpage');

  await generatePDF(element, 'print-styled.pdf', {
    emulateMediaType: 'print', // 'screen' (default) or 'print'
  });

  // Example CSS in your HTML:
  // @media print {
  //   .no-print { display: none; }
  //   .page-break { page-break-after: always; }
  //   body { font-size: 12pt; }
  // }

  // When emulateMediaType: 'print', the library will:
  // 1. Extract all @media print CSS rules
  // 2. Apply them to the content before PDF generation
  // 3. Ignore @media screen rules
}

// ===== 6. TEMPLATE VARIABLES =====
// Use dynamic variables in your HTML content

async function templateVariablesExample() {
  const htmlTemplate = `
    <div style="padding: 40px;">
      <h1>{{companyName}}</h1>
      <p>Invoice Date: {{invoiceDate}}</p>

      <h2>Items:</h2>
      {{#each items}}
        <div class="item">
          <p>{{name}}: ${{price}}</p>
        </div>
      {{/each}}

      <h3>Total: ${{total}}</h3>

      {{#if isPaid}}
        <p style="color: green;">PAID</p>
      {{/if}}
    </div>
  `;

  // Process template with context
  import { processTemplateWithContext, htmlStringToElement } from '@your-org/pdf-generator';

  const processedHtml = processTemplateWithContext(htmlTemplate, {
    companyName: 'Acme Corp',
    invoiceDate: '2025-01-15',
    items: [
      { name: 'Product A', price: '50.00' },
      { name: 'Product B', price: '75.00' },
    ],
    total: '125.00',
    isPaid: true,
  }, {
    enableLoops: true,
    enableConditionals: true,
  });

  const element = htmlStringToElement(processedHtml);
  document.body.appendChild(element);

  await generatePDF(element, 'invoice.pdf');

  // Clean up
  document.body.removeChild(element);
}

// ===== 7. TABLE OF CONTENTS =====
// Auto-generate TOC from document headings

async function tocExample() {
  const element = document.getElementById('long-document');

  await generatePDF(element, 'document-with-toc.pdf', {
    tocOptions: {
      enabled: true,
      title: 'Table of Contents',
      levels: [1, 2, 3], // Include h1, h2, h3 headings
      position: 'start', // 'start' or 'end'
      includePageNumbers: true,
      indentPerLevel: 10, // Indent in mm for nested headings
      enableLinks: true, // Make TOC entries clickable
    },
  });

  // Your HTML should have headings like:
  // <h1>Chapter 1</h1>
  // <h2>Section 1.1</h2>
  // <h3>Subsection 1.1.1</h3>

  // The TOC will be automatically generated with:
  // - Hierarchical structure
  // - Page numbers
  // - Clickable links (if enabled)
  // - Professional styling
}

// ===== 8. BOOKMARKS/OUTLINE =====
// Create PDF outline for easy navigation

async function bookmarksExample() {
  const element = document.getElementById('book');

  await generatePDF(element, 'book-with-outline.pdf', {
    bookmarkOptions: {
      enabled: true,
      autoGenerate: true, // Auto-generate from headings
      levels: [1, 2], // Use h1 and h2 headings
      openByDefault: true, // Show outline panel by default

      // Optional: Add custom bookmarks
      custom: [
        { title: 'Preface', page: 1, level: 1 },
        { title: 'Introduction', page: 3, level: 1 },
        { title: 'Background', page: 5, level: 2 },
      ],
    },
  });

  // Bookmarks appear in PDF viewer's outline/navigation panel
  // Making it easy to jump between sections
}

// ===== 9. COMBINED FEATURES EXAMPLE =====
// Use multiple features together for professional documents

async function professionalDocumentExample() {
  const generator = new PDFGenerator({
    format: 'a4',
    orientation: 'portrait',
    margins: [20, 15, 20, 15],
    scale: 3, // High quality
    imageQuality: 0.95,
    emulateMediaType: 'print',

    // Watermark
    watermark: {
      text: 'CONFIDENTIAL',
      opacity: 0.2,
      position: 'diagonal',
      fontSize: 40,
      color: '#999999',
      allPages: true,
    },

    // Header
    headerTemplate: {
      template: 'Company Report | {{date}}',
      height: 15,
      firstPage: false,
    },

    // Footer with page numbers
    footerTemplate: {
      template: 'Page {{pageNumber}} of {{totalPages}} - Confidential',
      height: 15,
      firstPage: true,
    },

    // Metadata
    metadata: {
      title: 'Q4 2024 Financial Report',
      author: 'Finance Department',
      subject: 'Quarterly Financial Analysis',
      keywords: ['finance', 'Q4', '2024', 'report'],
      creator: 'Corporate PDF Generator',
      creationDate: new Date(),
    },

    // Table of Contents
    tocOptions: {
      enabled: true,
      title: 'Contents',
      levels: [1, 2],
      position: 'start',
      includePageNumbers: true,
      enableLinks: true,
    },

    // Bookmarks
    bookmarkOptions: {
      enabled: true,
      autoGenerate: true,
      levels: [1, 2],
      openByDefault: true,
    },

    // Callbacks
    onProgress: (progress) => {
      updateProgressBar(progress);
    },
    onError: (error) => {
      showErrorNotification(error.message);
    },
    onComplete: (blob) => {
      showSuccessNotification(`PDF generated (${(blob.size / 1024).toFixed(2)} KB)`);
    },
  });

  const element = document.getElementById('financial-report');
  const result = await generator.generatePDF(element, 'Q4-2024-Report.pdf');

  console.log(`Professional PDF generated with ${result.pageCount} pages`);
}

// ===== 10. BATCH PDF WITH ADVANCED FEATURES =====
// Combine batch generation with watermarks, headers, etc.

async function advancedBatchExample() {
  const items = [
    { content: document.getElementById('cover'), pageCount: 1 },
    { content: document.getElementById('toc-placeholder'), pageCount: 1 },
    { content: document.getElementById('chapter-1'), pageCount: 5 },
    { content: document.getElementById('chapter-2'), pageCount: 4 },
    { content: document.getElementById('appendix'), pageCount: 2 },
  ];

  const result = await generateBatchPDF(items, 'complete-book.pdf', {
    format: 'a4',

    // Watermark on all pages
    watermark: {
      text: 'DRAFT',
      opacity: 0.15,
      position: 'diagonal',
      allPages: true,
    },

    // Footer with page numbers
    footerTemplate: {
      template: 'Page {{pageNumber}} of {{totalPages}}',
      height: 15,
    },

    // Metadata
    metadata: {
      title: 'Complete Book Draft',
      author: 'Author Name',
      subject: 'Book Manuscript',
    },

    // Bookmarks
    bookmarkOptions: {
      enabled: true,
      custom: [
        { title: 'Cover', page: 1, level: 1 },
        { title: 'Table of Contents', page: 2, level: 1 },
        { title: 'Chapter 1', page: 3, level: 1 },
        { title: 'Chapter 2', page: 8, level: 1 },
        { title: 'Appendix', page: 12, level: 1 },
      ],
    },
  });

  console.log(`Batch PDF with advanced features: ${result.totalPages} pages`);
}

// ===== UTILITY FUNCTIONS =====

function updateProgressBar(progress) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
  }
}

function showErrorNotification(message) {
  console.error('PDF Error:', message);
  // Show toast notification
  alert(`Error: ${message}`);
}

function showSuccessNotification(message) {
  console.log('PDF Success:', message);
  // Show toast notification
  alert(`Success: ${message}`);
}

// Export all examples
export {
  batchPDFExample,
  watermarkExample,
  headerFooterExample,
  metadataExample,
  printMediaExample,
  templateVariablesExample,
  tocExample,
  bookmarksExample,
  professionalDocumentExample,
  advancedBatchExample,
};
