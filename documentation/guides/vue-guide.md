# Vue 3 Integration Guide

Complete guide to using HTML to PDF Generator in your Vue 3 applications.

## Installation

```bash
npm install @encryptioner/html-to-pdf-generator
```

## Quick Start

### Using the `usePDFGenerator` Composable

The simplest way to generate PDFs in Vue 3:

```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'invoice.pdf',
  format: 'a4',
  showPageNumbers: true,
});
</script>

<template>
  <div>
    <div ref="targetRef" class="w-[794px] p-8 bg-white">
      <h1 class="text-3xl font-bold">Invoice #12345</h1>
      <p>Amount: $1,234.56</p>
    </div>

    <button
      @click="generatePDF"
      :disabled="isGenerating"
      class="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {{ isGenerating ? `Generating... ${progress}%` : 'Download PDF' }}
    </button>
  </div>
</template>
```

## The `usePDFGenerator` Composable

### Basic Usage

```vue
<script setup>
const { targetRef, generatePDF, isGenerating, progress, error, result } =
  usePDFGenerator({
    filename: 'document.pdf',
    format: 'a4',
  });
</script>
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `targetRef` | `Ref<HTMLElement \| null>` | Template ref for element to convert |
| `generatePDF()` | `() => Promise<void>` | Generate and download PDF |
| `generateBlob()` | `() => Promise<Blob>` | Generate blob without download |
| `isGenerating` | `Ref<boolean>` | Whether PDF is being generated |
| `progress` | `Ref<number>` | Current progress (0-100) |
| `error` | `Ref<Error \| null>` | Error if generation failed |
| `result` | `Ref<PDFGenerationResult \| null>` | Result from last generation |
| `reset()` | `() => void` | Reset state |

### All Options

```vue
<script setup>
const pdf = usePDFGenerator({
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

## The `usePDFGeneratorManual` Composable

For cases where you can't use template refs or need more control:

```vue
<script setup>
import { usePDFGeneratorManual } from '@encryptioner/html-to-pdf-generator/vue';

const { generatePDF, isGenerating, progress } = usePDFGeneratorManual({
  filename: 'document.pdf',
});

const handleDownload = () => {
  const element = document.getElementById('my-content');
  if (element) {
    generatePDF(element);
  }
};
</script>

<template>
  <div>
    <div id="my-content">
      <h1>Content</h1>
    </div>
    <button @click="handleDownload">Download</button>
  </div>
</template>
```

## Common Patterns

### With Loading State

```vue
<script setup>
const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'report.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <!-- Content -->
    </div>

    <button @click="generatePDF" :disabled="isGenerating">
      <template v-if="isGenerating">
        <Spinner />
        <span>Generating {{ progress }}%</span>
      </template>
      <template v-else>
        Download PDF
      </template>
    </button>
  </div>
</template>
```

### With Error Handling

```vue
<script setup>
import { useToast } from '@/composables/useToast';

const toast = useToast();
const { targetRef, generatePDF, error } = usePDFGenerator({
  filename: 'document.pdf',
  onError: (err) => {
    console.error('PDF generation failed:', err);
    toast.error('Failed to generate PDF');
  },
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <!-- Content -->
    </div>
    <button @click="generatePDF">Download</button>
    <div v-if="error" class="text-red-500">
      Error: {{ error.message }}
    </div>
  </div>
</template>
```

### Upload to Server

```vue
<script setup>
const { targetRef, generateBlob, isGenerating } = usePDFGenerator({
  filename: 'document.pdf',
});

const handleUpload = async () => {
  const blob = await generateBlob();

  const formData = new FormData();
  formData.append('pdf', blob, 'document.pdf');

  await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  toast.success('PDF uploaded!');
};
</script>

<template>
  <div>
    <div ref="targetRef">
      <!-- Content -->
    </div>
    <button @click="handleUpload" :disabled="isGenerating">
      Upload PDF
    </button>
  </div>
</template>
```

### Multiple PDFs in One Component

```vue
<script setup>
const invoice = usePDFGenerator({ filename: 'invoice.pdf' });
const receipt = usePDFGenerator({ filename: 'receipt.pdf' });
</script>

<template>
  <div>
    <div ref="invoice.targetRef">
      <!-- Invoice content -->
    </div>
    <button @click="invoice.generatePDF">Download Invoice</button>

    <div ref="receipt.targetRef">
      <!-- Receipt content -->
    </div>
    <button @click="receipt.generatePDF">Download Receipt</button>
  </div>
</template>
```

### With Progress Bar

```vue
<script setup>
const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <!-- Content -->
    </div>

    <div v-if="isGenerating" class="space-y-2">
      <div class="w-full bg-gray-200 rounded">
        <div
          class="bg-blue-500 h-2 rounded transition-all"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
      <p class="text-sm text-gray-600">
        Generating PDF... {{ progress }}%
      </p>
    </div>

    <button @click="generatePDF" :disabled="isGenerating">
      Download PDF
    </button>
  </div>
</template>
```

## Advanced Examples

### Dynamic Content with Reactive State

```vue
<script setup>
import { ref } from 'vue';

const items = ref([
  { name: 'Item 1', price: 100 },
  { name: 'Item 2', price: 200 },
]);

const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
  filename: 'invoice.pdf',
  showPageNumbers: true,
});

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.price, 0)
);
</script>

<template>
  <div>
    <div ref="targetRef" class="w-[794px]">
      <h1>Invoice</h1>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in items" :key="i">
            <td>{{ item.name }}</td>
            <td>${{ item.price }}</td>
          </tr>
        </tbody>
      </table>
      <p class="font-bold">Total: ${{ total }}</p>
    </div>

    <button @click="generatePDF">
      {{ isGenerating ? 'Generating...' : 'Download Invoice' }}
    </button>
  </div>
</template>
```

### With Composition API and Computed

```vue
<script setup>
import { ref, computed } from 'vue';

const showDetails = ref(false);
const { targetRef, generatePDF } = usePDFGenerator({
  filename: 'document.pdf',
});

const buttonText = computed(() =>
  showDetails.value ? 'Detailed PDF' : 'Summary PDF'
);
</script>

<template>
  <div>
    <label>
      <input type="checkbox" v-model="showDetails" />
      Include detailed information
    </label>

    <div ref="targetRef">
      <h1>Report</h1>
      <p>Summary information...</p>

      <div v-if="showDetails">
        <h2>Detailed Information</h2>
        <p>Additional details...</p>
      </div>
    </div>

    <button @click="generatePDF">{{ buttonText }}</button>
  </div>
</template>
```

### Conditional Rendering for PDF

```vue
<script setup>
import { ref } from 'vue';

const includeLogo = ref(true);
const includeFooter = ref(true);

const { targetRef, generatePDF } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div>
    <div class="controls">
      <label>
        <input type="checkbox" v-model="includeLogo" />
        Include Logo
      </label>
      <label>
        <input type="checkbox" v-model="includeFooter" />
        Include Footer
      </label>
    </div>

    <div ref="targetRef">
      <img v-if="includeLogo" src="/logo.png" alt="Logo" />
      <h1>Content</h1>
      <p>Main content here...</p>
      <footer v-if="includeFooter">
        Footer information
      </footer>
    </div>

    <button @click="generatePDF">Download PDF</button>
  </div>
</template>
```

### With Pinia Store

```vue
<script setup>
import { useInvoiceStore } from '@/stores/invoice';

const invoiceStore = useInvoiceStore();
const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
  filename: `invoice-${invoiceStore.invoiceNumber}.pdf`,
  onComplete: () => {
    invoiceStore.markAsExported();
  },
});
</script>

<template>
  <div>
    <div ref="targetRef" class="w-[794px]">
      <h1>Invoice #{{ invoiceStore.invoiceNumber }}</h1>
      <div v-for="item in invoiceStore.items" :key="item.id">
        <p>{{ item.name }}: ${{ item.price }}</p>
      </div>
      <p class="font-bold">Total: ${{ invoiceStore.total }}</p>
    </div>

    <button @click="generatePDF" :disabled="isGenerating">
      Export Invoice
    </button>
  </div>
</template>
```

## TypeScript Support

Full TypeScript support with complete type definitions:

```vue
<script setup lang="ts">
import type {
  PDFGeneratorOptions,
  PDFGenerationResult,
  UsePDFGeneratorOptions,
} from '@encryptioner/html-to-pdf-generator/vue';

const options: UsePDFGeneratorOptions = {
  filename: 'document.pdf',
  format: 'a4',
  showPageNumbers: true,
};

const {
  targetRef,
  generatePDF,
  isGenerating,
  progress,
  error,
  result,
} = usePDFGenerator(options);

// Result type is fully typed
watchEffect(() => {
  if (result.value) {
    const pageCount: number = result.value.pageCount;
    const fileSize: number = result.value.fileSize;
    const generationTime: number = result.value.generationTime;
    console.log(`Generated ${pageCount} pages in ${generationTime}ms`);
  }
});
</script>
```

## Using with Nuxt 3

The library works seamlessly with Nuxt 3:

```vue
<script setup>
// Nuxt 3 - works in pages or components
const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <h1>Nuxt 3 PDF</h1>
      <p>Content here...</p>
    </div>
    <button @click="generatePDF" :disabled="isGenerating">
      Download
    </button>
  </div>
</template>
```

## Best Practices

### 1. Use Fixed Width Container

```vue
<template>
  <div ref="targetRef" class="w-[794px]"> <!-- A4 width -->
    <!-- Content -->
  </div>
</template>
```

### 2. Handle Loading States

```vue
<template>
  <button @click="generatePDF" :disabled="isGenerating">
    {{ isGenerating ? `${progress}%` : 'Download' }}
  </button>
</template>
```

### 3. Implement Error Handling

```vue
<script setup>
const { generatePDF, error } = usePDFGenerator({
  filename: 'document.pdf',
  onError: (err) => {
    console.error(err);
    toast.error('Failed to generate PDF');
  },
});
</script>

<template>
  <div v-if="error" class="error">
    {{ error.message }}
  </div>
</template>
```

### 4. Wait for Images to Load

```vue
<script setup>
import { onMounted } from 'vue';

const imagesLoaded = ref(false);

onMounted(async () => {
  const images = Array.from(document.images);
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    })
  );
  imagesLoaded.value = true;
});
</script>

<template>
  <button @click="generatePDF" :disabled="!imagesLoaded">
    Download PDF
  </button>
</template>
```

### 5. Optimize for Performance

```vue
<script setup>
const pdf = usePDFGenerator({
  filename: 'document.pdf',
  scale: 1.5,           // Lower for faster generation
  compress: true,       // Reduce file size
  imageQuality: 0.8,   // Balance quality/size
});
</script>
```

## Common Issues

### Issue: Ref is null

```vue
<!-- ❌ Wrong: ref on wrong element -->
<template>
  <div>
    <div ref="targetRef">Content</div>
  </div>
</template>

<!-- ✅ Correct -->
<template>
  <div ref="targetRef">Content</div>
</template>
```

### Issue: Styles not applied

```vue
<script setup>
import { onMounted } from 'vue';

onMounted(() => {
  // Ensure styles are loaded before generating
  // Wait a tick for Vue to apply styles
  nextTick(() => {
    console.log('Styles applied');
  });
});
</script>
```

### Issue: Content cut off

```vue
<template>
  <!-- Use fixed width matching PDF format -->
  <div ref="targetRef" style="width: 794px">
    Content
  </div>
</template>
```

## Lifecycle Integration

### Generate PDF on Mount

```vue
<script setup>
import { onMounted } from 'vue';

const { targetRef, generatePDF } = usePDFGenerator({
  filename: 'auto-generated.pdf',
});

onMounted(async () => {
  // Auto-generate on component mount
  await generatePDF();
});
</script>
```

### Generate Before Unmount

```vue
<script setup>
import { onBeforeUnmount } from 'vue';

const { targetRef, generateBlob } = usePDFGenerator({
  filename: 'document.pdf',
});

onBeforeUnmount(async () => {
  // Save PDF before component unmounts
  const blob = await generateBlob();
  // Upload or save blob
});
</script>
```

## Next Steps

- **[Image Handling](../features/images.md)** - Basic image handling to DPI control and print quality
- **[Options Reference](../api/options.md)** - Complete options documentation
- **[Code Examples](../examples/code-examples.md)** - Copy-paste ready samples
- **[Production Examples](../examples/production-examples.md)** - Real-world use cases
- **[Best Practices](./best-practices.md)** - Optimization tips

---

[← Back to Documentation](../index.md)
