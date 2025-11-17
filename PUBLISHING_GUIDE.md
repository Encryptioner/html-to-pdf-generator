# Publishing PDF Generator to NPM

Complete guide for publishing the PDF generator library as an NPM package.

## Pre-Publishing Checklist

### 1. Prepare the Package Structure

```bash
# Create a separate directory for the library
mkdir pdf-generator-package
cd pdf-generator-package

# Copy library files
cp -r src/lib/pdf-generator/* .

# Create necessary files
touch README.md
touch LICENSE
touch CHANGELOG.md
touch .npmignore
```

### 2. Create package.json

Use the provided `package.json.example` as a template:

```bash
cp package.json.example package.json
```

**Update these fields:**
- `name`: Your package name (e.g., `@encryptioner/html-to-pdf-generator`)
- `version`: Start with `1.0.0`
- `description`: Library description
- `author`: Your name and email
- `repository`: Your Git repository URL
- `homepage`: Documentation URL
- `license`: Choose license (MIT recommended)

### 3. Create .npmignore

```text
# Source files (we only publish dist/)
src/
tsconfig.json
tsup.config.ts

# Development files
*.test.ts
*.spec.ts
__tests__/
examples/

# Build artifacts
node_modules/
*.log
.DS_Store

# Git files
.git/
.gitignore

# Documentation that doesn't need to be in package
FRAMEWORK_AGNOSTIC_GUIDE.md
PUBLISHING_GUIDE.md
```

### 4. Create README.md

```markdown
# PDF Generator

Framework-agnostic PDF generator from HTML with multi-page support.

## Features

✅ Works with any framework (React, Vue, Svelte, Vanilla JS)
✅ Multi-page PDF support with smart pagination
✅ GoFullPage-like full content capture
✅ Device-independent output
✅ TypeScript support
✅ High-quality rendering
✅ Progress tracking
✅ Error handling

## Installation

### For Vanilla JS/TypeScript
\`\`\`bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
\`\`\`

### For React
\`\`\`bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
# React is already in your project
\`\`\`

### For Vue 3
\`\`\`bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
# Vue is already in your project
\`\`\`

### For Svelte
\`\`\`bash
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
# Svelte is already in your project
\`\`\`

## Quick Start

### Vanilla JavaScript
\`\`\`javascript
import { generatePDF } from '@encryptioner/html-to-pdf-generator';

const element = document.getElementById('content');
await generatePDF(element, 'document.pdf', {
  format: 'a4',
  orientation: 'portrait',
});
\`\`\`

### React
\`\`\`tsx
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/react';

function MyComponent() {
  const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
    filename: 'my-document.pdf',
  });

  return (
    <div>
      <div ref={targetRef}>Content to export</div>
      <button onClick={generatePDF} disabled={isGenerating}>
        {isGenerating ? \`Generating \${progress}%\` : 'Download PDF'}
      </button>
    </div>
  );
}
\`\`\`

### Vue 3
\`\`\`vue
<script setup>
import { usePDFGenerator } from '@encryptioner/html-to-pdf-generator/vue';

const { targetRef, generatePDF, isGenerating, progress } = usePDFGenerator({
  filename: 'my-document.pdf',
});
</script>

<template>
  <div>
    <div ref="targetRef">Content to export</div>
    <button @click="generatePDF" :disabled="isGenerating">
      {{ isGenerating ? \`Generating \${progress}%\` : 'Download PDF' }}
    </button>
  </div>
</template>
\`\`\`

### Svelte
\`\`\`svelte
<script>
  import { createPDFGenerator } from '@encryptioner/html-to-pdf-generator/svelte';

  let targetElement;
  const { generatePDF, isGenerating, progress } = createPDFGenerator({
    filename: 'my-document.pdf',
  });

  const handleDownload = () => {
    if (targetElement) generatePDF(targetElement);
  };
</script>

<div bind:this={targetElement}>Content to export</div>
<button on:click={handleDownload} disabled={$isGenerating}>
  {$isGenerating ? \`Generating \${$progress}%\` : 'Download PDF'}
</button>
\`\`\`

## API Documentation

See full documentation at [your-docs-url]

## Requirements

- Node.js >= 16.0.0
- jspdf ^2.5.2 || ^3.0.0
- html2canvas ^1.4.1

## License

MIT
```

### 5. Choose a License

**MIT License (Recommended):**
```text
MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Building and Testing

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build the Library

```bash
pnpm build
```

This creates the `dist/` folder with:
```
dist/
├── core.js         # ESM bundle
├── core.cjs        # CommonJS bundle
├── core.d.ts       # TypeScript definitions
├── react.js        # React adapter
├── react.cjs
├── react.d.ts
├── vue.js          # Vue adapter
├── vue.cjs
├── vue.d.ts
├── svelte.js       # Svelte adapter
├── svelte.cjs
└── svelte.d.ts
```

### 3. Test Locally

Before publishing, test the package locally:

```bash
# In your library directory
pnpm link

