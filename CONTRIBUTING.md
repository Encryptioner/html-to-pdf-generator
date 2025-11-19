# Contributing to HTML to PDF Generator

Thank you for your interest in contributing to HTML to PDF Generator! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Accept criticism gracefully
- Prioritize the community's best interests

## Getting Started

### Ways to Contribute

- **Report bugs** - Submit detailed bug reports with reproduction steps
- **Suggest features** - Propose new features or enhancements
- **Fix issues** - Pick up issues labeled `good first issue` or `help wanted`
- **Improve documentation** - Help make our docs clearer and more comprehensive
- **Write tests** - Increase test coverage
- **Review PRs** - Help review pull requests from other contributors

### Before You Start

1. **Check existing issues** - Make sure your bug/feature hasn't been reported
2. **Discuss major changes** - Open an issue first for significant changes
3. **Check the roadmap** - See `docs/FEATURE_IMPLEMENTATION_STATUS.md` for planned features

## Development Setup

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **pnpm** 9.0.0+ (package manager)
- **Git**

### Installation

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/html-to-pdf-generator.git
   cd html-to-pdf-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Build the project**

   ```bash
   pnpm run build
   ```

4. **Run tests** (when available)

   ```bash
   pnpm test
   ```

### Development Commands

```bash
# Build library + MCP server
pnpm run build

# Build only library
pnpm run build:lib

# Build only MCP server
pnpm run build:mcp

# Watch mode for development
pnpm run dev

# Type check
pnpm run typecheck

# Lint code
pnpm run lint

# Clean build artifacts
pnpm run clean
```

## Project Structure

```
html-to-pdf-generator/
├── src/                      # Source code
│   ├── core.ts              # Main PDFGenerator class
│   ├── types.ts             # TypeScript type definitions
│   ├── utils.ts             # Utility functions
│   ├── image-handler.ts     # Image processing
│   ├── table-handler.ts     # Table pagination
│   ├── page-break-handler.ts # Page break logic
│   └── adapters/            # Framework adapters
│       ├── react/           # React hooks
│       ├── vue/             # Vue composables
│       ├── svelte/          # Svelte stores
│       └── node/            # Node.js/Puppeteer
├── mcp/                     # MCP server
│   └── src/                 # MCP server source
├── documentation/           # User documentation
│   ├── guides/             # Getting started guides
│   ├── features/           # Feature documentation
│   ├── advanced/           # Advanced features
│   ├── api/                # API reference
│   └── examples/           # Code examples
├── docs/                    # Project documentation
├── dist/                    # Build output
├── tsup.config.ts          # Build configuration
├── tsconfig.json           # TypeScript config
└── package.json            # Package manifest
```

## Making Changes

### Creating a Branch

Create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### Writing Code

1. **Follow the existing code style** - Use the same patterns as existing code
2. **Write TypeScript** - All code should be properly typed
3. **Add JSDoc comments** - Document public APIs
4. **Keep functions focused** - Single responsibility principle
5. **Avoid breaking changes** - Maintain backward compatibility when possible

### Example Code Style

```typescript
/**
 * Generate PDF from HTML element
 *
 * @param element - The HTML element to convert
 * @param filename - Output filename
 * @param options - PDF generation options
 * @returns Promise resolving to generation result
 *
 * @example
 * ```typescript
 * const result = await generatePDF(
 *   document.getElementById('content'),
 *   'document.pdf',
 *   { format: 'a4' }
 * );
 * ```
 */
export async function generatePDF(
  element: HTMLElement,
  filename: string = 'document.pdf',
  options: Partial<PDFGeneratorOptions> = {}
): Promise<PDFGenerationResult> {
  const generator = new PDFGenerator(options);
  return generator.generatePDF(element, filename);
}
```

## Coding Standards

### TypeScript

- **Use strict mode** - Already enabled in `tsconfig.json`
- **Define types** - No `any` unless absolutely necessary
- **Export types** - Make types available for users
- **Use interfaces** - For options and public APIs

### Code Quality

- **No console.log** - Use proper logging or remove debug statements
- **Error handling** - Handle errors gracefully
- **Resource cleanup** - Clean up timers, observers, event listeners
- **Memory management** - Revoke blob URLs, disconnect observers

### Example Good Practices

```typescript
// ✅ Good - Proper typing
interface PreviewOptions {
  containerId: string;
  liveUpdate?: boolean;
}

// ❌ Bad - Using any
function setupPreview(options: any) { }

// ✅ Good - Resource cleanup
stopPreview(): void {
  if (this.mutationObserver) {
    this.mutationObserver.disconnect();
    this.mutationObserver = null;
  }
  if (this.previewBlobUrl) {
    URL.revokeObjectURL(this.previewBlobUrl);
    this.previewBlobUrl = null;
  }
}

// ❌ Bad - No cleanup
stopPreview(): void {
  this.isActive = false;
}
```

