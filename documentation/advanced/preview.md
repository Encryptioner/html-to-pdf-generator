# PDF Preview

Display a real-time preview of your PDF before downloading, with optional live updates as content changes.

## Overview

The HTML to PDF Generator includes a built-in preview feature that:

- Shows a live preview of the PDF in an iframe
- Automatically updates when content changes (optional)
- Uses debouncing to optimize performance
- Supports configurable quality settings for faster rendering
- Properly manages resources (cleanup blob URLs, disconnect observers)

## Basic Usage

### Vanilla JavaScript/TypeScript

```typescript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

// Create generator with preview options
const generator = new PDFGenerator({
  format: 'a4',
  previewOptions: {
    containerId: 'pdf-preview',  // Required: ID of container element
    liveUpdate: true,            // Enable automatic updates
    debounce: 500,               // Wait 500ms after changes before updating
    scale: 1,                    // Lower scale for faster preview
    quality: 0.7                 // Lower quality for faster preview
  }
});

// Start preview
const contentElement = document.getElementById('content');
await generator.startPreview(contentElement);

// Later: manually update preview
await generator.updatePreview();

// Stop preview when done
generator.stopPreview();
```

### HTML Structure

```html
<!-- Content to preview -->
<div id="content">
  <h1>My Document</h1>
  <p>This content will be previewed as a PDF</p>
</div>

<!-- Preview container -->
<div id="pdf-preview" style="width: 100%; height: 600px; border: 1px solid #ccc;"></div>

<!-- Controls -->
<button onclick="startPreview()">Start Preview</button>
<button onclick="stopPreview()">Stop Preview</button>
<button onclick="updatePreview()">Update Preview</button>
<button onclick="downloadPDF()">Download PDF</button>
```

### Complete Example

```typescript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

let generator: PDFGenerator;

// Initialize
function init() {
  generator = new PDFGenerator({
    format: 'a4',
    margins: [10, 10, 10, 10],
    previewOptions: {
      containerId: 'pdf-preview',
      liveUpdate: true,
      debounce: 500,
      scale: 1,
      quality: 0.7
    }
  });
}

// Start preview
async function startPreview() {
  const element = document.getElementById('content');
  if (element) {
    await generator.startPreview(element as HTMLElement);
    console.log('Preview started');
  }
}

// Stop preview
function stopPreview() {
  generator.stopPreview();
  console.log('Preview stopped');
}

// Manual update
async function updatePreview() {
  await generator.updatePreview();
  console.log('Preview updated');
}

// Download final PDF
async function downloadPDF() {
  const element = document.getElementById('content');
  if (element) {
    // Stop preview first
    generator.stopPreview();

    // Generate high-quality PDF with original settings
    await generator.generatePDF(element as HTMLElement, 'document.pdf');
  }
}

// Initialize on page load
init();
```

## React Integration

```tsx
import { useState, useRef, useEffect } from 'react';
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

function PDFPreviewComponent() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [generator] = useState(() => new PDFGenerator({
    format: 'a4',
    previewOptions: {
      containerId: 'pdf-preview',
      liveUpdate: true,
      debounce: 500,
      scale: 1,
      quality: 0.7
    }
  }));
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [content, setContent] = useState('Edit this text to see live preview updates');

  const startPreview = async () => {
    if (contentRef.current) {
      await generator.startPreview(contentRef.current);
      setIsPreviewActive(true);
    }
  };

  const stopPreview = () => {
    generator.stopPreview();
    setIsPreviewActive(false);
  };

  const downloadPDF = async () => {
    if (contentRef.current) {
      stopPreview();
      await generator.generatePDF(contentRef.current, 'document.pdf');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      generator.stopPreview();
    };
  }, [generator]);

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Content */}
      <div style={{ flex: 1 }}>
        <h2>Content</h2>
        <div ref={contentRef} style={{ padding: '20px', border: '1px solid #ccc' }}>
          <h1>My Document</h1>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', minHeight: '200px' }}
          />
        </div>

        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button onClick={startPreview} disabled={isPreviewActive}>
            Start Preview
          </button>
          <button onClick={stopPreview} disabled={!isPreviewActive}>
            Stop Preview
          </button>
          <button onClick={() => generator.updatePreview()}>
            Update Preview
          </button>
          <button onClick={downloadPDF}>
            Download PDF
          </button>
        </div>
      </div>

      {/* Preview */}
      <div style={{ flex: 1 }}>
        <h2>Preview</h2>
        <div
          id="pdf-preview"
          style={{
            width: '100%',
            height: '600px',
            border: '1px solid #ccc',
            backgroundColor: '#f5f5f5'
          }}
        />
      </div>
    </div>
  );
}

export default PDFPreviewComponent;
```

