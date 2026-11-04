# CS50 Learning Companion

A **VS Code extension** for beginner-friendly CS50P support directly in the official [CS50 Codespace](https://cs50.dev). It contains all **41 unsolved problem starters** copied from [Python Lab](https://github.com/aspiece/python-lab/blob/main/cs50p-starters.js).

## Install the tested GitHub Actions build

1. Open the **Actions** tab in this repository.
2. Select **Build VS Code extension** and its latest successful run.
3. Under **Artifacts**, download `cs50-learning-companion-vsix` (the ZIP contains a `.vsix`).
4. Extract the ZIP on your computer.
5. In cs50.dev, open Extensions → `...` → **Install from VSIX**, choose that `.vsix`, and reload the window.
6. Open the **CS50 Companion** activity-bar icon. Choose an assignment and click **Create starter files**.

**Important:** This repository's source is now managed on GitHub, but the extension is **not yet confirmed working inside a live CS50 Codespace**. Use a test account before classroom rollout.

## What it does

- Creates the official assignment folder, unsolved Python files, and a student guide.
- Never overwrites an existing assignment folder.
- Provides gentle learning hints and beginner error explanations.
- Opens a real terminal for `python`, `check50`, `style50`, and student-confirmed `submit50`.
- Saves a self-reported checklist in VS Code workspace state.
- Links to the official CS50 problem page. CS50's own policies and submission instructions govern.

Do **not** put answer keys, private instructor reference files, passwords, or GitHub tokens in this public repository. The included README files were originally authored for Python Lab; the extension adjusts the Codespaces transfer section when it creates a local guide. Use official CS50 pages for exact requirements.

## Maintain and release

The `content/cs50p-starters.js` file was copied from Python Lab, not live-synced. When updating, re-import the source and rerun the tests. The extension's adapter is `src/core.js`.

GitHub Actions installs dependencies, tests the library, packages using the official `@vscode/vsce` CLI, and uploads the generated VSIX as a workflow artifact. For local builds, run:

```bash
npm install
npm test
npm run package
```

You can use `workflow_dispatch` from Actions to rerun packaging. After successful testing, a Marketplace release can enable easier updates.

## Status

Version 0.2.0 is an initial pilot and has not been validated in an actual authenticated CS50 Codespace.

## Installation troubleshooting

GitHub Actions **Artifacts are ZIP files**, not installable VSIX files. Download the artifact, **extract the ZIP**, and install the **.vsix inside**. Do not select the artifact ZIP or the source-code ZIP in the VS Code installer.

For a Codespace, you can upload the extracted `.vsix` into your workspace and run the following from its directory:

```bash
code --install-extension ./cs50-learning-companion-0.2.0.vsix --force
code --list-extensions --show-versions | grep -i geneseelearninglab
```

If the filename differs, replace it in the command. Reload the VS Code window after installation. If the CLI reports an error, **copy the entire error message**, or open **View → Output → Log (Remote Extension Host)** to investigate activation.

Verify that the GitHub Actions run is **green** before downloading. The workflow now checks that the VSIX is a readable ZIP containing the required manifest, extension entry point, and assignment catalog. A successful build is not proof that cs50.dev permits the installation; that requires a real Codespace test.

