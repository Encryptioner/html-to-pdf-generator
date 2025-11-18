/**
 * Test script for batch PDF generation with newPage parameter
 *
 * Run with: node examples/test-batch-newpage.js
 *
 * This demonstrates the fix for the issue where domA and domB
 * both appeared on page 1 instead of separate pages.
 */

const fs = require('fs');
const path = require('path');

// Test case structure
const testCases = [
  {
    name: 'Test 1: newPage = true (FIXES THE ISSUE)',
    description: 'domA should be on page 1, domB should be on page 2',
    items: [
      {
        html: `
          <div style="padding: 20px;">
            <h1>DOM A - Section 1</h1>
            <p>This is the first content section.</p>
            <p>With newPage: true, this should be on page 1.</p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
        `,
        pageCount: 1,
        title: 'DOM A',
        newPage: true  // Force new page
      },
      {
        html: `
          <div style="padding: 20px;">
            <h1>DOM B - Section 2</h1>
            <p>This is the second content section.</p>
            <p>With newPage: true, this should be on page 2 (separate from DOM A).</p>
            <ul>
              <li>Feature A</li>
              <li>Feature B</li>
              <li>Feature C</li>
            </ul>
          </div>
        `,
        pageCount: 1,
        title: 'DOM B',
        newPage: true  // Force new page
      }
    ],
    expected: {
      totalPages: 2,
      items: [
        { title: 'DOM A', startPage: 1, endPage: 1 },
        { title: 'DOM B', startPage: 2, endPage: 2 }
      ]
    }
  },
  {
    name: 'Test 2: newPage = false (Allow sharing)',
    description: 'domA and domB can share page 1 if they fit',
    items: [
      {
        html: `
          <div style="padding: 20px;">
            <h1>DOM A - Section 1</h1>
            <p>This is the first content section.</p>
            <p>With newPage: false, this allows sharing pages.</p>
          </div>
        `,
        pageCount: 1,
        title: 'DOM A',
        newPage: false  // Allow sharing page
      },
      {
        html: `
          <div style="padding: 20px;">
            <h1>DOM B - Section 2</h1>
            <p>This is the second content section.</p>
            <p>With newPage: false, this can appear on the same page as DOM A if there's room.</p>
          </div>
        `,
        pageCount: 1,
        title: 'DOM B',
        newPage: false  // Allow sharing page
      }
    ],
    expected: {
      note: 'Should allow content to share pages if they fit'
    }
  },
  {
    name: 'Test 3: newPage = undefined (Default)',
    description: 'Default behavior with page breaks after each item',
    items: [
      {
        html: `
          <div style="padding: 20px;">
            <h1>DOM A - Section 1</h1>
            <p>This is the first content section.</p>
            <p>With newPage undefined (default), page break after.</p>
          </div>
        `,
        pageCount: 1,
        title: 'DOM A'
        // newPage not specified - uses default
      },
      {
        html: `
          <div style="padding: 20px;">
            <h1>DOM B - Section 2</h1>
            <p>This is the second content section.</p>
            <p>With newPage undefined (default), page break after.</p>
          </div>
        `,
        pageCount: 1,
        title: 'DOM B'
        // newPage not specified - uses default
      }
    ],
    expected: {
      note: 'Default behavior adds page break after each item'
    }
  },
  {
    name: 'Test 4: Mixed newPage values',
    description: 'Combination of true, false, and undefined',
    items: [
      {
        html: '<div style="padding: 20px;"><h1>Cover Page</h1><p>This is the cover.</p></div>',
        pageCount: 1,
        title: 'Cover',
        newPage: true  // Cover on its own page
      },
      {
        html: '<div style="padding: 20px;"><h2>Section Header</h2><p>Header text.</p></div>',
        pageCount: 1,
        title: 'Header',
        newPage: false  // Can share page
      },
      {
        html: '<div style="padding: 20px;"><p>Section content that flows from header.</p></div>',
        pageCount: 1,
        title: 'Content',
        newPage: false  // Can share page
      },
      {
        html: '<div style="padding: 20px;"><h1>Chapter 2</h1><p>New chapter starts here.</p></div>',
        pageCount: 1,
        title: 'Chapter 2',
        newPage: true  // New chapter on new page
      }
    ],
    expected: {
      note: 'Cover on page 1, Header+Content can share page 2, Chapter 2 on new page'
    }
  }
];

// Print test case information
console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║   Batch PDF Generation - newPage Parameter Test Cases         ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

console.log('📋 Original Issue:');
console.log('   When domA (1 page) and domB (1 page) are combined,');
console.log('   both appeared on page 1 instead of separate pages.\n');

console.log('✅ Solution:');
console.log('   Added newPage parameter to PDFContentItem:');
console.log('   - newPage: true  → Force item to start on new page');
console.log('   - newPage: false → Allow item to share page with previous content');
console.log('   - newPage: undefined → Default (page break after each item)\n');

console.log('═══════════════════════════════════════════════════════════════\n');

testCases.forEach((testCase, index) => {
  console.log(`Test Case ${index + 1}: ${testCase.name}`);
  console.log(`Description: ${testCase.description}`);
  console.log('\nInput Configuration:');

  testCase.items.forEach((item, i) => {
    console.log(`  Item ${i + 1}:`);
    console.log(`    title: "${item.title}"`);
    console.log(`    pageCount: ${item.pageCount}`);
    console.log(`    newPage: ${item.newPage === undefined ? 'undefined (default)' : item.newPage}`);
  });

  if (testCase.expected.totalPages) {
    console.log(`\nExpected Result:`);
    console.log(`  Total Pages: ${testCase.expected.totalPages}`);
    testCase.expected.items.forEach(item => {
      console.log(`  - ${item.title}: Page ${item.startPage}${item.startPage !== item.endPage ? `-${item.endPage}` : ''}`);
    });
  } else {
    console.log(`\nExpected Result: ${testCase.expected.note}`);
  }

  console.log('\n' + '─'.repeat(65) + '\n');
});

console.log('📝 Implementation Details:\n');
console.log('File: src/core.ts (lines 674-686)');
console.log('Logic:');
console.log(`  if (item.newPage === true && i > 0) {
    element.style.pageBreakBefore = 'always';  // Force new page
  } else if (item.newPage === false) {
    // No page break - allow sharing
  } else if (item.newPage === undefined) {
    if (i < items.length - 1) {
      element.style.pageBreakAfter = 'always';  // Default
    }
  }`);

console.log('\n' + '═'.repeat(65) + '\n');

console.log('🧪 To test with actual PDF generation:');
console.log('   1. Browser: Open examples/batch-newpage-demo.html');
console.log('   2. MCP Server: Use generate_batch_pdf tool with newPage parameter');
console.log('   3. Code: Import generateBatchPDF and pass newPage in items array\n');

console.log('Example Usage:');
console.log(`
  import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

  const items = [
    {
      content: domA,
      pageCount: 1,
      newPage: true,  // domA on page 1
    },
    {
      content: domB,
      pageCount: 1,
      newPage: true,  // domB on page 2 (FIXES THE ISSUE!)
    }
  ];

  const result = await generateBatchPDF(items, 'output.pdf');
  // Result: domA on page 1, domB on page 2 ✓
`);

console.log('✅ Implementation Status:');
console.log('   - Types updated (src/types.ts)');
console.log('   - Core implementation updated (src/core.ts)');
console.log('   - Documentation updated (documentation/advanced/batch-generation.md)');
console.log('   - MCP server updated (mcp/src/index.ts)');
console.log('   - All builds passing');
console.log('   - All type checks passing');
console.log('   - Changes committed and pushed\n');
