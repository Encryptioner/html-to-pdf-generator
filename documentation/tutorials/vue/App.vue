<!--
  Vue 3 Example - PDF Generator Usage

  This example shows how to use the PDF generator in Vue 3
-->

<script setup lang="ts">
import { usePDFGenerator, usePDFGeneratorManual } from '@encryptioner/html-to-pdf-generator/vue';
import { ref } from 'vue';

// ===== BASIC USAGE =====

const {
  targetRef: basicRef,
  generatePDF: generateBasicPDF,
  isGenerating: isBasicGenerating,
  progress: basicProgress,
  error: basicError,
} = usePDFGenerator({
  filename: 'my-document.pdf',
  format: 'a4',
  orientation: 'portrait',
});

// ===== ADVANCED USAGE =====

const {
  targetRef: advancedRef,
  generatePDF: generateAdvancedPDF,
  generateBlob: generateAdvancedBlob,
  isGenerating: isAdvancedGenerating,
  progress: advancedProgress,
  result: advancedResult,
  error: advancedError,
  reset: resetAdvanced,
} = usePDFGenerator({
  filename: 'invoice.pdf',
  format: 'a4',
  scale: 3,
  imageQuality: 0.95,
  onProgress: (p) => console.log(`Progress: ${p}%`),
  onComplete: (blob) => console.log(`PDF size: ${blob.size} bytes`),
});

const handleUpload = async () => {
  const blob = await generateAdvancedBlob();
  if (!blob) return;

  const formData = new FormData();
  formData.append('pdf', blob, 'document.pdf');

  await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
};

// ===== MANUAL MODE =====

const {
  generatePDF: generateManualPDF,
  isGenerating: isManualGenerating,
  progress: manualProgress,
} = usePDFGeneratorManual({
  format: 'a4',
});

const handleExport = async (contentId: string) => {
  const element = document.getElementById(contentId);
  if (element) {
    await generateManualPDF(element, `${contentId}.pdf`);
  }
};

// ===== PREVIEW MODAL =====

const showPreview = ref(false);
const {
  targetRef: previewRef,
  generatePDF: generatePreviewPDF,
  isGenerating: isPreviewGenerating,
  progress: previewProgress,
} = usePDFGenerator({
  filename: 'document.pdf',
});
</script>

<template>
  <div class="app">
    <h1>PDF Generator Examples</h1>

    <!-- BASIC EXAMPLE -->
    <section class="example">
      <h2>Basic Example</h2>

      <div ref="basicRef" class="content">
        <h3>My Document</h3>
        <p>This content will be converted to PDF</p>
      </div>

      <button @click="generateBasicPDF" :disabled="isBasicGenerating">
        {{ isBasicGenerating ? `Generating... ${basicProgress}%` : 'Download PDF' }}
      </button>

      <div v-if="basicError" class="error">
        Error: {{ basicError.message }}
      </div>
    </section>

    <!-- ADVANCED EXAMPLE -->
    <section class="example">
      <h2>Advanced Example</h2>

      <div
        ref="advancedRef"
        class="content"
        style="width: 794px; padding: 40px; background-color: white"
      >
        <header>
          <h3>Invoice #12345</h3>
          <p>Date: {{ new Date().toLocaleDateString() }}</p>
        </header>

        <main>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product A</td>
                <td>2</td>
                <td>$50.00</td>
              </tr>
            </tbody>
          </table>
        </main>

        <footer>
          <p>Total: $100.00</p>
        </footer>
      </div>

      <div class="controls">
        <button @click="generateAdvancedPDF" :disabled="isAdvancedGenerating">
          <span v-if="isAdvancedGenerating" class="spinner"></span>
          {{ isAdvancedGenerating ? `Generating ${advancedProgress}%` : 'Download PDF' }}
        </button>

        <button @click="handleUpload" :disabled="isAdvancedGenerating">
          Upload PDF
        </button>

        <button @click="resetAdvanced" :disabled="isAdvancedGenerating">
          Reset
        </button>
      </div>

      <div v-if="advancedResult" class="success">
        PDF generated successfully!<br />
        Pages: {{ advancedResult.pageCount }}<br />
        Size: {{ (advancedResult.fileSize / 1024).toFixed(2) }} KB<br />
        Time: {{ advancedResult.generationTime.toFixed(0) }}ms
      </div>

      <div v-if="advancedError" class="error">
        Error: {{ advancedError.message }}
      </div>
    </section>

    <!-- MANUAL MODE EXAMPLE -->
    <section class="example">
      <h2>Manual Mode Example</h2>

      <div id="content1" class="content">
        <h3>Content 1</h3>
        <p>This is the first content block</p>
      </div>

      <div id="content2" class="content">
        <h3>Content 2</h3>
        <p>This is the second content block</p>
      </div>

      <button @click="handleExport('content1')" :disabled="isManualGenerating">
        Export Content 1
      </button>

      <button @click="handleExport('content2')" :disabled="isManualGenerating">
        Export Content 2
      </button>

      <p v-if="isManualGenerating">Generating... {{ manualProgress }}%</p>
    </section>

    <!-- PREVIEW MODAL EXAMPLE -->
    <section class="example">
      <h2>Preview Modal Example</h2>

      <button @click="showPreview = true">Preview Document</button>

      <div v-if="showPreview" class="modal">
        <div class="modal-content">
          <div class="preview">
            <div ref="previewRef">
              <h3>Document Preview</h3>
              <p>This is what will be converted to PDF</p>
            </div>
          </div>

          <div class="modal-actions">
            <button @click="showPreview = false">Close</button>
            <button @click="generatePreviewPDF" :disabled="isPreviewGenerating">
              {{ isPreviewGenerating ? `Downloading ${previewProgress}%` : 'Download PDF' }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
}

.example {
  margin-bottom: 40px;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
}

.content {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 4px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
  padding: 10px;
  background-color: #fee;
  border-radius: 4px;
}

.success {
  color: green;
  margin-top: 10px;
  padding: 10px;
  background-color: #efe;
  border-radius: 4px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.preview {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.spinner {
  display: inline-block;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
