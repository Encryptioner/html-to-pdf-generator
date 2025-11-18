# Publishing Guide

This guide explains how to publish new versions of `@encryptioner/html-to-pdf-generator` to NPM.

## Prerequisites

### 1. NPM Account Setup

You need an NPM account where your username is `encryptioner` (or the scope you want to use).

**Important:** For the scoped package `@encryptioner/html-to-pdf-generator`:
- ✅ **No organization required** if your npm username is `encryptioner`
- ✅ The scope automatically matches your username
- ✅ You can publish public scoped packages for free

If your npm username is different, you have two options:
- Change your npm username to `encryptioner`
- Create an organization called `encryptioner` (requires setup at npmjs.com)

### 2. GitHub Secrets Configuration

You need to configure **one secret** in your GitHub repository:

**`NPM_TOKEN`** - Your NPM authentication token (required)
- This is the only secret you need to manually create
- Used to authenticate with NPM for publishing

**`GITHUB_TOKEN`** - Automatically provided by GitHub (no setup needed)
- GitHub creates this automatically for every workflow run
- Used only for creating GitHub Releases
- You don't need to create or configure this

### 3. Creating a Granular Access Token

NPM now uses **Granular Access Tokens** (classic tokens are deprecated). These provide better security with fine-grained permissions.

**Steps to create the NPM_TOKEN granular access token:**

