# PDF Security & Encryption

> **🚧 NOT YET IMPLEMENTED**: This feature is documented for future implementation. The `securityOptions` parameter is defined but not functional. See [FEATURE_IMPLEMENTATION_STATUS.md](../../FEATURE_IMPLEMENTATION_STATUS.md) for details.

## Overview

Protect your PDF documents with encryption and access control. You can set user passwords (to open the document), owner passwords (to modify permissions), and configure specific restrictions on printing, copying, modification, and other operations.

Key features:
- **User Password** - Required to open the document
- **Owner Password** - Required to change permissions
- **Document Permissions** - Control printing, copying, modifying
- **Encryption Strength** - 128-bit or 256-bit encryption
- **Granular Control** - Fine-grained permission management

## Configuration Interface

```typescript
export interface PDFSecurityPermissions {
  /** Allow printing */
  printing?: 'none' | 'lowResolution' | 'highResolution';

  /** Allow modifying the document */
  modifying?: boolean;

  /** Allow copying text and graphics */
  copying?: boolean;

  /** Allow adding or modifying annotations */
  annotating?: boolean;

  /** Allow filling in form fields */
  fillingForms?: boolean;

  /** Allow content accessibility */
  contentAccessibility?: boolean;

  /** Allow assembling document */
  documentAssembly?: boolean;
}

export interface PDFSecurityOptions {
  /** Enable encryption */
  enabled?: boolean;

  /** User password (required to open the PDF) */
  userPassword?: string;

  /** Owner password (required to modify permissions) */
  ownerPassword?: string;

  /** Document permissions */
  permissions?: PDFSecurityPermissions;

  /** Encryption strength (128 or 256 bit) */
  encryptionStrength?: 128 | 256;
}
```

## Basic Usage

### User Password Protection

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();
const element = document.getElementById('content');

const result = await generator.generate(element, {
  securityOptions: {
    enabled: true,
    userPassword: 'SecurePass123!',
    encryptionStrength: 256
  }
});
```

### Owner Password with Restrictions

```typescript
const result = await generator.generate(element, {
  securityOptions: {
    enabled: true,
    userPassword: 'OpenPassword',
    ownerPassword: 'AdminPassword123!',
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false
    },
    encryptionStrength: 256
  }
});
```

### Full Permission Lock

```typescript
const result = await generator.generate(element, {
  securityOptions: {
    enabled: true,
    userPassword: 'DocumentAccess2024',
    ownerPassword: 'OwnerControl2024!',
    permissions: {
      printing: 'none',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 256
  }
});
```

## Advanced Examples

### Read-Only Confidential Document

```typescript
const result = await generator.generate(element, {
  watermark: {
    text: 'CONFIDENTIAL - READ ONLY',
    opacity: 0.15,
    position: 'diagonal',
    rotation: 45
  },
  securityOptions: {
    enabled: true,
    userPassword: 'Conf2024Access',
    ownerPassword: 'ConfOwner2024!',
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 256
  }
});
```

### Distribution-Controlled PDF

```typescript
const result = await generator.generate(element, {
  metadata: {
    title: 'Distribution Controlled Document',
    subject: 'Internal Use Only'
  },
  securityOptions: {
    enabled: true,
    userPassword: generateSecurePassword(), // Generate per recipient
    ownerPassword: 'MasterOwnerPassword123!',
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false, // Prevent copying content
      annotating: true, // Allow notes/comments
      fillingForms: false,
      contentAccessibility: false, // No screen reader access
      documentAssembly: false
    },
    encryptionStrength: 256
  }
});