## Vue 3 Integration

```vue
<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

const contentRef = ref<HTMLElement | null>(null);
const isPreviewActive = ref(false);
const content = ref('Edit this text to see live preview updates');

const generator = new PDFGenerator({
  format: 'a4',
  previewOptions: {
    containerId: 'pdf-preview',
    liveUpdate: true,
    debounce: 500,
    scale: 1,
    quality: 0.7
  }
});

async function startPreview() {
  if (contentRef.value) {
    await generator.startPreview(contentRef.value);
    isPreviewActive.value = true;
  }
}

function stopPreview() {
  generator.stopPreview();
  isPreviewActive.value = false;
}

async function downloadPDF() {
  if (contentRef.value) {
    stopPreview();
    await generator.generatePDF(contentRef.value, 'document.pdf');
  }
}

// Cleanup on unmount
onUnmounted(() => {
  generator.stopPreview();
});
</script>

<template>
  <div style="display: flex; gap: 20px">
    <!-- Content -->
    <div style="flex: 1">
      <h2>Content</h2>
      <div ref="contentRef" style="padding: 20px; border: 1px solid #ccc">
        <h1>My Document</h1>
        <textarea
          v-model="content"
          style="width: 100%; min-height: 200px"
        />
      </div>

      <div style="margin-top: 10px; display: flex; gap: 10px">
        <button @click="startPreview" :disabled="isPreviewActive">
          Start Preview
        </button>
        <button @click="stopPreview" :disabled="!isPreviewActive">
          Stop Preview
        </button>
        <button @click="generator.updatePreview()">
          Update Preview
        </button>
        <button @click="downloadPDF">
          Download PDF
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div style="flex: 1">
      <h2>Preview</h2>
      <div
        id="pdf-preview"
        style="width: 100%; height: 600px; border: 1px solid #ccc; background-color: #f5f5f5"
      />
    </div>
  </div>
</template>
```

## Svelte Integration

```svelte
<script lang="ts">
  import { onDestroy } from 'svelte';
  import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

  let contentElement: HTMLElement;
  let isPreviewActive = false;
  let content = 'Edit this text to see live preview updates';

  const generator = new PDFGenerator({
    format: 'a4',
    previewOptions: {
      containerId: 'pdf-preview',
      liveUpdate: true,
      debounce: 500,
      scale: 1,
      quality: 0.7
    }
  });

  async function startPreview() {
    if (contentElement) {
      await generator.startPreview(contentElement);
      isPreviewActive = true;
    }
  }

  function stopPreview() {
    generator.stopPreview();
    isPreviewActive = false;
  }

  async function downloadPDF() {
    if (contentElement) {
      stopPreview();
      await generator.generatePDF(contentElement, 'document.pdf');
    }
  }

  // Cleanup on destroy
  onDestroy(() => {
    generator.stopPreview();
  });
</script>

<div style="display: flex; gap: 20px">
  <!-- Content -->
  <div style="flex: 1">
    <h2>Content</h2>
    <div bind:this={contentElement} style="padding: 20px; border: 1px solid #ccc">
      <h1>My Document</h1>
      <textarea
        bind:value={content}
        style="width: 100%; min-height: 200px"
      />
    </div>

    <div style="margin-top: 10px; display: flex; gap: 10px">
      <button on:click={startPreview} disabled={isPreviewActive}>
        Start Preview
      </button>
      <button on:click={stopPreview} disabled={!isPreviewActive}>
        Stop Preview
      </button>
      <button on:click={() => generator.updatePreview()}>
        Update Preview
      </button>
      <button on:click={downloadPDF}>
        Download PDF
      </button>
    </div>
  </div>

  <!-- Preview -->
  <div style="flex: 1">
    <h2>Preview</h2>
    <div
      id="pdf-preview"
      style="width: 100%; height: 600px; border: 1px solid #ccc; background-color: #f5f5f5"
    />
  </div>
</div>
```

