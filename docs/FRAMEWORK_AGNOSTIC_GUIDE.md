# Making PDF Generator Framework-Agnostic & NPM-Ready

## Current State Analysis

### ✅ What's Already Framework-Agnostic
- **Core Library** (`core.ts`, `utils.ts`, `types.ts`) - Pure TypeScript, works everywhere
- **Vanilla JS API** - `generatePDF()` and `PDFGenerator` class work without any framework
- **Dependencies** - Only `jspdf` and `html2canvas` (both framework-agnostic)

### ❌ What Needs to be Fixed
1. **React hooks** (`hooks.ts`) - Currently bundled with core
2. **Dependencies** - Should be peerDependencies to avoid conflicts
3. **Node version** - Not specified in package.json
4. **Module exports** - Need separate entry points for different frameworks

---

## Solution Architecture

### 1. Package Structure for NPM

```
pdf-generator/
├── package.json              # Main package config
├── README.md                 # Usage guide
├── LICENSE
├── dist/                     # Built files
│   ├── core.js              # Vanilla JS/TS bundle
│   ├── core.d.ts            # TypeScript definitions
│   ├── react.js             # React adapter
│   ├── react.d.ts
│   ├── vue.js               # Vue adapter
│   ├── vue.d.ts
│   └── svelte.js            # Svelte adapter
├── src/
│   ├── core/                # Framework-agnostic core
│   │   ├── index.ts
│   │   ├── PDFGenerator.ts
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   ├── image-handler.ts
│   │   ├── table-handler.ts
│   │   └── page-break-handler.ts
│   ├── adapters/            # Framework adapters
│   │   ├── react/
│   │   │   ├── index.ts
│   │   │   └── usePDFGenerator.ts
│   │   ├── vue/
│   │   │   ├── index.ts
│   │   │   └── usePDFGenerator.ts
│   │   └── svelte/
│   │       ├── index.ts
│   │       └── pdfGenerator.ts
│   └── index.ts             # Main entry (core only)
└── examples/                # Usage examples
    ├── vanilla/
    ├── react/
    ├── vue/
    └── svelte/
```

### 2. Package.json Configuration

```json
{
  "name": "@encryptioner/html-to-pdf-generator",
  "version": "1.0.0",
  "description": "Framework-agnostic PDF generator from HTML",
  "type": "module",

  "engines": {
    "node": ">=16.0.0"
  },

  "exports": {
    ".": {
      "types": "./dist/core.d.ts",
      "import": "./dist/core.js",
      "require": "./dist/core.cjs"
    },
    "./react": {
      "types": "./dist/react.d.ts",
      "import": "./dist/react.js",
      "require": "./dist/react.cjs"
    },
    "./vue": {
      "types": "./dist/vue.d.ts",
      "import": "./dist/vue.js",
      "require": "./dist/vue.cjs"
    },
    "./svelte": {
      "types": "./dist/svelte.d.ts",
      "import": "./dist/svelte.js",
      "require": "./dist/svelte.cjs"
    }
  },

  "main": "./dist/core.cjs",
  "module": "./dist/core.js",
  "types": "./dist/core.d.ts",

  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],

  "peerDependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.2 || ^3.0.0",
    "react": ">=18.0.0",
    "vue": ">=3.0.0"
  },

  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "vue": {
      "optional": true
    }
  },

  "devDependencies": {
    "@types/react": "^18.0.0",
    "html2canvas": "^1.4.1",
    "jspdf": "^3.0.3",
    "react": "^18.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vue": "^3.0.0"
  },

  "scripts": {
    "build": "tsup",
    "prepublishOnly": "pnpm build"
  },

  "keywords": [
    "pdf",
    "generator",
    "html2pdf",
    "html2canvas",
    "jspdf",
    "react",
    "vue",
    "svelte",
    "framework-agnostic"
  ]
}
```

### 3. Dependency Isolation Strategy

#### Why peerDependencies?
- **Avoids version conflicts**: Project uses its own version of React/Vue
- **Reduces bundle size**: Doesn't duplicate dependencies
- **Compatibility**: Works with project's existing dependencies

#### Implementation
```json
{
  "peerDependencies": {
    "html2canvas": "^1.4.1",
    "jspdf": "^2.5.2 || ^3.0.0"
  }
}
```

This means:
- ✅ User must install `jspdf` and `html2canvas` themselves
- ✅ User controls the exact version
- ✅ No conflicts with existing dependencies
- ✅ Package manager warns if versions are incompatible