function generateSecurePassword(): string {
  return 'Pass' + Math.random().toString(36).substring(2, 15) + Date.now();
}
```

### Printable but Non-Editable

```typescript
const result = await generator.generate(element, {
  securityOptions: {
    enabled: true,
    userPassword: 'PrintableAccess',
    ownerPassword: 'OwnerPasswordSecure!',
    permissions: {
      printing: 'highResolution', // Allow full quality printing
      modifying: false,
      copying: true, // Allow copying for reference
      annotating: true, // Allow highlighting/notes
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 128
  }
});
```

### Form-Fillable but Protected

```typescript
const result = await generator.generate(element, {
  securityOptions: {
    enabled: true,
    userPassword: 'FormAccess',
    ownerPassword: 'FormOwner2024!',
    permissions: {
      printing: 'highResolution',
      modifying: false, // Can't modify document structure
      copying: false, // Prevent content theft
      annotating: false,
      fillingForms: true, // Only form fields can be filled
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 256
  }
});
```

### Screen-Reader Accessible Secure

```typescript
const result = await generator.generate(element, {
  securityOptions: {
    enabled: true,
    userPassword: 'AccessibleDoc',
    ownerPassword: 'Owner123Secure!',
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true, // Allows screen readers
      documentAssembly: false
    },
    encryptionStrength: 256
  }
});
```

## Common Patterns

### Public Shareable Document

```typescript
const publicShareable = {
  securityOptions: {
    enabled: true,
    userPassword: 'Public2024', // Simple, widely shareable
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: true,
      annotating: true,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 128
  }
};
```

### Sensitive Internal Document

```typescript
const sensitiveInternal = {
  securityOptions: {
    enabled: true,
    userPassword: 'SensitiveAccess2024',
    ownerPassword: 'SensitiveOwner2024!',
    permissions: {
      printing: 'lowResolution',
      modifying: false,
      copying: false,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 256
  }
};
```

### Executive Summary Secure

```typescript
const executiveSecure = {
  securityOptions: {
    enabled: true,
    userPassword: 'Executive2024',
    ownerPassword: 'ExecOwner2024!',
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: false,
      annotating: true,
      fillingForms: false,
      contentAccessibility: false,
      documentAssembly: false
    },
    encryptionStrength: 256
  }
};
```

### Printable Marketing Material

```typescript
const marketingMaterial = {
  securityOptions: {
    enabled: true,
    userPassword: 'PrintMe2024',
    permissions: {
      printing: 'highResolution',
      modifying: false,
      copying: true,
      annotating: false,
      fillingForms: false,
      contentAccessibility: true,
      documentAssembly: false
    },
    encryptionStrength: 128
  }
};
```

## Permission Combinations Guide

| Use Case | Printing | Modify | Copy | Annotate | Forms | Accessibility |
|----------|----------|--------|------|----------|-------|---------------|
| Read-Only | Low | No | No | No | No | Yes |
| Printable | High | No | Yes | Yes | No | Yes |
| Forms | Low | No | No | No | Yes | Yes |
| Public | High | No | Yes | Yes | No | Yes |
| Secure | None | No | No | No | No | Yes |
| Collaborative | High | No | Yes | Yes | No | Yes |

## Password Security Best Practices

1. **User Password**:
   - Minimum 8 characters
   - Mix of uppercase, lowercase, numbers, special characters
   - Generate unique passwords for sensitive documents
   - Use random generation for automated distribution

2. **Owner Password**:
   - Much stronger than user password
   - Minimum 12 characters
   - Store securely in password manager
   - Never hardcode in source code

3. **Encryption Strength**:
   - Use 256-bit for highly sensitive documents
   - Use 128-bit for standard protection

4. **Password Distribution**:
   - Deliver passwords via separate secure channel
   - Use different password for each recipient when possible
   - Track password distribution for compliance

5. **Password Management**:
   - Never log passwords in files or logs
   - Use environment variables for sensitive data
   - Implement password rotation policies

## Tips and Best Practices

1. **Permission Strategy**: Define clear permission sets based on document sensitivity

2. **Password Complexity**: Generate strong passwords programmatically

3. **Accessibility**: Always allow content accessibility for compliance with accessibility standards

4. **Testing**: Test encrypted PDFs in different PDF readers to ensure compatibility

5. **Documentation**: Document why specific permissions are set for each document type

6. **Compliance**: Ensure encryption meets regulatory requirements (HIPAA, GDPR, etc.)

7. **Version Control**: Update passwords for new document versions

8. **Audit Trail**: Log which documents were encrypted with which passwords

9. **Recovery**: Implement password reset procedures for legitimate document owners

10. **Standards**: Follow NIST guidelines for encryption strength recommendations

## See Also

- [Watermarks](./watermarks.md) - Add security watermarks
- [Metadata](./metadata.md) - Track document information
- [Headers/Footers](./headers-footers.md) - Add classification markings