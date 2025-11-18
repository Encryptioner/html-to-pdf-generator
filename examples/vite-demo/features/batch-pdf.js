/**
 * Batch PDF Generation Feature Module
 *
 * This module handles all batch PDF generation functionality
 * including the newPage parameter testing.
 */

import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

/**
 * Show status message
 */
function showStatus(message, isError = false) {
  const status = document.getElementById('status');
  if (!status) return;

  status.innerHTML = message;
  status.style.borderLeftColor = isError ? '#dc2626' : '#667eea';
  status.style.background = isError ? '#fef2f2' : '#f0f9ff';
}

/**
 * Test newPage = true (forces items on separate pages)
 */
async function testNewPageTrue() {
  showStatus('<strong>Testing newPage = true...</strong><br>Generating PDF...');

  try {
    const domA = document.getElementById('domA');
    const domB = document.getElementById('domB');

    if (!domA || !domB) {
      throw new Error('Test content elements not found');
    }

    const items = [
      {
        content: domA,
        pageCount: 1,
        title: 'DOM A',
        newPage: true  // Force new page
      },
      {
        content: domB,
        pageCount: 1,
        title: 'DOM B',
        newPage: true  // Force new page
      }
    ];

    const result = await generateBatchPDF(items, 'test-newpage-true.pdf', {
      format: 'a4',
      showPageNumbers: true,
    });

    showStatus(`
      <strong>✅ Test Completed: newPage = true</strong><br>
      <strong>Total Pages:</strong> ${result.totalPages}<br>
      <strong>File Size:</strong> ${(result.fileSize / 1024).toFixed(2)} KB<br>
      <strong>Generation Time:</strong> ${result.generationTime}ms<br>
      <strong>Items:</strong><br>
      ${result.items.map(item =>
        `&nbsp;&nbsp;- ${item.title || 'Untitled'}: Pages ${item.startPage}-${item.endPage} (${item.pageCount} pages)`
      ).join('<br>')}
      <br><br>
      <strong>Expected:</strong> DOM A on page 1, DOM B on page 2<br>
      <strong>✓ Check the downloaded PDF to verify!</strong>
    `);
  } catch (error) {
    showStatus(`<strong>❌ Error:</strong> ${error.message}`, true);
    console.error('Test error:', error);
  }
}

/**
 * Test newPage = false (allows items to share pages)
 */
async function testNewPageFalse() {
  showStatus('<strong>Testing newPage = false...</strong><br>Generating PDF...');

  try {
    const domA = document.getElementById('domA');
    const domB = document.getElementById('domB');

    if (!domA || !domB) {
      throw new Error('Test content elements not found');
    }

    const items = [
      {
        content: domA,
        pageCount: 1,
        title: 'DOM A',
        newPage: false  // Allow sharing page
      },
      {
        content: domB,
        pageCount: 1,
        title: 'DOM B',
        newPage: false  // Allow sharing page
      }
    ];

    const result = await generateBatchPDF(items, 'test-newpage-false.pdf', {
      format: 'a4',
      showPageNumbers: true,
    });

    showStatus(`
      <strong>✅ Test Completed: newPage = false</strong><br>
      <strong>Total Pages:</strong> ${result.totalPages}<br>
      <strong>File Size:</strong> ${(result.fileSize / 1024).toFixed(2)} KB<br>
      <strong>Generation Time:</strong> ${result.generationTime}ms<br>
      <strong>Items:</strong><br>
      ${result.items.map(item =>
        `&nbsp;&nbsp;- ${item.title || 'Untitled'}: Pages ${item.startPage}-${item.endPage} (${item.pageCount} pages)`
      ).join('<br>')}
      <br><br>
      <strong>Expected:</strong> Both DOM A and DOM B on page 1 if they fit<br>
      <strong>✓ Check the downloaded PDF to verify!</strong>
    `);
  } catch (error) {
    showStatus(`<strong>❌ Error:</strong> ${error.message}`, true);
    console.error('Test error:', error);
  }
}

/**
 * Test newPage = undefined (default behavior)
 */
async function testNewPageDefault() {
  showStatus('<strong>Testing newPage = undefined (default)...</strong><br>Generating PDF...');

  try {
    const domA = document.getElementById('domA');
    const domB = document.getElementById('domB');

    if (!domA || !domB) {
      throw new Error('Test content elements not found');
    }

    const items = [
      {
        content: domA,
        pageCount: 1,
        title: 'DOM A',
        // newPage not specified - uses default
      },
      {
        content: domB,
        pageCount: 1,
        title: 'DOM B',
        // newPage not specified - uses default
      }
    ];

    const result = await generateBatchPDF(items, 'test-newpage-default.pdf', {
      format: 'a4',
      showPageNumbers: true,
    });

    showStatus(`
      <strong>✅ Test Completed: newPage = undefined</strong><br>
      <strong>Total Pages:</strong> ${result.totalPages}<br>
      <strong>File Size:</strong> ${(result.fileSize / 1024).toFixed(2)} KB<br>
      <strong>Generation Time:</strong> ${result.generationTime}ms<br>
      <strong>Items:</strong><br>
      ${result.items.map(item =>
        `&nbsp;&nbsp;- ${item.title || 'Untitled'}: Pages ${item.startPage}-${item.endPage} (${item.pageCount} pages)`
      ).join('<br>')}
      <br><br>
      <strong>Expected:</strong> Default behavior (page break after each item)<br>
      <strong>✓ Check the downloaded PDF to verify!</strong>
    `);
  } catch (error) {
    showStatus(`<strong>❌ Error:</strong> ${error.message}`, true);
    console.error('Test error:', error);
  }
}

/**
 * Initialize Batch PDF feature
 */
export function initBatchPDF() {
  console.log('📦 Initializing Batch PDF feature...');

  // Attach event listeners
  const btnTestTrue = document.getElementById('btnTestTrue');
  const btnTestFalse = document.getElementById('btnTestFalse');
  const btnTestDefault = document.getElementById('btnTestDefault');

  if (btnTestTrue) {
    btnTestTrue.addEventListener('click', testNewPageTrue);
  }

  if (btnTestFalse) {
    btnTestFalse.addEventListener('click', testNewPageFalse);
  }

  if (btnTestDefault) {
    btnTestDefault.addEventListener('click', testNewPageDefault);
  }

  // Show ready message
  showStatus(`
    <strong>✅ Batch PDF Feature Ready!</strong><br>
    Click any test button above to generate PDFs with different newPage settings.<br><br>
    <strong>Available Tests:</strong><br>
    &nbsp;&nbsp;• newPage: true → Each item on separate pages (FIXES THE ISSUE)<br>
    &nbsp;&nbsp;• newPage: false → Items can share pages if they fit<br>
    &nbsp;&nbsp;• newPage: undefined → Default page break behavior
  `);

  console.log('✅ Batch PDF feature ready');
}
