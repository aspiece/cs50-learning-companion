# CS50 Learning Companion

A VS Code extension for guided, solution-free CS50P practice in [cs50.dev](https://cs50.dev). Includes **41 unsolved CS50P starter assignments** originally authored for [Python Lab](https://github.com/aspiece/python-lab). The two repositories are not automatically synchronized.

## Install or update in CS50 Codespaces

**Recommended for the current classroom pilot: build from the GitHub source in the Codespace.** This avoids browser upload issues. Open the Codespaces terminal:

First-time setup:

```bash
git clone https://github.com/aspiece/cs50-learning-companion.git "$HOME/cs50-learning-companion"
bash "$HOME/cs50-learning-companion/scripts/update-in-codespaces.sh"
```

If you already cloned the repository in `/workspaces/cs50-learning-companion`, there is no need for a second clone. Instead, open that folder and run `bash scripts/update-in-codespaces.sh`.

For future updates from a clone in your home directory, use **one command**:

```bash
bash "$HOME/cs50-learning-companion/scripts/update-in-codespaces.sh"
```

The script updates its own Git checkout with a fast-forward pull, installs npm dependencies, runs tests, builds the VSIX with `@vscode/vsce`, and installs it using `code --install-extension ... --force`. It prints the installed version. Then open the Command Palette and select **Developer: Reload Window**. It does not modify student assignment files.

**Alternative:** Download an attached `.vsix` from [Releases](https://github.com/aspiece/cs50-learning-companion/releases), then install via Extensions → `...` → **Install from VSIX**. A GitHub Actions **artifact** is a ZIP file containing the VSIX and checksum; extract it first.

## Versioning and publication

- Versions follow `major.minor.patch` semantic versioning in `package.json`. Example: `0.3.0`.
- Every push or pull request runs automated tests, builds a validated VSIX, and uploads a **temporary Actions artifact**. These are development builds, not releases.
- A **tag matching the package version** (for example `v0.3.0`) triggers publication of a **GitHub prerelease**, attaching the validated VSIX and a SHA-256 checksum file. A mismatched tag fails the build rather than publishing the wrong version.
- Release workflow: test on your own Codespace, update the version in `package.json`, commit the changes, create/push the matching `vX.Y.Z` tag in GitHub, and verify the new entry on Releases.
- Version `0.x` is still a classroom pilot. GitHub Releases and self-built VSIX files **do not automatically update installed extensions**. The one-command Codespaces updater is the supported interim path; Marketplace publishing is a separate future step.

The sidebar displays the installed extension version and includes **View new versions on GitHub**. Command Palette also includes **CS50 Companion: View Updates**.

## Features

- Choose from all 41 problems in CS50P problem sets 0–8.
- Create official assignment-named folders and unsolved Python scaffolds.
- Read README guidance and official assignment instructions.
- Use progressive hints, starter checklists, and beginner error descriptions.
- Run Python, check50, style50, and student-confirmed submit50 in the real Codespaces terminal.
- Existing assignment folders are preserved. The checklist is self-reported; CS50 alone confirms submissions.

## Development

```bash
npm install
npm run verify:release
npm test
npm run package
```

The source content is in `content/cs50p-starters.js`, adapted by `src/core.js`. Never add completed solutions, private instructor reference files, student credentials, or GitHub tokens to this public repo. CS50's official assignments and academic honesty rules are authoritative.

## Troubleshooting

To check the installed extension:

```bash
code --list-extensions --show-versions | grep -i geneseelearninglab
```

If installation fails, read the terminal error message. A file-not-found error indicates the selected VSIX path is incorrect; it does not indicate a broken extension. The updater avoids guessing the VSIX location by building and installing from the known source checkout.

## Status

v0.3.0 adds versioning, release automation, and a simpler updater. It has not yet been validated in a live authenticated CS50 Codespace. Test before offering it to students.
