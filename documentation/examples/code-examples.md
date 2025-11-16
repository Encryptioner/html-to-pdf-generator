# Code Examples

Copy-paste ready examples for common use cases.

## Table of Contents

- [Basic Examples](#basic-examples)
- [React Examples](#react-examples)
- [Vue Examples](#vue-examples)
- [Svelte Examples](#svelte-examples)
- [Advanced Examples](#advanced-examples)

## Basic Examples

### Simple PDF Generation

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf');
```

### With Common Options

```javascript
await generatePDF(element, 'document.pdf', {
  format: 'a4',
  orientation: 'portrait',
  margins: [10, 10, 10, 10],
  showPageNumbers: true,
  compress: true,
});
```

### From HTML String

```javascript
import { generatePDFFromHTML } from '@encryptioner/html-to-pdf-generator';

const html = `
  <div style="padding: 20px; font-family: Arial;">
    <h1>Invoice #12345</h1>
    <p>Amount: $1,234.56</p>
  </div>
`;

await generatePDFFromHTML(html, 'invoice.pdf', {
  format: 'a4',
});
```

## React Examples

### Basic Hook Usage

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

export default function Document() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'document.pdf',
  });

  return (
    <>
      <div ref={targetRef}>
        <h1>My Document</h1>
        <p>Content here...</p>
      </div>
      <button onClick={generatePDF} disabled={isGenerating}>
        Download PDF
      </button>
    </>
  );
}
```

### With Progress Indicator

```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

export default function DocumentWithProgress() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'document.pdf',
  });

  return (
    <div>
      <div ref={targetRef} className="w-[794px]">
        <h1>My Document</h1>
        <p>Content here...</p>
      </div>

      {isGenerating && (
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-blue-500 h-2 rounded"
            style={{ width: `${progress}%` }}
          />
          <p className="text-sm mt-2">Generating... {progress}%</p>
        </div>
      )}

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download PDF'}
      </button>
    </div>
  );
}
```

### Dynamic Invoice

```tsx
import { useState } from 'react';
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

export default function Invoice() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', price: 100 },
    { id: 2, name: 'Item 2', price: 200 },
  ]);

  const { targetRef, generatePDF } = usePDFGenerator({
    filename: 'invoice.pdf',
    showPageNumbers: true,
  });

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <div ref={targetRef} className="w-[794px] p-8 bg-white">
        <h1 className="text-2xl font-bold mb-4">Invoice</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-right">${item.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="border p-2">Total</td>
              <td className="border p-2 text-right">${total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button
        onClick={generatePDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download Invoice
      </button>
    </div>
  );
}
```

## Vue Examples

### Basic Composable Usage

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <h1>My Document</h1>
      <p>Content here...</p>
    </div>
    <button @click="generatePDF" :disabled="isGenerating">
      Download PDF
    </button>
  </div>
</template>
```

### With Progress Bar

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef" class="w-[794px]">
      <h1>My Document</h1>
      <p>Content here...</p>
    </div>

    <div v-if="isGenerating" class="w-full bg-gray-200 rounded">
      <div
        class="bg-blue-500 h-2 rounded transition-all"
        :style="{ width: `${progress}%` }"
      ></div>
      <p class="text-sm mt-2">Generating... {{ progress }}%</p>
    </div>

    <button @click="generatePDF" :disabled="isGenerating">
      {{ isGenerating ? 'Generating...' : 'Download PDF' }}
    </button>
  </div>
</template>
```

### Dynamic Report

```vue
<script setup>
import { ref, computed } from 'vue';
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const items = ref([
  { id: 1, name: 'Product A', sales: 1000 },
  { id: 2, name: 'Product B', sales: 1500 },
]);

const { targetRef, generatePDF } = usePDFGenerator({
  filename: 'sales-report.pdf',
});

const totalSales = computed(() =>
  items.value.reduce((sum, item) => sum + item.sales, 0)
);
</script>

<template>
  <div>
    <div ref="targetRef" class="w-[794px] p-8 bg-white">
      <h1 class="text-2xl font-bold mb-4">Sales Report</h1>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2 text-left">Product</th>
            <th class="border p-2 text-right">Sales</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td class="border p-2">{{ item.name }}</td>
            <td class="border p-2 text-right">${{ item.sales }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="font-bold">
            <td class="border p-2">Total</td>
            <td class="border p-2 text-right">${{ totalSales }}</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <button
      @click="generatePDF"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
    >
      Download Report
    </button>
  </div>
</template>
```

## Svelte Examples

### Basic Store Usage

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<div bind:this={targetElement}>
  <h1>My Document</h1>
  <p>Content here...</p>
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Download PDF
</button>
```

### With Progress Indicator

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<div bind:this={targetElement} class="w-[794px]">
  <h1>My Document</h1>
  <p>Content here...</p>
</div>

{#if $isGenerating}
  <div class="w-full bg-gray-200 rounded">
    <div
      class="bg-blue-500 h-2 rounded transition-all"
      style="width: {$progress}%"
    ></div>
    <p class="text-sm mt-2">Generating... {$progress}%</p>
  </div>
{/if}

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  {$isGenerating ? 'Generating...' : 'Download PDF'}
</button>
```

### Dynamic Data Table

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  let data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  const { generatePDF } = createPDFGenerator({
    filename: 'contacts.pdf',
  });
</script>

<div bind:this={targetElement} class="w-[794px] p-8 bg-white">
  <h1 class="text-2xl font-bold mb-4">Contacts</h1>
  <table class="w-full border-collapse">
    <thead>
      <tr class="bg-gray-100">
        <th class="border p-2 text-left">Name</th>
        <th class="border p-2 text-left">Email</th>
      </tr>
    </thead>
    <tbody>
      {#each data as contact}
        <tr>
          <td class="border p-2">{contact.name}</td>
          <td class="border p-2">{contact.email}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<button
  on:click={() => generatePDF(targetElement)}
  class="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
>
  Download Contacts
</button>
```

## Advanced Examples

### With Watermark

```javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

await generatePDF(element, 'confidential.pdf', {
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal',
    fontSize: 48,
    color: '#cccccc',
    allPages: true,
  },
});
```

### With Headers and Footers

```javascript
await generatePDF(element, 'report.pdf', {
  headerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}} | {{date}}',
    height: 20,
    firstPage: false,
  },
  footerTemplate: {
    template: '{{title}} - Confidential',
    height: 20,
  },
  metadata: {
    title: 'Annual Report 2025',
  },
});
```

### Batch PDF Generation

```javascript
import { generateBatchPDF } from '@encryptioner/html-to-pdf-generator';

const items = [
  { content: document.getElementById('cover'), pageCount: 1 },
  { content: document.getElementById('chapter1'), pageCount: 3 },
  { content: document.getElementById('chapter2'), pageCount: 2 },
];

const result = await generateBatchPDF(items, 'book.pdf', {
  format: 'a4',
  showPageNumbers: true,
});

console.log(`Generated ${result.pageCount} pages`);
```

### Template with Variables

```javascript
import {
  processTemplateWithContext,
  generatePDFFromHTML,
} from '@encryptioner/html-to-pdf-generator';

const template = `
  <div style="padding: 20px;">
    <h1>{{title}}</h1>
    <p>Dear {{name}},</p>

    <h2>Items</h2>
    {{#each items}}
      <div>
        <strong>{{name}}</strong>: ${{price}}
      </div>
    {{/each}}

    {{#if showFooter}}
      <footer>Thank you for your business!</footer>
    {{/if}}
  </div>
`;

const html = processTemplateWithContext(
  template,
  {
    title: 'Invoice',
    name: 'John Doe',
    items: [
      { name: 'Item 1', price: '10.00' },
      { name: 'Item 2', price: '25.00' },
    ],
    showFooter: true,
  },
  {
    enableLoops: true,
    enableConditionals: true,
  }
);

await generatePDFFromHTML(html, 'invoice.pdf');
```

### Upload to Server

```javascript
import { generatePDFBlob } from '@encryptioner/html-to-pdf-generator';

async function uploadPDF() {
  const element = document.getElementById('content');

  // Generate blob
  const blob = await generatePDFBlob(element, {
    format: 'a4',
    compress: true,
  });

  // Upload to server
  const formData = new FormData();
  formData.append('pdf', blob, 'document.pdf');
  formData.append('title', 'My Document');
  formData.append('userId', '12345');

  const response = await fetch('/api/pdfs', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  console.log('Uploaded:', data.url);
}
```

### Multi-Language Document

```javascript
await generatePDF(element, 'multilingual.pdf', {
  format: 'a4',
  fontOptions: {
    fonts: [
      {
        family: 'Noto Sans',
        src: '/fonts/NotoSans-Regular.ttf',
        weight: 400,
      },
      {
        family: 'Noto Sans Arabic',
        src: '/fonts/NotoSansArabic-Regular.ttf',
        weight: 400,
      },
    ],
    embedFonts: true,
  },
});
```

### With Table of Contents

```javascript
await generatePDF(element, 'manual.pdf', {
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    levels: [1, 2, 3],
    position: 'start',
    includePageNumbers: true,
    indentPerLevel: 10,
    enableLinks: true,
  },
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2, 3],
  },
});
```

### Print Media Styles

```javascript
await generatePDF(element, 'document.pdf', {
  emulateMediaType: 'print', // Apply @media print styles
});
```

```css
/* These styles will be applied when emulateMediaType: 'print' */
@media print {
  .no-print {
    display: none;
  }

  .print-only {
    display: block;
  }

  a[href]:after {
    content: ' (' attr(href) ')';
  }
}
```

### Complete Production Example

```javascript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

