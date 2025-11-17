# Template System

## Overview

The template system allows you to render dynamic HTML content with variable substitution, loops, and conditional logic before PDF generation. This feature is useful for generating personalized documents, reports with variable data, and mail-merge style documents.

Key features:
- **Variable Substitution** - Replace `{{variableName}}` with values
- **Loops** - `{{#each items}}...{{/each}}` for repeating content
- **Conditionals** - `{{#if condition}}...{{/if}}` for content branching
- **Nested Structures** - Support for complex data structures
- **Template Context** - Pass any JavaScript value as template data

## Configuration Interface

```typescript
export interface TemplateOptions {
  /** Template HTML string with variables */
  template: string;

  /** Context/variables to replace in template */
  context?: TemplateContext;

  /** Enable loops with {{#each}} syntax */
  enableLoops?: boolean;

  /** Enable conditionals with {{#if}} syntax */
  enableConditionals?: boolean;
}

export interface TemplateContext {
  /** Custom variables passed by user */
  [key: string]: string | number | boolean | string[] | Record<string, any>;
}
```

## Basic Usage

### Simple Variable Substitution

```typescript
import { PDFGenerator } from '@html-to-pdf/generator';

const generator = new PDFGenerator();

const templateHTML = `
  <h1>Invoice for {{customerName}}</h1>
  <p>Invoice Date: {{invoiceDate}}</p>
  <p>Total Amount: ${{totalAmount}}</p>
`;

const result = await generator.generate(templateHTML, {
  templateOptions: {
    template: templateHTML,
    context: {
      customerName: 'John Smith',
      invoiceDate: '2024-01-15',
      totalAmount: '1250.00'
    }
  }
});
```

### Object and Array Context

```typescript
const templateHTML = `
  <h1>Order Confirmation</h1>
  <p>Customer: {{order.customer.name}}</p>
  <p>Order ID: {{order.id}}</p>
  <p>Items Count: {{items.length}}</p>
`;

const result = await generator.generate(templateHTML, {
  templateOptions: {
    template: templateHTML,
    context: {
      order: {
        id: 'ORD-2024-001',
        customer: {
          name: 'Alice Johnson',
          email: 'alice@example.com'
        }
      },
      items: [
        { name: 'Product A', qty: 2 },
        { name: 'Product B', qty: 1 }
      ]
    }
  }
});
```

## Advanced Examples

### Loop Template (Each)

