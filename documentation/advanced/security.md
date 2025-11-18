# PDF Security & Encryption

Add password protection and permission controls to your generated PDFs.

## Overview

The HTML to PDF Generator supports PDF encryption and access control using jsPDF's built-in security features. You can:

- Password protect PDFs (user and owner passwords)
- Control document permissions (printing, copying, modifying, etc.)
- Restrict access to sensitive documents

## Important Notes

### Encryption Strength

jsPDF uses **RC4 40-bit encryption**, which is considered weak by modern security standards. While this provides basic protection against casual access, it should **not be relied upon for highly sensitive documents**.

For stronger encryption (AES 128/256), consider server-side solutions like:
- node-qpdf
- PDFtk
- Apache PDFBox

### Password Types

1. **User Password**: Required to open the PDF
2. **Owner Password**: Required to change permissions

If only the user password is set, the PDF can be opened but permissions cannot be modified. If both are set, the owner password allows full access and permission changes.

## Basic Usage

### Password Protection Only

```typescript
import { PDFGenerator } from '@encryptioner/html-to-pdf-generator';

const generator = new PDFGenerator({
  securityOptions: {
    enabled: true,
    userPassword: 'my-secret-password',
    ownerPassword: 'admin-password'
  }
});

await generator.generatePDF(element, 'protected.pdf');
```

### Permission Controls

```typescript
const generator = new PDFGenerator({
  securityOptions: {
    enabled: true,
    userPassword: 'view-only',
    permissions: {
      printing: 'none',        // Disable printing
      modifying: false,        // Disable modifications
      copying: false,          // Disable text/content copying
      annotating: false,       // Disable annotations
      fillingForms: false      // Disable form filling
    }
  }
});
```

### Allow Printing Only

```typescript
const generator = new PDFGenerator({
  securityOptions: {
    enabled: true,
    userPassword: 'print-only',
    permissions: {
      printing: 'highResolution',  // Allow high-quality printing
      modifying: false,
      copying: false,
      annotating: false
    }
  }
});
```

## Framework Examples

### React

```tsx
import { usePDFGeneratorManual } from '@encryptioner/html-to-pdf-generator/react';

function SecureDocument() {
  const { generatePDF, isGenerating } = usePDFGeneratorManual({
    securityOptions: {
      enabled: true,
      userPassword: 'secret123',
      ownerPassword: 'admin123',
      permissions: {
        printing: 'lowResolution',
        modifying: false,
        copying: true,          // Allow copying
        annotating: false
      }
    }
  });

  const handleDownload = async () => {
    const element = document.getElementById('invoice');
    if (element) {
      await generatePDF(element as HTMLElement, 'secure-invoice.pdf');
    }
  };

  return (
    <div>
      <div id="invoice">
        {/* Your invoice content */}
      </div>
      <button onClick={handleDownload} disabled={isGenerating}>
        Download Protected PDF
      </button>
    </div>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { usePDFGeneratorManual } from '@encryptioner/html-to-pdf-generator/vue';
import { ref } from 'vue';

const contentRef = ref<HTMLElement | null>(null);

const { generatePDF, isGenerating } = usePDFGeneratorManual({
  securityOptions: {
    enabled: true,
    userPassword: 'confidential',
    permissions: {
      printing: 'none',
      copying: false,
      modifying: false
    }
  }
});

async function downloadSecurePDF() {
  if (contentRef.value) {
    await generatePDF(contentRef.value, 'confidential-report.pdf');
  }
}
</script>

<template>
  <div>
    <div ref="contentRef">
      <!-- Your content -->
    </div>
    <button @click="downloadSecurePDF" :disabled="isGenerating">
      Download Secure PDF
    </button>
  </div>
</template>
```

### Svelte

```svelte
<script lang="ts">
  import { PDFGeneratorStore } from '@encryptioner/html-to-pdf-generator/svelte';

  let contentElement: HTMLElement;

  const pdfStore = new PDFGeneratorStore({
    securityOptions: {
      enabled: true,
      userPassword: 'secret',
      ownerPassword: 'master',
      permissions: {
        printing: 'highResolution',
        copying: false,
        modifying: false,
        annotating: false
      }
    }
  });

  async function download() {
    await pdfStore.generatePDF(contentElement, 'secure-document.pdf');
  }
</script>

<div bind:this={contentElement}>
  <!-- Your content -->
</div>

<button on:click={download} disabled={$pdfStore.isGenerating}>
  Download Protected PDF
</button>
```

### Server-Side (Node.js)

```typescript
import { generatePDFFromURL } from '@encryptioner/html-to-pdf-generator/node';

const pdfBuffer = await generatePDFFromURL('https://example.com', {
  securityOptions: {
    enabled: true,
    userPassword: 'secure123',
    ownerPassword: 'admin456',
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false
    }
  }
});

// Save to file
await fs.promises.writeFile('protected.pdf', pdfBuffer);
```

## API Reference

### PDFSecurityOptions

```typescript
interface PDFSecurityOptions {
  /** Enable encryption (must be true to activate security) */
  enabled?: boolean;

  /** User password (required to open the PDF) */
  userPassword?: string;

  /** Owner password (required to modify permissions) */
  ownerPassword?: string;

  /** Document permissions */
  permissions?: PDFSecurityPermissions;

  /** Encryption strength (currently only RC4 40-bit supported by jsPDF) */
  encryptionStrength?: 128 | 256;
}
```

### PDFSecurityPermissions

