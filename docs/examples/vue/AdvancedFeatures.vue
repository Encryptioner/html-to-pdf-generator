<template>
  <div class="container">
    <h1>PDF Generator - Advanced Features Tutorial (Vue)</h1>

    <!-- Tab Navigation -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 1. BATCH PDF GENERATION -->
    <div v-show="activeTab === 'batch'" class="example">
      <h2>Batch PDF Generation</h2>

      <div ref="section1Ref" class="content-section">
        <h1>Cover Page</h1>
        <p>Annual Report 2025</p>
      </div>

      <div ref="section2Ref" class="content-section">
        <h1>Introduction</h1>
        <p>This is a longer introduction section that will be scaled to fit 2 pages...</p>
      </div>

      <div ref="section3Ref" class="content-section">
        <h1>Main Content</h1>
        <p>Detailed content that will be scaled to fit 3 pages...</p>
      </div>

      <button @click="generateBatch" :disabled="batchState.isGenerating">
        {{ batchState.isGenerating ? `Generating... ${batchState.progress}%` : 'Generate Batch PDF' }}
      </button>

      <div v-if="batchState.result" class="success-box">
        <h3>Batch PDF Generated!</h3>
        <p>Total pages: {{ batchState.result.totalPages }}</p>
        <p>File size: {{ (batchState.result.fileSize / 1024).toFixed(2) }} KB</p>
        <p>Generation time: {{ batchState.result.generationTime.toFixed(0) }}ms</p>
        <h4>Items:</h4>
        <ul>
          <li v-for="(item, i) in batchState.result.itemResults" :key="i">
            Item {{ i + 1 }}: Pages {{ item.startPage }}-{{ item.endPage }} ({{ item.pageCount }} pages)
          </li>
        </ul>
      </div>
    </div>

    <!-- 2. WATERMARKS -->
    <div v-show="activeTab === 'watermark'" class="example">
      <h2>Watermark Example</h2>

      <div ref="watermarkRef" class="pdf-content">
        <h1>Confidential Document</h1>
        <p>This document contains sensitive information.</p>
        <p>All pages will have a diagonal "CONFIDENTIAL" watermark.</p>
      </div>

      <button @click="generateWatermark" :disabled="watermarkState.isGenerating">
        {{ watermarkState.isGenerating ? 'Generating...' : 'Download PDF with Watermark' }}
      </button>
    </div>

    <!-- 3. HEADERS AND FOOTERS -->
    <div v-show="activeTab === 'headers'" class="example">
      <h2>Headers & Footers Example</h2>

      <div ref="headerFooterRef" class="pdf-content" style="min-height: 1000px;">
        <h1>Annual Report 2025</h1>
        <p>First page will have no header but will have footer.</p>
        <p>Subsequent pages will have both header and footer with dynamic page numbers.</p>

        <div style="margin-top: 500px;">
          <h2>Page 2 Content</h2>
          <p>This content will appear on the second page with header and footer.</p>
        </div>
      </div>

      <button @click="generateHeaderFooter" :disabled="headerFooterState.isGenerating">
        {{ headerFooterState.isGenerating ? 'Generating...' : 'Download PDF with Headers/Footers' }}
      </button>
    </div>

    <!-- 4. TABLE OF CONTENTS -->
    <div v-show="activeTab === 'toc'" class="example">
      <h2>Table of Contents Example</h2>

      <div ref="tocRef" class="pdf-content" style="min-height: 1500px;">
        <h1 id="chapter-1">Chapter 1: Introduction</h1>
        <p>Introduction content...</p>

        <h2 id="section-1-1">1.1 Background</h2>
        <p>Background information...</p>

        <h3 id="subsection-1-1-1">1.1.1 History</h3>
        <p>Historical context...</p>

        <div style="margin-top: 500px;">
          <h1 id="chapter-2">Chapter 2: Methodology</h1>
          <p>Methodology content...</p>

          <h2 id="section-2-1">2.1 Research Design</h2>
          <p>Research design details...</p>
        </div>

        <div style="margin-top: 500px;">
          <h1 id="chapter-3">Chapter 3: Results</h1>
          <p>Results and findings...</p>
        </div>
      </div>

      <button @click="generateTOC" :disabled="tocState.isGenerating">
        {{ tocState.isGenerating ? 'Generating...' : 'Download PDF with TOC' }}
      </button>

      <p class="hint">
        The PDF will have an auto-generated Table of Contents at the start with clickable links.
      </p>
    </div>

    <!-- 5. PROFESSIONAL DOCUMENT -->
    <div v-show="activeTab === 'professional'" class="example">
      <h2>Professional Document - All Features Combined</h2>

      <div ref="professionalRef" class="pdf-content" style="min-height: 2000px;">
        <div style="text-align: center; margin-bottom: 60px;">
          <h1 style="font-size: 36px; margin-bottom: 10px;">Q4 2024 Financial Report</h1>
          <p style="font-size: 18px; color: #666;">Finance Department</p>
          <p style="font-size: 14px; color: #999;">{{ currentDate }}</p>
        </div>

        <h1>Executive Summary</h1>
        <p>This comprehensive report includes:</p>
        <ul>
          <li>Automatic Table of Contents</li>
          <li>Page headers and footers with page numbers</li>
          <li>Draft watermark on all pages</li>
          <li>PDF bookmarks for easy navigation</li>
          <li>Professional metadata</li>
        </ul>

        <div style="margin-top: 600px;">
          <h1>Financial Overview</h1>
          <h2>Revenue Analysis</h2>
          <p>Detailed revenue breakdown and analysis...</p>

          <h2>Expense Analysis</h2>
          <p>Comprehensive expense review...</p>
        </div>

        <div style="margin-top: 600px;">
          <h1>Recommendations</h1>
          <h2>Short-term Actions</h2>
          <p>Immediate steps to improve performance...</p>

          <h2>Long-term Strategy</h2>
          <p>Strategic initiatives for future growth...</p>
        </div>
      </div>

      <button @click="generateProfessional" :disabled="professionalState.isGenerating" class="btn-primary">
        {{ professionalState.isGenerating ? `Generating ${professionalState.progress}%` : 'Download Professional PDF' }}
      </button>

      <div v-if="professionalState.result" class="success-box">
        <h3>PDF Generated Successfully!</h3>
        <p>Pages: {{ professionalState.result.pageCount }}</p>
        <p>File size: {{ (professionalState.result.fileSize / 1024).toFixed(2) }} KB</p>
        <p>Generation time: {{ professionalState.result.generationTime.toFixed(0) }}ms</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  usePDFGenerator,
  useBatchPDFGenerator,
  type PDFContentItem,
} from '@your-org/pdf-generator/vue';

