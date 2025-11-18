# Multi-Page Generation

For comprehensive multi-page generation documentation, see:

**[Multi-Page Generation (Advanced Guide)](../advanced/multi-page.md)**

## Quick Overview

The PDF generator automatically splits content across multiple pages using smart pagination:

- ✅ **Automatic Page Splitting** - Content flows naturally across pages
- ✅ **Smart Boundaries** - Respects element boundaries
- ✅ **No Content Cuts** - Prevents awkward mid-element splits
- ✅ **Device Independent** - Same output on all screen sizes

## Basic Example

```typescript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('long-content');
await generatePDF(element, 'multi-page.pdf', {
  format: 'a4',
  showPageNumbers: true,
});
```

The generator automatically handles pagination for content that exceeds one page.

## See Also

- **[Multi-Page Generation (Full Guide)](../advanced/multi-page.md)** - Complete documentation
- [Page Breaks](./page-breaks.md) - Control page splitting
- [Table Support](./tables.md) - Multi-page tables