1. **Log in to npmjs.com**
   - Go to [npmjs.com](https://www.npmjs.com/) and sign in

2. **Navigate to Access Tokens**
   - Click your profile picture → "Access Tokens"
   - Click "Generate New Token" → Select "**Granular Access Token**"

3. **Configure Token Settings**

   **Basic Information:**
   - **Token Name**: `GitHub Actions CI/CD` (or descriptive name)
   - **Expiration**: Choose an expiration date (e.g., 90 days, 1 year)
     - ⚠️ You'll need to regenerate and update the secret when it expires

   **Permissions:**
   - Select "**Read and write**" for packages
   - Under "Packages and scopes" → Select:
     - "All packages" OR
     - Specifically select `@encryptioner/html-to-pdf-generator`

   **Organizations (if applicable):**
   - If using an organization scope, grant appropriate access

   **Optional Security:**
   - **IP Allowlist**: You can restrict to GitHub Actions IP ranges (optional)
   - **CIDR notation**: Leave empty for all IPs or add specific ranges

4. **Copy the Token**
   - ⚠️ **Important**: Copy the token immediately - you won't be able to see it again
   - The token starts with `npm_...`

5. **Add to GitHub Secrets**
   - Go to your repository: `Settings → Secrets and variables → Actions`
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Paste the token you copied
   - Click "Add secret"

## Publishing Process

### Branch Strategy

**Important: Always publish from the correct branch!**

Based on your repository structure, here's the recommended branching strategy:

- **`master`** - Main production branch
  - Use for stable releases (v1.0.0, v1.1.0, v2.0.0)
  - All production tags should be pushed from here

- **`release/**`** - Release preparation branches
  - Use for release candidates and final testing
  - Example: `release/1.0.0`, `release/2.0.0`
  - Merge to `master` when ready for production

- **`pre/**`** - Pre-release branches (your current branch: `pre/release/1.0.0`)
  - Use for alpha, beta, and release candidate versions
  - Example: `pre/release/1.0.0` for v1.0.0-beta.1
  - Test thoroughly before promoting to `release/**`

### Automated Publishing (Recommended)

The package is automatically published when you push a version tag:

**Step-by-step process:**

#### 1. Ensure You're on the Correct Branch

```bash
# For production releases
git checkout master
git pull origin master

# For pre-releases
git checkout pre/release/1.0.0  # or your pre-release branch
git pull origin pre/release/1.0.0
```

#### 2. Ensure All Changes Are Committed

```bash
# Check status
git status

# If there are uncommitted changes
git add .
git commit -m "chore: prepare for release"

# Push commits
git push origin master  # or your current branch
```

#### 3. Create a Version Tag

**Using pnpm (Recommended):**
```bash
# For patch release (1.0.0 → 1.0.1)
pnpm version patch

# For minor release (1.0.0 → 1.1.0)
pnpm version minor

# For major release (1.0.0 → 2.0.0)
pnpm version major

# For specific version
pnpm version 1.2.3
```

This command will:
- Update `package.json` version
- Create a git commit with message "1.0.1"
- Create a git tag `v1.0.1`

**Manual tagging (alternative):**
```bash
# If you've already updated package.json manually
git tag v1.0.1
```

#### 4. Push the Tag to Trigger Publishing

```bash
# Push the tag only
git push origin v1.0.1

# Or push commits and tags together
git push origin master --tags
```

**⚠️ Important:** Once you push a tag starting with `v`, the GitHub Actions workflow automatically:
1. ✅ Runs type checking
2. ✅ Runs tests
3. ✅ Runs linting
4. ✅ Builds the package (lib + MCP server)
5. ✅ Verifies package.json version matches the tag
6. ✅ Publishes to NPM with provenance
7. ✅ Creates a GitHub Release

### Manual Publishing

You can also trigger publishing manually from GitHub:

1. Go to "Actions" tab in your repository
2. Select "Publish to NPM" workflow
3. Click "Run workflow"
4. Optionally specify a tag (e.g., `v1.0.1`)
5. Click "Run workflow"

### Local Publishing (Not Recommended)

For emergency situations only:

```bash
# 1. Ensure you're logged in to NPM
npm login

# 2. Build and publish
pnpm run prepublishOnly
pnpm publish --access public
```

## Version Workflow Examples

### Production Releases (from `master` branch)

#### Patch Release (Bug fixes: 1.0.0 → 1.0.1)

```bash
# 1. Switch to master and ensure it's up to date
git checkout master
git pull origin master

# 2. Create version tag
pnpm version patch

# 3. Push commit and tag
git push origin master
git push origin v1.0.1
```

#### Minor Release (New features: 1.0.0 → 1.1.0)

```bash
# 1. Switch to master and ensure it's up to date
git checkout master
git pull origin master

# 2. Create version tag
pnpm version minor

# 3. Push commit and tag
git push origin master
git push origin v1.1.0
```

#### Major Release (Breaking changes: 1.0.0 → 2.0.0)

```bash
# 1. Switch to master and ensure it's up to date
git checkout master
git pull origin master

# 2. Create version tag
pnpm version major

# 3. Push commit and tag
git push origin master
git push origin v2.0.0
```

### Pre-release Versions (from `pre/**` branches)

Pre-releases are useful for testing before official release.

#### Alpha Release (Early testing)

```bash
# 1. Switch to pre-release branch
git checkout pre/release/1.0.0
git pull origin pre/release/1.0.0

# 2. Create alpha version
pnpm version prerelease --preid=alpha  # 1.0.0 → 1.0.1-alpha.0

# 3. Push commit and tag
git push origin pre/release/1.0.0
git push origin v1.0.1-alpha.0
```

**Installing alpha versions:**
```bash
npm install @encryptioner/html-to-pdf-generator@alpha
# or specific version
npm install @encryptioner/html-to-pdf-generator@1.0.1-alpha.0
```

#### Beta Release (Feature complete, testing)

```bash
# 1. Switch to pre-release branch
git checkout pre/release/1.0.0
git pull origin pre/release/1.0.0

# 2. Create beta version
pnpm version prerelease --preid=beta   # 1.0.0 → 1.0.1-beta.0

# 3. Push commit and tag
git push origin pre/release/1.0.0
git push origin v1.0.1-beta.0
```

#### Release Candidate (Final testing before production)

```bash
# 1. Switch to release branch
git checkout release/1.0.0
git pull origin release/1.0.0

# 2. Create RC version
pnpm version prerelease --preid=rc     # 1.0.0 → 1.0.1-rc.0

# 3. Push commit and tag
git push origin release/1.0.0
git push origin v1.0.1-rc.0
```

### Managing Pre-release Tags

When publishing pre-releases, you may want to update the workflow to add npm dist-tags:

**For manual control of dist-tags:**
```bash
# After automatic publish, set the dist-tag
npm dist-tag add @encryptioner/html-to-pdf-generator@1.0.1-beta.0 beta

# Users can then install with:
npm install @encryptioner/html-to-pdf-generator@beta
```

**Note:** The automated workflow publishes all versions with the `latest` tag by default. For pre-releases to use a different tag (like `beta`), you would need to modify the publish workflow.

## Complete Release Workflow

### Full Production Release Process

Here's the complete workflow from feature development to NPM:

```bash
# 1. Feature development on feature branch
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 2. Create PR and merge to master after review
# (via GitHub UI or gh CLI)

# 3. Pull latest master
git checkout master
git pull origin master

# 4. Update CHANGELOG.md
# Document all changes since last release

# 5. Commit changelog updates
git add CHANGELOG.md
git commit -m "docs: update changelog for v1.1.0"
git push origin master

# 6. Create version tag and push
pnpm version minor  # Creates v1.1.0
git push origin master
git push origin v1.1.0

# 7. Monitor GitHub Actions
# Go to: https://github.com/Encryptioner/html-to-pdf-generator/actions
# Watch the "Publish to NPM" workflow

# 8. Verify publication
# Check: https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator
# Test install: npm install @encryptioner/html-to-pdf-generator@latest
```

## Best Practices

### Before Publishing

1. **Update CHANGELOG.md**: Document all changes since the last release
2. **Test locally**: Run `pnpm test` and verify all tests pass
3. **Build verification**: Run `pnpm run build` and check dist/ outputs
4. **Ensure clean working directory**: `git status` should show no uncommitted changes
5. **Be on the correct branch**:
   - `master` for production releases
   - `pre/**` for pre-releases
6. **Pull latest changes**: `git pull origin <branch>` to ensure you're up to date

### Version Guidelines

Follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): New features (backward compatible)
- **PATCH** (1.0.0 → 1.0.1): Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests passing
- [ ] CHANGELOG.md updated
- [ ] Documentation updated (if needed)
- [ ] Version bumped in package.json
- [ ] Tag created and pushed
- [ ] GitHub Release created (auto-generated)
- [ ] NPM package published
- [ ] Verify package on npmjs.com
- [ ] Test installation: `npm install @encryptioner/html-to-pdf-generator@latest`