// State
const activeTab = ref('batch');
const currentDate = computed(() => new Date().toLocaleDateString());

// Tabs
const tabs = [
  { id: 'batch', label: 'Batch PDF' },
  { id: 'watermark', label: 'Watermarks' },
  { id: 'headers', label: 'Headers/Footers' },
  { id: 'toc', label: 'Table of Contents' },
  { id: 'professional', label: 'Professional Doc' },
];

// 1. BATCH PDF GENERATION
const section1Ref = ref<HTMLDivElement | null>(null);
const section2Ref = ref<HTMLDivElement | null>(null);
const section3Ref = ref<HTMLDivElement | null>(null);

const {
  generateBatchPDF,
  isGenerating: batchIsGenerating,
  progress: batchProgress,
  result: batchResult,
} = useBatchPDFGenerator({
  format: 'a4',
  orientation: 'portrait',
});

const batchState = computed(() => ({
  isGenerating: batchIsGenerating.value,
  progress: batchProgress.value,
  result: batchResult.value,
}));

const generateBatch = async () => {
  if (!section1Ref.value || !section2Ref.value || !section3Ref.value) return;

  const items: PDFContentItem[] = [
    { content: section1Ref.value, pageCount: 1 },
    { content: section2Ref.value, pageCount: 2 },
    { content: section3Ref.value, pageCount: 3 },
  ];

  await generateBatchPDF(items, 'complete-report.pdf');
};

// 2. WATERMARK
const watermarkRef = ref<HTMLDivElement | null>(null);

const {
  generatePDF: generateWatermarkPDF,
  isGenerating: watermarkIsGenerating,
} = usePDFGenerator({
  filename: 'confidential.pdf',
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal',
    fontSize: 48,
    color: '#ff0000',
    rotation: 45,
    allPages: true,
  },
});

const watermarkState = computed(() => ({
  isGenerating: watermarkIsGenerating.value,
}));

const generateWatermark = async () => {
  if (!watermarkRef.value) return;
  await generateWatermarkPDF();
};