async function generateProductionPDF() {
  // Wait for content to load
  await document.fonts.ready;
  await preloadImages();

  const element = document.getElementById('content');
  if (!element) {
    throw new Error('Content element not found');
  }

  const generator = new PDFGenerator({
    format: 'a4',
    orientation: 'portrait',
    margins: [15, 15, 15, 15],
    compress: true,
    scale: 2,
    imageQuality: 0.85,
    optimizeImages: true,
    showPageNumbers: true,
    repeatTableHeaders: true,
    preventOrphanedHeadings: true,
    respectCSSPageBreaks: true,
    watermark: {
      text: 'DRAFT',
      opacity: 0.2,
      position: 'diagonal',
    },
    headerTemplate: {
      template: 'Page {{pageNumber}} of {{totalPages}}',
      height: 15,
      firstPage: false,
    },
    metadata: {
      title: 'Production Document',
      author: 'Your Company',
      subject: 'Important Document',
      keywords: ['report', 'production'],
      creator: 'Your Application',
    },
    onProgress: (progress) => {
      updateProgressBar(progress);
    },
    onComplete: (blob) => {
      console.log(`Generated ${blob.size} bytes`);
      showSuccess('PDF generated successfully!');
    },
    onError: (error) => {
      console.error('Generation error:', error);
      showError('Failed to generate PDF');
    },
  });

  try {
    const result = await generator.generatePDF(element, 'document.pdf');
    console.log(`Generated ${result.pageCount} pages in ${result.generationTime}ms`);
    return result;
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
}

async function preloadImages() {
  const images = Array.from(document.images);
  await Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );
}

function updateProgressBar(progress) {
  const bar = document.getElementById('progress-bar');
  if (bar) bar.style.width = `${progress}%`;
}

function showSuccess(message) {
  console.log(message);
  // Show toast or notification
}

function showError(message) {
  console.error(message);
  // Show error notification
}
```

## Next Steps

- **[Use Cases](./use-cases.md)** - Real-world use cases
- **[Best Practices](../guides/best-practices.md)** - Optimization tips
- **[API Reference](../api/options.md)** - Complete API documentation

---

[← Back to Documentation](../index.md)
