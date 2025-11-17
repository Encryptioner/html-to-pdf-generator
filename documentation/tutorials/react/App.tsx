/**
 * React Example - PDF Generator Usage
 *
 * This example shows how to use the PDF generator in React
 */

import React from 'react';
import { usePDFGenerator, usePDFGeneratorManual } from '@encryptioner/html-to-pdf-generator/react';

// ===== BASIC USAGE WITH HOOK =====

function BasicExample() {
  const { targetRef, generatePDF, isGenerating, progress, error } = usePDFGenerator({
    filename: 'my-document.pdf',
    format: 'a4',
    orientation: 'portrait',
    margins: [10, 10, 10, 10],
    showPageNumbers: true,
  });

  return (
    <div>
      {/* Content to convert to PDF */}
      <div ref={targetRef} style={{ padding: '20px' }}>
        <h1>My Document</h1>
        <p>This content will be converted to PDF</p>
      </div>

      {/* Download button */}
      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
      </button>

      {/* Error message */}
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error.message}
        </div>
      )}
    </div>
  );
}

// ===== ADVANCED USAGE WITH CUSTOM STYLING =====

function AdvancedExample() {
  const {
    targetRef,
    generatePDF,
    generateBlob,
    isGenerating,
    progress,
    error,
    result,
    reset,
  } = usePDFGenerator({
    filename: 'invoice.pdf',
    format: 'a4',
    scale: 3, // High quality
    imageQuality: 0.95,
    onProgress: (p) => console.log(`Progress: ${p}%`),
    onComplete: (blob) => console.log(`PDF size: ${blob.size} bytes`),
  });

  const handleUpload = async () => {
    const blob = await generateBlob();
    if (!blob) return;

    const formData = new FormData();
    formData.append('pdf', blob, 'document.pdf');

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <div className="container">
      <div
        ref={targetRef}
        style={{
          width: '794px',
          padding: '40px',
          backgroundColor: 'white',
        }}
      >
        <header>
          <h1>Invoice #12345</h1>
          <p>Date: {new Date().toLocaleDateString()}</p>
        </header>

        <main>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product A</td>
                <td>2</td>
                <td>$50.00</td>
              </tr>
            </tbody>
          </table>
        </main>

        <footer>
          <p>Total: $100.00</p>
        </footer>
      </div>

      <div className="controls">
        <button onClick={generatePDF} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <span className="spinner" />
              Generating {progress}%
            </>
          ) : (
            'Download PDF'
          )}
        </button>

        <button onClick={handleUpload} disabled={isGenerating}>
          Upload PDF
        </button>

        <button onClick={reset} disabled={isGenerating}>
          Reset
        </button>
      </div>

      {result && (
        <div className="success">
          PDF generated successfully!
          <br />
          Pages: {result.pageCount}
          <br />
          Size: {(result.fileSize / 1024).toFixed(2)} KB
          <br />
          Time: {result.generationTime.toFixed(0)}ms
        </div>
      )}

      {error && <div className="error">Error: {error.message}</div>}
    </div>
  );
}

// ===== MANUAL MODE (FOR DYNAMIC ELEMENTS) =====

function ManualExample() {
  const { generatePDF, isGenerating, progress } = usePDFGeneratorManual({
    format: 'a4',
  });

  const handleExport = async (contentId: string) => {
    const element = document.getElementById(contentId);
    if (element) {
      await generatePDF(element, `${contentId}.pdf`);
    }
  };

  return (
    <div>
      <div id="content1">
        <h2>Content 1</h2>
        <p>This is the first content block</p>
      </div>

      <div id="content2">
        <h2>Content 2</h2>
        <p>This is the second content block</p>
      </div>

      <button onClick={() => handleExport('content1')} disabled={isGenerating}>
        Export Content 1
      </button>

      <button onClick={() => handleExport('content2')} disabled={isGenerating}>
        Export Content 2
      </button>

      {isGenerating && <p>Generating... {progress}%</p>}
    </div>
  );
}

// ===== WITH PREVIEW MODAL =====

function PreviewExample() {
  const [showPreview, setShowPreview] = React.useState(false);
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'document.pdf',
  });

  return (
    <div>
      <button onClick={() => setShowPreview(true)}>
        Preview Document
      </button>

      {showPreview && (
        <div className="modal">
          <div className="modal-content">
            <div className="preview">
              <div ref={targetRef}>
                <h1>Document Preview</h1>
                <p>This is what will be converted to PDF</p>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowPreview(false)}>
                Close
              </button>
              <button onClick={generatePDF} disabled={isGenerating}>
                {isGenerating ? `Downloading ${progress}%` : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <div>
      <h1>PDF Generator Examples</h1>
      <BasicExample />
      <AdvancedExample />
      <ManualExample />
      <PreviewExample />
    </div>
  );
}
