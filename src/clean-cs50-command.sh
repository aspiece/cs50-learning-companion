#!/usr/bin/env bash
# Run CS50's checker/submission in a disposable copy without personal journal notes.
set -euo pipefail
if [[ $# -ne 2 || ( "$1" != "check50" && "$1" != "submit50" ) ]]; then
  echo "Usage: clean-cs50-command.sh check50|submit50 cs50/problems/2022/python/slug" >&2
  exit 2
fi
tool="$1"
slug="$2"
if [[ ! "$slug" =~ ^cs50/problems/2022/python/[a-z0-9_/]+$ ]]; then
  echo "Invalid CS50 problem path." >&2
  exit 2
fi
scratch="$(mktemp -d)"
trap 'rm -rf -- "$scratch"' EXIT
cp -a . "$scratch/submission"
rm -f -- "$scratch/submission/LEARNING_JOURNAL.md" "$scratch/submission/README.md"
find "$scratch/submission" -maxdepth 1 -type f -name 'README.backup-*.md' -delete
cd "$scratch/submission"
echo "Running $tool from a temporary copy of the assignment."
echo "Personal LEARNING_JOURNAL.md and generated README files are excluded from this copy."
echo "Review the file list that CS50 displays before confirming any submission."
"$tool" "$slug"
