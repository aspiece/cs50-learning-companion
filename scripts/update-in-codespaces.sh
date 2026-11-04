#!/usr/bin/env bash
# Run this from anywhere inside a Codespace with Node.js and npm available.
set -euo pipefail
REPO="https://github.com/aspiece/cs50-learning-companion.git"
TARGET="${HOME}/cs50-learning-companion"
if [[ -d "$TARGET/.git" ]]; then
  echo "Updating extension source in $TARGET"
  git -C "$TARGET" pull --ff-only
elif [[ -e "$TARGET" ]]; then
  echo "Cannot use $TARGET: it already exists and is not a Git checkout." >&2
  exit 1
else
  echo "Cloning source to $TARGET"
  git clone "$REPO" "$TARGET"
fi
cd "$TARGET"
if ! command -v code >/dev/null || ! command -v npm >/dev/null; then
  echo "Requires VS Code CLI and npm in your Codespace." >&2
  exit 1
fi
npm install --no-audit --no-fund
npm test
npm run verify:release
npm run package
VERSION=$(node -p "require('./package.json').version")
VSIX="cs50-learning-companion-${VERSION}.vsix"
test -f "$VSIX" || { echo "Expected VSIX not found: $VSIX" >&2; exit 1; }
echo "Installing $VSIX in this VS Code environment..."
code --install-extension "$PWD/$VSIX" --force
echo "Installed extension entries:"
code --list-extensions --show-versions | grep -i 'geneseelearninglab.cs50-learning-companion' || true
echo "Reload Codespaces window using: Developer: Reload Window"