## API Reference

### PreviewOptions

```typescript
interface PreviewOptions {
  /** Container element ID where preview iframe will be inserted (required) */
  containerId: string;

  /** Enable live preview updates when content changes (default: false) */
  liveUpdate?: boolean;

  /** Debounce delay in milliseconds for live updates (default: 500) */
  debounce?: number;

  /** Preview quality 0-1, lower = faster (default: 0.7) */
  quality?: number;

  /** Scale factor for preview, lower = faster (default: 1) */
  scale?: number;
}
```

### Methods

#### `startPreview(element: HTMLElement): Promise<void>`

Start PDF preview for the given element.

**Parameters:**
- `element` - The HTML element to preview as PDF

**Throws:**
- Error if `previewOptions` not configured
- Error if container element not found

**Example:**
```typescript
const generator = new PDFGenerator({
  previewOptions: { containerId: 'preview' }
});
await generator.startPreview(document.getElementById('content'));
```

#### `stopPreview(): void`

Stop preview and cleanup resources (blob URLs, observers, timers).

**Example:**
```typescript
generator.stopPreview();
```

#### `updatePreview(): Promise<void>`

Manually update the preview (useful when `liveUpdate: false`).

**Example:**
```typescript
await generator.updatePreview();
```

#### `isPreviewRunning(): boolean`

Check if preview is currently active.

**Returns:** `true` if preview is active, `false` otherwise

**Example:**
```typescript
if (generator.isPreviewRunning()) {
  console.log('Preview is active');
}
```

## Configuration Examples

### Basic Preview (No Auto-Update)

```typescript
previewOptions: {
  containerId: 'pdf-preview',
  liveUpdate: false  // Manual updates only
}
```

### Live Preview with Fast Updates

```typescript
previewOptions: {
  containerId: 'pdf-preview',
  liveUpdate: true,
  debounce: 300,      // Update 300ms after changes stop
  scale: 1,           // Lower scale for speed
  quality: 0.6        // Lower quality for speed
}
```

### High-Quality Preview

```typescript
previewOptions: {
  containerId: 'pdf-preview',
  liveUpdate: true,
  debounce: 1000,     // Wait longer between updates
  scale: 2,           // Higher scale for quality
  quality: 0.9        // Higher quality
}
```

### Balanced Performance

```typescript
previewOptions: {
  containerId: 'pdf-preview',
  liveUpdate: true,
  debounce: 500,      // Default debounce
  scale: 1,           // Default preview scale
  quality: 0.7        // Default preview quality
}
```

## Performance Tips

### 1. Use Lower Quality for Preview

The preview doesn't need to be as high quality as the final PDF:

```typescript
// Preview settings
previewOptions: {
  scale: 1,           // vs 2 for final PDF
  quality: 0.7        // vs 0.85 for final PDF
}
```

### 2. Increase Debounce for Complex Content

If your content has many elements or complex layouts:

```typescript
previewOptions: {
  debounce: 1000      // Wait 1 second after changes
}
```

### 3. Disable Live Updates for Large Documents

For very large documents, use manual updates:

```typescript
previewOptions: {
  liveUpdate: false   // Call updatePreview() manually
}
```

### 4. Stop Preview Before Downloading

Always stop the preview before generating the final PDF:

```typescript
async function downloadPDF() {
  generator.stopPreview();  // Stop preview first
  await generator.generatePDF(element, 'document.pdf');
}
```

