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

## Assignment README workflow (v0.5.1)

Each new assignment folder receives a personalized README with the same four stages as the sidebar:

1. **Start:** mission, official CS50 instructions, assignment folder, and required Python filenames.
2. **Learn:** input/output questions, problem-specific planning steps, and the Understand → Plan → Get Unstuck sequence.
3. **Test:** predict output, run the actual Python script, try assignment-specific test ideas, use check50/style50, and debug one change at a time.
4. **Submit:** review required dependencies, reflect on learning, and perform the official submit50 workflow.

The original Python Lab content remains the source for assignment goals, plan steps, test ideas, glossary terms, and special supporting-file links. Generated README instructions use short, beginner-friendly language and are learning guides, not finished solutions.

**Existing student folders are never automatically rewritten.** In Start, choose **Update my README guide** to review the replacement prompt. If accepted, the previous README is backed up as README.backup-N.md before the updated guide is written. Existing Python and support files are left untouched. The backup is a local record, not an official CS50 submission file.

### Open both files
The Create starter files action opens the README in the left editor group and the selected assignment Python entry file in the right group. Existing folders can also use **Open README and Python file**.

## Official CS50 instructions in a separate browser tab or window (v0.5.5)

The **Start** tab uses a single **Open official CS50 instructions** button. It opens the live, authoritative CS50 assignment page in the user's regular browser using VS Code's external-link action. The browser decides whether to use a separate tab or window; students can move the page into a separate window if preferred.

Keep Codespaces open for the README, Python file, terminal, planning notes, and testing. This avoids browser-embedding errors and does not copy Harvard's instructions into the project.

## Learning Journals (v0.6.0)

Every CS50P assignment now has a separate **LEARNING_JOURNAL.md** beside its README and Python source. Students can write their input/output thinking, pseudocode, predictions, test results, debugging notes, and reflections from the sidebar. The extension saves to the journal file and reloads its contents when students revisit the assignment. The support level is stored with the notes.

- When a student first opens an existing assignment folder, the companion creates a journal if it is missing and **imports any earlier sidebar notes** from workspace storage. It never replaces a journal that already exists.
- In the **Learn** tab, **Open learning journal file** lets students review or edit the Markdown directly; **Reload notes from journal** imports those edits into sidebar fields.
- Textarea changes auto-save after a short pause or when a field loses focus. If the assignment folder does not exist yet, notes remain in the extension's workspace storage and are copied into the journal when the starter folder is created.
- If a file named LEARNING_JOURNAL.md already exists but is **not** in the companion's recognized format, it is preserved. The sidebar displays a warning rather than overwriting it.
- The journal is a normal file within the student's Codespace. It can be downloaded or backed up; it will not automatically survive deleting that Codespace unless backed up elsewhere.

**Keeping the journal out of CS50 submission:** The extension's **Run check50** and **Open submit50 in terminal** actions run the official commands against a temporary copy of the assignment. LEARNING_JOURNAL.md, the generated README.md, and README backups are removed from the temporary copy; the original assignment and journal are untouched. All other support files stay in the copy, so students should still inspect CS50's proposed file list before confirming. Running check50 or submit50 manually in the original folder does **not** use this protection.

## Learning Journals (v0.6.0)

Every CS50P assignment now has a separate **LEARNING_JOURNAL.md** beside its README and Python source. Students can write their input/output thinking, pseudocode, predictions, test results, debugging notes, and reflections from the sidebar. The extension saves to the journal file and reloads its contents when students revisit the assignment. The support level is stored with the notes.

- When a student first opens an existing assignment folder, the companion creates a journal if it is missing and **imports any earlier sidebar notes** from workspace storage. It never replaces a journal that already exists.
- In the **Learn** tab, **Open learning journal file** lets students review or edit the Markdown directly; **Reload notes from journal** imports those edits into sidebar fields.
- Textarea changes auto-save after a short pause or when a field loses focus. If the assignment folder does not exist yet, notes remain in the extension's workspace storage and are copied into the journal when the starter folder is created.
- If a file named LEARNING_JOURNAL.md already exists but is **not** in the companion's recognized format, it is preserved. The sidebar displays a warning rather than overwriting it.
- The journal is a normal file within the student's Codespace. It can be downloaded or backed up; it will not automatically survive deleting that Codespace unless backed up elsewhere.