### 4. Node Version Compatibility

#### Recommended Strategy
```json
{
  "engines": {
    "node": ">=16.0.0"
  }
}
```

**Why Node 16+?**
- ESM support is stable
- Modern JavaScript features (optional chaining, nullish coalescing)
- Wide adoption (Node 16, 18, 20 LTS)
- Covers 95%+ of use cases

**Version Range Support:**
```json
{
  "engines": {
    "node": ">=16.0.0 <=22.x"
  }
}
```

---

## Implementation Steps

### Step 1: Reorganize File Structure

**Create separate entry points:**

```typescript
// src/core/index.ts (framework-agnostic)
export { PDFGenerator, generatePDF, generatePDFBlob } from './PDFGenerator';
export type { PDFGeneratorOptions } from './types';
export * from './utils';

// src/adapters/react/index.ts (React-specific)
export { usePDFGenerator, usePDFGeneratorManual } from './usePDFGenerator';

// src/adapters/vue/index.ts (Vue-specific)
export { usePDFGenerator } from './usePDFGenerator';

// src/adapters/svelte/index.ts (Svelte-specific)
export { createPDFGenerator } from './pdfGenerator';
```

### Step 2: Create Framework Adapters

#### React Adapter (Already Exists)
```typescript
// src/adapters/react/usePDFGenerator.ts
import { useRef, useState, useCallback } from 'react';
import { PDFGenerator } from '../../core';

export function usePDFGenerator(options) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // ... existing implementation
}
```

#### Vue 3 Adapter (New)
```typescript
// src/adapters/vue/usePDFGenerator.ts
import { ref, Ref } from 'vue';
import { PDFGenerator } from '../../core';
import type { PDFGeneratorOptions } from '../../core';

export interface UsePDFGeneratorOptions extends Partial<PDFGeneratorOptions> {
  filename?: string;
}

export function usePDFGenerator(options: UsePDFGeneratorOptions = {}) {
  const targetRef = ref<HTMLElement | null>(null);
  const isGenerating = ref(false);
  const progress = ref(0);
  const error = ref<Error | null>(null);
  const result = ref(null);

  const generator = new PDFGenerator({
    ...options,
    onProgress: (p) => {
      progress.value = p;
      options.onProgress?.(p);
    },
    onError: (e) => {
      error.value = e;
      options.onError?.(e);
    },
  });

  const generatePDF = async () => {
    if (!targetRef.value) return null;

    try {
      isGenerating.value = true;
      error.value = null;

      const res = await generator.generatePDF(
        targetRef.value,
        options.filename || 'document.pdf'
      );

      result.value = res;
      return res;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  const generateBlob = async () => {
    if (!targetRef.value) return null;

    try {
      isGenerating.value = true;
      error.value = null;
      return await generator.generateBlob(targetRef.value);
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      return null;
    } finally {
      isGenerating.value = false;
    }
  };

  const reset = () => {
    progress.value = 0;
    error.value = null;
    result.value = null;
  };

  return {
    targetRef,
    generatePDF,
    generateBlob,
    isGenerating,
    progress,
    error,
    result,
    reset,
  };
}
```

#### Svelte Adapter (New)
```typescript
// src/adapters/svelte/pdfGenerator.ts
import { writable, derived } from 'svelte/store';
import { PDFGenerator } from '../../core';
import type { PDFGeneratorOptions } from '../../core';

export interface SveltePDFGeneratorOptions extends Partial<PDFGeneratorOptions> {
  filename?: string;
}

export function createPDFGenerator(options: SveltePDFGeneratorOptions = {}) {
  const isGenerating = writable(false);
  const progress = writable(0);
  const error = writable<Error | null>(null);
  const result = writable(null);

  const generator = new PDFGenerator({
    ...options,
    onProgress: (p) => {
      progress.set(p);
      options.onProgress?.(p);
    },
    onError: (e) => {
      error.set(e);
      options.onError?.(e);
    },
  });

  const generatePDF = async (element: HTMLElement) => {
    try {
      isGenerating.set(true);
      error.set(null);

      const res = await generator.generatePDF(
        element,
        options.filename || 'document.pdf'
      );

      result.set(res);
      return res;
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.set(err);
      return null;
    } finally {
      isGenerating.set(false);
    }
  };

  const generateBlob = async (element: HTMLElement) => {
    try {
      isGenerating.set(true);
      error.set(null);
      return await generator.generateBlob(element);
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e));
      error.set(err);
      return null;
    } finally {
      isGenerating.set(false);
    }
  };

  const reset = () => {
    progress.set(0);
    error.set(null);
    result.set(null);
  };

  return {
    generatePDF,
    generateBlob,
    isGenerating,
    progress,
    error,
    result,
    reset,
  };
}
```

