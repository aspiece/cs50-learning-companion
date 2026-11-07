# CS50 Learning Companion

A VS Code extension for guided, solution-free CS50P practice in [cs50.dev](https://cs50.dev). Includes **41 unsolved CS50P starter assignments** originally authored for [Python Lab](https://github.com/aspiece/python-lab). The two repositories are not automatically synchronized.

**Live classroom check:** After updating to v0.7.5 or newer, follow the [Start screen Codespaces test checklist](LIVE_CODESPACES_CHECK.md) to verify the new/returning assignment workflow without deleting or changing student code.

## Install or update in CS50 Codespaces

**Classroom installation:** Open the terminal inside [cs50.dev](https://cs50.dev) and paste **one command**. It works for first-time setup and for updates, from any starting directory:

```bash
curl -fsSL https://raw.githubusercontent.com/aspiece/cs50-learning-companion/main/scripts/install-in-codespaces.sh -o /tmp/gci-cs50-install.sh && bash /tmp/gci-cs50-install.sh
```

The installer places extension source in `$HOME/cs50-learning-companion` (not in an assignment folder), pulls new code when already installed, checks for Node.js 20+, uses npm to build a VSIX, and installs it through the VS Code `code` CLI. **Student installation no longer runs the development test suite**; GitHub Actions runs tests and packaging on each push. To deliberately run tests while updating, use `GCI_RUN_TESTS=1 bash "$HOME/cs50-learning-companion/scripts/update-in-codespaces.sh"`.

If the CLI is unavailable, the script prints the generated VSIX location and instructions for installing it from the Extensions menu. Complete setup with **Developer: Reload Window**.

The source repository remains at <https://github.com/aspiece/cs50-learning-companion>. Follow the [student installation guide](STUDENT_INSTALL.md) for classroom steps and error help. **Do not delete a Codespace to retry installation.** The script does not modify Python assignment files.

## Built-in classroom updates (v0.7.0)

Students install the companion once. After that, they can update it directly from the **GCI CS50 Companion sidebar**:

1. The sidebar checks GitHub for newer classroom releases when opened (no automatic installation).
2. If an update exists, **Check for updates** shows its version. Select it to review the update.
3. Choose **Install update**. The extension downloads the signed-off release artifact from our GitHub repository, checks its SHA-256 checksum, and uses the Codespaces VS Code CLI to install it.
4. Choose **Reload now** to start the new version. Students are asked before installation and before reloading.

There is also a Command Palette option **CS50 Companion: Check for Updates**. If the Codespace cannot install a VSIX through the CLI, the extension keeps the verified file, shows its exact path, and explains **Extensions → ... → Install from VSIX**. It never modifies student assignment folders, code, or Learning Journals.

GitHub Actions now publishes **versioned classroom prereleases automatically after tests pass on main**. Each prerelease has a versioned `.vsix` and `SHA256SUMS.txt`. Release downloads are constrained to the `aspiece/cs50-learning-companion` GitHub repository and checksummed before installation. The updater requires an accessible network and VS Code CLI and does not silently install new code.

**First-time installation or upgrading from pre-v0.7.0:** Use the [one-command student installer](STUDENT_INSTALL.md) one last time. After v0.7.0 is installed, later versions can be installed with the sidebar button.

## Versioning and publication

- Versions follow `major.minor.patch` semantic versioning in `package.json`. Example: `0.3.0`.
- Every push or pull request runs automated tests, builds a validated VSIX, and uploads a **temporary Actions artifact**. These are development builds, not releases.
- Every validated **main-branch build** now publishes or refreshes the matching versioned GitHub classroom prerelease (including its VSIX and SHA-256 checksum). A matching `vX.Y.Z` tag can still trigger a prerelease build; mismatched tags fail validation.
- Release workflow: test on your own Codespace, update the version in `package.json`, commit the changes, create/push the matching `vX.Y.Z` tag in GitHub, and verify the new entry on Releases.
- Version `0.x` is still a classroom pilot, and **Marketplace auto-updates are not in use**. The extension's built-in updater checks GitHub prereleases and installs only after student confirmation. The one-command installer remains available for first setup or recovery.

The sidebar displays the installed version, an available update when detected, and **Check for updates**. The Command Palette supports **CS50 Companion: Check for Updates** and **CS50 Companion: View Updates**.

## Short READMEs and lighter starters (v0.7.1)

All 41 CS50P problems now generate **short assignment guides** using the approved five sections: **Your Goal → Build It → Test It → Check It → Submit**. Each guide is about 130–220 words, links to Harvard's official problem page, gives clear assignment-specific coding steps and test ideas, and includes the right check50/submit50 commands.

Python starter files use light scaffolding: essential initial inputs and variable values, up to three TODOs on straightforward problems, and no completed solutions. Assignments requiring specific functions, classes, or pytest test files retain those structures even when that needs more placeholders. Indoor Voice and Coke Machine match the approved examples. Set 5 assignments launch pytest through the Test tab.

For problems involving CSVs, images, or multiple Python files, the README includes needed file names and Harvard resource links. Generated READMEs never ask students to move code from Python Lab. The formatted README still opens automatically beside their Python file.

**Student work is protected:** New scaffolds are used only when a new assignment folder is created. The extension never replaces existing Python files. Students with an older README can opt to **Update my README guide**, with a confirmation and backup; their Python code and Learning Journal are left unchanged. The old detailed README data remains embedded as an internal source for instructional prompts.

## Optional Harvard concept videos (v0.7.2)

Students who choose **Getting Started — more help** in the Companion's **Learn** tab now see an optional **CS50 concept video** card. Each of the 41 CS50P assignments is linked to one carefully matched topic from Harvard's official [CS50P Shorts library](https://cs50.harvard.edu/python/shorts/). Examples:

- Indoor Voice → **String Methods**
- Coke Machine → **While Loops**
- Fuel Gauge → **Handling Exceptions**
- Refueling (unit tests) → **pytest**
- Pizza Py → **Reading and Writing CSVs**
- Cookie Jar → **Classes**

The card identifies the topic, explains what skill the short video covers, and includes **Watch concept video in browser**. It opens Harvard's official page outside the Codespace editor so students can keep their Python work visible. Videos **do not autoplay**, require **no account, embedded player, or extra plugin**, and **do not include problem-specific solution walkthroughs**.

After watching, students see one brief planning question and are invited to write an idea in **My steps or pseudocode**. This uses the existing Learning Journal—no extra tracking of video views or student activity.

**Some Help** and **Independent** do not display the video card. Choosing a different assignment swaps the recommended topic immediately. The original student README, Python starter, submitted files, and saved notes are not changed by the new feature.

## Contextual Start screen (v0.7.5)

The **Start** tab now has one primary action instead of a stack of equally prominent buttons. Its status and button respond to the actual selected assignment folder:

- **No folder:** **Create starter files** creates the assignment in its standard slug-named folder and opens the README and Python entry file side by side.
- **Existing folder with Python file:** **Continue coding** reopens the student's files without recreating or replacing them.
- **Existing folder missing the main Python file:** **Inspect assignment folder** reveals the existing directory in Explorer without overwriting anything. A clear explanation describes the missing file.
- **Existing Python file but missing README:** **Continue coding** still works. **More options → Create missing README guide** can restore just the README.

The Start page keeps secondary shortcuts to **Read README**, **Learning help** (opens the Learn tab), and **Open official CS50 instructions**. Less-used actions, including **Open README and Python side by side** and **Update my README guide**, live in a collapsed **More options** section.

This UI update affects only the extension sidebar. It does **not** modify existing student assignments, journal entries, solutions, or submissions. The previous safe README-refresh confirmation and backup behavior remain in place.

## String Methods Toolkit expansion (v0.7.4)

A review of the private instructor CS50P assignment solutions identified eight additional Python string methods worth teaching: `.lstrip()`, `.rstrip()`, `.isupper()`, `.isalpha()`, `.isalnum()`, `.isdecimal()`, `.title()`, and `.capitalize()`. The built-in reference now includes **16 methods**, all with short, unrelated examples and safe live Python practice.

To keep the Codespaces sidebar usable, students can filter by **All methods**, **Changing text**, **Checking text**, or **Splitting text**, then search within that group. Entries highlight easily confused methods, including `.strip()` / `.lstrip()` / `.rstrip()` and `.isdigit()` / `.isdecimal()`. Empty optional arguments on `.lstrip()` and `.rstrip()` correctly mean the whitespace-stripping default.

**Privacy:** This expansion uses the private solutions only to identify method names and relevant topics. No private source code or assignment solutions are included in the extension, and no student files are changed.

## Less clutter, more help when needed (v0.8.0)

This update responds to student feedback that the original sidebar felt too busy. The assignment picker remains visible, while **search/filter**, **extra learning tools and journal actions**, **test-review and debugging notes**, **submission reflection**, and **self-reported progress** now live inside collapsed, clearly labeled sections. Start still has a clear primary Create/Continue action; Learn still preserves three support levels; Test still runs Python, check50 and style50; and Submit still uses the verified CS50 workflow. Existing journal data and Python code are untouched.

The Learn tab now shows one **related CodeHS lesson** when a verified public topic lesson matches the assignment. The link opens externally and never presents CodeHS exercises as CS50 answers. The mapping favors the public **CodeHS Intro to Computer Science in Python 3** course; for certain later file I/O topics it uses **CodeHS Introduction to Python Programming**. Not all advanced CS50P topics have an appropriate public CodeHS lesson; the link is hidden rather than guessed. These are public topic overviews, not a student's private assigned CodeHS lesson or a claim of school enrollment.

New starter READMEs now include **the problem in student-friendly terms**, concrete numbered requirements, test ideas, a verified related CodeHS lesson where available, the official CS50P concept Short, and links to Harvard's complete specification and any official hints. They include the CS50 license/attribution notice and make clear that **Harvard's full problem page is authoritative for all exact rules and examples**. The READMEs are locally generated and do not fetch or copy entire CS50 problem pages.

The **Submit** tab and each new README now link directly to the official [CS50P gradebook](https://cs50.me/cs50p). Students sign in themselves with their CS50-linked GitHub accounts. The companion **does not retrieve, track, or report students' grades or submission status**.

**Existing assignments:** The update never overwrites a student's README automatically. To regenerate the new version for an existing assignment, open **Start → More options → Update my README guide** and approve the prompt. The prior guide is saved as `README.backup-N.md`; student Python files and Learning Journals remain unchanged.

## Clearly different learning support levels (v0.7.9)

The **Learn** tab now visibly changes immediately when a student chooses a level in **How much guidance do you want?**

- **Getting Started — step-by-step help:** Shows assignment-specific understanding questions and input/output prompts, detailed planning steps, an expanded section of optional hints, and the official CS50 concept video where available.
- **Some Help — light guidance:** Hides the detailed questions and steps. Students write their own plan with one brief planning prompt; optional hints stay collapsed until requested.
- **Independent — challenge myself:** Shows a short self-directed challenge and optional plan space, without prompting detailed steps or showing hints unless students open them.

Each level has a clear summary saying what it includes. The Python String Methods Toolkit and other reference tools remain available at all three levels, but appear **after** the main learning activities so they no longer hide the differences.

Changing levels never rewrites student Python code or clears typed planning or input/output notes. The selected mode remains saved for that assignment in the workspace Learning Journal. Students may change levels at any point without penalty; no level provides a finished CS50P solution.

## Start tab navigation hotfix (v0.7.8)

A missing HTML element from the v0.7.7 Test-tab redesign caused a JavaScript error while rendering the sidebar. Because tab visibility was updated at the end of rendering, this could leave students stuck on the **Start** tab, including when they selected **Learning help**.

The hotfix removes the obsolete element reference and changes tab navigation to switch the visible tab **before** rendering all assignment content. Regression tests compare every statically referenced sidebar element ID against the actual HTML and simulate switching among Start, Learn, Test, and Submit with a strict DOM mock that does not invent missing elements.

**Student recovery:** From a stuck sidebar, select **Check for updates** and install v0.7.8, then reload Codespaces. If the sidebar cannot update itself, use the existing one-command terminal installer in the installation section above. Neither method needs a student assignment to be deleted, and the hotfix does not modify Python files or Learning Journals.

## Guided Test and Debug flow (v0.7.7)

The **Test** tab now guides students through four clear steps: **Predict and run → Review the result → Debug one thing → Check with CS50**. Assignment-specific test ideas remain available but are collapsed until requested. Running a program opens a Codespaces terminal, and the sidebar explains what to do after reading the output. Problem Set 5 continues to use `pytest` instead of running the test file with Python.

The Review step asks students whether the result matched their expectation, differed, or showed an error. **These are student-reported observations—not automated checks or grades.** Selecting an unexpected result opens the debugging section. Students can paste an error message to get a short, local explanation of common Python or pytest errors, with guidance on where to look and how to retry. No finished solution code is provided. Error text is not transmitted to a third-party service or written to their Learning Journal.

The Test tab retains its existing per-assignment journal fields for predicted output, observed results, and debugging notes. **check50** and **style50** still run in the terminal using the existing safe command workflow, and the Test tab does not submit any work, claim a passing check, or automatically mark any progress checkboxes. Terminal responses confirm only that a command was sent; they cannot determine whether the student's code passed. Existing student files and notes are preserved.

## Full-size String Methods editor (v0.7.6)

Students can open a larger **Python String Methods Toolkit** workspace from **Learn → Open String Toolkit**. The editor panel opens in the **left editor group**, allowing students to keep their Python assignment code open on the right. It is not a workspace file; it never modifies source files or journals.

The redesigned workspace has a **two-column layout** with searchable methods and group filters on the left, and a dedicated explanation/practice area on the right. It supports all **16 string methods** identified in the instructor's CS50P work, including Python-generated output, optional method arguments, copyable practice code, the official Harvard concept video, and Python reference documentation. A compact **Quick reference in sidebar** remains available but is collapsed by default.

The toolkit uses a single reusable webview panel, so repeatedly selecting **Open String Toolkit** does not create multiple tabs. The assignment heading and broad suggested method category update when the student changes assignments, while their chosen method and search remain visible. No solution code is exposed; only independently authored, general-purpose examples are included.

A secure content policy restricts the panel to local extension assets. Python practice remains limited to the existing whitelisted method runner, with no arbitrary code execution, network requests, or assignment-file modifications. The panel adapts to smaller editor widths. Classroom installation and update behavior remain unchanged.

## Python String Methods Toolkit (v0.7.3)

A searchable, expandable **Python String Methods Toolkit** now appears in the **Learn** tab for **all three support levels** (Getting Started, Some Help, and Independent). Students can explore eight beginner-friendly methods: `.lower()`, `.upper()`, `.strip()`, `.replace()`, `.split()`, `.startswith()`, `.endswith()`, and `.isdigit()`.

Each method has a short explanation, a sample Python expression, and its expected result. For relevant assignments, the toolkit suggests a **category** (changing text, checking text, or breaking text into pieces) without giving the assignment solution. The toolkit is collapsed until opened, preserving a short Learn panel.

**Try it yourself:** Students pick a method, type sample text, and—where needed—enter a search term, replacement, prefix, suffix, or separator. Select **Run in Python** to see the result produced by the **real Python interpreter inside Codespaces**. The practice uses a fixed set of allowed operations and limits input size. It does **not** run arbitrary student Python, open assignment files, upload data, or modify the workspace. A **Copy practice code** option places only the selected standalone sample expression on the clipboard.

The toolkit includes links to [Harvard's CS50P String Methods lesson](https://cs50.harvard.edu/python/shorts/string_methods/) and [Python's official string-method documentation](https://docs.python.org/3/library/stdtypes.html#string-methods), plus the reminder that Python strings are immutable. These are general concept resources, not assignment solutions.

**No extra software, sign-in, or student tracking is required.** Existing README, Python starter, check50/submit50, and Learning Journal behavior are unchanged.

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

## Automatic Markdown previews (v0.6.2)

**The formatted README opens automatically** when a student creates an assignment, reopens an existing assignment, selects an assignment whose folder already exists, or opens the GCI companion sidebar for the first time in a session with an existing selected assignment.

The extension directly opens VS Code's native `vscode.markdown.preview.editor` in the **left editor group** and the editable Python file in the **right editor group**. Students do not need to select Markdown: Open Preview. Preview actions for the Learning Journal also open a formatted preview directly. An **Edit journal as Markdown** action still offers source editing. When the native preview editor type is unavailable, the extension tries VS Code's classic Markdown preview, then falls back to the raw Markdown file without blocking coding.

This changes only how these files are displayed; the original Markdown and student Python files are not rewritten by preview opening.

## Formatted Markdown previews (v0.6.1)

The companion uses VS Code's built-in **Markdown preview** to display student guides and journals with formatted headings, lists, links, and text.

- **Create starter files** and **Open formatted README and Python file** open a rendered README in the left editor group and the assignment's Python file in the right.
- **Preview student guide** opens a rendered README.
- **Preview formatted learning journal** opens a rendered Learning Journal. It updates as saved changes arrive from the sidebar.
- **Edit journal as Markdown** opens the original Markdown source for students who want to type directly into the file. **Reload notes from journal** loads changes back into the sidebar.
- If the built-in Markdown renderer is unavailable, the companion falls back to showing the plain Markdown file. No extra extension or browser is needed when VS Code's Markdown support is enabled.

Students can also preview any open Markdown file manually with **Ctrl+Shift+V** (Windows/Linux) or **Cmd+Shift+V** (Mac), and open a preview beside the source with **Ctrl+K, V** (Windows/Linux) or **Cmd+K, V** (Mac).

## Status

v0.7.2 adds optional assignment-matched Harvard CS50P Shorts in the guided learning mode; no solution playlist or mandatory video tracking.

v0.7.1 updates all 41 classroom starter generators to approved light Python scaffolds and short five-section READMEs. Existing student Python files remain untouched.

v0.7.0 introduces built-in confirmed update installs, verified GitHub release downloads, and automatically published classroom packages.

Installation guide refreshed for CS50 Codespaces: one-command, folder-independent installer, fewer student prerequisites, and clearer VSIX fallback.

v0.6.2 reliably opens native Markdown previews on student assignment selection and startup, with a fallback for older Codespaces editors.

v0.6.1 adds formatted, built-in Markdown previews for the assignment README and Learning Journal, while preserving source-editing controls and Python code.

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
