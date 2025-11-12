# Production Examples - PDF Generator Library

Real-world examples demonstrating advanced features including images, tables, SVG, and complex layouts.

## Example 1: Invoice with Logo and Table

```typescript
import { usePDFGenerator } from './lib/pdf-generator/hooks';

function InvoiceGenerator() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'invoice.pdf',
    format: 'a4',
    margins: [20, 20, 20, 20],
    compress: true,
    optimizeImages: true,
    repeatTableHeaders: true,
    showPageNumbers: true,
  });

  return (
    <div>
      <div ref={targetRef} style={{ width: '794px', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        {/* Company Logo */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img
            src="/logo.png"
            alt="Company Logo"
            style={{ maxWidth: '200px', height: 'auto' }}
          />
        </div>

        {/* Invoice Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>INVOICE</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <p><strong>Invoice #:</strong> INV-2025-001</p>
              <p><strong>Date:</strong> January 12, 2025</p>
              <p><strong>Due Date:</strong> February 12, 2025</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>Your Company Name</strong></p>
              <p>123 Business Street</p>
              <p>City, State 12345</p>
              <p>Email: billing@company.com</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p><strong>Bill To:</strong></p>
          <p>Client Company Name</p>
          <p>456 Client Avenue</p>
          <p>City, State 67890</p>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <thead>
            <tr style={{ backgroundColor: '#3b82f6', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Description</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Qty</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Unit Price</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>Professional Services</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>40</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>$150.00</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>$6,000.00</td>
            </tr>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>Software License</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>1</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>$500.00</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>$500.00</td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>Support Package</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'center' }}>3</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>$300.00</td>
              <td style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'right' }}>$900.00</td>
            </tr>
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: 'bold', backgroundColor: '#e5e7eb' }}>
              <td colSpan={3} style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>
                Subtotal:
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>
                $7,400.00
              </td>
            </tr>
            <tr>
              <td colSpan={3} style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>
                Tax (10%):
              </td>
              <td style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>
                $740.00
              </td>
            </tr>
            <tr style={{ fontWeight: 'bold', fontSize: '18px', backgroundColor: '#3b82f6', color: 'white' }}>
              <td colSpan={3} style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'right' }}>
                TOTAL:
              </td>
              <td style={{ border: '1px solid #ddd', padding: '15px', textAlign: 'right' }}>
                $8,140.00
              </td>
            </tr>
          </tfoot>
        </table>

        {/* Payment Terms */}
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>Payment Terms</h3>
          <p>Payment is due within 30 days. Please make checks payable to Your Company Name.</p>
          <p>Bank Transfer: Account #123456789, Routing #987654321</p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb', textAlign: 'center', fontSize: '12px', color: '#6b7280' }}>
          <p>Thank you for your business!</p>
          <p>Questions? Email us at support@company.com or call (555) 123-4567</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={generatePDF}
          disabled={isGenerating}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: isGenerating ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
          }}
        >
          {isGenerating ? `Generating... ${progress}%` : 'Download Invoice PDF'}
        </button>
      </div>
    </div>
  );
}
```

## Example 2: Report with Charts (SVG)

```typescript
import { usePDFGenerator } from './lib/pdf-generator/hooks';

function AnalyticsReport() {
  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'analytics-report.pdf',
    convertSVG: true,
    optimizeImages: true,
    preventOrphanedHeadings: true,
  });

  return (
    <div ref={targetRef} style={{ width: '794px', padding: '40px' }}>
      <h1>Monthly Analytics Report</h1>
      <p>Period: January 2025</p>

      {/* Section with SVG Chart */}
      <section style={{ pageBreakInside: 'avoid' }}>
        <h2>User Growth</h2>
        <svg width="600" height="300" viewBox="0 0 600 300">
          <rect x="0" y="0" width="600" height="300" fill="#f9fafb" />
          {/* Chart bars */}
          <rect x="50" y="150" width="80" height="100" fill="#3b82f6" />
          <rect x="150" y="120" width="80" height="130" fill="#3b82f6" />
          <rect x="250" y="80" width="80" height="170" fill="#3b82f6" />
          <rect x="350" y="50" width="80" height="200" fill="#3b82f6" />
          <rect x="450" y="30" width="80" height="220" fill="#3b82f6" />
          {/* Labels */}
          <text x="90" y="270" textAnchor="middle" fontSize="12">Jan</text>
          <text x="190" y="270" textAnchor="middle" fontSize="12">Feb</text>
          <text x="290" y="270" textAnchor="middle" fontSize="12">Mar</text>
          <text x="390" y="270" textAnchor="middle" fontSize="12">Apr</text>
          <text x="490" y="270" textAnchor="middle" fontSize="12">May</text>
        </svg>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          User growth has been steadily increasing, with a 45% increase over the last 5 months.
        </p>
      </section>

      {/* Data Table */}
      <section style={{ marginTop: '30px' }}>
        <h2>Key Metrics</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'left' }}>Metric</th>
              <th style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right' }}>Value</th>
              <th style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right' }}>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px' }}>Total Users</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right' }}>15,234</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#10b981' }}>
                +12.5%
              </td>
            </tr>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td style={{ border: '1px solid #d1d5db', padding: '10px' }}>Active Sessions</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right' }}>8,456</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#10b981' }}>
                +8.3%
              </td>
            </tr>
            <tr>
              <td style={{ border: '1px solid #d1d5db', padding: '10px' }}>Bounce Rate</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right' }}>32.4%</td>
              <td style={{ border: '1px solid #d1d5db', padding: '10px', textAlign: 'right', color: '#ef4444' }}>
                -3.2%
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
```