## Common Patterns

### Editor with Live Preview

```typescript
// Setup
const generator = new PDFGenerator({
  previewOptions: {
    containerId: 'preview',
    liveUpdate: true,
    debounce: 500
  }
});

// Start preview when editor loads
await generator.startPreview(editorElement);

// Preview automatically updates as user edits
// No manual updates needed
```

### Manual Update on Button Click

```typescript
// Setup with manual updates
const generator = new PDFGenerator({
  previewOptions: {
    containerId: 'preview',
    liveUpdate: false  // Disable auto-update
  }
});

await generator.startPreview(contentElement);

// Update when user clicks button
document.getElementById('update-btn').addEventListener('click', async () => {
  await generator.updatePreview();
});
```

### Preview Toggle

```typescript
let isPreviewShowing = false;

async function togglePreview() {
  if (isPreviewShowing) {
    generator.stopPreview();
    isPreviewShowing = false;
  } else {
    await generator.startPreview(contentElement);
    isPreviewShowing = true;
  }
}
```

## Troubleshooting

### Preview Not Showing

**Issue**: Preview container is empty.

**Solutions**:
- Ensure container ID matches: `previewOptions.containerId`
- Check container exists in DOM before calling `startPreview()`
- Verify element being previewed is visible and has content

### Preview Not Updating

**Issue**: Changes to content don't trigger preview updates.

**Solutions**:
- Ensure `liveUpdate: true` is set
- Check that changes are happening to the observed element or its descendants
- Try calling `updatePreview()` manually to verify the update mechanism works

### Slow Preview Updates

**Issue**: Preview takes too long to update.

**Solutions**:
- Reduce `scale` (default preview uses 1 vs 2 for final)
- Reduce `quality` (default preview uses 0.7 vs 0.85 for final)
- Increase `debounce` to wait longer before updating
- Simplify content or reduce image sizes

### Memory Leaks

**Issue**: Browser memory usage increases over time.

**Solutions**:
- Always call `stopPreview()` when done
- Call `stopPreview()` before starting a new preview
- Call `stopPreview()` in cleanup/unmount handlers

**Example cleanup:**
```typescript
// React
useEffect(() => {
  return () => generator.stopPreview();
}, []);

// Vue
onUnmounted(() => generator.stopPreview());

// Svelte
onDestroy(() => generator.stopPreview());
```

## Best Practices

### 1. Always Cleanup

```typescript
// React
useEffect(() => {
  return () => generator.stopPreview();
}, [generator]);

// Vue
onUnmounted(() => generator.stopPreview());

// Svelte
onDestroy(() => generator.stopPreview());
```

### 2. Stop Before Final Generation

```typescript
async function download() {
  generator.stopPreview();  // Stop preview first
  await generator.generatePDF(element, 'final.pdf');
}
```

### 3. Use Different Quality Settings

```typescript
const generator = new PDFGenerator({
  // High quality for final PDF
  scale: 2,
  imageQuality: 0.85,

  // Lower quality for fast preview
  previewOptions: {
    scale: 1,
    quality: 0.7,
    // ...
  }
});
```

### 4. Optimize Debounce

```typescript
// Fast updates for small content
debounce: 300

// Balanced for most use cases
debounce: 500

// Slower updates for complex content
debounce: 1000
```

## Limitations

1. **Browser Only**: Preview feature only works in browser environments (not Node.js)
2. **Resource Usage**: Live preview continuously regenerates PDF, using CPU and memory
3. **Performance**: Large or complex documents may cause lag during updates
4. **PDF Reader Required**: Browser must support displaying PDFs in iframes

## Related Documentation

- [API Options](../api/options.md) - Complete options reference
- [Getting Started](../guides/getting-started.md) - Basic usage
- [React Guide](../guides/react-guide.md) - React integration
- [Vue Guide](../guides/vue-guide.md) - Vue integration
- [Svelte Guide](../guides/svelte-guide.md) - Svelte integration

## Support

- [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- [NPM Package](https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator)
