# Asynchronous PDF Processing

## Overview

Asynchronous PDF processing enables long-running PDF generation operations to complete in the background while your application remains responsive. Perfect for:
- Large documents that take time to render
- Batch PDF generation
- Server-side processing
- Progress tracking and webhooks
- Job status monitoring

Key features:
- **Async Generation** - Non-blocking PDF creation
- **Webhooks** - Notifications when PDF is ready
- **Job Tracking** - Monitor generation progress
- **Progress Updates** - Real-time progress callbacks
- **Custom Headers** - Authentication and metadata in webhook calls

## Configuration Interface

```typescript
export interface AsyncProcessingOptions {
  /** Enable async processing */
  enabled?: boolean;

  /** Webhook URL to call when PDF is ready */
  webhookUrl?: string;

  /** Custom headers for webhook request */
  webhookHeaders?: Record<string, string>;

  /** Job ID for tracking */
  jobId?: string;

  /** Progress callback URL */
  progressUrl?: string;
}
```

## Basic Usage

### Simple Async Generation

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  asyncOptions: {
    enabled: true,
    jobId: 'pdf-job-' + Date.now()
  },
  onProgress: (progress) => {
    console.log(`PDF generation: ${progress}%`);
  }
});
```

### With Webhook Notification

```typescript
const result = await generator.generate(element, {
  asyncOptions: {
    enabled: true,
    jobId: 'report-2024-001',
    webhookUrl: 'https://api.example.com/webhooks/pdf-ready',
    webhookHeaders: {
      'Authorization': 'Bearer webhook-token-123',
      'X-Api-Key': 'secret-api-key'
    }
  }
});
```

### With Progress Tracking

```typescript
const result = await generator.generate(element, {
  asyncOptions: {
    enabled: true,
    jobId: 'large-report-generation',
    webhookUrl: 'https://api.example.com/pdf-complete',
    progressUrl: 'https://api.example.com/progress'
  },
  onProgress: (progress) => {
    // Update UI with progress
    updateProgressBar(progress);

    // Optionally send to server
    fetch(`/api/jobs/${jobId}/progress`, {
      method: 'PUT',
      body: JSON.stringify({ progress })
    });
  }
});
```

## Advanced Examples

### Server-Side Async Generation

```typescript
// Express.js endpoint
app.post('/api/generate-report', async (req, res) => {
  const { reportId, recipientEmail } = req.body;

  // Start async generation
  const jobId = `report-${reportId}-${Date.now()}`;

  // Generate in background without blocking response
  generator.generate(reportHtmlElement, {
    asyncOptions: {
      enabled: true,
      jobId: jobId,
      webhookUrl: `${process.env.API_URL}/webhooks/pdf-ready`,
      webhookHeaders: {
        'Authorization': `Bearer ${process.env.WEBHOOK_TOKEN}`,
        'X-Job-Id': jobId,
        'X-Recipient': recipientEmail
      }
    }
  }).catch(err => {
    console.error(`PDF generation failed for job ${jobId}:`, err);
  });

  // Return immediately to user
  res.json({
    success: true,
    jobId: jobId,
    statusUrl: `/api/jobs/${jobId}`
  });
});

