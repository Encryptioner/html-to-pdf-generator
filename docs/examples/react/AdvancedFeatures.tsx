/**
 * React Example - Advanced Features Tutorial
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

import React, { useRef } from 'react';
import {
  usePDFGenerator,
  usePDFGeneratorManual,
  useBatchPDFGenerator,
  PDFContentItem,
  processTemplateWithContext,
} from '@your-org/pdf-generator/react';

// ===== 1. BATCH PDF GENERATION =====

function BatchPDFExample() {
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);

  const { generateBatchPDF, isGenerating, progress, result } = useBatchPDFGenerator({
    format: 'a4',
    orientation: 'portrait',
  });

  const handleGenerateBatch = async () => {
    if (!section1Ref.current || !section2Ref.current || !section3Ref.current) return;

    const items: PDFContentItem[] = [
      { content: section1Ref.current, pageCount: 1 }, // Cover page
      { content: section2Ref.current, pageCount: 2 }, // Introduction
      { content: section3Ref.current, pageCount: 3 }, // Main content
    ];

    await generateBatchPDF(items, 'complete-report.pdf');
  };

  return (
    <div>
      <h2>Batch PDF Generation</h2>

      {/* Content sections */}
      <div ref={section1Ref} style={{ padding: '40px', backgroundColor: '#f0f0f0' }}>
        <h1>Cover Page</h1>
        <p>Annual Report 2025</p>
      </div>

      <div ref={section2Ref} style={{ padding: '40px' }}>
        <h1>Introduction</h1>
        <p>This is a longer introduction section that will be scaled to fit 2 pages...</p>
      </div>

      <div ref={section3Ref} style={{ padding: '40px' }}>
        <h1>Main Content</h1>
        <p>Detailed content that will be scaled to fit 3 pages...</p>
      </div>

      {/* Controls */}
      <button onClick={handleGenerateBatch} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Generate Batch PDF'}
      </button>

      {/* Results */}
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#d4edda' }}>
          <h3>Batch PDF Generated!</h3>
          <p>Total pages: {result.totalPages}</p>
          <p>File size: {(result.fileSize / 1024).toFixed(2)} KB</p>
          <p>Generation time: {result.generationTime.toFixed(0)}ms</p>
          <h4>Items:</h4>
          <ul>
            {result.itemResults.map((item, i) => (
              <li key={i}>
                Item {i + 1}: Pages {item.startPage}-{item.endPage} ({item.pageCount} pages)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ===== 2. WATERMARKS =====

function WatermarkExample() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'confidential.pdf',
    watermark: {
      text: 'CONFIDENTIAL',
      opacity: 0.3,
      position: 'diagonal',
      fontSize: 48,
      color: '#ff0000',
      rotation: 45,
      allPages: true,
    },
  });

  return (
    <div>
      <h2>Watermark Example</h2>

      <div
        ref={targetRef}
        style={{
          padding: '40px',
          minHeight: '600px',
          backgroundColor: 'white',
        }}
      >
        <h1>Confidential Document</h1>
        <p>This document contains sensitive information.</p>
        <p>All pages will have a diagonal "CONFIDENTIAL" watermark.</p>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download PDF with Watermark'}
      </button>
    </div>
  );
}

// ===== 3. HEADERS AND FOOTERS =====

function HeaderFooterExample() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'report-with-headers.pdf',
    headerTemplate: {
      template: 'Company Name | Annual Report | {{date}}',
      height: 20,
      firstPage: false, // Skip header on cover page
    },
    footerTemplate: {
      template: 'Page {{pageNumber}} of {{totalPages}} - Confidential',
      height: 20,
      firstPage: true,
    },
    metadata: {
      title: 'Annual Report 2025',
      author: 'John Doe',
      subject: 'Financial Report',
      keywords: ['finance', 'report', '2025'],
      creator: 'React PDF Generator',
      creationDate: new Date(),
    },
  });

  return (
    <div>
      <h2>Headers & Footers Example</h2>

      <div
        ref={targetRef}
        style={{
          padding: '40px',
          minHeight: '1000px',
          backgroundColor: 'white',
        }}
      >
        <h1>Annual Report 2025</h1>
        <p>First page will have no header but will have footer.</p>
        <p>Subsequent pages will have both header and footer with dynamic page numbers.</p>

        <div style={{ marginTop: '500px' }}>
          <h2>Page 2 Content</h2>
          <p>This content will appear on the second page with header and footer.</p>
        </div>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download PDF with Headers/Footers'}
      </button>
    </div>
  );
}