```typescript
const templateHTML = `
  <h1>Order Details</h1>
  <table>
    <tr>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
    {{#each products}}
    <tr>
      <td>{{name}}</td>
      <td>{{quantity}}</td>
      <td>${{price}}</td>
    </tr>
    {{/each}}
  </table>
`;

const result = await generator.generate(templateHTML, {
  templateOptions: {
    template: templateHTML,
    enableLoops: true,
    context: {
      products: [
        { name: 'Laptop', quantity: 1, price: 999.99 },
        { name: 'Mouse', quantity: 2, price: 29.99 },
        { name: 'Keyboard', quantity: 1, price: 79.99 }
      ]
    }
  }
});
```

### Conditional Template (If)

```typescript
const templateHTML = `
  <h1>Order Summary</h1>
  <p>Order ID: {{orderId}}</p>
  {{#if isPremium}}
    <div style="background-color: #fff3cd; padding: 10px;">
      <p>Thank you for being a premium member!</p>
      <p>Discount Applied: {{discount}}%</p>
    </div>
  {{/if}}
  {{#if isPending}}
    <p style="color: red;">Status: Pending Approval</p>
  {{/if}}
  {{#if isShipped}}
    <p style="color: green;">Status: Shipped - Tracking: {{trackingNumber}}</p>
  {{/if}}
`;

const result = await generator.generate(templateHTML, {
  templateOptions: {
    template: templateHTML,
    enableConditionals: true,
    context: {
      orderId: 'ORD-001',
      isPremium: true,
      discount: 15,
      isPending: false,
      isShipped: true,
      trackingNumber: 'TRACK-123456'
    }
  }
});
```

### Complex Nested Template

```typescript
const templateHTML = `
  <h1>Sales Report: {{reportPeriod}}</h1>

  {{#each departments}}
  <div style="page-break-inside: avoid; margin-bottom: 20px;">
    <h2>{{name}}</h2>
    <p>Manager: {{manager}}</p>

    {{#if hasTarget}}
    <p>Target: ${{target}}</p>
    {{/if}}

    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <th>Agent</th>
        <th>Sales</th>
        <th>Status</th>
      </tr>
      {{#each agents}}
      <tr>
        <td>{{name}}</td>
        <td>${{sales}}</td>
        <td>
          {{#if sales >= 100000}}
            <span style="color: green;">Exceeds Target</span>
          {{/if}}
          {{#if sales < 100000}}
            <span style="color: orange;">On Track</span>
          {{/if}}
        </td>
      </tr>
      {{/each}}
    </table>
  </div>
  {{/each}}
`;

const result = await generator.generate(templateHTML, {
  templateOptions: {
    template: templateHTML,
    enableLoops: true,
    enableConditionals: true,
    context: {
      reportPeriod: 'Q4 2024',
      departments: [
        {
          name: 'Sales - East',
          manager: 'Sarah Johnson',
          hasTarget: true,
          target: 500000,
          agents: [
            { name: 'Alice', sales: 125000 },
            { name: 'Bob', sales: 98000 }
          ]
        },
        {
          name: 'Sales - West',
          manager: 'Mike Chen',
          hasTarget: true,
          target: 500000,
          agents: [
            { name: 'Carol', sales: 150000 },
            { name: 'David', sales: 110000 }
          ]
        }
      ]
    }
  }
});
```

### Mail-Merge Style Letters

```typescript
const letterTemplate = `
  <p>{{date}}</p>

  <p>
    {{recipientName}}<br>
    {{recipientAddress}}<br>
    {{recipientCity}}, {{recipientState}} {{recipientZip}}
  </p>

  <p>Dear {{recipientName}},</p>

  <p>We are pleased to inform you that you have been selected for {{programName}}.</p>

  {{#if hasBonus}}
  <p style="font-weight: bold;">As a bonus, you will receive {{bonusDescription}}!</p>
  {{/if}}

  <p>{{#if requiresAction}}Please visit {{actionLink}} to complete registration.{{/if}}</p>

  <p>Sincerely,</p>
  <p>{{senderName}}<br>{{senderTitle}}</p>
`;
```

## Common Patterns

### Product Catalog Template

```typescript
const catalogTemplate = {
  template: `
    <h1>{{catalogTitle}}</h1>
    {{#each categories}}
    <section>
      <h2>{{categoryName}}</h2>
      {{#each products}}
      <div class="product">
        <h3>{{productName}}</h3>
        <p>Price: ${{price}}</p>
        {{#if onSale}}
        <p style="color: red;">Sale Price: ${{salePrice}}</p>
        {{/if}}
      </div>
      {{/each}}
    </section>
    {{/each}}
  `,
  enableLoops: true,
  enableConditionals: true
};
```

### Invoice Template

```typescript
const invoiceTemplate = {
  template: `
    <h1>INVOICE #{{invoiceNumber}}</h1>
    <p>Date: {{invoiceDate}}</p>

    <h3>Bill To:</h3>
    <p>{{customerName}}</p>

    <table>
      <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
      {{#each lineItems}}
      <tr>
        <td>{{description}}</td>
        <td>{{quantity}}</td>
        <td>${{unitPrice}}</td>
        <td>${{total}}</td>
      </tr>
      {{/each}}
    </table>

    <p style="font-weight: bold;">Total: ${{grandTotal}}</p>
  `,
  enableLoops: true
};
```

### Report with Conditional Sections

```typescript
const reportTemplate = {
  template: `
    <h1>{{reportTitle}}</h1>
    <p>Period: {{period}}</p>

    {{#if showExecutiveSummary}}
    <section>
      <h2>Executive Summary</h2>
      <p>{{executiveSummary}}</p>
    </section>
    {{/if}}

    {{#if showDetailedAnalysis}}
    <section>
      <h2>Detailed Analysis</h2>
      <p>{{detailedAnalysis}}</p>
    </section>
    {{/if}}

    {{#if showRecommendations}}
    <section>
      <h2>Recommendations</h2>
      <ul>
      {{#each recommendations}}
        <li>{{this}}</li>
      {{/each}}
      </ul>
    </section>
    {{/if}}
  `,
  enableLoops: true,
  enableConditionals: true
};
```

## Template Context Best Practices

1. **Data Structure**: Organize context data logically to match your template structure

2. **Variable Naming**: Use descriptive, camelCase names for clarity

3. **Type Safety**: When using TypeScript, define context interfaces

4. **Escape HTML**: If values come from user input, ensure they're properly escaped

5. **Complex Logic**: Keep template logic simple; handle complex calculations in context preparation

6. **Array Handling**: Use `{{#each}}` for arrays, access current item with `{{this}}`

7. **Nested Objects**: Access nested properties with dot notation: `{{user.profile.name}}`

8. **Conditional Values**: Define boolean flags in context for conditional rendering

9. **Default Values**: Provide sensible defaults for optional context properties

10. **Documentation**: Document required context properties and their format

## See Also

- [Headers/Footers](./headers-footers.md) - Use templates in headers and footers
- [Table of Contents](./table-of-contents.md) - Auto-generate from content
- [Batch Generation](../advanced/batch-generation.md) - Generate multiple PDFs