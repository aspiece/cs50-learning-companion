# GCI CS50 Companion — Live Codespaces Check

Use this after installing **v0.9.4** or newer. The automated tests have passed, but this check verifies the interface in a real CS50 Codespace.

**Important:** Use your own test Codespace or a test assignment. Do not delete, rename, or change a student's Python files to set up a test. Never submit a test assignment to CS50.

## Before you start

1. Open your Codespace at [cs50.dev](https://cs50.dev).
2. In the GCI Companion sidebar, select **Check for updates**. Install the newest release if prompted, then reload.
3. Confirm the version shown beside **CS50 Companion** is v0.9.4 or newer.
4. Keep the VS Code **Explorer** open so you can see files.

## Check A — A new assignment

Select an assignment you have **not started** and confirm its folder does not already exist.

- [ ] The Start tab says **Ready to begin**.
- [ ] The main button says **Create starter files**.
- [ ] Select it. The correct folder and Python file appear in Explorer.
- [ ] The README opens on the left and Python code on the right.
- [ ] The starter contains TODO comments but not a completed solution.
- [ ] **Continue coding** replaces **Create starter files** once the folder exists.
- [ ] The sidebar has **Start**, **Test**, and **Submit**.
- [ ] **I’m stuck** shows one clue at a time. Its debugging option opens the error helper on Test.
- [ ] The new folder contains the starter files and README without a generated journal.

## Check B — An existing assignment

Select an assignment with a Python file you already started. Make a note of one line of your code first.

- [ ] The main button says **Continue coding**.
- [ ] Select it. Your existing Python file and README open side by side.
- [ ] The code you noted is unchanged.
- [ ] **Read README** opens the current guide.
- [ ] The README link opens Harvard’s problem page. **More options** shows the README update.

## Check C — Incomplete folders (optional)

Only use a **throwaway, unstarted assignment folder** in your own test Codespace. Do not remove files from a real assignment.

- [ ] If the folder exists but its main Python file does not, the button says **Inspect assignment folder**.
- [ ] Selecting it reveals the folder in Explorer without creating or replacing anything.
- [ ] If the Python file exists but README is missing, **Continue coding** still works.
- [ ] **More options → Open official CS50 instructions** opens Harvard’s problem page while the README is missing.
- [ ] **More options → Create missing README guide** creates the README. The Harvard link then appears in the guide.

## Check D — Safely update an older README (optional)

Only do this for an assignment whose README you are comfortable updating.

- [ ] **More options → Update my README guide** asks before replacing an existing guide.
- [ ] Canceling makes no changes.
- [ ] Approving saves an old copy named `README.backup-1.md` or the next available number.
- [ ] The Python file and `LEARNING_JOURNAL.md` remain unchanged.

## Check E — Run and update guides

- [ ] Open an untouched older guide, reload Codespaces, and open the Companion. The README refreshes.
- [ ] Repeat with a guide that has a saved student note. The note stays in the guide.
- [ ] In Pizza Py, save Harvard’s regular.csv beside pizza.py. Run from the sidebar and confirm the terminal receives `python pizza.py regular.csv`.
- [ ] In Working 9 to 5, confirm both Python and pytest can be opened from Test.
- [ ] Make an unsaved edit and click Run. Cancel the save prompt and confirm the terminal command did not start.

## What to send back if something fails

Report the assignment name, installed version, what you clicked, and what actually happened. A screenshot of the Start tab or a short error message can help. **Do not send access tokens, passwords, student personal information, or full solution code.**

**Passing this checklist is the final live classroom verification.** Automated GitHub tests alone do not prove the browser-based Codespaces interface works for every student.