// Make targetRef point to watermarkRef
const { targetRef: watermarkTargetRef } = usePDFGenerator({
  filename: 'confidential.pdf',
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: 0.3,
    position: 'diagonal',
    fontSize: 48,
    color: '#ff0000',
    rotation: 45,
    allPages: true,
  },
});

// Set the ref after component mount
watermarkTargetRef.value = watermarkRef.value;

// 3. HEADER/FOOTER
const headerFooterRef = ref<HTMLDivElement | null>(null);

const {
  generatePDF: generateHeaderFooterPDF,
  isGenerating: headerFooterIsGenerating,
} = usePDFGenerator({
  filename: 'report-with-headers.pdf',
  headerTemplate: {
    template: 'Company Name | Annual Report | {{date}}',
    height: 20,
    firstPage: false,
  },
  footerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}} - Confidential',
    height: 20,
    firstPage: true,
  },
  metadata: {
    title: 'Annual Report 2025',
    author: 'John Doe',
    subject: 'Financial Report',
    keywords: ['finance', 'report', '2025'],
    creator: 'Vue PDF Generator',
    creationDate: new Date(),
  },
});

const headerFooterState = computed(() => ({
  isGenerating: headerFooterIsGenerating.value,
}));

const generateHeaderFooter = async () => {
  if (!headerFooterRef.value) return;
  await generateHeaderFooterPDF();
};

// 4. TABLE OF CONTENTS
const tocRef = ref<HTMLDivElement | null>(null);

const {
  generatePDF: generateTOCPDF,
  isGenerating: tocIsGenerating,
} = usePDFGenerator({
  filename: 'document-with-toc.pdf',
  tocOptions: {
    enabled: true,
    title: 'Table of Contents',
    levels: [1, 2, 3],
    position: 'start',
    includePageNumbers: true,
    indentPerLevel: 10,
    enableLinks: true,
  },
});

const tocState = computed(() => ({
  isGenerating: tocIsGenerating.value,
}));

const generateTOC = async () => {
  if (!tocRef.value) return;
  await generateTOCPDF();
};

// 5. PROFESSIONAL DOCUMENT
const professionalRef = ref<HTMLDivElement | null>(null);

const {
  generatePDF: generateProfessionalPDF,
  isGenerating: professionalIsGenerating,
  progress: professionalProgress,
  result: professionalResult,
} = usePDFGenerator({
  filename: 'professional-report.pdf',
  format: 'a4',
  orientation: 'portrait',
  margins: [20, 15, 20, 15],
  scale: 3,
  imageQuality: 0.95,
  emulateMediaType: 'print',
  watermark: {
    text: 'DRAFT',
    opacity: 0.15,
    position: 'diagonal',
    fontSize: 40,
    color: '#999999',
    allPages: true,
  },
  headerTemplate: {
    template: 'Q4 2024 Financial Report | {{date}}',
    height: 15,
    firstPage: false,
  },
  footerTemplate: {
    template: 'Page {{pageNumber}} of {{totalPages}} - Confidential',
    height: 15,
    firstPage: true,
  },
  metadata: {
    title: 'Q4 2024 Financial Report',
    author: 'Finance Department',
    subject: 'Quarterly Financial Analysis',
    keywords: ['finance', 'Q4', '2024', 'report'],
    creator: 'Corporate PDF Generator',
    creationDate: new Date(),
  },
  tocOptions: {
    enabled: true,
    title: 'Contents',
    levels: [1, 2],
    position: 'start',
    includePageNumbers: true,
    enableLinks: true,
  },
  bookmarkOptions: {
    enabled: true,
    autoGenerate: true,
    levels: [1, 2],
    openByDefault: true,
  },
});

const professionalState = computed(() => ({
  isGenerating: professionalIsGenerating.value,
  progress: professionalProgress.value,
  result: professionalResult.value,
}));

const generateProfessional = async () => {
  if (!professionalRef.value) return;
  await generateProfessionalPDF();
};
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
}

.tabs button {
  padding: 10px 20px;
  margin-right: 5px;
  border: none;
  border-bottom: 3px solid transparent;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

.tabs button.active {
  border-bottom-color: #007bff;
  background: #f8f9fa;
  font-weight: bold;
}

.example {
  margin-top: 20px;
}

.content-section {
  padding: 40px;
  background-color: #f0f0f0;
  margin-bottom: 20px;
}

.pdf-content {
  padding: 40px;
  background-color: white;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}

button {
  padding: 12px 24px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
}

.success-box {
  margin-top: 20px;
  padding: 15px;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 4px;
}

.hint {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
</style>