# In your test project
cd /path/to/test-project
pnpm link @encryptioner/html-to-pdf-generator

# Import and test
import { generatePDF } from '@encryptioner/html-to-pdf-generator';
```

### 4. Test in Different Frameworks

Create test projects for each framework:

```bash
# React test
npx create-react-app test-react
cd test-react
pnpm link @encryptioner/html-to-pdf-generator
# Test the React adapter

# Vue test
npm create vue@latest test-vue
cd test-vue
pnpm link @encryptioner/html-to-pdf-generator
# Test the Vue adapter

# Svelte test
npm create vite@latest test-svelte -- --template svelte
cd test-svelte
pnpm link @encryptioner/html-to-pdf-generator
# Test the Svelte adapter
```

## Publishing to NPM

### 1. Create NPM Account

If you don't have an NPM account:
```bash
npm adduser
```

If you already have an account:
```bash
npm login
```

### 2. Verify Package Configuration

```bash
# Check what will be published
npm pack --dry-run

# This shows all files that will be included in the package
```

### 3. Update Version (Semantic Versioning)

```bash
# Patch release (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - New features (backwards compatible)
npm version minor

# Major release (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### 4. Publish

```bash
# Publish publicly
npm publish --access public

# For scoped packages (@your-org/package-name)
npm publish --access public
```

### 5. Verify Publication

```bash
# Check on NPM
npm view @encryptioner/html-to-pdf-generator

# Install in a fresh project to test
mkdir test-install
cd test-install
npm init -y
npm install @encryptioner/html-to-pdf-generator jspdf html2canvas
```

## Continuous Integration (GitHub Actions)

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'

      - run: npm install

      - run: npm run build

      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Version Management

### CHANGELOG.md Example

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-01-01

### Added
- Initial release
- Core PDF generation functionality
- React adapter with usePDFGenerator hook
- Vue 3 adapter with composable
- Svelte adapter with stores
- Multi-page support with smart pagination
- Device-independent rendering
- Progress tracking
- Error handling

### Features
- Framework-agnostic core
- TypeScript support
- High-quality rendering (scale: 3, quality: 0.95)
- A4 and Letter paper formats
- Portrait and landscape orientation
- Custom margins
- Page numbering
```

## Best Practices

### 1. Semantic Versioning

- **Major (X.0.0)**: Breaking changes
- **Minor (1.X.0)**: New features, backwards compatible
- **Patch (1.0.X)**: Bug fixes

### 2. Testing Before Release

Always test:
- [ ] Build succeeds
- [ ] TypeScript types are correct
- [ ] Works in Vanilla JS
- [ ] Works in React
- [ ] Works in Vue
- [ ] Works in Svelte
- [ ] Node 16, 18, 20, 22 compatibility

### 3. Documentation

Keep updated:
- [ ] README with examples
- [ ] CHANGELOG with version history
- [ ] API documentation
- [ ] Migration guides for breaking changes

### 4. Security

- [ ] Run `npm audit` before publishing
- [ ] Keep dependencies updated
- [ ] Don't include secrets in package

## Updating the Package

```bash
# 1. Make changes to code
# 2. Update tests
# 3. Update CHANGELOG.md
# 4. Commit changes
git add .
git commit -m "feat: add new feature"

# 5. Update version
npm version minor

# 6. Push to Git (includes tags)
git push && git push --tags

# 7. Rebuild
pnpm build

# 8. Publish
npm publish --access public
```

## Troubleshooting

### Package Size Too Large

```bash
# Check package size
npm pack
du -sh *.tgz

# Reduce size by:
# 1. Adding unnecessary files to .npmignore
# 2. Minifying distribution files
# 3. Tree-shaking unused code
```

### Dependency Conflicts

If users report dependency conflicts:
```json
{
  "peerDependencies": {
    "jspdf": "^2.5.2 || ^3.0.0 || ^4.0.0"
  }
}
```

Use flexible version ranges.

### TypeScript Errors in Consumer Projects

Ensure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "skipLibCheck": false
  }
}
```

## Support and Community

After publishing:
1. Create GitHub repository
2. Enable Issues for bug reports
3. Add discussions for questions
4. Create Discord/Slack community
5. Write blog posts/tutorials

## Resources

- [NPM Documentation](https://docs.npmjs.com/)
- [Semantic Versioning](https://semver.org/)
- [Choose a License](https://choosealicense.com/)
- [tsup Documentation](https://tsup.egoist.dev/)
