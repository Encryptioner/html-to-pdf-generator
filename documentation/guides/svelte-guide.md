# Svelte Integration Guide

Complete guide to using HTML to PDF Generator in your Svelte applications (Svelte 4 & 5 compatible).

## Installation

```bash
npm install @encryptioner/html-to-pdf-generator
```

## Quick Start

### Using the `createPDFGenerator` Store

The simplest way to generate PDFs in Svelte:

```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'invoice.pdf',
    format: 'a4',
    showPageNumbers: true,
  });

  const handleDownload = () => {
    if (targetElement) {
      generatePDF(targetElement);
    }
  };
</script>

<div bind:this={targetElement} class="w-[794px] p-8 bg-white">
  <h1 class="text-3xl font-bold">Invoice #12345</h1>
  <p>Amount: $1,234.56</p>
</div>

<button
  on:click={handleDownload}
  disabled={$isGenerating}
  class="px-4 py-2 bg-blue-500 text-white rounded"
>
  {$isGenerating ? `Generating... ${$progress}%` : 'Download PDF'}
</button>
```

## The `createPDFGenerator` Store

### Basic Usage

```svelte
<script>
  const { generatePDF, isGenerating, progress, error, result } =
    createPDFGenerator({
      filename: 'document.pdf',
      format: 'a4',
    });
</script>
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `generatePDF(element)` | `(element: HTMLElement) => Promise<void>` | Generate and download PDF |
| `generateBlob(element)` | `(element: HTMLElement) => Promise<Blob>` | Generate blob without download |
| `isGenerating` | `Writable<boolean>` | Store: Whether PDF is being generated |
| `progress` | `Writable<number>` | Store: Current progress (0-100) |
| `error` | `Writable<Error \| null>` | Store: Error if generation failed |
| `result` | `Writable<PDFGenerationResult \| null>` | Store: Result from last generation |
| `reset()` | `() => void` | Reset all stores to initial state |

> **Note**: `isGenerating`, `progress`, `error`, and `result` are Svelte stores. Access their values using the `$` prefix.

### All Options

```svelte
<script>
  const pdf = createPDFGenerator({
    // Required
    filename: 'document.pdf',

    // Paper settings
    format: 'a4',                    // 'a4' | 'letter' | 'a3' | 'legal'
    orientation: 'portrait',         // 'portrait' | 'landscape'
    margins: [10, 10, 10, 10],      // [top, right, bottom, left] in mm

    // Quality
    scale: 2,                        // 1-4, higher = better quality
    imageQuality: 0.85,             // 0-1 (legacy, use imageOptions instead)
    compress: true,

    // Image Optimization
    imageOptions: {
      dpi: 300,                      // 72 (web), 150 (print), 300 (high-quality)
      format: 'jpeg',                // 'jpeg' | 'png' | 'webp'
      backgroundColor: '#ffffff',    // Background for transparent images
      optimizeForPrint: true,        // Enable print optimizations
      interpolate: true,             // Image smoothing
      quality: 0.92                  // Compression quality
    },

    // Features
    showPageNumbers: true,
    pageNumberPosition: 'footer',    // 'header' | 'footer'

    // Callbacks
    onProgress: (progress) => console.log(`${progress}%`),
    onComplete: (blob) => console.log('Done!', blob),
    onError: (error) => console.error('Failed:', error),
  });
</script>
```

## Common Patterns

### With Loading State

```svelte
<script>
  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'report.pdf',
  });
</script>

