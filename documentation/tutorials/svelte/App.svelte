<!--
  Svelte Example - PDF Generator Usage

  This example shows how to use the PDF generator in Svelte
-->

<script lang="ts">
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  // ===== BASIC USAGE =====

  let basicElement: HTMLElement;
  const basic = createPDFGenerator({
    filename: 'my-document.pdf',
    format: 'a4',
    orientation: 'portrait',
  });

  const handleBasicDownload = () => {
    if (basicElement) {
      basic.generatePDF(basicElement);
    }
  };

  // ===== ADVANCED USAGE =====

  let advancedElement: HTMLElement;
  const advanced = createPDFGenerator({
    filename: 'invoice.pdf',
    format: 'a4',
    scale: 3,
    imageQuality: 0.95,
    onProgress: (p) => console.log(`Progress: ${p}%`),
    onComplete: (blob) => console.log(`PDF size: ${blob.size} bytes`),
  });

  const handleAdvancedDownload = () => {
    if (advancedElement) {
      advanced.generatePDF(advancedElement);
    }
  };

  const handleUpload = async () => {
    if (!advancedElement) return;

    const blob = await advanced.generateBlob(advancedElement);
    if (!blob) return;

    const formData = new FormData();
    formData.append('pdf', blob, 'document.pdf');

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  // ===== MANUAL MODE =====

  const manual = createPDFGenerator({
    format: 'a4',
  });

  const handleExport = async (contentId: string) => {
    const element = document.getElementById(contentId);
    if (element) {
      await manual.generatePDF(element);
    }
  };

  // ===== PREVIEW MODAL =====

  let showPreview = false;
  let previewElement: HTMLElement;
  const preview = createPDFGenerator({
    filename: 'document.pdf',
  });

  const handlePreviewDownload = () => {
    if (previewElement) {
      preview.generatePDF(previewElement);
    }
  };
</script>

<div class="app">
  <h1>PDF Generator Examples</h1>

  <!-- BASIC EXAMPLE -->
  <section class="example">
    <h2>Basic Example</h2>

    <div bind:this={basicElement} class="content">
      <h3>My Document</h3>
      <p>This content will be converted to PDF</p>
    </div>

    <button on:click={handleBasicDownload} disabled={$basic.isGenerating}>
      {$basic.isGenerating ? `Generating... ${$basic.progress}%` : 'Download PDF'}
    </button>

    {#if $basic.error}
      <div class="error">
        Error: {$basic.error.message}
      </div>
    {/if}
  </section>

  <!-- ADVANCED EXAMPLE -->
  <section class="example">
    <h2>Advanced Example</h2>

    <div
      bind:this={advancedElement}
      class="content"
      style="width: 794px; padding: 40px; background-color: white;"
    >
      <header>
        <h3>Invoice #12345</h3>
        <p>Date: {new Date().toLocaleDateString()}</p>
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
      <button on:click={handleAdvancedDownload} disabled={$advanced.isGenerating}>
        {#if $advanced.isGenerating}
          <span class="spinner"></span>
          Generating {$advanced.progress}%
        {:else}
          Download PDF
        {/if}
      </button>

      <button on:click={handleUpload} disabled={$advanced.isGenerating}>
        Upload PDF
      </button>

      <button on:click={advanced.reset} disabled={$advanced.isGenerating}>
        Reset
      </button>
    </div>

    {#if $advanced.result}
      <div class="success">
        PDF generated successfully!<br />
        Pages: {$advanced.result.pageCount}<br />
        Size: {($advanced.result.fileSize / 1024).toFixed(2)} KB<br />
        Time: {$advanced.result.generationTime.toFixed(0)}ms
      </div>
    {/if}

    {#if $advanced.error}
      <div class="error">
        Error: {$advanced.error.message}
      </div>
    {/if}
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

    <button on:click={() => handleExport('content1')} disabled={$manual.isGenerating}>
      Export Content 1
    </button>

    <button on:click={() => handleExport('content2')} disabled={$manual.isGenerating}>
      Export Content 2
    </button>

    {#if $manual.isGenerating}
      <p>Generating... {$manual.progress}%</p>
    {/if}
  </section>

  <!-- PREVIEW MODAL EXAMPLE -->
  <section class="example">
    <h2>Preview Modal Example</h2>

    <button on:click={() => (showPreview = true)}>Preview Document</button>

    {#if showPreview}
      <div class="modal">
        <div class="modal-content">
          <div class="preview">
            <div bind:this={previewElement}>
              <h3>Document Preview</h3>
              <p>This is what will be converted to PDF</p>
            </div>
          </div>

          <div class="modal-actions">
            <button on:click={() => (showPreview = false)}>Close</button>
            <button on:click={handlePreviewDownload} disabled={$preview.isGenerating}>
              {$preview.isGenerating ? `Downloading ${$preview.progress}%` : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
    {/if}
  </section>
</div>

<style>
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