### Step 3: Configure Build System (tsup)

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig([
  // Core bundle (framework-agnostic)
  {
    entry: {
      core: 'src/core/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    external: ['jspdf', 'html2canvas'],
    treeshake: true,
    splitting: false,
  },
  // React adapter
  {
    entry: {
      react: 'src/adapters/react/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['react', 'jspdf', 'html2canvas'],
  },
  // Vue adapter
  {
    entry: {
      vue: 'src/adapters/vue/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['vue', 'jspdf', 'html2canvas'],
  },
  // Svelte adapter
  {
    entry: {
      svelte: 'src/adapters/svelte/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    external: ['svelte', 'svelte/store', 'jspdf', 'html2canvas'],
  },
]);
```

---

## Usage Examples

### Vanilla JavaScript
```javascript
import { generatePDF, PDFGenerator } from '@encryptioner/html-to-pdf-generator';

// Quick usage
const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  format: 'a4',
  orientation: 'portrait',
});

// Advanced usage
const generator = new PDFGenerator({
  format: 'a4',
  margins: [10, 10, 10, 10],
  onProgress: (progress) => console.log(`${progress}%`),
});

const result = await generator.generatePDF(element, 'document.pdf');
console.log(`Generated ${result.pageCount} pages`);
```

### React
```tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'my-document.pdf',
    format: 'a4',
  });

  return (
    <div>
      <div ref={targetRef}>
        {/* Your content */}
      </div>
      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `Generating... ${progress}%` : 'Download PDF'}
      </button>
    </div>
  );
}
```

### Vue 3
```vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const {
  targetRef,
  generatePDF,
  isGenerating,
  progress,
} = usePDFGenerator({
  filename: 'my-document.pdf',
  format: 'a4',
});
</script>

<template>
  <div>
    <div ref="targetRef">
      <!-- Your content -->
    </div>
    <button @click="generatePDF" :disabled="isGenerating">
      {{ isGenerating ? `Generating... ${progress}%` : 'Download PDF' }}
    </button>
  </div>
</template>
```

### Svelte
```svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;

  const {
    generatePDF,
    isGenerating,
    progress,
  } = createPDFGenerator({
    filename: 'my-document.pdf',
    format: 'a4',
  });

  const handleDownload = () => {
    if (targetElement) {
      generatePDF(targetElement);
    }
  };
</script>

<div bind:this={targetElement}>
  <!-- Your content -->
</div>

<button on:click={handleDownload} disabled={$isGenerating}>
  {$isGenerating ? `Generating... ${$progress}%` : 'Download PDF'}
</button>
```

---

## Installation Instructions

### For Vanilla JS/TypeScript Projects
```bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
```

### For React Projects
```bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
# React is already installed in your project
```

### For Vue Projects
```bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
# Vue is already installed in your project
```

### For Svelte Projects
```bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
# Svelte is already in your project
```

---

## Testing Node Version Compatibility

### Create Test Matrix

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x, 22.x]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm install
      - run: npm run build
      - run: npm test
```

---

## Migration Checklist

- [ ] Move `hooks.ts` to `src/adapters/react/`
- [ ] Create Vue adapter in `src/adapters/vue/`
- [ ] Create Svelte adapter in `src/adapters/svelte/`
- [ ] Update `package.json` with peerDependencies
- [ ] Add `engines` field for Node version
- [ ] Configure `tsup` for multi-entry bundling
- [ ] Update main `index.ts` to export only core
- [ ] Create separate entry points in `exports` field
- [ ] Write usage examples for each framework
- [ ] Test with Node 16, 18, 20, 22
- [ ] Publish to NPM with proper tags

---

## Benefits

- ✅ **No Version Conflicts**: Uses project's own dependencies
- ✅ **Smaller Bundle**: No duplicate dependencies
- ✅ **Framework Agnostic**: Works with any framework or vanilla JS
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Tree Shakeable**: Import only what you need
- ✅ **Future Proof**: Easy to add more framework adapters
- ✅ **Wide Node Support**: Works with Node 16-22
