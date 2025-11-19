# Publishing Scripts

Helper scripts for managing package releases.

## publish-patch.sh

Automates the complete patch version release workflow.

**What it does:**
1. Bumps patch version in package.json (e.g., 1.0.0 → 1.0.1)
2. Commits the version bump
3. Deletes old tag if it exists (both local and remote)
4. Creates new version tag
5. Pushes everything to trigger GitHub Actions publish workflow

**Usage:**
```bash
./scripts/publish-patch.sh
```

**When to use:**
- Publishing bug fixes
- After making workflow/configuration changes
- When you need to republish after fixing issues
- Moving a tag to a newer commit

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
Step 3: Deleting old v1.0.0 tag if it exists...
Step 4: Creating v1.0.1 tag...
Step 5: Getting current branch...
Step 6: Pushing to remote...

✅ Done!
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
