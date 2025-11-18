/**
 * Main entry point for the demo application
 *
 * This file handles:
 * - Tab switching
 * - Loading feature modules
 * - Global initialization
 */

// Import feature modules
import { initBatchPDF } from './features/batch-pdf.js';

// Initialize tab switching
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;

      // Remove active class from all buttons and panels
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanels.forEach(panel => panel.classList.remove('active'));

      // Add active class to clicked button and corresponding panel
      button.classList.add('active');
      const targetPanel = document.getElementById(targetTab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

// Initialize features
function initFeatures() {
  // Initialize Batch PDF feature
  initBatchPDF();

  // Future feature initializations
  // initSinglePDF();
  // initTables();
  // initImages();
  // initColors();
}

// Initialize app
function init() {
  console.log('🚀 Demo app initializing...');

  initTabs();
  initFeatures();

  console.log('✅ Demo app ready!');
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