// Webhook endpoint to receive completion notification
app.post('/webhooks/pdf-ready', async (req, res) => {
  const { jobId, pdfUrl, fileSize } = req.body;

  // Store PDF location
  await db.updateJob(jobId, {
    status: 'completed',
    pdfUrl: pdfUrl,
    fileSize: fileSize,
    completedAt: new Date()
  });

  // Send email to user
  await sendEmail({
    to: req.headers['x-recipient'],
    subject: 'Your report is ready',
    template: 'report-ready',
    data: { downloadUrl: pdfUrl }
  });

  res.json({ success: true });
});
```

### Queue-Based Processing

```typescript
// Job queue with async PDF generation
async function processPDFQueue() {
  while (true) {
    const job = await queue.dequeue();
    if (!job) {
      await delay(1000);
      continue;
    }

    try {
      await generator.generate(job.content, {
        asyncOptions: {
          enabled: true,
          jobId: job.id,
          webhookUrl: `${API_URL}/webhooks/complete`,
          webhookHeaders: {
            'X-Job-Id': job.id,
            'Authorization': `Bearer ${WEBHOOK_KEY}`
          }
        },
        onProgress: (progress) => {
          // Update job progress in database
          db.updateJobProgress(job.id, progress);
        }
      });

      // Mark as completed
      await db.updateJob(job.id, { status: 'completed' });
    } catch (error) {
      // Handle failure
      await db.updateJob(job.id, {
        status: 'failed',
        error: error.message
      });

      // Optionally retry
      if (job.retries < 3) {
        await queue.enqueue({ ...job, retries: job.retries + 1 });
      }
    }
  }
}
```

### Batch PDF Generation with Progress

```typescript
async function generateBatchReports(reports: ReportData[]) {
  const results = [];
  const totalReports = reports.length;

  for (let i = 0; i < reports.length; i++) {
    const report = reports[i];
    const progress = Math.round((i / totalReports) * 100);

    try {
      const result = await generator.generate(
        buildReportHTML(report),
        {
          asyncOptions: {
            enabled: true,
            jobId: `batch-report-${i}`,
            webhookUrl: `${API_URL}/webhooks/batch-complete`,
            webhookHeaders: {
              'X-Batch-Id': 'batch-001',
              'X-Item': i + 1,
              'X-Total': totalReports
            }
          }
        }
      );

      results.push({
        reportId: report.id,
        success: true,
        pdfBlob: result.blob
      });

      // Update overall progress
      console.log(`Batch progress: ${progress}%`);
    } catch (error) {
      results.push({
        reportId: report.id,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}
```

### Progress Streaming

```typescript
class PDFGenerationTracker {
  constructor(private jobId: string, private apiBaseUrl: string) {}

  async generateWithProgress(content: HTMLElement) {
    const lastProgress = { value: 0 };

    const result = await generator.generate(content, {
      asyncOptions: {
        enabled: true,
        jobId: this.jobId,
        progressUrl: `${this.apiBaseUrl}/progress`
      },
      onProgress: async (progress) => {
        // Only send if progress actually changed
        if (progress - lastProgress.value >= 5) {
          lastProgress.value = progress;

          // Send progress update to server
          await fetch(`${this.apiBaseUrl}/jobs/${this.jobId}/progress`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jobId: this.jobId,
              progress: progress,
              timestamp: Date.now()
            })
          }).catch(err => console.warn('Progress update failed:', err));
        }
      }
    });

    return result;
  }
}
```

## Common Patterns

### Fire-and-Forget

```typescript
const asyncGeneration = {
  asyncOptions: {
    enabled: true,
    jobId: `pdf-${Date.now()}`
  }
};

// Start and don't wait
generator.generate(element, asyncGeneration).catch(err => {
  console.error('Generation failed:', err);
});
```

### Status Polling

```typescript
async function generateAndWait(jobId: string, element: HTMLElement) {
  await generator.generate(element, {
    asyncOptions: {
      enabled: true,
      jobId: jobId
    }
  });

  // Poll for completion
  let attempts = 0;
  while (attempts < 30) {
    const status = await fetch(`/api/jobs/${jobId}`);
    const data = await status.json();

    if (data.status === 'completed') {
      return data.pdfUrl;
    }

    attempts++;
    await delay(1000);
  }

  throw new Error('PDF generation timeout');
}
```

### Event-Driven with Webhooks

```typescript
const asyncOptions = {
  asyncOptions: {
    enabled: true,
    jobId: `event-driven-${uuid()}`,
    webhookUrl: '/api/webhooks/pdf-generated',
    webhookHeaders: {
      'X-Event-Type': 'pdf.generated',
      'X-Timestamp': new Date().toISOString()
    }
  }
};
```

## Tips and Best Practices

1. **Job IDs**: Generate unique, trackable job IDs using timestamps or UUIDs

2. **Webhook Security**:
   - Use HTTPS for webhook URLs
   - Include authentication tokens in headers
   - Verify webhook signatures on receiver side
   - Implement timeout handling

3. **Error Handling**: Always catch errors from async generation operations

4. **Progress Updates**: Send progress updates at reasonable intervals (5-10% increments)

5. **Timeouts**: Implement timeouts for long-running operations (e.g., 30 minutes)

6. **Retries**: Implement exponential backoff for failed generations

7. **Storage**: Store generated PDFs on CDN or cloud storage, not in memory

8. **Cleanup**: Delete temporary files and jobs after successful completion

9. **Monitoring**: Log all async operations for debugging and audit trails

10. **Scaling**: Use job queues for high-volume PDF generation

## Webhook Response Format

```typescript
interface WebhookPayload {
  jobId: string;
  status: 'completed' | 'failed';
  pdfUrl?: string;
  fileSize?: number;
  pageCount?: number;
  generationTime?: number;
  error?: string;
  timestamp: string;
}
```

## See Also

- [Batch Generation](./batch-generation.md) - Generate multiple PDFs efficiently
- [Performance](../guides/performance.md) - Optimize PDF generation speed
- [Error Handling](../guides/error-handling.md) - Handle generation errors gracefully