# Publishing Scripts

Helper scripts for managing package releases following semantic versioning.

## Overview

Three scripts automate version bumping and publishing:
- **publish-patch.sh** - Bug fixes (1.0.0 → 1.0.1)
- **publish-minor.sh** - New features (1.0.5 → 1.1.0)
- **publish-major.sh** - Breaking changes (1.5.3 → 2.0.0)

All scripts:
- Automatically calculate the new version
- Commit the version bump
- Clean up any existing tags (from previous failed attempts)
- Create and push new version tag
- Trigger GitHub Actions publish workflow

**Making scripts executable:**
```bash
chmod +x scripts/publish-patch.sh scripts/publish-minor.sh scripts/publish-major.sh
```

## publish-patch.sh

Automates patch version releases for bug fixes and minor improvements.

**What it does:**
1. Bumps patch version in package.json (e.g., 1.0.0 → 1.0.1)
2. Commits the version bump
3. Deletes NEW version tag if it exists (from previous failed attempt)
4. Creates new version tag
5. Pushes everything to trigger GitHub Actions publish workflow

**Usage:**
```bash
./scripts/publish-patch.sh
```

**When to use:**
- Publishing bug fixes
- After making workflow/configuration changes
- Documentation updates
- Performance improvements without API changes

**Prerequisites:**
- All changes committed
- Clean working directory
- On the correct branch (`pre/**` for pre-releases, `master` for production)

**What happens next:**
- GitHub Actions workflow runs automatically
- Package is published to NPM
- GitHub Release is created

**Example output:**
```
===== Publishing Patch Version =====

Current version: 1.0.0
New version will be: 1.0.1

Continue? (y/n) y

Step 1: Updating version to 1.0.1...
Step 2: Committing version bump...
Step 3: Deleting v1.0.1 tag if it exists (from previous failed attempt)...
Step 4: Creating v1.0.1 tag...
Step 5: Getting current branch...
Step 6: Pushing to remote...

✅ Done!
```

## publish-minor.sh

Automates minor version releases for new features.

**What it does:**
1. Bumps minor version in package.json (e.g., 1.0.5 → 1.1.0)
2. Commits the version bump
3. Deletes NEW version tag if it exists (from previous failed attempt)
4. Creates new version tag
5. Pushes everything to trigger GitHub Actions publish workflow

**Usage:**
```bash
./scripts/publish-minor.sh
```

**When to use:**
- Adding new features
- New framework adapters
- New configuration options
- Backwards-compatible API additions

**Prerequisites:**
- All changes committed
- Clean working directory
- On the correct branch
- New features tested and documented

**Example:**
```
Current: 1.2.5
New: 1.3.0
```

## publish-major.sh

Automates major version releases for breaking changes.

**What it does:**
1. Bumps major version in package.json (e.g., 1.5.3 → 2.0.0)
2. Commits the version bump with BREAKING CHANGE notice
3. Deletes NEW version tag if it exists (from previous failed attempt)
4. Creates new version tag
5. Pushes everything to trigger GitHub Actions publish workflow

**Usage:**
```bash
./scripts/publish-major.sh
```

**When to use:**
- Breaking API changes
- Removing deprecated features
- Major refactoring that affects public API
- Incompatible updates to dependencies

**Prerequisites:**
- All changes committed
- Clean working directory
- **CHANGELOG.md updated with breaking changes**
- **Migration guide prepared**
- Breaking changes reviewed and documented

**Example:**
```
⚠️  WARNING: This is a MAJOR version bump!

Current version: 1.5.3
New version will be: 2.0.0

⚠️  This is a breaking change! Make sure you've:
   - Updated CHANGELOG.md with breaking changes
   - Updated migration guide
   - Reviewed all breaking API changes

Are you sure you want to continue? (y/n)
```

## verify-package.cjs

Verifies package structure before publishing.

**Usage:**
```bash
node scripts/verify-package.cjs
```

Checks:
- Package.json exports are valid
- TypeScript declarations exist
- Build outputs are present
- No missing files
