# Publishing to NPM

Quick guide for publishing this package to NPM.

## Prerequisites

1. NPM account with access to publish `@encryptioner` scope
2. Logged in to NPM: `npm login`
3. pnpm installed: `npm install -g pnpm`

## Pre-Publishing Checklist

- [ ] All tests passing: `pnpm test`
- [ ] Type checking passes: `pnpm run typecheck`
- [ ] Linting passes: `pnpm run lint`
- [ ] Build succeeds: `pnpm run build`
- [ ] Version updated in package.json
- [ ] CHANGELOG.md updated with changes
- [ ] README.md is up to date

## Publishing Steps

### 1. Update Version

```bash
# Patch release (1.0.0 -> 1.0.1) - Bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - New features (backwards compatible)
npm version minor

# Major release (1.0.0 -> 2.0.0) - Breaking changes
npm version major
```

### 2. Build and Test

```bash
# Clean, build, and typecheck
pnpm run prepublishOnly

# Verify build output
ls -la dist/
```

### 3. Test Locally (Optional)

```bash
# Pack the package
npm pack

# This creates @encryptioner-html-to-pdf-generator-1.0.0.tgz
# Test install in another project:
cd /path/to/test-project
npm install /path/to/@encryptioner-html-to-pdf-generator-1.0.0.tgz
```

### 4. Publish

```bash
# Dry run first (see what will be published)
npm publish --dry-run

# Publish to NPM
npm publish --access public
```

### 5. Verify

```bash
# Check on NPM
npm view @encryptioner/html-to-pdf-generator

# Install fresh to test
mkdir test-install && cd test-install
npm init -y
npm install @encryptioner/html-to-pdf-generator
```

## What Gets Published

Based on `.npmignore`, only these files are published:

- `dist/` - All built files (JS, CJS, TypeScript definitions)
- `README.md` - Package documentation
- `LICENSE.md` - MIT license

Source files (`src/`), configuration files, and development files are excluded.

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (1.X.0): New features, backwards compatible
- **PATCH** (1.0.X): Bug fixes

## Troubleshooting

### Package too large

```bash
npm pack --dry-run
# Check which files are included and update .npmignore
```

### Authentication failed

```bash
npm whoami  # Check if logged in
npm login   # Login to NPM
```

### Permission denied

Make sure you have access to the `@encryptioner` scope on NPM.

## Post-Publishing

1. Create a GitHub release with the version tag
2. Update documentation if needed
3. Announce in relevant channels
4. Monitor for issues/feedback