## Testing

### Running Tests

```bash
pnpm test
```

### Writing Tests

When adding new features:

1. **Add unit tests** - Test individual functions
2. **Add integration tests** - Test feature end-to-end
3. **Test edge cases** - Empty inputs, large inputs, errors
4. **Test browser compatibility** - Chrome, Firefox, Safari

### Test Structure

```typescript
describe('PDFGenerator', () => {
  describe('startPreview', () => {
    it('should create preview iframe', async () => {
      // Test implementation
    });

    it('should throw error if container not found', async () => {
      // Test implementation
    });
  });
});
```

## Documentation

### When to Update Documentation

Update documentation when you:
- Add a new feature
- Change existing behavior
- Add new options
- Fix a bug that affects documented behavior

### Documentation Locations

1. **JSDoc comments** - In source code
2. **Type definitions** - In `src/types.ts`
3. **README.md** - Quick start and examples
4. **documentation/** - Detailed feature guides
5. **FEATURE_IMPLEMENTATION_STATUS.md** - Implementation status

### Documentation Standards

- **Be clear and concise** - Use simple language
- **Provide examples** - Show code examples
- **Explain why** - Not just what and how
- **Update all formats** - React, Vue, Svelte examples
- **Include troubleshooting** - Common issues and solutions

### Example Documentation

```markdown
## PDF Preview

Display a real-time preview of your PDF with automatic updates as content changes.

### Basic Usage

\`\`\`typescript
const generator = new PDFGenerator({
  previewOptions: {
    containerId: 'preview',
    liveUpdate: true
  }
});

await generator.startPreview(element);
\`\`\`

### Options

- `containerId` (required) - Container element ID
- `liveUpdate` (default: false) - Enable auto-updates

### Troubleshooting

**Issue**: Preview not showing

**Solution**: Ensure container exists in DOM before calling `startPreview()`
```

## Submitting Changes

### Before Submitting

1. **Run the build** - Ensure code compiles
   ```bash
   pnpm run build
   ```

2. **Check types** - No TypeScript errors
   ```bash
   pnpm run typecheck
   ```

3. **Run linter** - Follow code style
   ```bash
   pnpm run lint
   ```

4. **Test your changes** - Verify everything works
   ```bash
   pnpm test
   ```

5. **Update documentation** - Add/update docs as needed

### Commit Messages

Follow conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `refactor` - Code refactoring
- `test` - Test additions/changes
- `chore` - Maintenance tasks
- `perf` - Performance improvements

**Examples:**

```
feat(preview): implement real-time PDF preview

Add PDF preview feature with live updates using MutationObserver.
Includes iframe rendering, debouncing, and resource cleanup.

Closes #123
```

```
fix(security): correct permission mapping for jsPDF

Fixed incorrect mapping between PDFSecurityPermissions and
jsPDF userPermissions array.

Fixes #456
```

```
docs(readme): add preview feature examples

Added comprehensive preview examples for React, Vue, and Svelte
with HTML structure and configuration options.
```

### Pull Request Process

1. **Create a pull request** to the `main` branch

2. **Fill out the PR template** with:
   - Description of changes
   - Related issue numbers
   - Testing performed
   - Breaking changes (if any)
   - Documentation updates

3. **Respond to feedback** - Address reviewer comments

4. **Update as needed** - Make requested changes

5. **Wait for approval** - At least one maintainer approval required

### Pull Request Template

```markdown
## Description
Brief description of what this PR does

## Related Issues
Closes #123

## Changes Made
- Added preview feature
- Updated documentation
- Added tests

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Added unit tests
- [ ] Updated documentation

## Breaking Changes
None / List breaking changes

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Release Process

Releases are handled by maintainers:

1. **Version bump** - Update version in `package.json`
2. **Update changelog** - Document changes
3. **Create release tag** - Tag with version number
4. **Publish to NPM** - `pnpm publish`
5. **Create GitHub release** - With release notes

## Questions?

- **Issues** - [GitHub Issues](https://github.com/Encryptioner/html-to-pdf-generator/issues)
- **Discussions** - [GitHub Discussions](https://github.com/Encryptioner/html-to-pdf-generator/discussions)
- **Email** - mir.ankur.ruet13@gmail.com

## Recognition

All contributors will be recognized in:
- GitHub contributors list
- Release notes
- Project README (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HTML to PDF Generator! 🎉
