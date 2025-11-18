/**
 * Comprehensive Package Verification Script
 *
 * This script verifies that the package is production-ready by checking:
 * - All exports are available
 * - All framework adapters load correctly
 * - TypeScript types are generated
 * - Package.json is correctly configured
 * - Build artifacts exist
 * - Documentation is complete
 *
 * Run with: node scripts/verify-package.cjs
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;
let warnings = 0;

function success(message) {
  console.log(`✅ ${message}`);
  passed++;
}

function fail(message) {
  console.log(`❌ ${message}`);
  failed++;
}

function warn(message) {
  console.log(`⚠️  ${message}`);
  warnings++;
}

function section(title) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  ${title}`);
  console.log(`${'='.repeat(70)}\n`);
}

async function verifyExports() {
  section('Verifying Exports');

  try {
    const pkg = await import('../dist/index.js');

    // Core functions
    const coreExports = [
      'PDFGenerator',
      'generatePDF',
      'generatePDFBlob',
      'generatePDFFromHTML',
      'generateBlobFromHTML',
      'generateBatchPDF',
      'generateBatchPDFBlob',
    ];

    coreExports.forEach(name => {
      if (typeof pkg[name] === 'function') {
        success(`Core export: ${name}`);
      } else {
        fail(`Missing or invalid core export: ${name}`);
      }
    });

    // Utilities
    const utilExports = [
      'PAPER_FORMATS',
      'DEFAULT_OPTIONS',
      'calculatePageConfig',
      'sanitizeFilename',
      'htmlStringToElement',
      'loadExternalStyles',
    ];

    utilExports.forEach(name => {
      if (pkg[name] !== undefined) {
        success(`Utility export: ${name}`);
      } else {
        fail(`Missing utility export: ${name}`);
      }
    });

    // Helpers
    const helperExports = [
      'DEFAULT_PDF_OPTIONS',
      'injectPDFStyles',
      'HIGH_QUALITY_PDF_OPTIONS',
      'FAST_PDF_OPTIONS',
      'PDF_CONTENT_WIDTH_PX',
    ];

    helperExports.forEach(name => {
      if (pkg[name] !== undefined) {
        success(`Helper export: ${name}`);
      } else {
        fail(`Missing helper export: ${name}`);
      }
    });

    // Advanced exports
    const advancedExports = [
      'preloadImages',
      'convertSVGsToImages',
      'analyzeTable',
      'prepareTableForPDF',
      'analyzePageBreaks',
      'applyPageBreakHints',
    ];

    advancedExports.forEach(name => {
      if (typeof pkg[name] === 'function') {
        success(`Advanced export: ${name}`);
      } else {
        fail(`Missing advanced export: ${name}`);
      }
    });

  } catch (error) {
    fail(`Failed to load core package: ${error.message}`);
  }
}

async function verifyFrameworkAdapters() {
  section('Verifying Framework Adapters');

  // React
  try {
    const react = await import('../dist/react.js');
    if (typeof react.usePDFGenerator === 'function') {
      success('React adapter: usePDFGenerator');
    } else {
      fail('React adapter: usePDFGenerator missing');
    }
    if (typeof react.useBatchPDFGenerator === 'function') {
      success('React adapter: useBatchPDFGenerator');
    } else {
      fail('React adapter: useBatchPDFGenerator missing');
    }
  } catch (error) {
    fail(`React adapter failed to load: ${error.message}`);
  }

  // Vue
  try {
    const vue = await import('../dist/vue.js');
    if (typeof vue.usePDFGenerator === 'function') {
      success('Vue adapter: usePDFGenerator');
    } else {
      fail('Vue adapter: usePDFGenerator missing');
    }
    if (typeof vue.useBatchPDFGenerator === 'function') {
      success('Vue adapter: useBatchPDFGenerator');
    } else {
      fail('Vue adapter: useBatchPDFGenerator missing');
    }
  } catch (error) {
    fail(`Vue adapter failed to load: ${error.message}`);
  }

  // Svelte
  try {
    const svelte = await import('../dist/svelte.js');
    if (typeof svelte.createPDFGenerator === 'function') {
      success('Svelte adapter: createPDFGenerator');
    } else {
      fail('Svelte adapter: createPDFGenerator missing');
    }
    if (typeof svelte.createBatchPDFGenerator === 'function') {
      success('Svelte adapter: createBatchPDFGenerator');
    } else {
      fail('Svelte adapter: createBatchPDFGenerator missing');
    }
  } catch (error) {
    fail(`Svelte adapter failed to load: ${error.message}`);
  }

  // Node
  try {
    const node = await import('../dist/node.js');
    if (typeof node.ServerPDFGenerator === 'function') {
      success('Node adapter: ServerPDFGenerator');
    } else {
      fail('Node adapter: ServerPDFGenerator missing');
    }
    if (typeof node.generateServerPDF === 'function') {
      success('Node adapter: generateServerPDF');
    } else {
      fail('Node adapter: generateServerPDF missing');
    }
  } catch (error) {
    fail(`Node adapter failed to load: ${error.message}`);
  }
}

function verifyBuildArtifacts() {
  section('Verifying Build Artifacts');

  const requiredFiles = [
    'dist/index.js',
    'dist/index.cjs',
    'dist/index.d.ts',
    'dist/react.js',
    'dist/react.cjs',
    'dist/react.d.ts',
    'dist/vue.js',
    'dist/vue.cjs',
    'dist/vue.d.ts',
    'dist/svelte.js',
    'dist/svelte.cjs',
    'dist/svelte.d.ts',
    'dist/node.js',
    'dist/node.cjs',
    'dist/node.d.ts',
    'mcp/dist/index.js',
  ];

  requiredFiles.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 0) {
        success(`Build artifact exists: ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
      } else {
        fail(`Build artifact is empty: ${file}`);
      }
    } else {
      fail(`Missing build artifact: ${file}`);
    }
  });
}

function verifyPackageJson() {
  section('Verifying package.json');

  const pkgPath = path.join(process.cwd(), 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

  // Check required fields
  const requiredFields = ['name', 'version', 'description', 'main', 'module', 'types', 'exports'];
  requiredFields.forEach(field => {
    if (pkg[field]) {
      success(`package.json has ${field}: ${typeof pkg[field] === 'object' ? 'configured' : pkg[field]}`);
    } else {
      fail(`package.json missing ${field}`);
    }
  });

  // Check exports
  const requiredExports = ['.', './node', './react', './vue', './svelte'];
  requiredExports.forEach(exp => {
    if (pkg.exports[exp]) {
      success(`package.json exports configured: ${exp}`);
    } else {
      fail(`package.json missing export: ${exp}`);
    }
  });

  // Check dependencies
  if (pkg.dependencies?.['jspdf']) {
    success('Dependency: jspdf is listed');
  } else {
    fail('Missing dependency: jspdf');
  }

  if (pkg.dependencies?.['html2canvas-pro']) {
    success('Dependency: html2canvas-pro is listed');
  } else {
    fail('Missing dependency: html2canvas-pro');
  }

  // Check MCP bin
  if (pkg.bin?.['html-to-pdf-mcp']) {
    success('MCP binary configured');
  } else {
    warn('MCP binary not configured (optional)');
  }

  // Check version
  if (pkg.version === '1.0.0') {
    success('Version is 1.0.0 (ready for release)');
  } else {
    warn(`Version is ${pkg.version}, not 1.0.0`);
  }
}

function verifyDocumentation() {
  section('Verifying Documentation');

  const requiredDocs = [
    'README.md',
    'documentation/index.md',
    'documentation/advanced/batch-generation.md',
    'documentation/features/multi-page.md',
    'documentation/features/images.md',
    'documentation/features/tables.md',
    'documentation/features/page-breaks.md',
    'documentation/features/colors.md',
    'mcp/README.md',
    'examples/README.md',
    'examples/test-batch-newpage.cjs',
    'examples/vite-demo/README.md',
  ];

  requiredDocs.forEach(doc => {
    const fullPath = path.join(process.cwd(), doc);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.length > 100) {
        success(`Documentation exists: ${doc} (${(content.length / 1024).toFixed(2)} KB)`);
      } else {
        warn(`Documentation file is very short: ${doc}`);
      }
    } else {
      fail(`Missing documentation: ${doc}`);
    }
  });
}

function verifyNewPageParameter() {
  section('Verifying newPage Parameter Implementation');

  // Check types file
  const typesPath = path.join(process.cwd(), 'src/types.ts');
  const typesContent = fs.readFileSync(typesPath, 'utf8');

  if (typesContent.includes('newPage?: boolean')) {
    success('newPage parameter defined in PDFContentItem interface');
  } else {
    fail('newPage parameter missing from PDFContentItem interface');
  }

  if (typesContent.includes('Force this item to start on a new page')) {
    success('newPage parameter has documentation comment');
  } else {
    warn('newPage parameter lacks documentation comment');
  }

  // Check core implementation
  const corePath = path.join(process.cwd(), 'src/core.ts');
  const coreContent = fs.readFileSync(corePath, 'utf8');

  if (coreContent.includes('item.newPage === true')) {
    success('newPage: true logic implemented');
  } else {
    fail('newPage: true logic missing');
  }

  if (coreContent.includes('item.newPage === false')) {
    success('newPage: false logic implemented');
  } else {
    fail('newPage: false logic missing');
  }

  if (coreContent.includes('pageBreakBefore')) {
    success('Page break before logic implemented');
  } else {
    fail('Page break before logic missing');
  }

  // Check documentation
  const batchDocsPath = path.join(process.cwd(), 'documentation/advanced/batch-generation.md');
  const batchDocsContent = fs.readFileSync(batchDocsPath, 'utf8');

  if (batchDocsContent.includes('newPage')) {
    success('newPage parameter documented in batch-generation.md');
  } else {
    fail('newPage parameter not documented in batch-generation.md');
  }

  if (batchDocsContent.includes('Controlling Page Breaks')) {
    success('Page break control section exists in documentation');
  } else {
    warn('Page break control section missing from documentation');
  }
}

async function runVerification() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   HTML to PDF Generator - Package Verification                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');

  await verifyExports();
  await verifyFrameworkAdapters();
  verifyBuildArtifacts();
  verifyPackageJson();
  verifyDocumentation();
  verifyNewPageParameter();

  // Summary
  section('Verification Summary');

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️  Warnings: ${warnings}`);

  console.log(`\nTotal Tests: ${passed + failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  if (failed === 0 && warnings === 0) {
    console.log('🎉 Package is PRODUCTION READY! All checks passed.\n');
    process.exit(0);
  } else if (failed === 0) {
    console.log(`⚠️  Package is ready with ${warnings} warning(s). Review recommended.\n`);
    process.exit(0);
  } else {
    console.log(`❌ Package has ${failed} critical issue(s). Fix before release.\n`);
    process.exit(1);
  }
}

runVerification().catch(error => {
  console.error('\n❌ Verification failed with error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