## Security & Public Packages

### Is This Workflow Safe for Public Repositories?

**Yes, absolutely!** This workflow is designed for public NPM packages and is completely secure:

1. **Protected Publishing**:
   - Only repository maintainers can push tags (requires write access)
   - External contributors cannot trigger the publish workflow
   - Pull requests from forks cannot access secrets

2. **Limited Permissions**:
   - The workflow has minimal permissions (`contents: read`)
   - Can only read code and create releases
   - Cannot modify repository settings or code

3. **Secret Protection**:
   - `NPM_TOKEN` is masked in all logs
   - Only available to workflows in your repository
   - Cannot be accessed by external contributors

4. **Standard Practice**:
   - This is the recommended approach for public NPM packages
   - Used by thousands of open-source projects
   - Follows GitHub and NPM best practices

### What Secrets Are Used?

| Secret | Who Creates It | Purpose | Setup Required |
|--------|----------------|---------|----------------|
| `NPM_TOKEN` | You | Publish to NPM | ✅ Yes - follow guide above |
| `GITHUB_TOKEN` | GitHub (automatic) | Create GitHub Releases | ❌ No - automatic |

## Troubleshooting

### Publishing Fails with Authentication Error

- Verify `NPM_TOKEN` secret is set correctly in GitHub
- Ensure the token hasn't expired (check expiration date)
- Verify the token has "Read and write" permissions for your package
- Check that the token scope includes `@encryptioner/html-to-pdf-generator`
- If using IP restrictions, ensure GitHub Actions IPs are allowed
- **Note**: `GITHUB_TOKEN` is automatic - don't create it manually!

### First-Time Publishing a Scoped Package

If this is your first time publishing `@encryptioner/html-to-pdf-generator`:

1. **Verify Scope Ownership**
   ```bash
   npm owner ls @encryptioner/html-to-pdf-generator
   ```

2. **Check if Scope is Available**
   - If the scope doesn't exist, npm will create it on first publish
   - Your npm username must match the scope OR you need an organization

3. **Publishing for the First Time**
   - Use `--access public` flag (scoped packages are private by default)
   - The workflow already includes this flag

4. **Scope Already Taken**
   - If someone else owns `@encryptioner`, you'll need to:
     - Use a different scope (e.g., `@your-username/html-to-pdf-generator`)
     - Or contact npm support to transfer/verify ownership

### Version Mismatch Error

The workflow verifies that package.json version matches the git tag. If they don't match:

```bash
# Update package.json to match tag
pnpm version 1.0.1 --no-git-tag-version

# Commit and re-tag
git add package.json
git commit -m "chore: bump version to 1.0.1"
git tag -f v1.0.1
git push --force origin v1.0.1
```

### Build Failures

If the build fails during publishing:

1. Run `pnpm run build` locally to debug
2. Check TypeScript errors: `pnpm run typecheck`
3. Fix any linting issues: `pnpm run lint`
4. Verify tests pass: `pnpm test`

### Package Not Appearing on NPM

1. Check the GitHub Actions logs for errors
2. Verify package name is available (not taken by another package)
3. Ensure you have publish rights to the `@encryptioner` scope
4. Wait a few minutes - NPM can have a delay

## Continuous Integration

The CI workflow (`.github/workflows/ci.yml`) runs on:
- Every push to `main` branch
- Every push to `pre/**` branches
- All pull requests to `main`