// ===== 4. PRINT MEDIA EMULATION =====

function PrintMediaExample() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'print-styled.pdf',
    emulateMediaType: 'print', // Apply @media print styles
  });

  return (
    <div>
      <h2>Print Media CSS Example</h2>

      <style>
        {`
          .screen-only {
            display: block;
            color: blue;
          }
          .print-only {
            display: none;
            color: red;
          }
          @media print {
            .screen-only {
              display: none;
            }
            .print-only {
              display: block;
            }
            body {
              font-size: 12pt;
            }
          }
        `}
      </style>

      <div ref={targetRef} style={{ padding: '40px', backgroundColor: 'white' }}>
        <h1>Print Media Example</h1>

        <p className="screen-only">
          This text is visible on screen but will NOT appear in PDF (blue text).
        </p>

        <p className="print-only">
          This text is hidden on screen but WILL appear in PDF (red text).
        </p>

        <p>This text appears in both screen and print.</p>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download Print-Styled PDF'}
      </button>
    </div>
  );
}

// ===== 5. TABLE OF CONTENTS =====

function TOCExample() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'document-with-toc.pdf',
    tocOptions: {
      enabled: true,
      title: 'Table of Contents',
      levels: [1, 2, 3],
      position: 'start',
      includePageNumbers: true,
      indentPerLevel: 10,
      enableLinks: true,
    },
  });

  return (
    <div>
      <h2>Table of Contents Example</h2>

      <div
        ref={targetRef}
        style={{
          padding: '40px',
          minHeight: '1500px',
          backgroundColor: 'white',
        }}
      >
        <h1 id="chapter-1">Chapter 1: Introduction</h1>
        <p>Introduction content...</p>

        <h2 id="section-1-1">1.1 Background</h2>
        <p>Background information...</p>

        <h3 id="subsection-1-1-1">1.1.1 History</h3>
        <p>Historical context...</p>

        <div style={{ marginTop: '500px' }}>
          <h1 id="chapter-2">Chapter 2: Methodology</h1>
          <p>Methodology content...</p>

          <h2 id="section-2-1">2.1 Research Design</h2>
          <p>Research design details...</p>
        </div>

        <div style={{ marginTop: '500px' }}>
          <h1 id="chapter-3">Chapter 3: Results</h1>
          <p>Results and findings...</p>
        </div>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download PDF with TOC'}
      </button>

      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        The PDF will have an auto-generated Table of Contents at the start with clickable links.
      </p>
    </div>
  );
}

// ===== 6. BOOKMARKS/OUTLINE =====

function BookmarksExample() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'document-with-bookmarks.pdf',
    bookmarkOptions: {
      enabled: true,
      autoGenerate: true,
      levels: [1, 2],
      openByDefault: true,
    },
  });

  return (
    <div>
      <h2>Bookmarks Example</h2>

      <div
        ref={targetRef}
        style={{
          padding: '40px',
          minHeight: '1200px',
          backgroundColor: 'white',
        }}
      >
        <h1>Introduction</h1>
        <p>The PDF outline/bookmarks panel will show this structure...</p>

        <h2>Overview</h2>
        <p>Overview content...</p>

        <div style={{ marginTop: '400px' }}>
          <h1>Main Content</h1>
          <p>Main content...</p>

          <h2>Details</h2>
          <p>Detailed information...</p>
        </div>

        <div style={{ marginTop: '400px' }}>
          <h1>Conclusion</h1>
          <p>Concluding remarks...</p>
        </div>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download PDF with Bookmarks'}
      </button>

      <p style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        Open the PDF in a viewer that supports outlines/bookmarks to see the navigation panel.
      </p>
    </div>
  );
}

// ===== 7. COMBINED FEATURES - PROFESSIONAL DOCUMENT =====