## Example 3: Multi-Page Document with Images

```typescript
import { usePDFGenerator } from './lib/pdf-generator/hooks';

function ProductCatalog() {
  const products = [
    {
      id: 1,
      name: 'Premium Widget',
      image: '/products/widget-1.jpg',
      price: '$99.99',
      description: 'High-quality widget with advanced features and durable construction.',
    },
    // ... more products
  ];

  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'product-catalog.pdf',
    format: 'a4',
    optimizeImages: true,
    maxImageWidth: 600,
    compress: true,
  });

  return (
    <div>
      <div ref={targetRef} style={{ width: '794px', padding: '40px' }}>
        {/* Cover Page */}
        <div style={{ height: '1000px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pageBreakAfter: 'always' }}>
          <img src="/logo-large.png" alt="Company Logo" style={{ width: '300px', marginBottom: '40px' }} />
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>Product Catalog 2025</h1>
          <p style={{ fontSize: '24px', color: '#6b7280' }}>Premium Quality Products</p>
        </div>

        {/* Product Pages */}
        {products.map((product, index) => (
          <div key={product.id} style={{ pageBreakBefore: index > 0 ? 'always' : 'auto', pageBreakInside: 'avoid' }}>
            <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
              {/* Product Image */}
              <div style={{ flex: '0 0 300px' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                />
              </div>

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>{product.name}</h2>
                <p style={{ fontSize: '24px', color: '#3b82f6', fontWeight: 'bold', marginBottom: '20px' }}>
                  {product.price}
                </p>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563' }}>
                  {product.description}
                </p>

                {/* Features */}
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>Features:</h3>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li style={{ marginBottom: '8px' }}>Premium build quality</li>
                    <li style={{ marginBottom: '8px' }}>2-year warranty</li>
                    <li style={{ marginBottom: '8px' }}>Free shipping</li>
                    <li style={{ marginBottom: '8px' }}>24/7 customer support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Back Cover */}
        <div style={{ height: '1000px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pageBreakBefore: 'always', backgroundColor: '#f9fafb' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>Contact Us</h2>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Email: sales@company.com</p>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>Phone: (555) 123-4567</p>
          <p style={{ fontSize: '18px' }}>Visit: www.company.com</p>
        </div>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? `${progress}%` : 'Download Catalog'}
      </button>
    </div>
  );
}
```

## Example 4: Large Data Table with Pagination

```typescript
import { usePDFGenerator } from './lib/pdf-generator/hooks';

function EmployeeDirectory() {
  const employees = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    email: `employee${i + 1}@company.com`,
    department: ['Sales', 'Engineering', 'Marketing', 'HR'][i % 4],
    phone: `(555) ${String(i + 1).padStart(3, '0')}-${String(i + 1).padStart(4, '0')}`,
  }));

  const { targetRef, generatePDF, isGenerating } = usePDFGenerator({
    filename: 'employee-directory.pdf',
    repeatTableHeaders: true,
    avoidTableRowSplit: true,
    showPageNumbers: true,
    pageNumberPosition: 'footer',
  });

  return (
    <div>
      <div ref={targetRef} style={{ width: '794px', padding: '30px' }}>
        <h1>Employee Directory 2025</h1>
        <p style={{ marginBottom: '20px', color: '#6b7280' }}>
          Total Employees: {employees.length}
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
          <thead>
            <tr style={{ backgroundColor: '#1f2937', color: 'white' }}>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Email</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Department</th>
              <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, index) => (
              <tr key={emp.id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.email}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.department}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{emp.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download Directory'}
      </button>
    </div>
  );
}
```

## Best Practices for Production

### 1. Image Optimization
```typescript
// Always optimize images for PDF
{
  optimizeImages: true,
  maxImageWidth: 1200,
  compress: true,
  imageQuality: 0.85,
}
```

### 2. Table Handling
```typescript
// Enable table optimizations
{
  repeatTableHeaders: true,  // Headers on each page
  avoidTableRowSplit: true,   // Keep rows together
}
```

### 3. Page Breaks
```typescript
// Control page breaks
{
  preventOrphanedHeadings: true,
  respectCSSPageBreaks: true,
}

// In JSX
<div style={{ pageBreakBefore: 'always' }}>New page content</div>
<section style={{ pageBreakInside: 'avoid' }}>Keep together</section>
```

### 4. Performance
```typescript
// For large documents
{
  scale: 1.5,          // Lower scale = faster
  compress: true,       // Reduce file size
  imageQuality: 0.8,   // Balance quality/size
}
```

### 5. Progress Feedback
```typescript
{
  onProgress: (p) => setProgress(p),
  onComplete: (blob) => console.log(`PDF generated: ${blob.size} bytes`),
  onError: (err) => showErrorToast(err.message),
}
```

### 6. File Size Management
```typescript
// Monitor and optimize file size
const result = await generator.generatePDF(element, 'doc.pdf');
console.log(`Pages: ${result.pageCount}`);
console.log(`Size: ${(result.fileSize / 1024 / 1024).toFixed(2)} MB`);
console.log(`Time: ${result.generationTime}ms`);
```

These production examples demonstrate real-world usage with images, tables, SVG charts, and complex multi-page layouts!