It tests the package across Node.js versions: 18.20.0, 20, and 22.

## Rolling Back a Release

If you need to rollback a published version:

```bash
# Deprecate the broken version
npm deprecate @encryptioner/html-to-pdf-generator@1.0.1 "This version has critical bugs, use 1.0.0 instead"

# Or unpublish (only within 72 hours)
npm unpublish @encryptioner/html-to-pdf-generator@1.0.1
```

Then publish a fixed version immediately.

## Quick Reference

### Which Branch Should I Use?

| Release Type | Branch | Tag Pattern | npm Tag | Example |
|-------------|---------|------------|---------|---------|
| Production Patch | `master` | `v*.*.*` | `latest` | `v1.0.1` |
| Production Minor | `master` | `v*.*.*` | `latest` | `v1.1.0` |
| Production Major | `master` | `v*.*.*` | `latest` | `v2.0.0` |
| Alpha | `pre/**` | `v*.*.*-alpha.*` | `alpha` | `v1.0.0-alpha.0` |
| Beta | `pre/**` | `v*.*.*-beta.*` | `beta` | `v1.0.0-beta.0` |
| Release Candidate | `release/**` | `v*.*.*-rc.*` | `rc` | `v1.0.0-rc.0` |

### Common Git Tag Commands

```bash
# Create and push a patch version
pnpm version patch && git push origin master && git push origin --tags

# Create and push a minor version
pnpm version minor && git push origin master && git push origin --tags

# Create and push a major version
pnpm version major && git push origin master && git push origin --tags

# Create and push a beta version
pnpm version prerelease --preid=beta && git push origin pre/release/1.0.0 && git push origin --tags

# List all tags
git tag -l

# Delete a local tag
git tag -d v1.0.1

# Delete a remote tag
git push origin --delete v1.0.1

# View tag details
git show v1.0.1
```

### Troubleshooting Tag Issues

**If you pushed the wrong tag:**
```bash
# 1. Delete the tag locally
git tag -d v1.0.1

# 2. Delete the tag from remote (stops the workflow)
git push origin --delete v1.0.1

# 3. Create the correct tag
pnpm version 1.0.2

# 4. Push the correct tag
git push origin v1.0.2
```

**If you need to move a tag to a different commit:**

This happens when you create a tag, then make additional commits (like bug fixes) and want the tag to point to the latest commit.

```bash
# Scenario: You created tag v1.0.0, then made fixes, now want to move the tag

# 1. Commit your fixes first
git add .
git commit -m "fix: your fix message"
git push origin pre/release/1.0.0  # or your branch

# 2. Delete the old tag locally
git tag -d v1.0.0

# 3. Delete the old tag from remote (this cancels any running workflow)
git push origin --delete v1.0.0

# 4. Create the tag again on the current commit
git tag v1.0.0

# 5. Force push the new tag
git push origin v1.0.0

# Alternative: Use --force flag in one step
git tag -f v1.0.0              # Force create/move tag locally
git push origin v1.0.0 --force # Force push to remote
```

**Important Notes:**
- Always commit and push your code changes BEFORE creating/moving tags
- Moving a tag will restart the publish workflow from the beginning
- The package.json version must match the tag version (e.g., v1.0.0 → "version": "1.0.0")

**If the workflow fails after pushing a tag:**
1. Check the GitHub Actions logs for the error
2. Fix the issue in your code
3. Commit and push the fixes
4. Move the tag to the new commit (see above)
   OR delete the tag and create a new patch version

**Common workflow failures and fixes:**
- **"Dependencies lock file not found"** → Commit pnpm-lock.yaml
- **"Version mismatch"** → Update package.json version to match tag
- **"Repository URL mismatch"** → Ensure repository URL in package.json matches GitHub (case-sensitive)
- **"Cannot publish over previously published version"** → Bump to next patch version using `./scripts/publish-patch.sh`
- **"Resource not accessible by integration" (403)** → Workflow needs `contents: write` permission
- **ESLint errors** → Fix linting issues or temporarily disable linter in workflow

### Quick Fix Script

For common scenarios like needing to republish with fixes, use the helper script:

```bash
./scripts/publish-patch.sh
```

This script handles:
- Version bumping
- Tag management
- Committing and pushing
- Triggering the publish workflow

See `scripts/README.md` for details.

## Support

For questions or issues:
- GitHub Issues: https://github.com/Encryptioner/html-to-pdf-generator/issues
- NPM Package: https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator
- GitHub Actions: https://github.com/Encryptioner/html-to-pdf-generator/actions
