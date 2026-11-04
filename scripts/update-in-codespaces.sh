#!/usr/bin/env bash
# Update or install the GCI CS50 Learning Companion from a local checkout.
# Can be run from any working directory, no need for /workspaces paths.
set -euo pipefail
TARGET="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
error() { printf '\nGCI installation stopped: %s\n' "$*" >&2; exit 1; }

[[ -d "$TARGET/.git" ]] || error "Extension source is not a git repository: $TARGET. Use the classroom installation command."
command -v git >/dev/null || error "git not found; open your official CS50 Codespace."
command -v node >/dev/null || error "Node.js is unavailable. Your Codespace needs Node.js to build this extension."
command -v npm >/dev/null || error "npm is unavailable. Your Codespace needs npm to build this extension."
node -e "if(+process.versions.node.split('.')[0]<20)process.exit(1)" || error "Node.js 20 or newer is required (found $(node --version))."

echo ""
echo "[1/4] Updating companion source in: $TARGET"
git -C "$TARGET" pull --ff-only || error "Git could not update the source. If you edited extension files, save or commit those changes before retrying. Your assignment files were not changed."

cd "$TARGET"
echo "[2/4] Preparing the extension package"
npm install --no-audit --no-fund || error "npm could not install the extension's build tools. Check the network or ask your teacher for help."

# Automated tests run in GitHub Actions on each commit. Students do not
# need to execute the development test suite to install a released version.
if [[ "${GCI_RUN_TESTS:-0}" == "1" ]]; then
  echo "Running optional development tests..."
  npm test || error "The extension's development tests failed."
fi
npm run verify:release || error "Release metadata verification failed."
npm run package || error "Could not build the VS Code extension file."

VERSION="$(node -p "require('./package.json').version")"
VSIX="$TARGET/cs50-learning-companion-${VERSION}.vsix"
[[ -f "$VSIX" ]] || error "Expected extension file not found: $VSIX"

echo "[3/4] Installing GCI CS50 Learning Companion v${VERSION}"
if command -v code >/dev/null 2>&1; then
  if code --install-extension "$VSIX" --force; then
    echo "[4/4] Installation complete."
    echo "To finish: press Ctrl+Shift+P and choose 'Developer: Reload Window'."
    echo "Then find the GCI letters in the left sidebar."
    exit 0
  fi
fi

# Some CS50 browser environments do not expose a working code CLI.
echo ""
echo "The extension was built successfully, but could not be installed by the terminal."
echo "Use the VS Code menu instead:"
echo "  1. Open Extensions in the left sidebar."
echo "  2. Select ... -> Install from VSIX..."
echo "  3. Choose this file in your Codespace:"
echo "     $VSIX"
echo "  4. Select Developer: Reload Window."
echo ""
echo "Your work and the built extension file are safe."
exit 0
