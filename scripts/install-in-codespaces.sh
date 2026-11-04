#!/usr/bin/env bash
# Classroom installer. Can be run from any folder in an official CS50 Codespace.
set -euo pipefail

REPO="https://github.com/aspiece/cs50-learning-companion.git"
TARGET="$HOME/cs50-learning-companion"

fail() {
  echo "" >&2
  echo "GCI CS50 Companion installation stopped: $*" >&2
  echo "Share the error above with your teacher." >&2
  exit 1
}
echo ""
echo "GCI CS50 Learning Companion — classroom installation"
echo "The installer does not delete your assignment files."

command -v git >/dev/null 2>&1 || fail "'git' is missing. Open your official CS50 Codespace at https://cs50.dev."
if [[ -e "$TARGET" && ! -d "$TARGET/.git" ]]; then
  fail "$TARGET already exists but is not an extension Git repository. Ask your teacher before changing that folder."
fi
if [[ ! -d "$TARGET/.git" ]]; then
  echo "Step 1/3: Downloading the companion source..."
  git clone --depth 1 "$REPO" "$TARGET" || fail "Could not clone the GitHub repository. Check internet access."
else
  echo "Step 1/3: Existing companion source found. No need to clone again."
fi
echo "Step 2/3: Building and installing in this Codespace..."
bash "$TARGET/scripts/update-in-codespaces.sh" || fail "Read the command output above to see what stopped."
echo "Step 3/3: Open the Command Palette, then select 'Developer: Reload Window'."
echo "Done. Look for the GCI icon in the left sidebar."