function ProfessionalDocumentExample() {
  const { targetRef, generatePDF, isGenerating, progress, result } = usePDFGenerator({
    filename: 'professional-report.pdf',
    format: 'a4',
    orientation: 'portrait',
    margins: [20, 15, 20, 15],
    scale: 3,
    imageQuality: 0.95,
    emulateMediaType: 'print',

    // Watermark
    watermark: {
      text: 'DRAFT',
      opacity: 0.15,
      position: 'diagonal',
      fontSize: 40,
      color: '#999999',
      allPages: true,
    },

    // Header
    headerTemplate: {
      template: 'Q4 2024 Financial Report | {{date}}',
      height: 15,
      firstPage: false,
    },

    // Footer
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
  });

  return (
    <div>
      <h2>Professional Document - All Features Combined</h2>

      <div
        ref={targetRef}
        style={{
          padding: '40px',
          minHeight: '2000px',
          backgroundColor: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
            Q4 2024 Financial Report
          </h1>
          <p style={{ fontSize: '18px', color: '#666' }}>Finance Department</p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            {new Date().toLocaleDateString()}
          </p>
        </div>

        <h1>Executive Summary</h1>
        <p>This comprehensive report includes:</p>
        <ul>
          <li>Automatic Table of Contents</li>
          <li>Page headers and footers with page numbers</li>
          <li>Draft watermark on all pages</li>
          <li>PDF bookmarks for easy navigation</li>
          <li>Professional metadata</li>
        </ul>

        <div style={{ marginTop: '600px' }}>
          <h1>Financial Overview</h1>
          <h2>Revenue Analysis</h2>
          <p>Detailed revenue breakdown and analysis...</p>

          <h2>Expense Analysis</h2>
          <p>Comprehensive expense review...</p>
        </div>

        <div style={{ marginTop: '600px' }}>
          <h1>Recommendations</h1>
          <h2>Short-term Actions</h2>
          <p>Immediate steps to improve performance...</p>

          <h2>Long-term Strategy</h2>
          <p>Strategic initiatives for future growth...</p>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isGenerating ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? `Generating ${progress}%` : 'Download Professional PDF'}
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            border: '1px solid #c3e6cb',
            borderRadius: '4px',
          }}
        >
          <h3 style={{ margin: '0 0 10px 0' }}>PDF Generated Successfully!</h3>
          <p style={{ margin: '5px 0' }}>Pages: {result.pageCount}</p>
          <p style={{ margin: '5px 0' }}>
            File size: {(result.fileSize / 1024).toFixed(2)} KB
          </p>
          <p style={{ margin: '5px 0' }}>
            Generation time: {result.generationTime.toFixed(0)}ms
          </p>
        </div>
      )}
    </div>
  );
}

// ===== MAIN APP =====

export default function AdvancedFeaturesApp() {
  const [activeTab, setActiveTab] = React.useState('batch');

  const tabs = [
    { id: 'batch', label: 'Batch PDF', component: BatchPDFExample },
    { id: 'watermark', label: 'Watermarks', component: WatermarkExample },
    { id: 'headers', label: 'Headers/Footers', component: HeaderFooterExample },
    { id: 'print', label: 'Print Media', component: PrintMediaExample },
    { id: 'toc', label: 'Table of Contents', component: TOCExample },
    { id: 'bookmarks', label: 'Bookmarks', component: BookmarksExample },
    { id: 'professional', label: 'Professional Doc', component: ProfessionalDocumentExample },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || BatchPDFExample;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>PDF Generator - Advanced Features Tutorial</h1>

      {/* Tab Navigation */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #ddd' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              marginRight: '5px',
              border: 'none',
              borderBottom: activeTab === tab.id ? '3px solid #007bff' : '3px solid transparent',
              backgroundColor: activeTab === tab.id ? '#f8f9fa' : 'transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active Component */}
      <div style={{ marginTop: '20px' }}>
        <ActiveComponent />
      </div>

      {/* Documentation Link */}
      <div
        style={{
          marginTop: '60px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, color: '#666' }}>
          For more information, visit the{' '}
          <a href="#" style={{ color: '#007bff' }}>
            full documentation
          </a>
        </p>
      </div>
    </div>
  );
}