<div bind:this={targetElement}>
  <!-- Content -->
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  {#if $isGenerating}
    <Spinner />
    <span>Generating {$progress}%</span>
  {:else}
    Download PDF
  {/if}
</button>
```

### With Error Handling

```svelte
<script>
  import { toast } from '@/utils/toast';

  let targetElement;
  const { generatePDF, error } = createPDFGenerator({
    filename: 'document.pdf',
    onError: (err) => {
      console.error('PDF generation failed:', err);
      toast.error('Failed to generate PDF');
    },
  });
</script>

<div bind:this={targetElement}>
  <!-- Content -->
</div>

<button on:click={() => generatePDF(targetElement)}>
  Download
</button>

{#if $error}
  <div class="text-red-500">
    Error: {$error.message}
  </div>
{/if}
```

### Upload to Server

```svelte
<script>
  let targetElement;
  const { generateBlob, isGenerating } = createPDFGenerator({
    filename: 'document.pdf',
  });

  async function handleUpload() {
    if (!targetElement) return;

    const blob = await generateBlob(targetElement);

    const formData = new FormData();
    formData.append('pdf', blob, 'document.pdf');

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    toast.success('PDF uploaded!');
  }
</script>

<div bind:this={targetElement}>
  <!-- Content -->
</div>

<button on:click={handleUpload} disabled={$isGenerating}>
  Upload PDF
</button>
```

### Multiple PDFs in One Component

```svelte
<script>
  let invoiceElement;
  let receiptElement;

  const invoice = createPDFGenerator({ filename: 'invoice.pdf' });
  const receipt = createPDFGenerator({ filename: 'receipt.pdf' });
</script>

<div bind:this={invoiceElement}>
  <!-- Invoice content -->
</div>
<button on:click={() => invoice.generatePDF(invoiceElement)}>
  Download Invoice
</button>

<div bind:this={receiptElement}>
  <!-- Receipt content -->
</div>
<button on:click={() => receipt.generatePDF(receiptElement)}>
  Download Receipt
</button>
```

### With Progress Bar

```svelte
<script>
  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<div bind:this={targetElement}>
  <!-- Content -->
</div>

{#if $isGenerating}
  <div class="space-y-2">
    <div class="w-full bg-gray-200 rounded">
      <div
        class="bg-blue-500 h-2 rounded transition-all"
        style="width: {$progress}%"
      ></div>
    </div>
    <p class="text-sm text-gray-600">
      Generating PDF... {$progress}%
    </p>
  </div>
{/if}

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Download PDF
</button>
```

## Advanced Examples

### Dynamic Content with Reactive State

```svelte
<script>
  let items = [
    { name: 'Item 1', price: 100 },
    { name: 'Item 2', price: 200 },
  ];

  let targetElement;
  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: 'invoice.pdf',
    showPageNumbers: true,
  });

  $: total = items.reduce((sum, item) => sum + item.price, 0);
</script>

<div bind:this={targetElement} class="w-[794px]">
  <h1>Invoice</h1>
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      {#each items as item, i}
        <tr>
          <td>{item.name}</td>
          <td>${item.price}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <p class="font-bold">Total: ${total}</p>
</div>

<button on:click={() => generatePDF(targetElement)}>
  {$isGenerating ? 'Generating...' : 'Download Invoice'}
</button>
```

### Conditional Rendering for PDF

```svelte
<script>
  let showDetails = false;
  let targetElement;

  const { generatePDF } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<label>
  <input type="checkbox" bind:checked={showDetails} />
  Include detailed information
</label>

<div bind:this={targetElement}>
  <h1>Report</h1>
  <p>Summary information...</p>

  {#if showDetails}
    <div>
      <h2>Detailed Information</h2>
      <p>Additional details...</p>
    </div>
  {/if}
</div>

<button on:click={() => generatePDF(targetElement)}>
  Download {showDetails ? 'Detailed' : 'Summary'} PDF
</button>
```

### With Svelte 5 Runes (Svelte 5+)

```svelte
<script>
  let targetElement = $state();
  let showLogo = $state(true);
  let showFooter = $state(true);

  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<div class="controls">
  <label>
    <input type="checkbox" bind:checked={showLogo} />
    Include Logo
  </label>
  <label>
    <input type="checkbox" bind:checked={showFooter} />
    Include Footer
  </label>
</div>

<div bind:this={targetElement}>
  {#if showLogo}
    <img src="/logo.png" alt="Logo" />
  {/if}
  <h1>Content</h1>
  <p>Main content here...</p>
  {#if showFooter}
    <footer>Footer information</footer>
  {/if}
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Download PDF
</button>
```

### With Svelte Store Integration

```svelte
<script>
  import { invoiceStore } from './stores';

  let targetElement;
  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: `invoice-${$invoiceStore.number}.pdf`,
    onComplete: () => {
      invoiceStore.markAsExported();
    },
  });
</script>

<div bind:this={targetElement} class="w-[794px]">
  <h1>Invoice #{$invoiceStore.number}</h1>
  {#each $invoiceStore.items as item}
    <p>{item.name}: ${item.price}</p>
  {/each}
  <p class="font-bold">Total: ${$invoiceStore.total}</p>
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Export Invoice
</button>
```

### Component Composition

```svelte
<!-- InvoiceDocument.svelte -->
<script>
  export let data;
</script>

<div class="w-[794px] p-8">
  <h1>Invoice #{data.number}</h1>
  {#each data.items as item}
    <p>{item.name}: ${item.price}</p>
  {/each}
  <p class="font-bold">Total: ${data.total}</p>
</div>
```

```svelte
<!-- Parent component -->
<script>
  import InvoiceDocument from './InvoiceDocument.svelte';

  let targetElement;
  const invoiceData = {
    number: '12345',
    items: [{ name: 'Item 1', price: 100 }],
    total: 100
  };

  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: 'invoice.pdf',
  });
</script>

<div bind:this={targetElement}>
  <InvoiceDocument data={invoiceData} />
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Download
</button>
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```svelte
<script lang="ts">
  import type {
    PDFGeneratorOptions,
    PDFGenerationResult,
  } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement: HTMLElement;

  const options: PDFGeneratorOptions = {
    filename: 'document.pdf',
    format: 'a4',
    showPageNumbers: true,
  };

  const { generatePDF, isGenerating, progress, error, result } =
    createPDFGenerator(options);

  // Result store is fully typed
  $: if ($result) {
    const pageCount: number = $result.pageCount;
    const fileSize: number = $result.fileSize;
    const generationTime: number = $result.generationTime;
    console.log(`Generated ${pageCount} pages in ${generationTime}ms`);
  }
</script>
```

## Using with SvelteKit

The library works seamlessly with SvelteKit:

```svelte
<script>
  // SvelteKit - works in pages or components
  let targetElement;

  const { generatePDF, isGenerating } = createPDFGenerator({
    filename: 'document.pdf',
  });
</script>

<div bind:this={targetElement}>
  <h1>SvelteKit PDF</h1>
  <p>Content here...</p>
</div>

<button on:click={() => generatePDF(targetElement)} disabled={$isGenerating}>
  Download
</button>
```

### SvelteKit SSR Considerations

Since PDF generation requires DOM access, ensure it runs client-side:

```svelte
<script>
  import { browser } from '$app/environment';

  let targetElement;
  const { generatePDF } = createPDFGenerator({
    filename: 'document.pdf',
  });

  function handleDownload() {
    if (!browser) return; // Skip during SSR
    if (targetElement) {
      generatePDF(targetElement);
    }
  }
</script>

<button on:click={handleDownload}>Download</button>
```

## Best Practices

### 1. Use Fixed Width Container

```svelte
<div bind:this={targetElement} style="width: 794px"> <!-- A4 width -->
  <!-- Content -->
</div>
```

### 2. Handle Loading States

```svelte
<button
  on:click={() => generatePDF(targetElement)}
  disabled={$isGenerating}
>
  {$isGenerating ? `${$progress}%` : 'Download'}
</button>
```

### 3. Implement Error Handling

```svelte
<script>
  const { generatePDF, error } = createPDFGenerator({
    filename: 'document.pdf',
    onError: (err) => {
      console.error(err);
      toast.error('Failed to generate PDF');
    },
  });
</script>

{#if $error}
  <div class="error">{$error.message}</div>
{/if}
```

### 4. Check Element Exists Before Generating

```svelte
<script>
  function handleDownload() {
    if (!targetElement) {
      console.error('Element not found');
      return;
    }
    generatePDF(targetElement);
  }
</script>
```

### 5. Optimize for Performance

```svelte
<script>
  const pdf = createPDFGenerator({
    filename: 'document.pdf',
    scale: 1.5,           // Lower for faster generation
    compress: true,       // Reduce file size
    imageQuality: 0.8,   // Balance quality/size
  });
</script>
```

## Common Issues

### Issue: Element is undefined

```svelte
<!-- ❌ Wrong: Using element before it's bound -->
<script>
  let targetElement;
  const { generatePDF } = createPDFGenerator({
    filename: 'document.pdf',
  });

  // This runs immediately, element is undefined
  generatePDF(targetElement);
</script>

<!-- ✅ Correct: Use in event handler -->
<script>
  let targetElement;
  const { generatePDF } = createPDFGenerator({
    filename: 'document.pdf',
  });

  function handleClick() {
    if (targetElement) {
      generatePDF(targetElement);
    }
  }
</script>

<button on:click={handleClick}>Download</button>
```

### Issue: Styles not applied

```svelte
<script>
  import { onMount } from 'svelte';

  let ready = false;

  onMount(() => {
    // Wait for styles to be applied
    setTimeout(() => {
      ready = true;
    }, 100);
  });
</script>

<button disabled={!ready} on:click={() => generatePDF(targetElement)}>
  Download
</button>
```

### Issue: Content cut off

```svelte
<!-- Use fixed width matching PDF format -->
<div bind:this={targetElement} style="width: 794px">
  Content
</div>
```

## Lifecycle Integration

### Generate PDF on Mount

```svelte
<script>
  import { onMount } from 'svelte';

  let targetElement;
  const { generatePDF } = createPDFGenerator({
    filename: 'auto-generated.pdf',
  });

  onMount(() => {
    // Auto-generate after component mounts
    if (targetElement) {
      generatePDF(targetElement);
    }
  });
</script>
```

### Generate Before Destroy

```svelte
<script>
  import { onDestroy } from 'svelte';

  let targetElement;
  const { generateBlob } = createPDFGenerator({
    filename: 'document.pdf',
  });

  onDestroy(async () => {
    // Save PDF before component is destroyed
    if (targetElement) {
      const blob = await generateBlob(targetElement);
      // Upload or save blob
    }
  });
</script>
```

## Reactive Stores

Since the library returns Svelte stores, you can use them reactively:

```svelte
<script>
  const { generatePDF, isGenerating, progress, result } = createPDFGenerator({
    filename: 'document.pdf',
  });

  // React to progress changes
  $: if ($progress > 0) {
    console.log(`Progress: ${$progress}%`);
  }

  // React to completion
  $: if ($result) {
    console.log(`Generated ${$result.pageCount} pages`);
  }

  // Disable other actions while generating
  $: canEdit = !$isGenerating;
</script>

<button disabled={!canEdit}>
  Edit Document
</button>
```

## Next Steps

- **[Image Optimization](../advanced/image-optimization.md)** - DPI control and print quality
- **[Options Reference](../api/options.md)** - Complete options documentation
- **[Code Examples](../examples/code-examples.md)** - Copy-paste ready samples
- **[Production Examples](../examples/production-examples.md)** - Real-world use cases
- **[Best Practices](./best-practices.md)** - Optimization tips

---

[← Back to Documentation](../index.md)
