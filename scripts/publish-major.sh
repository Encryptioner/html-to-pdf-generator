#!/bin/bash
# Script to publish a major version (e.g., 1.5.3 → 2.0.0)
# This handles the complete workflow including tag management

set -e

echo "===== Publishing Major Version ====="
echo ""
echo "⚠️  WARNING: This is a MAJOR version bump!"
echo "This indicates breaking changes and will reset minor/patch to 0."
echo ""
echo "This script will:"
echo "1. Bump major version in package.json (e.g., 1.5.3 → 2.0.0)"
echo "2. Commit the version bump"
echo "3. Delete old tag if it exists (local and remote)"
echo "4. Create new version tag"
echo "5. Push everything to trigger the GitHub Actions publish workflow"
echo ""

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "Current version: $CURRENT_VERSION"

# Calculate new version (major bump)
IFS='.' read -r -a version_parts <<< "$CURRENT_VERSION"
major="${version_parts[0]}"
new_major=$((major + 1))
NEW_VERSION="$new_major.0.0"

echo "New version will be: $NEW_VERSION"
echo ""
echo "⚠️  This is a breaking change! Make sure you've:"
echo "   - Updated CHANGELOG.md with breaking changes"
echo "   - Updated migration guide"
echo "   - Reviewed all breaking API changes"
echo ""

read -p "Are you sure you want to continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "Step 1: Updating version to $NEW_VERSION..."
pnpm version major --no-git-tag-version

echo "Step 2: Committing version bump..."
git add package.json
git commit -m "chore: bump version to $NEW_VERSION

BREAKING CHANGE: Major release with breaking changes.
See CHANGELOG.md for migration guide."

echo "Step 3: Deleting v$NEW_VERSION tag if it exists (from previous failed attempt)..."
git tag -d "v$NEW_VERSION" 2>/dev/null || echo "  (no local tag to delete)"
git push origin --delete "v$NEW_VERSION" 2>/dev/null || echo "  (no remote tag to delete)"

echo "Step 4: Creating v$NEW_VERSION tag..."
git tag "v$NEW_VERSION"

echo "Step 5: Getting current branch..."
CURRENT_BRANCH=$(git branch --show-current)
echo "  Current branch: $CURRENT_BRANCH"

echo "Step 6: Pushing to remote..."
git push origin "$CURRENT_BRANCH"
git push origin "v$NEW_VERSION"

echo ""
echo "✅ Done!"
echo ""
echo "Next steps:"
echo "1. Monitor GitHub Actions workflow:"
echo "   https://github.com/Encryptioner/html-to-pdf-generator/actions"
echo ""
echo "2. Once published, verify on NPM:"
echo "   https://www.npmjs.com/package/@encryptioner/html-to-pdf-generator"
echo ""
echo "3. Test installation:"
echo "   npm install @encryptioner/html-to-pdf-generator@$NEW_VERSION"
echo ""
echo "4. Update documentation with migration guide"
echo ""
