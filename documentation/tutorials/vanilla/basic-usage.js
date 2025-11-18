/**
 * Vanilla JavaScript Example - Basic Usage
 *
 * This example shows how to use the PDF generator in vanilla JavaScript
 */

import { generatePDF, PDFGenerator } from '@encryptioner/html-to-pdf-generator';

// ===== QUICK USAGE =====

// Get the element you want to convert
const element = document.getElementById('content');

// Generate PDF with single function call
await generatePDF(element, 'my-document.pdf', {
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10],
  showPageNumbers: true,
});

// ===== ADVANCED USAGE =====

// Create a generator instance with custom options
const generator = new PDFGenerator({
  format: 'a4',
  orientation: 'portrait',
  margins: [15, 15, 15, 15],
  scale: 3, // Higher quality
  imageQuality: 0.95,
  showPageNumbers: true,
  pageNumberPosition: 'footer',

  // Progress callback
  onProgress: (progress) => {
    console.log(`Generating PDF: ${progress}%`);
    updateProgressBar(progress);
  },

  // Error callback
  onError: (error) => {
    console.error('PDF generation failed:', error);
    showErrorMessage(error.message);
  },

  // Complete callback
  onComplete: (blob) => {
    console.log('PDF generated successfully!');
    console.log(`File size: ${(blob.size / 1024).toFixed(2)} KB`);
  },
});

// Generate the PDF
const result = await generator.generatePDF(element, 'document.pdf');

console.log(`
  Generated PDF:
  - Pages: ${result.pageCount}
  - File size: ${(result.fileSize / 1024).toFixed(2)} KB
  - Generation time: ${result.generationTime.toFixed(0)}ms
`);

// ===== GENERATE BLOB ONLY (WITHOUT DOWNLOAD) =====

// Useful for uploading to server or previewing
const blob = await generator.generateBlob(element);

// Upload to server
const formData = new FormData();
formData.append('pdf', blob, 'document.pdf');

await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

// ===== WITH BUTTON CLICK =====

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const content = document.getElementById('content');
  const button = document.getElementById('downloadBtn');

  button.disabled = true;
  button.textContent = 'Generating...';

  try {
    await generatePDF(content, 'my-document.pdf', {
      format: 'a4',
      onProgress: (progress) => {
        button.textContent = `Generating... ${progress}%`;
      },
    });

    button.textContent = 'Download Complete!';
    setTimeout(() => {
      button.textContent = 'Download PDF';
      button.disabled = false;
    }, 2000);
  } catch (error) {
    console.error('PDF generation failed:', error);
    button.textContent = 'Download Failed';
    button.disabled = false;
  }
});

// ===== HELPER FUNCTIONS =====

function updateProgressBar(progress) {
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
  }
}

function showErrorMessage(message) {
  const errorDiv = document.getElementById('error');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }
}
