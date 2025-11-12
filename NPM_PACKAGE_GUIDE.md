# Converting to NPM Package Guide

This guide explains how to convert this PDF generator library into a standalone NPM package.

## Step 1: Create New Project

```bash
mkdir html-to-pdf-generator
cd html-to-pdf-generator
git init
npm init -y
```

## Step 2: Copy Library Files

Copy all files from `src/lib/pdf-generator/` to the new project:

```bash
# In the new project directory
mkdir -p src
cp -r /path/to/service-charge/src/lib/pdf-generator/* src/
```

## Step 3: Setup Package Configuration

1. Copy `package.json.template` to `package.json`
2. Update the following fields:
   - `name`: Choose a unique package name (check npm availability)
   - `repository.url`: Your GitHub repository URL
   - `bugs.url`: Your issues URL
   - `homepage`: Your package homepage

3. Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.test.tsx"]
}
```

4. Create `tsup.config.ts`:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    hooks: 'src/hooks.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'jspdf', 'html2canvas'],
  treeshake: true,
  minify: true,
});
```

## Step 4: Create License File

Create `LICENSE`:

```
MIT License

Copyright (c) 2025 Mir Mursalin Ankur

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

## Step 5: Create GitHub Repository

1. Create a new repository on GitHub
2. Add remote and push:

```bash
git add .
git commit -m "Initial commit: HTML to PDF Generator library"
git branch -M main
git remote add origin https://github.com/yourusername/html-to-pdf-generator.git
git push -u origin main
```

## Step 6: Setup NPM Publishing

1. Create an NPM account at https://www.npmjs.com/signup

2. Login to NPM:
```bash
npm login
```

3. Check package name availability:
```bash
npm view @yourorg/html-to-pdf-generator
# Should return 404 if available
```

4. Test the build:
```bash
npm run build
```

5. Test locally:
```bash
npm pack
# This creates a .tgz file you can test in another project
```

## Step 7: Publish to NPM

### First Release

```bash
# Ensure everything is committed
git status

# Build the package
npm run build

# Publish to NPM
npm publish --access public
```

### Subsequent Releases

```bash
# Update version
npm version patch  # or minor, or major

# Build and publish
npm run build
npm publish

# Push tags to git
git push --follow-tags
```

## Step 8: Add GitHub Actions CI/CD

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish to NPM
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Step 9: Create GitHub Release

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Create a new tag (e.g., `v1.0.0`)
4. Add release notes
5. Publish release
6. GitHub Actions will automatically publish to NPM

## Step 10: Update README

Make sure README.md has:
- Installation instructions
- Quick start guide
- API documentation
- Examples
- Links to:
  - GitHub repository
  - Issues page
  - NPM package page
  - Demo/documentation site (if available)

## Usage After Publishing

Users can install your package:

```bash
npm install @yourorg/html-to-pdf-generator
# or
yarn add @yourorg/html-to-pdf-generator
# or
pnpm add @yourorg/html-to-pdf-generator
```

And use it:

```typescript
import { generatePDF, usePDFGenerator } from '@yourorg/html-to-pdf-generator';

// Use as documented in README.md
```

## Versioning Guide

Follow Semantic Versioning (semver):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

```bash
npm version major  # Breaking changes
npm version minor  # New features
npm version patch  # Bug fixes
```

## Maintenance Tips

1. **Add Tests**: Use Vitest to add unit tests
2. **Add Examples**: Create a `/examples` directory
3. **Setup Changesets**: Use `@changesets/cli` for better version management
4. **Add Code Coverage**: Setup coverage reporting
5. **Add Badges**: Add status badges to README (build, coverage, version, downloads)
6. **Setup Docs Site**: Consider using VitePress or Docusaurus
7. **Monitor Usage**: Setup analytics to see how your package is being used

## Marketing Your Package

1. **Write Blog Post**: Explain the problem and your solution
2. **Post on Reddit**: r/reactjs, r/webdev, r/javascript
3. **Tweet About It**: Share on Twitter/X
4. **Dev.to Article**: Write a tutorial
5. **Product Hunt**: Launch on Product Hunt
6. **Hacker News**: Share on Show HN
7. **Add to Lists**: Awesome lists, React component libraries

## Support and Community

1. **Enable Discussions**: On GitHub repository
2. **Create Discord/Slack**: For community support
3. **Respond to Issues**: Be responsive to bug reports
4. **Welcome Contributors**: Make it easy for others to contribute
5. **Add Code of Conduct**: Create welcoming environment

## Monetization Options (Optional)

1. **GitHub Sponsors**: Enable sponsorship
2. **Open Collective**: For open source funding
3. **Pro Version**: Offer premium features
4. **Support Packages**: Paid support contracts
5. **Training/Consulting**: Offer training sessions

## Legal Considerations

1. **License**: MIT is most permissive and popular
2. **Copyright**: Include copyright notice
3. **Attribution**: Acknowledge dependencies
4. **Trademark**: Consider trademark if popular
5. **DMCA**: Setup DMCA policy if accepting contributions

## Example Package Names (Check Availability)

- `@yourorg/html-to-pdf`
- `@yourorg/pdf-generator`
- `@yourorg/react-pdf-generator`
- `html-to-pdf-multi-page`
- `smart-pdf-generator`
- `react-html-pdf`

## Resources

- [NPM Publishing Guide](https://docs.npmjs.com/cli/v9/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
- [Creating NPM Packages](https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages)
- [TypeScript Library Guide](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [TSUP Documentation](https://tsup.egoist.dev/)

Good luck with your NPM package! 🚀