```typescript
interface PDFSecurityPermissions {
  /**
   * Allow printing
   * - 'none': No printing allowed
   * - 'lowResolution': Low resolution printing only
   * - 'highResolution': Full quality printing
   */
  printing?: 'none' | 'lowResolution' | 'highResolution';

  /** Allow modifying the document */
  modifying?: boolean;

  /** Allow copying text and graphics */
  copying?: boolean;

  /** Allow adding or modifying annotations */
  annotating?: boolean;

  /** Allow filling in form fields */
  fillingForms?: boolean;

  /** Allow content accessibility (for screen readers) */
  contentAccessibility?: boolean;

  /** Allow assembling document (inserting, rotating, deleting pages) */
  documentAssembly?: boolean;
}
```

## Permission Combinations

### Read-Only PDF

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'readonly',
  permissions: {
    printing: 'none',
    modifying: false,
    copying: false,
    annotating: false,
    fillingForms: false
  }
}
```

### Print-Only PDF

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'printonly',
  permissions: {
    printing: 'highResolution',
    modifying: false,
    copying: false,
    annotating: false
  }
}
```

### Annotate-Only PDF

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'review',
  permissions: {
    printing: 'lowResolution',
    modifying: false,
    copying: false,
    annotating: true,        // Can add comments
    fillingForms: true       // Can fill forms
  }
}
```

### Copy-Allowed PDF

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'copy-ok',
  permissions: {
    printing: 'highResolution',
    modifying: false,
    copying: true,           // Can copy text
    annotating: false
  }
}
```

## Common Use Cases

### Invoice Protection

Protect invoices from modification while allowing printing:

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'invoice-' + Date.now(),
  permissions: {
    printing: 'highResolution',
    modifying: false,
    copying: true,    // Allow copying invoice details
    annotating: false
  }
}
```

### Confidential Reports

Maximum protection for sensitive documents:

```typescript
securityOptions: {
  enabled: true,
  userPassword: generateSecurePassword(),
  ownerPassword: adminPassword,
  permissions: {
    printing: 'none',
    modifying: false,
    copying: false,
    annotating: false,
    fillingForms: false
  }
}
```

### Forms Distribution

Allow users to fill forms but not modify structure:

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'form-access',
  permissions: {
    printing: 'highResolution',
    modifying: false,
    copying: false,
    annotating: true,
    fillingForms: true
  }
}
```

## Best Practices

### 1. Strong Passwords

```typescript
// Bad - weak password
userPassword: '1234'

// Good - strong password
userPassword: crypto.randomBytes(16).toString('hex')
```

### 2. Separate User and Owner Passwords

```typescript
securityOptions: {
  enabled: true,
  userPassword: 'user-access-key',     // For viewing
  ownerPassword: 'admin-master-key',   // For full control
  permissions: { /* ... */ }
}
```

### 3. Default Permissions

If permissions are not specified, the library defaults to allowing print and copy:

```typescript
// This allows print and copy by default
securityOptions: {
  enabled: true,
  userPassword: 'secret'
  // No permissions specified - defaults to print + copy
}
```

### 4. Progressive Enhancement

For public documents, don't use security. Only apply for sensitive content:

```typescript
const securityOptions = isConfidential ? {
  enabled: true,
  userPassword: generatePassword(),
  permissions: restrictedPermissions
} : undefined;

const generator = new PDFGenerator({ securityOptions });
```

## Security Limitations

### What This DOES Protect Against

- Casual unauthorized access
- Accidental modifications
- Unauthorized printing/copying (enforced by PDF readers)
- Basic document protection

### What This DOES NOT Protect Against

- Determined attackers with password cracking tools (RC4 40-bit is weak)
- Users with specialized PDF tools
- Screen capture / photography
- OCR of printed documents

## Alternative Solutions

For stronger security requirements:

### 1. Server-Side Encryption

Use stronger encryption libraries on the server:

```typescript
// After generating PDF with this library
import { PDFDocument } from 'pdf-lib';

const pdfDoc = await PDFDocument.load(pdfBytes);
// Use pdf-lib for stronger encryption if needed
```

### 2. External Tools

- **node-qpdf**: Supports AES 128/256
- **PDFtk**: Command-line PDF toolkit
- **Apache PDFBox**: Java-based PDF library

### 3. Access Control

Combine with application-level access control:

```typescript
// Generate unique password per user
const userPassword = await hashUserCredentials(userId);

await generator.generatePDF(element, 'document.pdf', {
  securityOptions: {
    enabled: true,
    userPassword,
    permissions: getUserPermissions(userRole)
  }
});
```

## Troubleshooting

### PDF Opens Without Password Prompt

**Issue**: PDF opens directly without asking for password.

**Solution**: Ensure `enabled: true` is set:

```typescript
securityOptions: {
  enabled: true,  // Must be true!
  userPassword: 'secret'
}
```

### Permissions Not Enforced

**Issue**: User can still copy/print despite restrictions.

**Solution**: Permissions are enforced by the PDF reader. Some readers may ignore restrictions. This is a limitation of PDF security in general, not this library.

### TypeScript Errors

**Issue**: TypeScript errors with security options.

**Solution**: Import types:

```typescript
import type { PDFSecurityOptions } from '@encryptioner/html-to-pdf-generator';

const security: PDFSecurityOptions = {
  enabled: true,
  userPassword: 'secret'
};
```

## Related Documentation

- [Metadata](./metadata.md) - Add author, title, and other metadata
- [Watermarks](./watermarks.md) - Add visible watermarks
- [Headers & Footers](./headers-footers.md) - Add headers and footers
- [Batch Generation](./batch-generation.md) - Generate multiple PDFs

## Support

- [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- [NPM Package](https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator)