**Keeping the journal out of CS50 submission:** The extension's **Run check50** and **Open submit50 in terminal** actions run the official commands against a temporary copy of the assignment. LEARNING_JOURNAL.md, the generated README.md, and README backups are removed from the temporary copy; the original assignment and journal are untouched. All other support files stay in the copy, so students should still inspect CS50's proposed file list before confirming. Running check50 or submit50 manually in the original folder does **not** use this protection.

## Status

v0.6.0 saves learning notes to a per-assignment LEARNING_JOURNAL.md, migrates previous sidebar notes, and stages CS50 checking/submission without journal files.

v0.6.0 saves learning notes to a per-assignment LEARNING_JOURNAL.md, migrates previous sidebar notes, and stages CS50 checking/submission without journal files.

v0.5.5 opens official instructions directly in the student's browser instead of trying unsupported in-editor browser commands. Generated READMEs use the same workflow.


v0.5.4 tries integrated browser and Simple Browser commands when available and provides a clear external-page fallback for Codespaces without an in-editor browser.\n\nv0.5.3 updates the VS Code activity-bar icon to the approved GCI lettermark.\n\nv0.5.2 audits the instructional wording across all 41 generated READMEs and adds live official CS50 pages in the VS Code editor, with an external browser fallback. In-editor display depends on CS50's iframe policy and still requires a Codespaces check.\n\nv0.5.1 aligns generated READMEs with Start → Learn → Test → Submit and adds an opt-in, backed-up guide update for existing folders. The GitHub build and live Codespaces behavior still need verification.\n\nv0.5.0 adds guided learning, prediction and reflection, and side-by-side opening of README and the entry Python file. This is a pilot and needs a live Codespaces check.\n\nv0.4.0 introduces a redesigned sidebar with assignment search, problem-set filters, Start/Learn/Test/Submit tabs, a compact progress meter, and accessible keyboard navigation. The original Codespaces actions and safe folder creation remain available. The redesign is committed but has not yet been confirmed in a live authenticated CS50 Codespace.

## Interface design (v0.4.0)

The sidebar now separates the most common student tasks instead of showing all buttons at once:

- **Find an assignment:** Search the 41-problem catalog or filter by problem set. The selected problem is remembered in workspace state.
- **Start:** See the assignment goal, folder status, and create/open its starter files and student guide.
- **Learn:** Use planning questions and three guided hints without exposing solutions.
- **Test:** Launch Python, check50, style50, and a beginner-friendly error explanation.
- **Submit:** Student-confirmed submit50 with a clear reminder to follow Harvard's official rules.

The sidebar retains a five-step *self-reported* progress checklist, displays the installed extension version, and links to GitHub releases. Colors use the VS Code theme, so the interface works with dark and light themes. It supports keyboard navigation, smaller Codespaces sidebars, and a content security policy.

The interface is implemented in `src/ui.js`, `media/sidebar.js`, and `media/sidebar.css`, keeping the browser view separate from the Codespace filesystem and terminal actions in `src/extension.js`.

## Guided learning (v0.5.0)

Students continue using Start, Learn, Test, and Submit. The Learn tab contains **Understand → Plan → Get Unstuck**, with problem-specific planning steps pulled from each existing Python Lab README. Indoor Voice, Playback Speed, and Making Faces additionally have custom conceptual hints. For the other assignments, hints use the topic and the individual README plan; no completed solutions are included.

Students may choose **Getting started**, **Some help**, or **Independent** to fade scaffolds. They can type an input/output explanation and pseudocode, predict test results, note terminal output, document debugging attempts, and reflect on learning. The Test tab includes exercise-specific test ideas from the Python Lab README, and the progress area counts problems students mark tested and topics practiced. It does not claim mastery. These notes are self-reported and stored with the VS Code workspace extension state, not sent to CS50 or Canvas; they are not automatically evaluated for correctness.

Selecting **Create starter files** opens both `README.md` (left editor group) and the assignment entry `.py` file (right editor group). If the assignment folder already exists, its files are opened without overwriting any content. The **Open README and Python file** action is also available for returning students. For unit-testing assignments, the entry Python file is the student test file; the related implementation Python file remains in Explorer.

After updating, verify the existing assignment folders are unchanged, both editor panes open, notes survive navigating between problems, and terminal commands still run from the assignment directory.
